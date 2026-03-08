import { readUIMessageStream, tool } from "ai";
import { z } from "zod";
import {
  requirementsAgent,
  type RequirementsAgentUIMessage,
} from "./requirements-agent";

/**
 * A tool that wraps the Requirements Agent as a streaming subagent.
 *
 * Takes the user's raw system description, runs the Requirements Agent to
 * extract a structured Requirements Schema, and streams the agent's progress
 * back to the parent's UI. The parent receives only the final JSON text.
 */
export const requirementsAgentTool = tool({
  description:
    "Run the Requirements Agent to extract a structured Requirements Schema from the " +
    "user's system description. This is always the first step — it captures workload type, " +
    "scale, team context, budget, compliance constraints, provider preferences, and quality " +
    "attributes. Returns a JSON Requirements Schema that all downstream agents depend on.",
  inputSchema: z.object({
    user_message: z
      .string()
      .describe(
        "The user's raw system description, copied verbatim from their message.",
      ),
  }),
  execute: async function* ({ user_message }, { abortSignal }) {
    const result = await requirementsAgent.stream({
      prompt: user_message,
      abortSignal,
    });

    for await (const message of readUIMessageStream({
      stream: result.toUIMessageStream(),
    })) {
      yield message as RequirementsAgentUIMessage;
    }
  },
  toModelOutput: ({ output: message }) => {
    const lastTextPart = (message as RequirementsAgentUIMessage)?.parts.findLast(
      (p) => p.type === "text",
    );
    return {
      type: "text" as const,
      value: lastTextPart?.text ?? "{}",
    };
  },
});
