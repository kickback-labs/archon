import {
  readUIMessageStream,
  streamText,
  generateText,
  Output,
  createUIMessageStream,
  generateId,
  stepCountIs,
  type UIMessage,
  type FilePart,
} from "ai";
import { z } from "zod";
import { makeModel, agentProviderOptions } from "./model";
import { createDiagramMCPClient } from "./mcp-client";
import {
  requirementsAgent,
  type RequirementsAgentUIMessage,
} from "./requirements-agent";
import { patternAgent, type PatternAgentUIMessage } from "./pattern-agent";
import {
  wave1Specialists,
  wave2Specialists,
  type SpecialistAgentUIMessage,
  type WaveOutput,
} from "./specialist-agent";
import {
  validatorAgent,
  type ValidatorAgentUIMessage,
} from "./validator-agent";
import type { CategorySlug } from "@/lib/tools/retrieve-tool";
import type { UserSettings } from "@/lib/db/schema";
import {
  loadPrompt,
  loadDiagramPrompt,
  extractDiagramStepResults,
} from "./pipeline-utils";

// ─── Prompts (loaded once at module init) ────────────────────────────────────

const SYNTHESIS_SYSTEM = loadPrompt("synthesis");
const SERVICES_EXTRACTION_SYSTEM = loadPrompt("services-extraction");

// ─── Data part schemas ────────────────────────────────────────────────────────

/**
 * A single service card produced by the services extraction phase.
 * Shared between the pipeline data part and the DB upsert.
 */
export type ServiceCard = {
  tier: "core" | "secondary";
  provider: "AWS" | "Azure" | "GCP";
  serviceName: string;
  pillarLabel: string;
  /** Short "why it's core" tag (≤ 50 chars). Only present for core services, null for secondary. */
  coreTag?: string | null;
  /** App-tailored description. Core ≤ 300 chars, secondary ≤ 150 chars. */
  description: string;
  sortOrder: number;
};

/**
 * Data parts emitted by the pipeline into the UIMessage stream.
 * These replace the tool-call parts that the old ToolLoopAgent orchestrator
 * would have produced, giving the UI the same phase-progress signals.
 */
export type ArchonDataTypes = {
  /** Emitted when the requirements phase starts/finishes */
  "archon-requirements": {
    state: "streaming" | "complete";
    output?: RequirementsAgentUIMessage;
  };
  /** Emitted when the pattern phase starts/finishes */
  "archon-patterns": {
    state: "streaming" | "complete";
    output?: PatternAgentUIMessage;
  };
  /** Emitted incrementally as wave 1 specialists complete */
  "archon-wave1": WaveOutput & { complete?: boolean; total?: number };
  /** Emitted incrementally as wave 2 specialists complete */
  "archon-wave2": WaveOutput & { complete?: boolean };
  /** Emitted when the validator phase starts/finishes */
  "archon-validator": {
    state: "streaming" | "complete";
    output?: ValidatorAgentUIMessage;
  };
  /** Emitted when diagram generation completes (Phase 5) */
  "archon-diagram": {
    state: "generating" | "complete" | "error";
    /** URL path served by /api/diagrams/... */
    imagePath?: string;
    /** Python diagrams code used to generate the PNG */
    diagramCode?: string;
    error?: string;
  };
  /** Emitted when service cards extraction completes (Phase 5b, parallel with diagram) */
  "archon-services": {
    state: "generating" | "complete" | "error";
    coreServices?: ServiceCard[];
    secondaryServices?: ServiceCard[];
    error?: string;
  };
};

export type ArchonUIMessage = UIMessage<unknown, ArchonDataTypes>;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Extract the last text part from any agent's final UIMessage. */
function extractLastText(message: UIMessage): string {
  const lastText = message.parts.findLast((p) => p.type === "text");
  return lastText?.type === "text" ? lastText.text : "{}";
}

/**
 * Stream an agent to completion, returning the final accumulated UIMessage.
 * Calls onMilestone only when a new completed tool call appears in the snapshot,
 * avoiding per-token writes that would cause React key churn and UI flashing.
 */
async function streamAgentWithMilestones<T extends UIMessage>(
  stream: ReadableStream,
  onMilestone: (msg: T) => void,
): Promise<T> {
  let lastMessage: T | undefined;
  let lastCompletedToolCount = 0;
  for await (const message of readUIMessageStream({ stream })) {
    lastMessage = message as T;
    const completedCount = lastMessage.parts.filter(
      (p) =>
        p.type.startsWith("tool-") &&
        "state" in p &&
        p.state === "output-available",
    ).length;
    if (completedCount > lastCompletedToolCount) {
      lastCompletedToolCount = completedCount;
      onMilestone(lastMessage);
    }
  }
  if (!lastMessage) throw new Error("Agent produced no output");
  return lastMessage;
}

// ─── Wave helpers ─────────────────────────────────────────────────────────────

const WAVE1_PILLARS = [
  "compute",
  "storage",
  "database",
  "analytics",
  "ai_ml",
  "integration_messaging",
  "migration_hybrid",
  "other",
] as const;

type Wave1Pillar = (typeof WAVE1_PILLARS)[number];

function buildWave1Prompt(
  pillar: string,
  requirementsJson: string,
  patternJson: string,
): string {
  return [
    "## Requirements Schema",
    requirementsJson,
    "",
    "## Pattern Output",
    patternJson,
    "",
    `## Your Pillar: ${pillar}`,
    `You are the ${pillar} specialist. Using the Requirements Schema and Pattern Output above, ` +
      `follow your mandatory process: (1) formulate a precise retrieval query, ` +
      `(2) call retrieve() exactly once, (3) reason over the returned documents, ` +
      `(4) output your pillar recommendation as raw JSON.`,
  ].join("\n");
}

function buildWave2Prompt(
  pillar: string,
  requirementsJson: string,
  patternJson: string,
  wave1Json: string,
): string {
  return [
    "## Requirements Schema",
    requirementsJson,
    "",
    "## Pattern Output",
    patternJson,
    "",
    "## Wave 1 Recommendations",
    wave1Json,
    "",
    `## Your Pillar: ${pillar}`,
    `You are the ${pillar} specialist. Read the Wave 1 Recommendations above carefully — ` +
      `your retrieval query and every decision you make must be grounded in the specific ` +
      `services Wave 1 already selected. Follow your mandatory process: ` +
      `(1) formulate a precise retrieval query based on Wave 1 choices, ` +
      `(2) call retrieve() exactly once, (3) reason over the returned documents in the ` +
      `context of the full Wave 1 picture, (4) output your pillar recommendation as raw JSON.`,
  ].join("\n");
}

function buildValidatorPrompt(
  requirementsJson: string,
  patternJson: string,
  wave1Json: string,
  wave2Json: string,
): string {
  return [
    "## Requirements Schema",
    requirementsJson,
    "",
    "## Pattern Analysis",
    patternJson,
    "",
    "## Wave 1 Pillar Recommendations",
    wave1Json,
    "",
    "## Wave 2 Pillar Recommendations",
    wave2Json,
    "",
    "Review all of the above against the Well-Architected framework and produce your report.",
  ].join("\n");
}

async function runSpecialist(
  agent:
    | (typeof wave1Specialists)[keyof typeof wave1Specialists]
    | (typeof wave2Specialists)[keyof typeof wave2Specialists],
  prompt: string,
  abortSignal?: AbortSignal,
): Promise<SpecialistAgentUIMessage> {
  const result = await agent.stream({ prompt, abortSignal });
  let lastMessage: SpecialistAgentUIMessage | undefined;
  for await (const message of readUIMessageStream({
    stream: result.toUIMessageStream(),
  })) {
    lastMessage = message as SpecialistAgentUIMessage;
  }
  if (!lastMessage) throw new Error("Specialist agent produced no output");
  return lastMessage;
}

/**
 * Run specialist promises and yield incremental WaveOutput as each resolves.
 */
async function* runSpecialistsIncrementally(
  specialistEntries: Array<{
    pillar: CategorySlug;
    promise: Promise<SpecialistAgentUIMessage>;
  }>,
): AsyncGenerator<WaveOutput> {
  const waveOutput: WaveOutput = {};
  const completed: Array<{
    pillar: CategorySlug;
    msg: SpecialistAgentUIMessage;
  }> = [];
  let notify: (() => void) | null = null;
  let remaining = specialistEntries.length;

  const wrappedPromises = specialistEntries.map(({ pillar, promise }) =>
    promise
      .then((msg) => {
        completed.push({ pillar, msg });
        notify?.();
      })
      .catch(() => {
        remaining--;
        notify?.();
      }),
  );

  while (remaining > 0) {
    while (completed.length > 0) {
      const result = completed.shift()!;
      waveOutput[result.pillar] = result.msg;
      remaining--;
      yield { ...waveOutput };
    }
    if (remaining <= 0) break;
    await new Promise<void>((resolve) => {
      notify = resolve;
    });
    notify = null;
  }

  await Promise.allSettled(wrappedPromises);
}

// ─── Utility ──────────────────────────────────────────────────────────────────

/** Extract the latest user message text from the uiMessages array. */
export function extractUserPrompt(uiMessages: UIMessage[]): string {
  const last = [...uiMessages].reverse().find((m) => m.role === "user");
  if (!last) return "";
  return last.parts
    .filter((p) => p.type === "text")
    .map((p) => (p.type === "text" ? p.text : ""))
    .join("\n");
}

/** Extract file parts (e.g. PDFs) from the latest user message. */
export function extractUserFileParts(uiMessages: UIMessage[]): FilePart[] {
  const last = [...uiMessages].reverse().find((m) => m.role === "user");
  if (!last) return [];
  const parts: FilePart[] = [];
  for (const p of last.parts) {
    if (p.type === "file") {
      const dataUrlPrefix = `data:${p.mediaType};base64,`;
      const base64 = p.url.startsWith(dataUrlPrefix)
        ? p.url.slice(dataUrlPrefix.length)
        : p.url;
      parts.push({
        type: "file" as const,
        data: base64,
        mediaType: p.mediaType,
        ...(p.filename ? { filename: p.filename } : {}),
      });
    }
  }
  return parts;
}

/**
 * Format user settings into a context block prepended to prompts.
 * Returns an empty string if settings are null/undefined.
 */
export function formatSettingsContext(
  settings: UserSettings | null | undefined,
): string {
  if (!settings) return "";

  const lines: string[] = [
    "## User Profile (from saved settings — treat as explicitly stated preferences)",
    `- Scale: ${settings.scale}`,
    `- Cloud Expertise: ${settings.cloudExpertise}`,
    `- Budget: ${settings.budget}`,
  ];

  if (settings.providers && settings.providers.length > 0) {
    lines.push(`- Preferred Providers: ${settings.providers.join(", ")}`);
  }

  if (settings.compliance && settings.compliance.length > 0) {
    lines.push(`- Compliance Requirements: ${settings.compliance.join(", ")}`);
  }

  lines.push("");
  return lines.join("\n");
}

/**
 * Resolve the hard cap on additional (secondary) services from user settings.
 * Mirrors the table in synthesis.md so the exact number can be injected into
 * the synthesis prompt rather than requiring the model to look it up.
 */
export function computeAdditionalServicesCap(
  settings: UserSettings | null | undefined,
): number {
  if (!settings) return 10;
  const scale = settings.scale ?? "";
  const expertise = settings.cloudExpertise ?? "";

  if (scale === "> 100k" && expertise === "high") return 20;
  if (scale === "1k–100k" || expertise === "medium") return 15;

  // Default
  return 10;
}

// ─── Services extraction schema ───────────────────────────────────────────────

const ServiceItemSchema = z.object({
  serviceName: z
    .string()
    .describe(
      "The full, official name of the cloud service (e.g. 'Cloud SQL', 'AWS Lambda')",
    ),
  provider: z.enum(["AWS", "Azure", "GCP"]).describe("The cloud provider"),
  pillarLabel: z
    .string()
    .describe(
      "Human-readable pillar name, e.g. 'Database', 'Compute', 'Security & Identity'",
    ),
  coreTag: z
    .string()
    .nullable()
    .describe(
      "Core services only: a short (≤ 50 chars) plain-English phrase explaining why the app cannot work without this service. Write in everyday language, NOT technical jargon. Good: 'Stores every video and user file', 'Runs all the app's backend logic'. Bad: 'Primary relational database layer', 'Stateless compute tier'. Use null for secondary services.",
    ),
  description: z
    .string()
    .describe(
      "App-tailored description that MUST start with the service name (e.g. 'Cloud SQL serves as the primary database storing user profiles, video metadata, and comments.'). Explain what this service does in this specific application in plain, conversational language. NEVER mention user settings such as scale figures, budget labels, or expertise levels. Core ≤ 300 chars, secondary ≤ 150 chars. Do NOT write generic descriptions that could apply to any app.",
    ),
});

export const ServicesExtractionSchema = z.object({
  coreServices: z
    .array(ServiceItemSchema)
    .describe(
      "The core services — the absolute essentials the app cannot run without (max 5). Must mirror the Core Services section of the synthesis.",
    ),
  secondaryServices: z
    .array(ServiceItemSchema)
    .describe(
      "The secondary/additional services that meaningfully improve the app. Must mirror the Additional Services section of the synthesis.",
    ),
});

// ─── Main pipeline ────────────────────────────────────────────────────────────

/**
 * Run the full Archon pipeline deterministically.
 *
 * Data flows as in-memory values between phases — no LLM orchestrator between
 * phases means no token-by-token JSON copying across tool call boundaries.
 *
 * Phase progress is surfaced as typed data parts in the UIMessage stream:
 *   data-archon-requirements  →  Phase 0: Requirements extraction
 *   data-archon-patterns      →  Phase 1: Pattern selection
 *   data-archon-wave1         →  Phase 2a: Independent specialist wave (incremental)
 *   data-archon-wave2         →  Phase 2b: Reactive specialist wave (incremental)
 *   data-archon-validator     →  Phase 3: Well-Architected validation report
 */
export function runArchonPipeline({
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
      const userPrompt = extractUserPrompt(uiMessages);
      const userFileParts = extractUserFileParts(uiMessages);
      const settingsContext = formatSettingsContext(userSettings);

      const enrichedPrompt = settingsContext
        ? `${settingsContext}\n## User Request\n${userPrompt}`
        : userPrompt;

      // ── Phase 0: Requirements Agent ────────────────────────────────────
      writer.write({
        type: "data-archon-requirements",
        id: "phase-requirements",
        data: { state: "streaming" },
      });

      const reqResult = await requirementsAgent.stream(
        userFileParts.length > 0
          ? {
              messages: [
                {
                  role: "user" as const,
                  content: [
                    { type: "text" as const, text: enrichedPrompt },
                    ...userFileParts,
                  ],
                },
              ],
              abortSignal,
            }
          : {
              prompt: enrichedPrompt,
              abortSignal,
            },
      );

      const reqMessage =
        await streamAgentWithMilestones<RequirementsAgentUIMessage>(
          reqResult.toUIMessageStream(),
          (msg: RequirementsAgentUIMessage) => {
            writer.write({
              type: "data-archon-requirements",
              id: "phase-requirements",
              data: { state: "streaming", output: msg },
            });
          },
        );
      const requirementsJson = extractLastText(reqMessage);

      writer.write({
        type: "data-archon-requirements",
        id: "phase-requirements",
        data: { state: "complete", output: reqMessage },
      });

      // ── Phase 1: Pattern Agent ─────────────────────────────────────────
      writer.write({
        type: "data-archon-patterns",
        id: "phase-patterns",
        data: { state: "streaming" },
      });

      const patResult = await patternAgent.stream({
        prompt: requirementsJson,
        abortSignal,
      });

      const patMessage = await streamAgentWithMilestones<PatternAgentUIMessage>(
        patResult.toUIMessageStream(),
        (msg: PatternAgentUIMessage) => {
          writer.write({
            type: "data-archon-patterns",
            id: "phase-patterns",
            data: { state: "streaming", output: msg },
          });
        },
      );
      const patternJson = extractLastText(patMessage);

      writer.write({
        type: "data-archon-patterns",
        id: "phase-patterns",
        data: { state: "complete", output: patMessage },
      });

      // Parse implied_pillars for wave 1
      let impliedPillars: CategorySlug[] = [];
      try {
        const parsed = JSON.parse(patternJson) as {
          implied_pillars?: string[];
        };
        impliedPillars = (parsed.implied_pillars ?? []) as CategorySlug[];
      } catch {
        impliedPillars = [...WAVE1_PILLARS];
      }

      // ── Phase 2 Wave 1: Independent Specialists ────────────────────────
      const wave1Pillars = impliedPillars.filter((p) =>
        (WAVE1_PILLARS as readonly string[]).includes(p),
      ) as Wave1Pillar[];

      const wave1Entries = wave1Pillars.map((pillar) => ({
        pillar: pillar as CategorySlug,
        promise: runSpecialist(
          wave1Specialists[pillar],
          buildWave1Prompt(pillar, requirementsJson, patternJson),
          abortSignal,
        ),
      }));

      const wave1Total = wave1Pillars.length;

      writer.write({
        type: "data-archon-wave1",
        id: "phase-wave1",
        data: { total: wave1Total },
      });

      const wave1Output: WaveOutput = {};
      for await (const snapshot of runSpecialistsIncrementally(wave1Entries)) {
        Object.assign(wave1Output, snapshot);
        writer.write({
          type: "data-archon-wave1",
          id: "phase-wave1",
          data: { ...wave1Output, total: wave1Total },
        });
      }
      writer.write({
        type: "data-archon-wave1",
        id: "phase-wave1",
        data: { ...wave1Output, complete: true, total: wave1Total },
      });

      const wave1Summary: Record<string, string> = {};
      for (const [pillar, msg] of Object.entries(wave1Output)) {
        if (msg)
          wave1Summary[pillar] = extractLastText(
            msg as SpecialistAgentUIMessage,
          );
      }
      const wave1Json = JSON.stringify(wave1Summary, null, 2);

      // ── Phase 2 Wave 2: Reactive Specialists ───────────────────────────
      const wave2PillarNames = [
        "networking",
        "devops",
        "security_identity",
      ] as const;
      const wave2Entries = wave2PillarNames.map((pillar) => ({
        pillar: pillar as CategorySlug,
        promise: runSpecialist(
          wave2Specialists[pillar],
          buildWave2Prompt(pillar, requirementsJson, patternJson, wave1Json),
          abortSignal,
        ),
      }));

      writer.write({
        type: "data-archon-wave2",
        id: "phase-wave2",
        data: {},
      });

      const wave2Output: WaveOutput = {};
      for await (const snapshot of runSpecialistsIncrementally(wave2Entries)) {
        Object.assign(wave2Output, snapshot);
        writer.write({
          type: "data-archon-wave2",
          id: "phase-wave2",
          data: { ...wave2Output },
        });
      }
      writer.write({
        type: "data-archon-wave2",
        id: "phase-wave2",
        data: { ...wave2Output, complete: true },
      });

      const wave2Summary: Record<string, string> = {};
      for (const [pillar, msg] of Object.entries(wave2Output)) {
        if (msg)
          wave2Summary[pillar] = extractLastText(
            msg as SpecialistAgentUIMessage,
          );
      }
      const wave2Json = JSON.stringify(wave2Summary, null, 2);

      // ── Phase 3: Validator Agent ───────────────────────────────────────
      writer.write({
        type: "data-archon-validator",
        id: "phase-validator",
        data: { state: "streaming" },
      });

      const valResult = await validatorAgent.stream({
        prompt: buildValidatorPrompt(
          requirementsJson,
          patternJson,
          wave1Json,
          wave2Json,
        ),
        abortSignal,
      });

      const valMessage =
        await streamAgentWithMilestones<ValidatorAgentUIMessage>(
          valResult.toUIMessageStream(),
          (msg: ValidatorAgentUIMessage) => {
            writer.write({
              type: "data-archon-validator",
              id: "phase-validator",
              data: { state: "streaming", output: msg },
            });
          },
        );
      const validatorReport = extractLastText(valMessage);

      writer.write({
        type: "data-archon-validator",
        id: "phase-validator",
        data: { state: "complete", output: valMessage },
      });

      // ── Phase 4: Synthesis ─────────────────────────────────────────────
      const additionalServicesCap = computeAdditionalServicesCap(userSettings);

      const synthesisPrompt = [
        "## Requirements Schema",
        requirementsJson,
        "",
        "## Pattern Analysis",
        patternJson,
        "",
        "## Wave 1 Pillar Recommendations",
        wave1Json,
        "",
        "## Wave 2 Pillar Recommendations",
        wave2Json,
        "",
        "## Well-Architected Validation Report",
        validatorReport,
        "",
        `## ⚠️ HARD CAP FOR THIS RESPONSE`,
        `Additional Services: **${additionalServicesCap} maximum**. Do not list more than ${additionalServicesCap} bullets in the Additional Services section — this is a hard limit, not a target. Count before you write. If you reach ${additionalServicesCap}, stop. Do NOT exceed it under any circumstances.`,
        "",
        "Now write the final architectural response. Use the specialist justifications to write notes that are specific to the user's workload — reference their actual use case, data type, scale, or constraints. Avoid generic descriptions. Where the Well-Architected Validation Report identifies strengths or concerns, incorporate the most important ones into your Trade-offs & Caveats section.",
      ].join("\n");

      const synthesisResult = streamText({
        model: makeModel(),
        providerOptions: agentProviderOptions,
        system: SYNTHESIS_SYSTEM,
        prompt: synthesisPrompt,
        abortSignal,
      });

      const synthesisTextId = "synthesis-text";
      writer.write({ type: "text-start", id: synthesisTextId });
      let synthesisText = "";
      for await (const chunk of synthesisResult.textStream) {
        synthesisText += chunk;
        writer.write({ type: "text-delta", delta: chunk, id: synthesisTextId });
      }
      writer.write({ type: "text-end", id: synthesisTextId });

      // ── Phase 5 & 5b: Diagram + Services (parallel) ───────────────────
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

      const servicesPrompt = [
        "## User Request",
        userPrompt,
        "",
        "## Requirements Schema",
        requirementsJson,
        "",
        "## Wave 1 Specialist Recommendations",
        wave1Json,
        "",
        "## Wave 2 Specialist Recommendations",
        wave2Json,
        "",
        "## Final Synthesis (Core Services + Additional Services sections)",
        synthesisText,
      ].join("\n");

      const [diagramResult, servicesResult] = await Promise.allSettled([
        // ── Phase 5: Diagram Generation ───────────────────────────────────
        (async () => {
          const diagramOutputDir =
            process.env.DIAGRAM_OUTPUT_DIR ?? "/tmp/archon-diagrams";

          const { mkdir } = await import("fs/promises");
          await mkdir(diagramOutputDir, { recursive: true }).catch(() => {});

          const mcpClient = await createDiagramMCPClient();
          try {
            const mcpTools = await mcpClient.tools();
            const diagramGenResult = await generateText({
              model: makeModel(),
              providerOptions: agentProviderOptions,
              tools: mcpTools,
              stopWhen: stepCountIs(7),
              system: loadDiagramPrompt(diagramOutputDir),
              prompt: synthesisText,
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
          } finally {
            await mcpClient.close();
          }
        })(),

        // ── Phase 5b: Services Extraction ─────────────────────────────────
        (async () => {
          const result = await generateText({
            model: makeModel(),
            providerOptions: agentProviderOptions,
            output: Output.object({ schema: ServicesExtractionSchema }),
            system: SERVICES_EXTRACTION_SYSTEM,
            prompt: servicesPrompt,
            abortSignal,
          });
          const extracted = result.output;

          const coreCards: ServiceCard[] = extracted.coreServices.map(
            (s, i) => ({
              tier: "core" as const,
              provider: s.provider,
              serviceName: s.serviceName,
              pillarLabel: s.pillarLabel,
              coreTag: s.coreTag,
              description: s.description,
              sortOrder: i,
            }),
          );

          const secondaryCards: ServiceCard[] = extracted.secondaryServices.map(
            (s, i) => ({
              tier: "secondary" as const,
              provider: s.provider,
              serviceName: s.serviceName,
              pillarLabel: s.pillarLabel,
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
        })(),
      ]);

      if (diagramResult.status === "rejected") {
        const msg =
          diagramResult.reason instanceof Error
            ? diagramResult.reason.message
            : String(diagramResult.reason);
        writer.write({
          type: "data-archon-diagram",
          id: "phase-diagram",
          data: { state: "error", error: msg },
        });
      }

      if (servicesResult.status === "rejected") {
        const msg =
          servicesResult.reason instanceof Error
            ? servicesResult.reason.message
            : String(servicesResult.reason);
        writer.write({
          type: "data-archon-services",
          id: "phase-services",
          data: { state: "error", error: msg },
        });
      }
    },
  });
}
