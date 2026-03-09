import { readUIMessageStream, tool } from "ai";
import { z } from "zod";
import {
  wave1Specialists,
  wave2Specialists,
  WAVE1_PILLARS,
  type SpecialistAgentUIMessage,
} from "./specialist-agent";
import type { CategorySlug } from "@/lib/tools/retrieve-tool";

// ─── Shared types ─────────────────────────────────────────────────────────────

/**
 * The combined output of a wave tool: a record from pillar slug to the
 * specialist's final UIMessage. The UI reads individual specialist states
 * from this record to drive progress rendering.
 */
export type WaveOutput = Partial<Record<CategorySlug, SpecialistAgentUIMessage>>;

// ─── Helper: run one specialist and collect its final UIMessage ───────────────

async function runSpecialist(
  agent: (typeof wave1Specialists)[keyof typeof wave1Specialists] | (typeof wave2Specialists)[keyof typeof wave2Specialists],
  prompt: string,
  abortSignal: AbortSignal | undefined,
): Promise<SpecialistAgentUIMessage> {
  const result = await agent.stream({ prompt, abortSignal });

  let lastMessage: SpecialistAgentUIMessage | undefined;
  for await (const message of readUIMessageStream({
    stream: result.toUIMessageStream(),
  })) {
    lastMessage = message as SpecialistAgentUIMessage;
  }

  if (!lastMessage) {
    throw new Error("Specialist agent produced no output");
  }
  return lastMessage;
}

/** Extract the last text part from a specialist UIMessage (the JSON result). */
function extractSpecialistJson(message: SpecialistAgentUIMessage): string {
  const lastText = message.parts.findLast((p) => p.type === "text");
  return lastText?.type === "text" ? lastText.text : "{}";
}

/**
 * Run specialist promises and yield incremental WaveOutput as each one resolves.
 * This uses a "race and remove" pattern so the UI sees each pillar appear as
 * soon as its specialist finishes, rather than waiting for all to complete.
 */
async function* runSpecialistsIncrementally(
  specialistEntries: Array<{ pillar: CategorySlug; promise: Promise<SpecialistAgentUIMessage> }>,
): AsyncGenerator<WaveOutput> {
  const waveOutput: WaveOutput = {};

  // Wrap each promise so it carries its pillar slug and can signal completion
  // via a shared callback. We use a queue + notify pattern.
  const completed: Array<{ pillar: CategorySlug; msg: SpecialistAgentUIMessage }> = [];
  let notify: (() => void) | null = null;
  let remaining = specialistEntries.length;

  const wrappedPromises = specialistEntries.map(({ pillar, promise }) =>
    promise
      .then((msg) => {
        completed.push({ pillar, msg });
        notify?.();
      })
      .catch(() => {
        // Count failures so we still drain the queue
        remaining--;
        notify?.();
      }),
  );

  // Drain completions as they come in
  while (remaining > 0) {
    // Flush any already-completed results
    while (completed.length > 0) {
      const result = completed.shift()!;
      waveOutput[result.pillar] = result.msg;
      remaining--;
      yield { ...waveOutput };
    }

    if (remaining <= 0) break;

    // Wait for the next specialist to finish
    await new Promise<void>((resolve) => {
      notify = resolve;
    });
    notify = null;
  }

  // Await all to surface any uncaught errors
  await Promise.allSettled(wrappedPromises);
}

// ─── Wave 1 tool ─────────────────────────────────────────────────────────────

const wave1InputSchema = z.object({
  implied_pillars: z
    .array(z.enum(WAVE1_PILLARS as [CategorySlug, ...CategorySlug[]]))
    .min(1)
    .describe(
      "The Wave 1 pillars to run. MUST be taken directly from the Pattern Agent's " +
        "implied_pillars output — do NOT add pillars that were not in that list, and do NOT " +
        "include Wave 2 pillars (networking, devops, security_identity). Valid Wave 1 values: " +
        "compute, storage, database, analytics, ai_ml, integration_messaging, migration_hybrid, other.",
    ),
  requirements_schema: z
    .string()
    .min(10)
    .describe(
      "The complete Requirements Schema JSON string produced by the Requirements Agent. " +
        "Must be the actual JSON — NEVER a placeholder like '{...}' or '<schema here>'. " +
        "Copy the full JSON output from run_requirements_agent verbatim.",
    ),
  pattern_output: z
    .string()
    .min(10)
    .describe(
      "The complete Pattern Agent JSON output string (patterns + implied_pillars). " +
        "Must be the actual JSON — NEVER a placeholder like '{...}' or '<pattern here>'. " +
        "Copy the full JSON output from run_pattern_agent verbatim.",
    ),
});

export const wave1SpecialistsTool = tool({
  description:
    "Run all applicable Wave 1 specialist agents in parallel. " +
    "Wave 1 specialists are independent and cover: compute, storage, database, analytics, " +
    "ai_ml, integration_messaging, migration_hybrid, other. " +
    "Only runs the pillars present in implied_pillars — do NOT add extra pillars. " +
    "Each specialist calls retrieve() internally and produces a Pillar Recommendation. " +
    "IMPORTANT: requirements_schema and pattern_output must be the actual JSON strings " +
    "from the previous steps — never placeholders or summaries.",
  inputSchema: wave1InputSchema,
  execute: async function* (
    { implied_pillars, requirements_schema, pattern_output },
    { abortSignal },
  ) {
    // Determine which Wave 1 specialists to run
    const pillarsToRun = implied_pillars.filter(
      (p) => p in wave1Specialists,
    ) as (keyof typeof wave1Specialists)[];

    // Build per-specialist prompts — inject the full context so each specialist
    // has everything it needs to formulate a precise retrieval query and recommendation.
    const buildPrompt = (pillar: string) =>
      [
        "## Requirements Schema",
        requirements_schema,
        "",
        "## Pattern Output",
        pattern_output,
        "",
        `## Your Pillar: ${pillar}`,
        `You are the ${pillar} specialist. Using the Requirements Schema and Pattern Output above, ` +
          `follow your mandatory process: (1) formulate a precise retrieval query, ` +
          `(2) call retrieve() exactly once, (3) reason over the returned documents, ` +
          `(4) output your pillar recommendation as raw JSON.`,
      ].join("\n");

    // Launch all specialists in parallel immediately
    const specialistEntries = pillarsToRun.map((pillar) => ({
      pillar: pillar as CategorySlug,
      promise: runSpecialist(wave1Specialists[pillar], buildPrompt(pillar), abortSignal),
    }));

    // Yield incremental WaveOutput as each specialist finishes
    for await (const snapshot of runSpecialistsIncrementally(specialistEntries)) {
      yield snapshot;
    }
  },
  toModelOutput: ({ output }) => {
    // Build a concise JSON summary of all specialist results for the parent agent
    const waveOutput = output as WaveOutput;
    const summary: Record<string, string> = {};
    for (const [pillar, msg] of Object.entries(waveOutput)) {
      if (msg) {
        summary[pillar] = extractSpecialistJson(msg as SpecialistAgentUIMessage);
      }
    }
    return {
      type: "text" as const,
      value: JSON.stringify(summary, null, 2),
    };
  },
});

// ─── Wave 2 tool ─────────────────────────────────────────────────────────────

const wave2InputSchema = z.object({
  wave1_recommendations: z
    .string()
    .min(10)
    .describe(
      "The complete JSON string of all Wave 1 pillar recommendations, keyed by pillar slug. " +
        "Must be the actual JSON returned by run_wave1_specialists — NEVER a placeholder " +
        "like '{...}' or '<wave1 results here>'. Copy the full JSON verbatim.",
    ),
  requirements_schema: z
    .string()
    .min(10)
    .describe(
      "The complete Requirements Schema JSON string produced by the Requirements Agent. " +
        "Must be the actual JSON — NEVER a placeholder. Same string passed to Wave 1.",
    ),
  pattern_output: z
    .string()
    .min(10)
    .describe(
      "The complete Pattern Agent JSON output string (patterns + implied_pillars). " +
        "Must be the actual JSON — NEVER a placeholder. Same string passed to Wave 1.",
    ),
});

export const wave2SpecialistsTool = tool({
  description:
    "Run all three Wave 2 specialist agents in parallel: networking, devops, security_identity. " +
    "Wave 2 specialists are reactive — their recommendations are grounded in what Wave 1 chose. " +
    "security_identity always runs regardless of implied_pillars. " +
    "Each specialist reads the Wave 1 recommendations, calls retrieve() internally, " +
    "and produces a Pillar Recommendation. " +
    "IMPORTANT: all three string inputs must be actual JSON from previous steps — never placeholders.",
  inputSchema: wave2InputSchema,
  execute: async function* (
    { wave1_recommendations, requirements_schema, pattern_output },
    { abortSignal },
  ) {
    const buildPrompt = (pillar: string) =>
      [
        "## Requirements Schema",
        requirements_schema,
        "",
        "## Pattern Output",
        pattern_output,
        "",
        "## Wave 1 Recommendations",
        wave1_recommendations,
        "",
        `## Your Pillar: ${pillar}`,
        `You are the ${pillar} specialist. Read the Wave 1 Recommendations above carefully — ` +
          `your retrieval query and every decision you make must be grounded in the specific ` +
          `services Wave 1 already selected. Follow your mandatory process: ` +
          `(1) formulate a precise retrieval query based on Wave 1 choices, ` +
          `(2) call retrieve() exactly once, (3) reason over the returned documents in the ` +
          `context of the full Wave 1 picture, (4) output your pillar recommendation as raw JSON.`,
      ].join("\n");

    // All three Wave 2 specialists always run in parallel
    const specialistEntries = (
      Object.keys(wave2Specialists) as (keyof typeof wave2Specialists)[]
    ).map((pillar) => ({
      pillar: pillar as CategorySlug,
      promise: runSpecialist(wave2Specialists[pillar], buildPrompt(pillar), abortSignal),
    }));

    // Yield incremental WaveOutput as each specialist finishes
    for await (const snapshot of runSpecialistsIncrementally(specialistEntries)) {
      yield snapshot;
    }
  },
  toModelOutput: ({ output }) => {
    const waveOutput = output as WaveOutput;
    const summary: Record<string, string> = {};
    for (const [pillar, msg] of Object.entries(waveOutput)) {
      if (msg) {
        summary[pillar] = extractSpecialistJson(msg as SpecialistAgentUIMessage);
      }
    }
    return {
      type: "text" as const,
      value: JSON.stringify(summary, null, 2),
    };
  },
});
