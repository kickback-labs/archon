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
    .describe(
      "The Wave 1 pillars to run, derived from the Pattern Agent's implied_pillars output. " +
        "Only include pillars that appear in both this list and the Wave 1 pillar set.",
    ),
  requirements_schema: z
    .string()
    .describe("The Requirements Schema JSON produced by the Requirements Agent."),
  pattern_output: z
    .string()
    .describe("The Pattern Agent's JSON output (patterns + implied_pillars)."),
});

export const wave1SpecialistsTool = tool({
  description:
    "Run all applicable Wave 1 specialist agents in parallel. Wave 1 specialists are independent — " +
    "compute, storage, database, analytics, ai_ml, integration_messaging, migration_hybrid, other. " +
    "Each specialist retrieves relevant service documents and produces a Pillar Recommendation. " +
    "Runs only the pillars that appear in implied_pillars. Returns all recommendations as a combined record.",
  inputSchema: wave1InputSchema,
  execute: async function* (
    { implied_pillars, requirements_schema, pattern_output },
    { abortSignal },
  ) {
    // Determine which Wave 1 specialists to run
    const pillarsToRun = implied_pillars.filter(
      (p) => p in wave1Specialists,
    ) as (keyof typeof wave1Specialists)[];

    // Build per-specialist prompts
    const buildPrompt = (pillar: string) =>
      `## Requirements Schema\n${requirements_schema}\n\n## Pattern Output\n${pattern_output}\n\n## Your Pillar\nYou are the ${pillar} specialist. Analyse the above and produce your pillar recommendation.`;

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
    .describe(
      "JSON string containing all Wave 1 pillar recommendations, keyed by pillar slug. " +
        "Wave 2 specialists read this to ground their decisions in the specific services already chosen.",
    ),
  requirements_schema: z
    .string()
    .describe("The Requirements Schema JSON produced by the Requirements Agent."),
  pattern_output: z
    .string()
    .describe("The Pattern Agent's JSON output (patterns + implied_pillars)."),
});

export const wave2SpecialistsTool = tool({
  description:
    "Run all three Wave 2 specialist agents in parallel: networking, devops, security_identity. " +
    "Wave 2 specialists are reactive — their recommendations depend on what Wave 1 chose. " +
    "security_identity always runs regardless of implied_pillars. " +
    "Each specialist reads the Wave 1 recommendations, retrieves relevant service documents, " +
    "and produces a Pillar Recommendation. Returns all three recommendations as a combined record.",
  inputSchema: wave2InputSchema,
  execute: async function* (
    { wave1_recommendations, requirements_schema, pattern_output },
    { abortSignal },
  ) {
    const buildPrompt = (pillar: string) =>
      `## Requirements Schema\n${requirements_schema}\n\n## Pattern Output\n${pattern_output}\n\n## Wave 1 Recommendations\n${wave1_recommendations}\n\n## Your Pillar\nYou are the ${pillar} specialist. Read the Wave 1 recommendations carefully — your decisions must be grounded in the specific services already chosen. Produce your pillar recommendation.`;

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
