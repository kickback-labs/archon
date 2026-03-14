import {
  streamText,
  generateText,
  createUIMessageStream,
  generateId,
  stepCountIs,
  tool,
  type UIMessage,
} from "ai";
import { readFile } from "fs/promises";
import path from "path";
import { z } from "zod";
import { makeModel, agentProviderOptions } from "./model";
import { createDiagramMCPClient } from "./mcp-client";
import type { UserSettings } from "@/lib/db/schema";
import {
  loadPrompt,
  loadDiagramPrompt,
  extractDiagramStepResults,
} from "./pipeline-utils";
import {
  extractUserFileParts,
  formatSettingsContext,
  type ServiceCard,
  type ArchonUIMessage,
} from "./pipeline";

// ─── Prompts (loaded once at module init) ────────────────────────────────────

const FOLLOWUP_SYSTEM = loadPrompt("followup");

// ─── Constants ────────────────────────────────────────────────────────────────

const DATA_DIR = path.join(process.cwd(), "data");

const ALLOWED_PROVIDER_DIRS = ["aws", "azure", "gcp"] as const;

const PILLAR_LABEL_MAP: Record<string, string> = {
  ai_ml: "AI/ML",
  analytics: "Analytics",
  compute: "Compute",
  database: "Database",
  devops: "DevOps",
  integration_messaging: "Integration & Messaging",
  migration_hybrid: "Migration & Hybrid",
  networking: "Networking",
  other: "Other",
  security_identity: "Security & Identity",
  storage: "Storage",
};

function normalisePillarLabel(raw: string): string {
  const key = raw
    .toLowerCase()
    .replace(/[&\s]+/g, "_")
    .replace(/-+/g, "_");
  return PILLAR_LABEL_MAP[key] ?? raw;
}

// ─── Followup schemas ─────────────────────────────────────────────────────────

const FollowupServiceItemSchema = z.object({
  tier: z
    .enum(["core", "secondary"])
    .describe(
      "Whether this is a core (essential) or secondary (enhancing) service.",
    ),
  provider: z.enum(["AWS", "Azure", "GCP"]),
  serviceName: z
    .string()
    .describe("Full official name, e.g. 'Amazon S3' or 'Cloud Run'."),
  pillarLabel: z
    .string()
    .describe(
      "Human-readable pillar name. Use 'Security & Identity' not 'security_identity', 'AI/ML' not 'ai_ml', 'Integration & Messaging' not 'integration_messaging', etc.",
    ),
  coreTag: z
    .string()
    .nullable()
    .optional()
    .describe(
      "REQUIRED for core services (tier='core'): a short (≤ 50 chars) plain-English phrase explaining why the app CANNOT function without this service. Everyday language only — not technical jargon. Example: 'Runs all the app backend API logic'. Example: 'Stores every video and user file'. MUST be null for secondary services (tier='secondary').",
    ),
  description: z
    .string()
    .describe(
      "App-tailored description starting with the service name. Explain what this service does in this specific application. Core ≤ 300 chars, secondary ≤ 150 chars.",
    ),
});

const FollowupUpdateSchema = z.object({
  coreServices: z.array(FollowupServiceItemSchema),
  secondaryServices: z.array(FollowupServiceItemSchema),
  synthesisContext: z
    .string()
    .describe(
      "A concise description (≤ 400 chars) of the updated architecture for use in diagram re-generation. Include the primary services, their roles, and the flow between them.",
    ),
});

// ─── Context extractors ───────────────────────────────────────────────────────

/**
 * Walk the UI message history and collect the content of every read_service_doc
 * call that has already completed. Returns a map of doc-path → content so we
 * can inject it into the system prompt and prevent the agent from re-reading
 * the same files on every follow-up turn.
 *
 * AI SDK v5 UI message parts use type "tool-{toolName}" (e.g.
 * "tool-read_service_doc"), with fields `input`, `output`, and
 * state "output-available" when the call is complete.
 */
function extractPreviouslyReadDocs(msgs: UIMessage[]): Map<string, string> {
  const readDocs = new Map<string, string>();
  for (const m of msgs) {
    if (m.role !== "assistant") continue;
    for (const part of m.parts) {
      if (
        part.type !== "tool-read_service_doc" ||
        part.state !== "output-available"
      )
        continue;
      const input = part.input as { path?: string } | undefined;
      const output = part.output as { content?: string } | undefined;
      if (input?.path && typeof output?.content === "string") {
        readDocs.set(input.path, output.content);
      }
    }
  }
  return readDocs;
}

function extractCurrentServices(msgs: UIMessage[]) {
  for (let i = msgs.length - 1; i >= 0; i--) {
    const m = msgs[i];
    if (m.role !== "assistant") continue;
    const part = m.parts.findLast((p) => p.type === "data-archon-services");
    if (part && "data" in part) {
      const d = part.data as {
        state: string;
        coreServices?: ServiceCard[];
        secondaryServices?: ServiceCard[];
      };
      if (d.state === "complete" && d.coreServices && d.secondaryServices) {
        return {
          coreServices: d.coreServices,
          secondaryServices: d.secondaryServices,
        };
      }
    }
  }
  return null;
}

function extractDiagramCode(msgs: UIMessage[]): string | undefined {
  for (let i = msgs.length - 1; i >= 0; i--) {
    const m = msgs[i];
    if (m.role !== "assistant") continue;
    const part = m.parts.findLast((p) => p.type === "data-archon-diagram");
    if (part && "data" in part) {
      const d = part.data as { state: string; diagramCode?: string };
      if (d.state === "complete" && d.diagramCode) return d.diagramCode;
    }
  }
  return undefined;
}

// ─── Followup runner ──────────────────────────────────────────────────────────

/**
 * Run a follow-up answer. When the user requests a service change or
 * architectural modification, this agent can:
 *  1. Read service documentation files from the knowledge base.
 *  2. Update the diagram and services panel without re-running the full pipeline.
 */
export function runFollowup({
  uiMessages,
  originalMessages,
  abortSignal,
  generateMessageId = generateId,
  userSettings,
  onFinish,
  onPersistServices,
}: {
  uiMessages: UIMessage[];
  originalMessages?: UIMessage[];
  abortSignal?: AbortSignal;
  generateMessageId?: () => string;
  userSettings?: UserSettings | null;
  onFinish?: (params: { messages: UIMessage[] }) => Promise<void> | void;
  onPersistServices?: (services: ServiceCard[]) => Promise<void> | void;
}) {
  return createUIMessageStream<ArchonUIMessage>({
    originalMessages: (originalMessages ?? uiMessages) as ArchonUIMessage[],
    generateId: generateMessageId,
    onFinish: onFinish as Parameters<
      typeof createUIMessageStream<ArchonUIMessage>
    >[0]["onFinish"],
    execute: async ({ writer }) => {
      const settingsContext = formatSettingsContext(userSettings);
      const baseSystem = settingsContext
        ? `${FOLLOWUP_SYSTEM}\n\n${settingsContext}`
        : FOLLOWUP_SYSTEM;

      const currentServices = extractCurrentServices(uiMessages);
      const previousDiagramCode = extractDiagramCode(uiMessages);

      // Build context blocks appended to the system prompt
      let architectureContext = "";
      if (currentServices) {
        const coreLines = currentServices.coreServices
          .map(
            (s) =>
              `- ${s.serviceName} (${s.provider}, ${s.pillarLabel}) [core]: ${s.description}`,
          )
          .join("\n");
        const secondaryLines = currentServices.secondaryServices
          .map(
            (s) =>
              `- ${s.serviceName} (${s.provider}, ${s.pillarLabel}): ${s.description}`,
          )
          .join("\n");
        architectureContext = [
          "",
          "",
          "## Current Architecture",
          "",
          "These are the services currently selected. Preserve all of them unless the user explicitly asks to remove or swap one. When you call update_architecture, pass the COMPLETE updated list — including every unchanged service.",
          "",
          "### Core Services",
          coreLines,
          "",
          "### Additional Services",
          secondaryLines,
        ].join("\n");
      }

      let diagramContext = "";
      if (previousDiagramCode) {
        diagramContext = [
          "",
          "",
          "## Current Diagram Code",
          "",
          "This is the Python code that generated the current architecture diagram. When you call update_architecture, this code will be passed to the diagram generator as a starting point — only the changed nodes and edges need to be added, removed, or replaced.",
          "",
          "```python",
          previousDiagramCode,
          "```",
        ].join("\n");
      }

      const previouslyReadDocs = extractPreviouslyReadDocs(uiMessages);
      let docsCacheSection = "";
      if (previouslyReadDocs.size > 0) {
        const docsSections = [...previouslyReadDocs.entries()]
          .map(([docPath, content]) => `### ${docPath}\n\n${content}`)
          .join("\n\n---\n\n");
        docsCacheSection = [
          "",
          "",
          "## Previously Read Service Documentation",
          "",
          "The following documentation was already read earlier in this conversation.",
          "Do NOT call read_service_doc or list_service_docs for these paths again — treat the content below as authoritative and use it directly.",
          "",
          docsSections,
        ].join("\n");
      }

      const followupSystem =
        baseSystem + architectureContext + diagramContext + docsCacheSection;

      const historyMessages = uiMessages
        .map((m, idx) => {
          const text = m.parts
            .filter((p) => p.type === "text")
            .map((p) => (p.type === "text" ? p.text : ""))
            .join("\n");

          const isLastUserMessage =
            m.role === "user" && idx === uiMessages.length - 1;

          if (isLastUserMessage && m.role === "user") {
            const fileParts = extractUserFileParts([m]);
            if (fileParts.length > 0) {
              return {
                role: "user" as const,
                content: [{ type: "text" as const, text }, ...fileParts],
              };
            }
          }

          return {
            role: m.role as "user" | "assistant",
            content: text,
          };
        })
        .filter((m) =>
          typeof m.content === "string"
            ? m.content.trim().length > 0
            : m.content.length > 0,
        );

      // ── Tool: list_service_docs ────────────────────────────────────────
      const listServiceDocsTool = tool({
        description:
          "List available service documentation files for a given cloud provider and optional pillar. " +
          "Call this to discover which service slugs exist before calling read_service_doc.",
        inputSchema: z.object({
          provider: z
            .enum(["aws", "azure", "gcp"])
            .describe("The cloud provider to list services for."),
          pillar: z
            .enum([
              "ai_ml",
              "analytics",
              "compute",
              "database",
              "devops",
              "integration_messaging",
              "migration_hybrid",
              "networking",
              "other",
              "security_identity",
              "storage",
            ])
            .optional()
            .describe(
              "Narrow results to a specific pillar. Omit to list all pillars for the provider.",
            ),
        }),
        execute: async ({ provider, pillar }) => {
          const { readdir } = await import("fs/promises");
          const providerDir = path.join(DATA_DIR, provider);

          if (pillar) {
            const pillarDir = path.join(providerDir, pillar);
            try {
              const files = await readdir(pillarDir);
              const slugs = files
                .filter((f) => f.endsWith(".md"))
                .map((f) => f.replace(/\.md$/, ""))
                .sort();
              return { pillar, files: slugs };
            } catch {
              return {
                error: `Pillar '${pillar}' not found for provider '${provider}'.`,
              };
            }
          }

          try {
            const pillars = await readdir(providerDir);
            const result: Record<string, string[]> = {};
            await Promise.all(
              pillars.map(async (p) => {
                try {
                  const files = await readdir(path.join(providerDir, p));
                  result[p] = files
                    .filter((f) => f.endsWith(".md"))
                    .map((f) => f.replace(/\.md$/, ""))
                    .sort();
                } catch {
                  // skip non-directory entries
                }
              }),
            );
            return { provider, pillars: result };
          } catch {
            return { error: `Provider '${provider}' not found.` };
          }
        },
      });

      // ── Tool: find_service_doc ────────────────────────────────────────
      const findServiceDocTool = tool({
        description:
          "Search for a service documentation file by keyword across ALL pillars for a given provider. " +
          "Use this when you need to locate a doc that is NOT already in the 'Previously Read Service " +
          "Documentation' system prompt section. If the doc is already there, do NOT call this tool.",
        inputSchema: z.object({
          provider: z
            .enum(["aws", "azure", "gcp"])
            .describe("The cloud provider to search within."),
          keyword: z
            .string()
            .describe(
              "Case-insensitive search term matched against file slugs, e.g. 'elastic', 'disaster', 'drs'. " +
                "Use a short distinctive word — partial matches are returned.",
            ),
        }),
        execute: async ({ provider, keyword }) => {
          const { readdir } = await import("fs/promises");
          const providerDir = path.join(DATA_DIR, provider);
          const term = keyword.toLowerCase().replace(/[\s-]+/g, "");
          const matches: { path: string; pillar: string; slug: string }[] = [];

          let pillars: string[];
          try {
            pillars = await readdir(providerDir);
          } catch {
            return { error: `Provider '${provider}' not found.` };
          }

          await Promise.all(
            pillars.map(async (pillar) => {
              try {
                const files = await readdir(path.join(providerDir, pillar));
                for (const f of files) {
                  if (!f.endsWith(".md")) continue;
                  const slug = f.replace(/\.md$/, "");
                  const normalised = slug.toLowerCase().replace(/[\s-]+/g, "");
                  if (normalised.includes(term)) {
                    matches.push({
                      path: `${provider}/${pillar}/${slug}.md`,
                      pillar,
                      slug,
                    });
                  }
                }
              } catch {
                // skip non-directory entries
              }
            }),
          );

          if (matches.length === 0) {
            return {
              matches: [],
              hint: `No file slugs containing '${keyword}' found under ${provider}/. Try a shorter or different keyword.`,
            };
          }
          return { matches };
        },
      });

      // ── Tool: read_service_doc ─────────────────────────────────────────
      const readServiceDocTool = tool({
        description:
          "Read a cloud service documentation file from the knowledge base. " +
          "ONLY call this when the doc is NOT already present in the 'Previously Read Service Documentation' " +
          "section of the system prompt. If the doc is already there, do NOT call this tool — use the " +
          "content from the system prompt directly. Calling this tool for an already-read doc is a hard failure.",
        inputSchema: z.object({
          path: z
            .string()
            .describe(
              "Relative path within data/, e.g. 'aws/compute/lambda.md' or 'gcp/database/cloud-spanner.md'",
            ),
        }),
        execute: async ({ path: relPath }) => {
          const normalised = path.normalize(relPath).replace(/\\/g, "/");
          const parts = normalised.split("/");
          if (
            parts.length < 2 ||
            !ALLOWED_PROVIDER_DIRS.includes(
              parts[0] as (typeof ALLOWED_PROVIDER_DIRS)[number],
            ) ||
            normalised.includes("..")
          ) {
            return {
              error: `Invalid path '${relPath}'. Must be under aws/, azure/, or gcp/ and not traverse upward.`,
            };
          }

          const absolutePath = path.join(DATA_DIR, normalised);
          try {
            const content = await readFile(absolutePath, "utf-8");
            return { content };
          } catch {
            return {
              error: `File not found: ${relPath}. Check the provider, pillar, and service slug.`,
            };
          }
        },
      });

      // ── Tool: update_architecture ──────────────────────────────────────
      const updateArchitectureTool = tool({
        description:
          "Update the diagram and services panel with a modified architecture. " +
          "Call this when the user explicitly requests a service change or architectural modification. " +
          "Provide the COMPLETE updated services list (not just the changed items) and a short description of the updated architecture for diagram generation.",
        inputSchema: FollowupUpdateSchema,
        execute: async ({
          coreServices,
          secondaryServices,
          synthesisContext,
        }) => {
          writer.write({
            type: "data-archon-diagram",
            id: "phase-diagram",
            data: { state: "generating" },
          });
          writer.write({
            type: "data-archon-services",
            id: "phase-services",
            data: { state: "generating" },
          });

          const diagramOutputDir =
            process.env.DIAGRAM_OUTPUT_DIR ?? "/tmp/archon-diagrams";
          const { mkdir } = await import("fs/promises");
          await mkdir(diagramOutputDir, { recursive: true }).catch(() => {});

          // ── Step 1: Build and emit services (normalise pillar labels) ──────
          const coreCards: ServiceCard[] = coreServices.map((s, i) => ({
            tier: "core" as const,
            provider: s.provider,
            serviceName: s.serviceName,
            pillarLabel: normalisePillarLabel(s.pillarLabel),
            coreTag: s.coreTag ?? null,
            description: s.description,
            sortOrder: i,
          }));

          const secondaryCards: ServiceCard[] = secondaryServices.map(
            (s, i) => ({
              tier: "secondary" as const,
              provider: s.provider,
              serviceName: s.serviceName,
              pillarLabel: normalisePillarLabel(s.pillarLabel),
              description: s.description,
              sortOrder: i,
            }),
          );

          writer.write({
            type: "data-archon-services",
            id: "phase-services",
            data: {
              state: "complete",
              coreServices: coreCards,
              secondaryServices: secondaryCards,
            },
          });

          if (onPersistServices) {
            await onPersistServices([...coreCards, ...secondaryCards]);
          }

          // ── Step 2: Build rich diagram prompt from finalised service list ──

          // Hard cap: diagram must stay within 12 nodes (including Users node).
          // All core services are required; secondary ones fill the remaining slots.
          const DIAGRAM_NODE_LIMIT = 12;
          const reservedForUsers = 1;
          const maxSecondaryForDiagram = Math.max(
            0,
            DIAGRAM_NODE_LIMIT - reservedForUsers - coreCards.length,
          );
          // Take only the most important secondary services (first N by sortOrder).
          const diagramSecondaryCards = secondaryCards.slice(
            0,
            maxSecondaryForDiagram,
          );

          const coreServicesList = coreCards
            .map(
              (s) =>
                `- ${s.serviceName} (${s.provider}, ${s.pillarLabel}): ${s.description}`,
            )
            .join("\n");
          const secondaryServicesList = diagramSecondaryCards
            .map(
              (s) =>
                `- ${s.serviceName} (${s.provider}, ${s.pillarLabel}): ${s.description}`,
            )
            .join("\n");

          const diagramPrompt = previousDiagramCode
            ? [
                "## Previous Diagram Code",
                "The following Python code generated the current diagram. Modify it to reflect the service changes below — preserve the overall structure, layout direction, and cluster names. Only add, remove, or replace nodes and edges for services that changed.",
                "",
                "```python",
                previousDiagramCode,
                "```",
                "",
                "## Updated Service List",
                "Apply the following service changes to the diagram code above:",
                "",
                "### Core Services",
                coreServicesList,
                "",
                "### Additional Services",
                secondaryServicesList,
              ].join("\n")
            : [
                synthesisContext,
                "",
                "## Core Services",
                coreServicesList,
                "",
                "## Additional Services",
                secondaryServicesList,
              ].join("\n");

          // ── Step 3: Diagram re-generation via MCP ─────────────────────────
          const mcpClient = await createDiagramMCPClient();
          try {
            const mcpTools = await mcpClient.tools();
            const diagramGenResult = await generateText({
              model: makeModel(),
              providerOptions: agentProviderOptions,
              tools: mcpTools,
              stopWhen: stepCountIs(7),
              system: loadDiagramPrompt(diagramOutputDir),
              prompt: diagramPrompt,
              abortSignal,
            });

            const { imagePath, diagramCode, lastGenerateError } =
              extractDiagramStepResults(diagramGenResult.steps);

            if (imagePath) {
              writer.write({
                type: "data-archon-diagram",
                id: "phase-diagram",
                data: { state: "complete", imagePath, diagramCode },
              });
            } else {
              writer.write({
                type: "data-archon-diagram",
                id: "phase-diagram",
                data: {
                  state: "error",
                  error: lastGenerateError
                    ? `Diagram generation failed: ${lastGenerateError}`
                    : "generate_diagram was not called or returned no output",
                },
              });
            }
          } catch (err) {
            writer.write({
              type: "data-archon-diagram",
              id: "phase-diagram",
              data: {
                state: "error",
                error: err instanceof Error ? err.message : String(err),
              },
            });
          } finally {
            await mcpClient.close();
          }

          return { success: true };
        },
      });

      // ── Run the followup agent with tools ─────────────────────────────
      const result = streamText({
        model: makeModel(),
        providerOptions: agentProviderOptions,
        system: followupSystem,
        messages: historyMessages,
        tools: {
          find_service_doc: findServiceDocTool,
          list_service_docs: listServiceDocsTool,
          read_service_doc: readServiceDocTool,
          update_architecture: updateArchitectureTool,
        },
        stopWhen: stepCountIs(10),
        abortSignal,
      });

      writer.merge(
        result.toUIMessageStream() as ReadableStream<
          Parameters<typeof writer.write>[0]
        >,
      );
    },
  });
}
