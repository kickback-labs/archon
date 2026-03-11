import {
  readUIMessageStream,
  streamText,
  generateText,
  Output,
  createUIMessageStream,
  generateId,
  stepCountIs,
  type UIMessage,
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

const FOLLOWUP_SYSTEM = `You are Archon, a senior cloud architect AI. Answer the user's question directly and concisely. You may reference the prior architectural recommendation in the conversation. Do not run any multi-phase analysis — just answer the question.`;

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

      const reqResult = await requirementsAgent.stream({
        prompt: enrichedPrompt,
        abortSignal,
      });

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
              stopWhen: stepCountIs(5),
              system: `You are a cloud architect generating a clear, readable infrastructure diagram using the Python diagrams package.

STRICT WORKFLOW — follow in order:
1. Call get_diagram_examples with the relevant provider (e.g. "aws", "gcp", "azure") to learn the syntax.
2. Call list_icons with provider_filter set to the cloud provider to get the exact icon class names. You MUST do this — never guess icon names.
3. Call generate_diagram with the code you write.

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
- CONNECTIONS: Connect layers to layers, not individual nodes to everything. The canonical flow is: Users → Edge cluster → Network cluster → Application/Compute cluster → Data/Storage cluster. Draw one representative arrow per layer-to-layer handoff (e.g. the load balancer node represents the whole Edge→Network handoff). Never fan out edges from a single node to nodes in multiple unrelated layers. No edge labels — never use Edge(label=...). Use Edge(style="dashed") only for async/background flows between layers. If two nodes are in the same cluster (same layer), do NOT draw an edge between them unless there is an explicit intra-layer flow (e.g. primary→replica replication).
- NODE LABELS: Every node label must have two lines: line 1 is the service name, line 2 is a short description of its role. Keep each line under ~25 characters. Use \\n to separate them. Example: "Cloud Run\\nHandle API requests".
- USERS: Represent end users with Users (diagrams.onprem.client.Users).

CODING RULES:
- Always set workspace_dir="${diagramOutputDir}"
- Never write import statements. Start the code directly with: with Diagram(
- Always set graph_attr={"splines": "polyline", "ranksep": "2.0", "nodesep": "0.8"} on the Diagram for clean arrow routing.
- Only use icon class names that appeared verbatim in the list_icons response. If unsure, omit the node.
- PROVIDER CONSISTENCY: For single-provider architectures (e.g. AWS-only), every icon MUST come from that provider's namespace (diagrams.aws.*). Do NOT accidentally include icons from other providers — if a service has no icon in the target provider, omit the node. For explicitly multi-cloud architectures, you may mix provider namespaces intentionally; in that case call list_icons once per provider used and group each provider's nodes inside a clearly labelled cluster (e.g. "AWS Region", "Azure Services"). The only always-permitted cross-provider node is Users (diagrams.onprem.client.Users).
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

            // Find the diagram path from the generate_diagram tool result
            let imagePath: string | undefined;
            let lastGenerateError: string | undefined;
            for (const step of diagramGenResult.steps) {
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
                data: { state: "complete", imagePath },
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

/**
 * Run a direct follow-up answer without the pipeline.
 */
export function runFollowup({
  uiMessages,
  originalMessages,
  abortSignal,
  generateMessageId = generateId,
  userSettings,
  onFinish,
}: {
  uiMessages: UIMessage[];
  originalMessages?: UIMessage[];
  abortSignal?: AbortSignal;
  generateMessageId?: () => string;
  userSettings?: UserSettings | null;
  onFinish?: (params: { messages: UIMessage[] }) => Promise<void> | void;
}) {
  return createUIMessageStream<ArchonUIMessage>({
    originalMessages: (originalMessages ?? uiMessages) as ArchonUIMessage[],
    generateId: generateMessageId,
    onFinish: onFinish as Parameters<
      typeof createUIMessageStream<ArchonUIMessage>
    >[0]["onFinish"],
    execute: ({ writer }) => {
      const settingsContext = formatSettingsContext(userSettings);
      const followupSystem = settingsContext
        ? `${FOLLOWUP_SYSTEM}\n\n${settingsContext}`
        : FOLLOWUP_SYSTEM;

      const historyMessages = uiMessages
        .map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.parts
            .filter((p) => p.type === "text")
            .map((p) => (p.type === "text" ? p.text : ""))
            .join("\n"),
        }))
        .filter((m) => m.content.trim().length > 0);

      const result = streamText({
        model: makeModel(),
        providerOptions: agentProviderOptions,
        system: followupSystem,
        messages: historyMessages,
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
