/**
 * Archon Deterministic Orchestrator
 *
 * Replaces the Archon ToolLoopAgent with a hardcoded 5-step pipeline:
 *   1. Requirements Agent
 *   2. Pattern Agent
 *   3. Wave 1 Specialists (parallel)
 *   4. Wave 2 Specialists (parallel — direct handoff, no Archon LLM call)
 *   5. Synthesis (streamText, no ToolLoopAgent overhead)
 *
 * P0 eliminations vs the old ToolLoopAgent:
 *   - 4 sequential Archon LLM round-trips (each ~8-30s) → gone
 *   - 3-min delay before Wave 2 caused by Archon processing full Wave 1 JSON → gone
 *
 * The chunks emitted here are structurally identical to what the ToolLoopAgent
 * would have written, so:
 *   - chat.tsx renderers work unchanged
 *   - route.ts onFinish persistence logic works unchanged
 *   - ArchonAgentUIMessage type (inferred from the stub agent) covers all parts
 */

import {
  readUIMessageStream,
  streamText,
  generateId,
  type UIMessage,
  type UIMessageChunk,
  type UIMessageStreamWriter,
} from "ai";
import { requirementsAgent } from "./requirements-agent";
import { patternAgent } from "./pattern-agent";
import {
  wave1Specialists,
  wave2Specialists,
  type SpecialistAgentUIMessage,
} from "./specialist-agent";
import { makeModel, agentProviderOptions } from "./model";
import type { CategorySlug } from "@/lib/tools/retrieve-tool";
import type { WaveOutput } from "./wave-tools";
import type { RequirementsAgentUIMessage } from "./requirements-agent";
import type { PatternAgentUIMessage } from "./pattern-agent";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Collect the final UIMessage from a UI message chunk stream. */
async function collectFinalMessage<T extends UIMessage>(
  stream: ReadableStream<UIMessageChunk>,
): Promise<T> {
  let last: T | undefined;
  for await (const msg of readUIMessageStream({ stream })) {
    last = msg as T;
  }
  if (!last) throw new Error("Agent produced no output");
  return last;
}

/** Extract the last text part from a UIMessage. */
function lastText(msg: UIMessage): string {
  const part = msg.parts.findLast((p) => p.type === "text");
  return part?.type === "text" ? part.text : "{}";
}

/** Extract the last text part from a specialist UIMessage. */
function extractSpecialistJson(msg: SpecialistAgentUIMessage): string {
  return lastText(msg as UIMessage);
}

// ─── Synthesis system prompt ───────────────────────────────────────────────────

const SYNTHESIS_SYSTEM = `You are Archon, a senior cloud architect AI. You have just completed a full architectural analysis pipeline. Write a clear, well-structured architectural response that synthesises all specialist outputs.

Include:
- A brief executive summary of the architecture
- Key architectural decisions and why they were made
- The full service list organised by pillar
- Any important caveats or trade-offs the user should know about

Be direct and technically precise. Use markdown with headers and lists for clarity. Acknowledge trade-offs honestly. Do not repeat information already shown in the tool progress panels.`;

// ─── Orchestrator execute function ────────────────────────────────────────────

/**
 * The execute function for the Archon deterministic orchestrator.
 *
 * Called by the route's createUIMessageStream with a writer. Runs all 5 steps
 * of the Archon pipeline and writes chunks directly — no intermediate wrapping.
 */
export async function executeArchonOrchestrator(
  userMessage: string,
  writer: UIMessageStreamWriter,
  abortSignal?: AbortSignal,
): Promise<void> {
  // ── Step 1: Requirements Agent ────────────────────────────────────────────
  const reqCallId = generateId();

  writer.write({
    type: "tool-input-start",
    toolCallId: reqCallId,
    toolName: "run_requirements_agent",
  });
  writer.write({
    type: "tool-input-available",
    toolCallId: reqCallId,
    toolName: "run_requirements_agent",
    input: { user_message: userMessage },
  });

  const reqResult = await requirementsAgent.stream({
    prompt: userMessage,
    abortSignal,
  });
  const reqMessage = await collectFinalMessage<RequirementsAgentUIMessage>(
    reqResult.toUIMessageStream() as ReadableStream<UIMessageChunk>,
  );
  const requirementsJson = lastText(reqMessage);

  writer.write({
    type: "tool-output-available",
    toolCallId: reqCallId,
    output: reqMessage,
  });

  // ── Step 2: Pattern Agent ──────────────────────────────────────────────────
  const patCallId = generateId();

  writer.write({
    type: "tool-input-start",
    toolCallId: patCallId,
    toolName: "run_pattern_agent",
  });
  writer.write({
    type: "tool-input-available",
    toolCallId: patCallId,
    toolName: "run_pattern_agent",
    input: { system_description: userMessage },
  });

  const patResult = await patternAgent.stream({
    prompt: userMessage,
    abortSignal,
  });
  const patMessage = await collectFinalMessage<PatternAgentUIMessage>(
    patResult.toUIMessageStream() as ReadableStream<UIMessageChunk>,
  );
  const patternJson = lastText(patMessage);

  writer.write({
    type: "tool-output-available",
    toolCallId: patCallId,
    output: patMessage,
  });

  // Parse implied_pillars from pattern output
  let impliedPillars: CategorySlug[] = [];
  try {
    const parsed = JSON.parse(patternJson) as {
      implied_pillars?: CategorySlug[];
    };
    impliedPillars = parsed.implied_pillars ?? [];
  } catch {
    // If parsing fails, leave impliedPillars empty — Wave 1 will run nothing
  }

  // Filter to Wave 1 slugs only
  const wave1PillarsToRun = impliedPillars.filter(
    (p) => p in wave1Specialists,
  ) as (keyof typeof wave1Specialists)[];

  // ── Step 3: Wave 1 Specialists ─────────────────────────────────────────────
  const w1CallId = generateId();

  const buildWave1Prompt = (pillar: string) =>
    `## Requirements Schema\n${requirementsJson}\n\n## Pattern Output\n${patternJson}\n\n## Your Pillar\nYou are the ${pillar} specialist. Analyse the above and produce your pillar recommendation.`;

  writer.write({
    type: "tool-input-start",
    toolCallId: w1CallId,
    toolName: "run_wave1_specialists",
  });
  writer.write({
    type: "tool-input-available",
    toolCallId: w1CallId,
    toolName: "run_wave1_specialists",
    input: {
      implied_pillars: wave1PillarsToRun,
      requirements_schema: requirementsJson,
      pattern_output: patternJson,
    },
  });

  // Launch all Wave 1 specialists in parallel.
  // Emit a preliminary output each time any specialist finishes so the UI
  // shows progress in real time rather than waiting for the slowest one.
  const wave1Output: WaveOutput = {};

  await Promise.allSettled(
    wave1PillarsToRun.map(async (pillar) => {
      const result = await wave1Specialists[pillar].stream({
        prompt: buildWave1Prompt(pillar),
        abortSignal,
      });
      let last: SpecialistAgentUIMessage | undefined;
      for await (const msg of readUIMessageStream({
        stream: result.toUIMessageStream(),
      })) {
        last = msg as SpecialistAgentUIMessage;
      }
      if (!last) throw new Error(`Wave 1 ${pillar} produced no output`);
      // Update shared state and immediately emit a preliminary output
      wave1Output[pillar as CategorySlug] = last;
      writer.write({
        type: "tool-output-available",
        toolCallId: w1CallId,
        output: { ...wave1Output },
        preliminary: true,
      });
    }),
  );

  // Final Wave 1 output (not preliminary)
  writer.write({
    type: "tool-output-available",
    toolCallId: w1CallId,
    output: { ...wave1Output },
  });

  // Build Wave 1 summary for Wave 2
  const wave1Summary: Record<string, string> = {};
  for (const [pillar, msg] of Object.entries(wave1Output)) {
    if (msg) {
      wave1Summary[pillar] = extractSpecialistJson(
        msg as SpecialistAgentUIMessage,
      );
    }
  }
  const wave1RecommendationsJson = JSON.stringify(wave1Summary, null, 2);

  // ── Step 4: Wave 2 Specialists ─────────────────────────────────────────────
  const w2CallId = generateId();

  const buildWave2Prompt = (pillar: string) =>
    `## Requirements Schema\n${requirementsJson}\n\n## Pattern Output\n${patternJson}\n\n## Wave 1 Recommendations\n${wave1RecommendationsJson}\n\n## Your Pillar\nYou are the ${pillar} specialist. Read the Wave 1 recommendations carefully — your decisions must be grounded in the specific services already chosen. Produce your pillar recommendation.`;

  writer.write({
    type: "tool-input-start",
    toolCallId: w2CallId,
    toolName: "run_wave2_specialists",
  });
  writer.write({
    type: "tool-input-available",
    toolCallId: w2CallId,
    toolName: "run_wave2_specialists",
    input: {
      wave1_recommendations: wave1RecommendationsJson,
      requirements_schema: requirementsJson,
      pattern_output: patternJson,
    },
  });

  const wave2Output: WaveOutput = {};

  await Promise.allSettled(
    (Object.keys(wave2Specialists) as (keyof typeof wave2Specialists)[]).map(
      async (pillar) => {
        const result = await wave2Specialists[pillar].stream({
          prompt: buildWave2Prompt(pillar),
          abortSignal,
        });
        let last: SpecialistAgentUIMessage | undefined;
        for await (const msg of readUIMessageStream({
          stream: result.toUIMessageStream(),
        })) {
          last = msg as SpecialistAgentUIMessage;
        }
        if (!last) throw new Error(`Wave 2 ${pillar} produced no output`);
        wave2Output[pillar as CategorySlug] = last;
        writer.write({
          type: "tool-output-available",
          toolCallId: w2CallId,
          output: { ...wave2Output },
          preliminary: true,
        });
      },
    ),
  );

  writer.write({
    type: "tool-output-available",
    toolCallId: w2CallId,
    output: { ...wave2Output },
  });

  // ── Step 5: Synthesis ──────────────────────────────────────────────────────
  const wave2Summary: Record<string, string> = {};
  for (const [pillar, msg] of Object.entries(wave2Output)) {
    if (msg) {
      wave2Summary[pillar] = extractSpecialistJson(
        msg as SpecialistAgentUIMessage,
      );
    }
  }

  const synthesisPrompt = [
    `## User Request\n${userMessage}`,
    `## Requirements Schema\n${requirementsJson}`,
    `## Architectural Patterns\n${patternJson}`,
    `## Wave 1 Specialist Recommendations\n${wave1RecommendationsJson}`,
    `## Wave 2 Specialist Recommendations\n${JSON.stringify(wave2Summary, null, 2)}`,
    `Now write the final architectural response.`,
  ].join("\n\n");

  const textId = generateId();
  writer.write({ type: "text-start", id: textId });

  const synthesis = streamText({
    model: makeModel(),
    providerOptions: agentProviderOptions,
    system: SYNTHESIS_SYSTEM,
    prompt: synthesisPrompt,
    abortSignal,
  });

  for await (const chunk of synthesis.textStream) {
    writer.write({ type: "text-delta", id: textId, delta: chunk });
  }

  writer.write({ type: "text-end", id: textId });
}
