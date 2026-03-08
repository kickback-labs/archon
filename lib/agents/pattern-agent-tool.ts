import { readUIMessageStream, tool } from "ai";
import { z } from "zod";
import { patternAgent, type PatternAgentUIMessage } from "./pattern-agent";

/**
 * A tool that wraps the Pattern Agent as a streaming subagent.
 *
 * The execute function is an async generator so the Pattern Agent's
 * progress (read_file tool calls, intermediate reasoning) streams back
 * to the parent agent's UI message in real time.
 *
 * toModelOutput extracts only the final text (the JSON result) so the
 * parent Archon Agent receives a concise summary rather than the full
 * token-heavy execution trace.
 */
export const patternAgentTool = tool({
  description:
    "Run the Pattern Agent to select architectural patterns for the user's system. " +
    "This agent reads the pattern catalogue, selects matching patterns, enriches them " +
    "by reading pattern detail files, and returns a structured JSON result containing: " +
    "selected patterns with justifications and implied architectural pillars.",
  inputSchema: z.object({
    system_description: z
      .string()
      .describe(
        "A concise description of the system to architect, derived from the user's message. " +
          "Include workload type, scale hints, team context, and any constraints mentioned.",
      ),
  }),
  execute: async function* ({ system_description }, { abortSignal }) {
    const result = await patternAgent.stream({
      prompt: system_description,
      abortSignal,
    });

    // Stream each accumulated UIMessage back to the parent agent's tool part.
    // Each yield replaces the previous output in the UI (readUIMessageStream
    // builds an ever-growing UIMessage from the stream chunks).
    for await (const message of readUIMessageStream({
      stream: result.toUIMessageStream(),
    })) {
      yield message as PatternAgentUIMessage;
    }
  },
  // What the parent model sees: just the final text (the JSON result).
  // The full execution trace (all tool calls) is shown in the UI but
  // does NOT bloat the parent agent's context window.
  toModelOutput: ({ output: message }) => {
    const lastTextPart = (message as PatternAgentUIMessage)?.parts.findLast(
      (p) => p.type === "text",
    );
    return {
      type: "text" as const,
      value: lastTextPart?.text ?? "Pattern analysis complete.",
    };
  },
});
