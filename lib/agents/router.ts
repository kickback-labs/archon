import { generateText, Output } from "ai";
import { z } from "zod";
import { makeModel, agentProviderOptions } from "./model";
import type { UIMessage } from "ai";
import fs from "fs";
import path from "path";

const routerSchema = z.object({
  intent: z.enum(["pipeline", "followup"]),
});

const ROUTER_PROMPT_TEMPLATE = fs.readFileSync(
  path.join(process.cwd(), "data", "prompts", "router.md"),
  "utf-8",
);

/**
 * Classify the user's latest message as either:
 * - "pipeline" — a new system design / architecture request that requires the
 *   full 5-phase pipeline (Requirements → Pattern → Wave 1 → Wave 2 → Synthesis)
 * - "followup" — a general cloud question, follow-up on a previous response,
 *   cost/comparison question, or clarification that should be answered directly
 */
export async function classifyIntent(
  userMessage: string,
  conversationHistory: UIMessage[],
  abortSignal?: AbortSignal,
): Promise<"pipeline" | "followup"> {
  const hasPriorArchitecture = conversationHistory.some(
    (m) => m.role === "assistant",
  );

  const contextNote = hasPriorArchitecture
    ? "There is prior architecture output in this conversation."
    : "This is the first message in the conversation.";

  const { output } = await generateText({
    model: makeModel(),
    providerOptions: agentProviderOptions,
    output: Output.object({ schema: routerSchema }),
    system: ROUTER_PROMPT_TEMPLATE.replace("{{CONTEXT_NOTE}}", contextNote),
    prompt: userMessage,
    abortSignal,
  });

  return output.intent;
}
