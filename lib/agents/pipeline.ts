import {
  readUIMessageStream,
  streamText,
  createUIMessageStream,
  generateId,
  type UIMessage,
} from "ai";
import { makeModel, agentProviderOptions } from "./model";
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

// ─── Data part schemas ────────────────────────────────────────────────────────

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
    // Count how many tool calls have a completed output in this snapshot.
    const completedCount = lastMessage.parts.filter(
      (p) =>
        (p.type.startsWith("tool-") && "state" in p && p.state === "output-available"),
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

[2–3 sentence executive summary. State the core pattern and why it fits the stated requirements.]

## Key Decisions

[3–6 bullet points. Each bullet = one decision + one-line rationale. No sub-bullets.]

## Services by Pillar

[One ### sub-heading per relevant pillar. Under each, a tight bullet list of chosen services with a brief note. Omit pillars with no meaningful services.]

## Trade-offs & Caveats

[2–4 bullet points covering honest trade-offs, risks, or constraints the user should know.]

**Formatting rules:**
- Use ## and ### headers — never use plain bold as a heading substitute
- Keep each section tight: no padding, no restating what the tool panels already showed
- Do not list every service exhaustively — highlight the important choices only
- Never use nested (sub-)bullet points — all bullets must be top-level
- Always use human-readable pillar names: Compute, Storage, Database, Analytics, AI/ML, Integration & Messaging, Migration & Hybrid, Other Services, Networking, DevOps, Security & Identity — never raw slugs like \`ai_ml\` or \`security_identity\``;

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
  onFinish,
}: {
  uiMessages: UIMessage[];
  originalMessages?: UIMessage[];
  abortSignal?: AbortSignal;
  generateMessageId?: () => string;
  onFinish?: (params: { messages: UIMessage[] }) => Promise<void> | void;
}) {
  return createUIMessageStream<ArchonUIMessage>({
    originalMessages: (originalMessages ?? uiMessages) as ArchonUIMessage[],
    generateId: generateMessageId,
    onFinish: onFinish as Parameters<
      typeof createUIMessageStream<ArchonUIMessage>
    >[0]["onFinish"],
    execute: async ({ writer }) => {
      const userPrompt = extractUserPrompt(uiMessages);

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
        prompt: userPrompt,
        abortSignal,
      });

      // Forward each incremental snapshot so the UI sees live tool progress.
      const reqMessage = await streamAgentWithMilestones<RequirementsAgentUIMessage>(
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
        "Now write the final architectural response. Where the Well-Architected Validation Report identifies strengths or concerns, incorporate the most important ones into your Trade-offs & Caveats section.",
      ].join("\n");

      const synthesisResult = streamText({
        model: makeModel(),
        providerOptions: agentProviderOptions,
        system: SYNTHESIS_SYSTEM,
        prompt: synthesisPrompt,
        abortSignal,
      });

      writer.merge(
        synthesisResult.toUIMessageStream() as ReadableStream<
          Parameters<typeof writer.write>[0]
        >,
      );
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
  onFinish,
}: {
  uiMessages: UIMessage[];
  originalMessages?: UIMessage[];
  abortSignal?: AbortSignal;
  generateMessageId?: () => string;
  onFinish?: (params: { messages: UIMessage[] }) => Promise<void> | void;
}) {
  return createUIMessageStream<ArchonUIMessage>({
    originalMessages: (originalMessages ?? uiMessages) as ArchonUIMessage[],
    generateId: generateMessageId,
    onFinish: onFinish as Parameters<
      typeof createUIMessageStream<ArchonUIMessage>
    >[0]["onFinish"],
    execute: ({ writer }) => {
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
        system: FOLLOWUP_SYSTEM,
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
