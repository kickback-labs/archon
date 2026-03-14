import {
  readUIMessageStream,
  streamText,
  generateText,
  Output,
  createUIMessageStream,
  generateId,
  stepCountIs,
  tool,
  type UIMessage,
  type FilePart,
} from "ai";
import { readFile } from "fs/promises";
import path from "path";
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
} from "./specialist-agent";
import {
  validatorAgent,
  type ValidatorAgentUIMessage,
} from "./validator-agent";
import type { CategorySlug } from "@/lib/tools/retrieve-tool";
import type { WaveOutput } from "./wave-tools";
import type { UserSettings } from "@/lib/db/schema";

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
  "archon-wave1": WaveOutput & { complete?: boolean };
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
    /** Python diagrams code used to generate the PNG — captured from the generate_diagram tool call input. */
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
    // Fire a milestone each time a tool call's output becomes available.
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
 * Identical to the race-and-remove pattern in wave-tools.ts.
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

// ─── Synthesis & follow-up prompts ────────────────────────────────────────────

const SYNTHESIS_SYSTEM = `You are Archon, a senior cloud architect AI. You have just completed a full architectural analysis pipeline. Write the final architectural response in markdown, structured exactly as follows:

## Architecture: [one-line title]

[2–3 sentence executive summary. Describe the architecture and explain why it fits the user's idea — reference their use case, the type of application, and what it needs to do well. Do NOT mention or echo the user's settings (scale tier, expertise level, budget label, constraints) — the reasoning must be grounded in the nature of the workload and the application itself, not the user's configuration choices.]

## Key Decisions

[3–6 bullet points. Each bullet = one decision + one-line rationale. No sub-bullets.]

## Core Services

List the services the application genuinely cannot work without — the absolute essentials. Hard cap: 5 services, no exceptions. Each service MUST come from a different pillar (one per pillar). Pick the single most critical pillar from each specialist's recommendation and take only its top service.

Format each bullet as: \`- **Service Name** (Pillar) — [tailored note]\`

## Additional Services

List services that meaningfully improve the app but are not strictly required to run it. Apply the cap from the table below based on the user's scale and cloud expertise in the Requirements Schema:

| scale / expertise            | additional services (hard cap) |
|------------------------------|-------------------------------|
| < 1k users OR low expertise  | up to 10                      |
| 1k–100k users OR medium exp. | up to 15                      |
| > 100k users AND high exp.   | up to 20                      |

Do NOT pad to reach the cap — include only services that add real value for this specific app. When in doubt, cut it. Do NOT add any parenthetical notes, annotations, or commentary about the cap itself to the section header or anywhere in the output — just list the services. Format each bullet the same way: \`- **Service Name** (Pillar) — [tailored note]\`

For EVERY bullet in both sections, write a note grounded in the user's actual workload — reference their use case, data type, and the specific needs of their application. Do NOT reference the user's settings (no scale figures like "<1k users", no budget labels, no expertise levels). Do NOT write notes that could apply to any app (e.g. "primary object store" or "managed relational database"). Explain WHY this service fits THIS application (e.g. "holds uploaded videos; Intelligent-Tiering keeps cost low since most clips are rarely re-watched after the first week").

## Trade-offs & Caveats

[2–4 bullet points covering honest trade-offs, risks, or constraints the user should know. Do NOT mention the user's settings (scale tier, expertise level, budget label) — frame trade-offs in terms of the architecture and the application's needs.]

**Formatting rules:**
- Use ## and ### headers — never use plain bold as a heading substitute
- Keep each section tight: no padding, no restating what the tool panels already showed
- Never use nested (sub-)bullet points — all bullets must be top-level
- Respect the service count caps above — exceeding them is a failure
- Always use human-readable pillar names in service bullets — never raw slugs: write "Security & Identity" not \`security_identity\`, "AI/ML" not \`ai_ml\`, "Integration & Messaging" not \`integration_messaging\`, etc.
- NEVER echo the user's settings anywhere in the output — no scale figures (e.g. "<1k users", "> 100k users"), no budget labels (e.g. "cost-focused", "low budget"), no expertise levels (e.g. "low expertise", "medium expertise"). These are internal configuration values, not part of the architectural narrative.`;

// ─── Utility ──────────────────────────────────────────────────────────────────

/** Extract the latest user message text from the uiMessages array. */
function extractUserPrompt(uiMessages: UIMessage[]): string {
  const last = [...uiMessages].reverse().find((m) => m.role === "user");
  if (!last) return "";
  return last.parts
    .filter((p) => p.type === "text")
    .map((p) => (p.type === "text" ? p.text : ""))
    .join("\n");
}

/** Extract file parts (e.g. PDFs) from the latest user message. */
function extractUserFileParts(uiMessages: UIMessage[]): FilePart[] {
  const last = [...uiMessages].reverse().find((m) => m.role === "user");
  if (!last) return [];
  const parts: FilePart[] = [];
  for (const p of last.parts) {
    if (p.type === "file") {
      // p.url is a data URL: "data:<mediaType>;base64,<b64data>"
      // FilePart.data must be a plain base64 string, not a data URL.
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
 * Format user settings into a context block that can be prepended to prompts.
 * Returns an empty string if settings are null/undefined.
 */
function formatSettingsContext(
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

// ─── Services extraction ──────────────────────────────────────────────────────

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

const ServicesExtractionSchema = z.object({
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

const SERVICES_EXTRACTION_SYSTEM = `You are a cloud architect producing structured service card data for a cloud architecture recommendation.

You will receive:
1. The user's original request
2. The requirements schema extracted from that request
3. The specialist recommendations (Wave 1 + Wave 2) for the services that were selected
4. The final synthesis text that already lists Core Services and Additional Services

Your job is to produce a JSON object with two arrays: coreServices and secondaryServices.

## Rules

- Mirror EXACTLY the services listed in the synthesis's "Core Services" and "Additional Services" sections. Do NOT add or remove services.
- For each service, write a description that MUST begin with the service name and explain what that service does in the context of this specific application, in plain conversational language. For example: "Cloud SQL stores all user profiles, video metadata, comments, and viewing statistics — it's the central data layer the app reads and writes on every request." Reference the user's use case, data type, or key application features. Use the specialist justifications for grounding — but rewrite them in fresh language (do NOT copy the synthesis text verbatim).
- NEVER mention the user's settings in any description or coreTag — no scale figures (e.g. "<1k users", "100k users"), no budget labels (e.g. "low-cost", "cost-focused"), no expertise level (e.g. "low expertise"), no constraint labels of any kind. Descriptions must be grounded in what the application does, not in the user's configuration.
- Core service descriptions: ≤ 300 characters. Always start with the service name.
- Secondary service descriptions: ≤ 150 characters. Always start with the service name. No coreTag field.
- coreTag (core services only): a short (≤ 50 chars) plain-English phrase that explains WHY the app cannot work without this service. Write it in everyday language a non-expert would understand — NOT technical jargon. Good examples: "Stores every video and user file", "Runs all the app's backend logic", "Keeps users logged in securely". Bad examples: "Primary relational database layer", "Stateless compute tier", "Relational metadata and transactional store".
- pillarLabel must be the human-readable pillar name (e.g. "Database" not "database", "Security & Identity" not "security_identity", "AI/ML" not "ai_ml", "Integration & Messaging" not "integration_messaging").
- Extract the provider from the specialist recommendations — use the provider that was actually recommended, not a generic guess.
- Output ONLY valid JSON matching the schema. No preamble, no markdown fences.`;

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

      // Prepend user settings to the prompt so the requirements agent
      // treats them as explicitly stated preferences instead of falling
      // back to conservative defaults.
      const enrichedPrompt = settingsContext
        ? `${settingsContext}\n## User Request\n${userPrompt}`
        : userPrompt;

      // ── Phase 0: Requirements Agent ────────────────────────────────────
      // Use a stable id so every subsequent write updates the same part in-place
      // (SDK behaviour: if id matches an existing part of the same type, it
      // updates data instead of appending a new part).
      writer.write({
        type: "data-archon-requirements",
        id: "phase-requirements",
        data: { state: "streaming" },
      });

      // When the user attached PDF files, pass them as a structured message
      // (text + file parts) so the model can read the document content.
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

      // Forward each incremental snapshot so the UI sees live tool progress.
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

      // Forward incremental snapshots so read_file tool calls appear live.
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

      // Emit initial empty wave1 part immediately so the UI shows "Delegating tasks…"
      // before any specialist has finished.
      writer.write({
        type: "data-archon-wave1",
        id: "phase-wave1",
        data: {},
      });

      const wave1Output: WaveOutput = {};
      for await (const snapshot of runSpecialistsIncrementally(wave1Entries)) {
        Object.assign(wave1Output, snapshot);
        writer.write({
          type: "data-archon-wave1",
          id: "phase-wave1",
          data: { ...wave1Output },
        });
      }
      // Emit final wave1 complete marker
      writer.write({
        type: "data-archon-wave1",
        id: "phase-wave1",
        data: { ...wave1Output, complete: true },
      });

      // Serialise Wave 1 results for Wave 2 specialists
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

      // Emit initial empty wave2 part so the UI shows "Delegating tasks…" immediately.
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

      // Serialise Wave 2 for synthesis
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
        "Now write the final architectural response. Read the scale and cloud_expertise fields from the Requirements Schema and apply the correct service count caps. Use the specialist justifications to write notes that are specific to the user's workload — reference their actual use case, data type, scale, or constraints. Avoid generic descriptions. Where the Well-Architected Validation Report identifies strengths or concerns, incorporate the most important ones into your Trade-offs & Caveats section.",
      ].join("\n");

      const synthesisResult = streamText({
        model: makeModel(),
        providerOptions: agentProviderOptions,
        system: SYNTHESIS_SYSTEM,
        prompt: synthesisPrompt,
        abortSignal,
      });

      // Stream synthesis text manually so we can run Phase 5 after it completes.
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

      // Build the services extraction prompt once
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

      // Run both phases in parallel
      const [diagramResult, servicesResult] = await Promise.allSettled([
        // ── Phase 5: Diagram Generation ──────────────────────────────────
        (async () => {
          const diagramOutputDir =
            process.env.DIAGRAM_OUTPUT_DIR ?? "/tmp/archon-diagrams";

          // Ensure the output directory exists before passing it to the MCP server.
          // The Python diagrams_tools.py checks os.path.isdir(workspace_dir) and
          // falls back to /tmp/generated-diagrams if the directory doesn't exist.
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
              system: `You are a cloud architect generating a clear, readable infrastructure diagram using the Python diagrams package.

STRICT WORKFLOW — follow in order:
1. Call get_diagram_examples with the relevant provider (e.g. "aws", "gcp", "azure") to learn the syntax.
2. Call list_icons with provider_filter set to the cloud provider to get the exact icon class names. You MUST do this — never guess icon names.
3. Call generate_diagram with the code you write.

ICON USAGE — provider-prefixed aliases (CRITICAL):
The runtime does NOT use wildcard imports. Every provider module is pre-imported as a prefixed alias.
You MUST always qualify every icon class with its alias — never use bare class names.
  Correct:   aws_compute.EC2(...)      gcp_storage.Storage(...)    onprem_client.Users(...)
  Wrong:     EC2(...)                  Storage(...)                 Users(...)

AVAILABLE ALIASES:
  diagrams.aws.*       → aws_compute, aws_storage, aws_database, aws_network, aws_analytics,
                         aws_integration, aws_ml, aws_iot, aws_security, aws_devtools,
                         aws_management, aws_migration, aws_mobile, aws_media, aws_general,
                         aws_cost, aws_ar, aws_game, aws_enablement, aws_engagement,
                         aws_quantum, aws_robotics, aws_satellite, aws_enduser,
                         aws_blockchain, aws_business
  diagrams.gcp.*       → gcp_compute, gcp_storage, gcp_database, gcp_network, gcp_analytics,
                         gcp_ml, gcp_devtools, gcp_operations, gcp_iot, gcp_api,
                         gcp_security, gcp_migration
  diagrams.azure.*     → azure_compute, azure_storage, azure_database, azure_network,
                         azure_web, azure_analytics, azure_integration, azure_devops,
                         azure_ml, azure_iot, azure_general, azure_mobile, azure_security,
                         azure_identity, azure_migration
  diagrams.k8s.*       → k8s_compute, k8s_storage, k8s_network, k8s_rbac, k8s_infra,
                         k8s_ecosystem, k8s_podconfig, k8s_controlplane, k8s_clusterconfig,
                         k8s_chaos, k8s_others, k8s_group
  diagrams.onprem.*    → onprem_compute, onprem_database, onprem_network, onprem_storage,
                         onprem_messaging, onprem_queue, onprem_monitoring, onprem_inmemory,
                         onprem_analytics, onprem_client, onprem_container, onprem_ci,
                         onprem_cd, onprem_vcs, onprem_iac, onprem_gitops, onprem_registry,
                         onprem_security, onprem_identity, onprem_dns, onprem_etl,
                         onprem_workflow, onprem_tracing, onprem_mlops, onprem_certificates,
                         onprem_auth, onprem_aggregator, onprem_logging, onprem_groupware,
                         onprem_proxmox, onprem_search
  diagrams.generic.*   → generic_compute, generic_storage, generic_database, generic_network,
                         generic_os, generic_device, generic_place, generic_virtualization,
                         generic_blank
  diagrams.saas.*      → saas_crm, saas_identity, saas_chat, saas_recommendation, saas_cdn,
                         saas_communication, saas_media, saas_logging, saas_security,
                         saas_social, saas_alerting, saas_analytics, saas_automation,
                         saas_filesharing
  diagrams.elastic.*   → elastic_agent, elastic_beats, elastic_elasticsearch,
                         elastic_enterprisesearch, elastic_observability, elastic_orchestration,
                         elastic_saas, elastic_security
  diagrams.programming.* → programming_flowchart, programming_framework,
                           programming_language, programming_runtime
  diagrams.gis.*       → gis_cli, gis_cplusplus, gis_data, gis_database, gis_desktop,
                         gis_format, gis_geocoding, gis_java, gis_javascript, gis_mobile,
                         gis_ogc, gis_organization, gis_python, gis_routing, gis_server

DIAGRAM DESIGN — clarity over completeness:
- SCOPE: Show only the most important services in the core request/data path. Do NOT include monitoring, logging, IAM/KMS, or CI/CD nodes unless the user explicitly asked for them.
- SIZE: Target 8–12 nodes. Hard maximum: 15 nodes. When in doubt, cut — fewer nodes makes a better diagram.
- LAYOUT: Always use direction="LR" (left-to-right). Do not use "TB".
- CLUSTERS: Group nodes into clusters that reflect their architectural role — not their AWS/GCP/Azure category. Use these names and strictly follow what belongs in each:
  • "Edge" — CDN, DNS, WAF, API Gateway, load balancers only. Never put storage or compute here.
  • "Compute" — application servers, containers, functions, autoscaling groups. Never put databases or storage here.
  • "Data" — databases (relational, NoSQL, cache, search). Never put object storage or CDN here.
  • "Storage" — object stores (S3, GCS, Blob). Never put databases or compute here.
  • "Messaging" — queues, topics, event buses, streams. Never put compute or storage here.
  • "Analytics" — data warehouses, stream processors, lake services. Never put operational databases here.
  Only create a cluster when 2+ nodes belong to it — never create a cluster with a single node. A cluster with no edges connecting it to any other cluster or node MUST be removed. Do not nest more than 2 levels deep. Use invisible edges (Edge(style="invis")) between clusters/nodes to enforce left-to-right column ordering.
- CONNECTIONS: Follow the Diagrams docs "Merged Edges" approach when several arrows converge on the same downstream service or layer. Use Graphviz edge concentration rather than leaving parallel edges in place: set graph_attr with concentrate="true" and splines="spline", keep the default dot engine, and when helpful use a tiny junction node plus shared headports/minlen so the edges visibly merge before the destination. The canonical flow is: Users → Edge cluster → Network cluster → Application/Compute cluster → Data/Storage cluster. Draw one representative arrow per layer-to-layer handoff (e.g. the load balancer node represents the whole Edge→Network handoff). Never fan out edges from a single node to nodes in multiple unrelated layers, and never leave several parallel arrows terminating on the same service when they should be merged into one path. No edge labels — never use Edge(label=...). If two nodes are in the same cluster (same layer), do NOT draw an edge between them unless there is an explicit intra-layer flow (e.g. primary→replica replication).
- NODE LABELS: Every node label must have two lines: line 1 is the service name, line 2 is a short description of its role. Keep each line under ~25 characters. Use \\n to separate them. Example: gcp_compute.Run("Cloud Run\\nHandle API requests").
- USERS: Always represent end users with onprem_client.Users(...).

CODING RULES:
- Always set workspace_dir="${diagramOutputDir}"
- Never write import statements. Start the code directly with: with Diagram(
- Always set graph_attr={"splines": "spline", "concentrate": "true", "ranksep": "2.0", "nodesep": "0.8"} on the Diagram so compatible edges can merge cleanly.
- Only use icon class names that appeared verbatim in the list_icons response, qualified with their alias. If unsure, omit the node.
- PROVIDER CONSISTENCY: For single-provider architectures (e.g. AWS-only), every icon MUST use that provider's aliases (aws_*). Do NOT accidentally use icons from other provider aliases — if a service has no icon in the target provider, omit the node. For explicitly multi-cloud architectures, you may mix provider aliases intentionally; in that case call list_icons once per provider used and group each provider's nodes inside a clearly labelled cluster (e.g. "AWS Region", "Azure Services"). The only always-permitted cross-provider node is onprem_client.Users(...).
- Do not name any variable "os" — it shadows the built-in used by the runtime.
- Do not use parentheses inside diagram title strings (e.g. use "EKS and Fargate" not "EKS (Fargate)").`,
              prompt: synthesisText,
              abortSignal,
            });

            // Extract text from an MCP tool output.
            // The raw execute() return from @ai-sdk/mcp is the MCP CallToolResult:
            //   { content: [{ type: "text", text: "..." }, ...], isError: bool }
            // (mcpToModelOutput converts this for the LLM, but toolResult.output
            //  is the raw value before that transformation.)
            function extractTextFromOutput(output: unknown): string {
              if (!output || typeof output !== "object")
                return String(output ?? "");
              const o = output as Record<string, unknown>;

              // Raw MCP CallToolResult: { content: [...], isError?: bool }
              if (Array.isArray(o.content)) {
                return (o.content as unknown[])
                  .filter(
                    (item): item is { type: string; text: string } =>
                      typeof item === "object" &&
                      item !== null &&
                      (item as Record<string, unknown>).type === "text" &&
                      typeof (item as Record<string, unknown>).text ===
                        "string",
                  )
                  .map((item) => item.text)
                  .join("\n");
              }

              // @ai-sdk/mcp transformed shape: { type: "content", value: [...] }
              if (o.type === "content" && Array.isArray(o.value)) {
                return (o.value as unknown[])
                  .filter(
                    (item): item is { type: string; text: string } =>
                      typeof item === "object" &&
                      item !== null &&
                      (item as Record<string, unknown>).type === "text" &&
                      typeof (item as Record<string, unknown>).text ===
                        "string",
                  )
                  .map((item) => item.text)
                  .join("\n");
              }

              // { type: "json", value: <raw> }
              if (o.type === "json") return JSON.stringify(o.value);

              return JSON.stringify(o);
            }

            // Find the diagram path and source code from the generate_diagram tool
            let imagePath: string | undefined;
            let diagramCode: string | undefined;
            let lastGenerateError: string | undefined;
            for (const step of diagramGenResult.steps) {
              // Capture Python code from the tool call input
              for (const call of step.toolCalls ?? []) {
                if (
                  !("toolName" in call) ||
                  call.toolName !== "generate_diagram"
                )
                  continue;
                const inp = (call as { input?: unknown }).input as
                  | Record<string, unknown>
                  | undefined;
                if (inp && typeof inp.code === "string") diagramCode = inp.code;
              }
              for (const toolResult of step.toolResults ?? []) {
                if (
                  !("toolName" in toolResult) ||
                  toolResult.toolName !== "generate_diagram"
                )
                  continue;
                const text = extractTextFromOutput(toolResult.output);
                const match = text.match(/PNG diagram:\s*(.+\.png)/i);
                if (match) {
                  imagePath = match[1].trim();
                } else {
                  // Surface the actual error text, stripping the "Error: " prefix if present
                  lastGenerateError =
                    text.replace(/^Error:\s*/i, "").trim() ||
                    "generate_diagram returned no output";
                }
              }
            }

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

        // ── Phase 5b: Services Extraction ────────────────────────────────
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

          // Persist to DB via the injected callback
          if (onPersistServices) {
            await onPersistServices([...coreCards, ...secondaryCards]);
          }
        })(),
      ]);

      // Surface any diagram errors that weren't already written
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

      // Surface any services errors that weren't already written
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

// ─── Data directory ───────────────────────────────────────────────────────────

const DATA_DIR = path.join(process.cwd(), "data");

// Allowed subdirectories the model may read from (service docs only).
const ALLOWED_PROVIDER_DIRS = ["aws", "azure", "gcp"] as const;

// ─── Pillar label normalisation ───────────────────────────────────────────────

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

/**
 * Convert any pillar slug (e.g. "integration_messaging", "Security & Identity")
 * to its canonical human-readable label. Falls back to the raw string unchanged.
 */
function normalisePillarLabel(raw: string): string {
  const key = raw
    .toLowerCase()
    .replace(/[&\s]+/g, "_")
    .replace(/-+/g, "_");
  return PILLAR_LABEL_MAP[key] ?? raw;
}

// ─── Followup system prompt ───────────────────────────────────────────────────

const FOLLOWUP_SYSTEM_TOOLS = `You are Archon, a senior cloud architect AI.

You have three tools:

1. **list_service_docs** — lists the .md documentation files available for a provider and optional pillar.
   Valid providers: aws, azure, gcp
   Valid pillars: ai_ml, analytics, compute, database, devops, integration_messaging, migration_hybrid, networking, other, security_identity, storage

2. **read_service_doc** — reads one documentation file. Use the exact slug returned by list_service_docs.
   Path format: \`{provider}/{pillar}/{slug}.md\`

3. **update_architecture** — updates the diagram and services panel with a modified service list.
   Only call this when the user explicitly wants a service change or architectural modification.
   Always pass the COMPLETE services list — every core and secondary service, including unchanged ones.

---

## ⚠️ NON-NEGOTIABLE RULE — NO EXCEPTIONS

**You MUST call list_service_docs and read_service_doc for any specific cloud service the user asks about, before writing a single word of your response — UNLESS that exact service is already listed under "Core Services" or "Additional Services" in the Current Architecture section below.**

This rule applies even if you believe you know the service well from training. Training knowledge may be outdated, incomplete, or wrong. The documentation files are the authoritative source and must be consulted every time.

Do NOT treat this as optional or as a Case B question just because the service sounds familiar. "Can we use X?", "What about X?", "Should we add X?" — if X is not already in the Current Architecture, you MUST read the doc first. Writing a response before reading the doc is a critical failure.

---

## WORKFLOW

### Case A — user mentions a specific service NOT listed in the Current Architecture below

Complete ALL steps in order. Never skip or reorder them.

STEP 1 · Call list_service_docs for the relevant provider and pillar.
STEP 2 · Call read_service_doc for the specific service file. Read the entire file.
STEP 3 · Write your text response (assessment, reasoning, recommendation).
STEP 4 · If the user wants the service added or swapped: call update_architecture.

**No text output until Steps 1 and 2 are complete. No exceptions.**

**When in doubt — use Case A and read the doc.**

### Case B — user asks a general question OR asks about a service ALREADY in the Current Architecture

STEP 1 · Write your text response.
STEP 2 · If the user wants a change: call update_architecture.

---

## update_architecture rules

When calling update_architecture:
- Pass the **COMPLETE** list of services (core + secondary). Never drop services that didn't change.
- For every **core** service you MUST include \`coreTag\`: a short (≤ 50 chars) plain-English phrase explaining why the app cannot function without this service. Everyday language only — no technical jargon. Good: "Runs all the app's backend API logic". Bad: "Stateless compute tier".
- For **secondary** services, \`coreTag\` must be null or omitted.
- \`pillarLabel\` must be human-readable: "Security & Identity" not "security_identity", "AI/ML" not "ai_ml", "Integration & Messaging" not "integration_messaging".

---

## Response style

- Be concise. 2–4 sentences is enough for most follow-up answers.
- Do not repeat the full service list — the UI panels update automatically.
- Never use nested bullet points.`;

// ─── Followup update schema ───────────────────────────────────────────────────

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

// ─── Followup diagram system prompt (mirrors Phase 5 but for updates) ────────

function buildFollowupDiagramSystem(diagramOutputDir: string): string {
  return `You are a cloud architect generating a clear, readable infrastructure diagram using the Python diagrams package.

STRICT WORKFLOW — follow in order:
1. Call get_diagram_examples with the relevant provider (e.g. "aws", "gcp", "azure") to learn the syntax.
2. Call list_icons with provider_filter set to the cloud provider to get the exact icon class names. You MUST do this — never guess icon names.
3. Call generate_diagram with the code you write.

ICON USAGE — provider-prefixed aliases (CRITICAL):
The runtime does NOT use wildcard imports. Every provider module is pre-imported as a prefixed alias.
You MUST always qualify every icon class with its alias — never use bare class names.
  Correct:   aws_compute.EC2(...)      gcp_storage.Storage(...)    onprem_client.Users(...)
  Wrong:     EC2(...)                  Storage(...)                 Users(...)

AVAILABLE ALIASES:
  diagrams.aws.*       → aws_compute, aws_storage, aws_database, aws_network, aws_analytics,
                         aws_integration, aws_ml, aws_iot, aws_security, aws_devtools,
                         aws_management, aws_migration, aws_mobile, aws_media, aws_general,
                         aws_cost, aws_ar, aws_game, aws_enablement, aws_engagement,
                         aws_quantum, aws_robotics, aws_satellite, aws_enduser,
                         aws_blockchain, aws_business
  diagrams.gcp.*       → gcp_compute, gcp_storage, gcp_database, gcp_network, gcp_analytics,
                         gcp_ml, gcp_devtools, gcp_operations, gcp_iot, gcp_api,
                         gcp_security, gcp_migration
  diagrams.azure.*     → azure_compute, azure_storage, azure_database, azure_network,
                         azure_web, azure_analytics, azure_integration, azure_devops,
                         azure_ml, azure_iot, azure_general, azure_mobile, azure_security,
                         azure_identity, azure_migration
  diagrams.k8s.*       → k8s_compute, k8s_storage, k8s_network, k8s_rbac, k8s_infra,
                         k8s_ecosystem, k8s_podconfig, k8s_controlplane, k8s_clusterconfig,
                         k8s_chaos, k8s_others, k8s_group
  diagrams.onprem.*    → onprem_compute, onprem_database, onprem_network, onprem_storage,
                         onprem_messaging, onprem_queue, onprem_monitoring, onprem_inmemory,
                         onprem_analytics, onprem_client, onprem_container, onprem_ci,
                         onprem_cd, onprem_vcs, onprem_iac, onprem_gitops, onprem_registry,
                         onprem_security, onprem_identity, onprem_dns, onprem_etl,
                         onprem_workflow, onprem_tracing, onprem_mlops, onprem_certificates,
                         onprem_auth, onprem_aggregator, onprem_logging, onprem_groupware,
                         onprem_proxmox, onprem_search
  diagrams.generic.*   → generic_compute, generic_storage, generic_database, generic_network,
                         generic_os, generic_device, generic_place, generic_virtualization,
                         generic_blank
  diagrams.saas.*      → saas_crm, saas_identity, saas_chat, saas_recommendation, saas_cdn,
                         saas_communication, saas_media, saas_logging, saas_security,
                         saas_social, saas_alerting, saas_analytics, saas_automation,
                         saas_filesharing

DIAGRAM DESIGN — clarity over completeness:
- SCOPE: Show only the most important services in the core request/data path. Do NOT include monitoring, logging, IAM/KMS, or CI/CD nodes unless the user explicitly asked for them.
- SIZE: Target 8–12 nodes. Hard maximum: 15 nodes. When in doubt, cut — fewer nodes makes a better diagram.
- LAYOUT: Always use direction="LR" (left-to-right). Do not use "TB".
- CLUSTERS: Group nodes into clusters that reflect their architectural role — not their AWS/GCP/Azure category. Use these names and strictly follow what belongs in each:
  • "Edge" — CDN, DNS, WAF, API Gateway, load balancers only.
  • "Compute" — application servers, containers, functions, autoscaling groups.
  • "Data" — databases (relational, NoSQL, cache, search).
  • "Storage" — object stores (S3, GCS, Blob).
  • "Messaging" — queues, topics, event buses, streams.
  • "Analytics" — data warehouses, stream processors, lake services.
  Only create a cluster when 2+ nodes belong to it. Do not nest more than 2 levels deep.
- CONNECTIONS: Use concentrate="true" and splines="spline". No edge labels.
- NODE LABELS: Every node label must have two lines separated by \\n. Keep each line under ~25 characters.
- USERS: Always represent end users with onprem_client.Users(...).

CODING RULES:
- Always set workspace_dir="${diagramOutputDir}"
- Never write import statements. Start the code directly with: with Diagram(
- Always set graph_attr={"splines": "spline", "concentrate": "true", "ranksep": "2.0", "nodesep": "0.8"} on the Diagram.
- Only use icon class names that appeared verbatim in the list_icons response, qualified with their alias.
- Do not name any variable "os" — it shadows the built-in used by the runtime.
- Do not use parentheses inside diagram title strings.`;
}

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
        ? `${FOLLOWUP_SYSTEM_TOOLS}\n\n${settingsContext}`
        : FOLLOWUP_SYSTEM_TOOLS;

      // ── Extract current architecture context from message history ──────────

      /** Walk backward to find the last complete services snapshot. */
      function extractCurrentServices(msgs: UIMessage[]) {
        for (let i = msgs.length - 1; i >= 0; i--) {
          const m = msgs[i];
          if (m.role !== "assistant") continue;
          const part = m.parts.findLast(
            (p) => p.type === "data-archon-services",
          );
          if (part && "data" in part) {
            const d = part.data as {
              state: string;
              coreServices?: ServiceCard[];
              secondaryServices?: ServiceCard[];
            };
            if (
              d.state === "complete" &&
              d.coreServices &&
              d.secondaryServices
            ) {
              return {
                coreServices: d.coreServices,
                secondaryServices: d.secondaryServices,
              };
            }
          }
        }
        return null;
      }

      /** Walk backward to find the last captured Python diagram code. */
      function extractDiagramCode(msgs: UIMessage[]): string | undefined {
        for (let i = msgs.length - 1; i >= 0; i--) {
          const m = msgs[i];
          if (m.role !== "assistant") continue;
          const part = m.parts.findLast(
            (p) => p.type === "data-archon-diagram",
          );
          if (part && "data" in part) {
            const d = part.data as { state: string; diagramCode?: string };
            if (d.state === "complete" && d.diagramCode) return d.diagramCode;
          }
        }
        return undefined;
      }

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

      const followupSystem = baseSystem + architectureContext + diagramContext;

      // Build full conversation history (same as before)
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

          // No pillar specified — list all pillars and their files
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

      // ── Tool: read_service_doc ─────────────────────────────────────────
      const readServiceDocTool = tool({
        description:
          "Read a cloud service documentation file from the knowledge base. " +
          "Use this to learn about a specific service before recommending it or comparing alternatives. " +
          "Path must be relative to the data/ directory, e.g. 'aws/compute/lambda.md'.",
        inputSchema: z.object({
          path: z
            .string()
            .describe(
              "Relative path within data/, e.g. 'aws/compute/lambda.md' or 'gcp/database/cloud-spanner.md'",
            ),
        }),
        execute: async ({ path: relPath }) => {
          // Security: only allow reading from provider service directories
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
      // This tool accepts the model's proposed updated services list and
      // triggers diagram re-generation + services panel update in parallel,
      // emitting data parts into the stream as they complete.
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
          // Emit generating state for both panels immediately
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

          // Helper to extract text from MCP tool output
          function extractTextFromOutput(output: unknown): string {
            if (!output || typeof output !== "object")
              return String(output ?? "");
            const o = output as Record<string, unknown>;
            if (Array.isArray(o.content)) {
              return (o.content as unknown[])
                .filter(
                  (item): item is { type: string; text: string } =>
                    typeof item === "object" &&
                    item !== null &&
                    (item as Record<string, unknown>).type === "text" &&
                    typeof (item as Record<string, unknown>).text === "string",
                )
                .map((item) => item.text)
                .join("\n");
            }
            if (o.type === "content" && Array.isArray(o.value)) {
              return (o.value as unknown[])
                .filter(
                  (item): item is { type: string; text: string } =>
                    typeof item === "object" &&
                    item !== null &&
                    (item as Record<string, unknown>).type === "text" &&
                    typeof (item as Record<string, unknown>).text === "string",
                )
                .map((item) => item.text)
                .join("\n");
            }
            if (o.type === "json") return JSON.stringify(o.value);
            return JSON.stringify(o);
          }

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

          // ── Step 2: Build rich diagram prompt from finalized service list ──
          const coreServicesList = coreCards
            .map(
              (s) =>
                `- ${s.serviceName} (${s.provider}, ${s.pillarLabel}): ${s.description}`,
            )
            .join("\n");
          const secondaryServicesList = secondaryCards
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

          // ── Step 3: Diagram re-generation via MCP (sequential) ────────────
          const mcpClient = await createDiagramMCPClient();
          try {
            const mcpTools = await mcpClient.tools();
            const diagramGenResult = await generateText({
              model: makeModel(),
              providerOptions: agentProviderOptions,
              tools: mcpTools,
              stopWhen: stepCountIs(7),
              system: buildFollowupDiagramSystem(diagramOutputDir),
              prompt: diagramPrompt,
              abortSignal,
            });

            let imagePath: string | undefined;
            let diagramCode: string | undefined;
            let lastGenerateError: string | undefined;
            for (const step of diagramGenResult.steps) {
              // Capture Python code from the tool call input
              for (const call of step.toolCalls ?? []) {
                if (
                  !("toolName" in call) ||
                  call.toolName !== "generate_diagram"
                )
                  continue;
                const inp = (call as { input?: unknown }).input as
                  | Record<string, unknown>
                  | undefined;
                if (inp && typeof inp.code === "string") diagramCode = inp.code;
              }
              for (const toolResult of step.toolResults ?? []) {
                if (
                  !("toolName" in toolResult) ||
                  toolResult.toolName !== "generate_diagram"
                )
                  continue;
                const text = extractTextFromOutput(toolResult.output);
                const match = text.match(/PNG diagram:\s*(.+\.png)/i);
                if (match) {
                  imagePath = match[1].trim();
                } else {
                  lastGenerateError =
                    text.replace(/^Error:\s*/i, "").trim() ||
                    "generate_diagram returned no output";
                }
              }
            }

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
