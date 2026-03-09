import { generateObject } from "ai";
import { z } from "zod";
import { makeModel, agentProviderOptions } from "./model";
import type { UIMessage } from "ai";

const routerSchema = z.object({
  intent: z.enum(["pipeline", "followup"]),
});

/**
 * Classify the user's latest message as either:
 * - "pipeline" — a new system design / architecture request that requires the
 *   full 5-phase pipeline (Requirements → Pattern → Wave 1 → Wave 2 → Synthesis)
 * - "followup" — a general cloud question, follow-up on a previous response,
 *   cost/comparison question, or clarification that should be answered directly
 *
 * This replaces the routing logic that was previously baked into the Archon
 * orchestrator LLM. Using generateObject (single structured-output call, no
 * tool loop) keeps this decision fast and cheap.
 */
export async function classifyIntent(
  userMessage: string,
  conversationHistory: UIMessage[],
  abortSignal?: AbortSignal,
): Promise<"pipeline" | "followup"> {
  // Build a minimal conversation summary so the classifier understands context.
  // We only need to know whether there is prior architecture work in the thread.
  const hasPriorArchitecture = conversationHistory.some(
    (m) => m.role === "assistant",
  );

  const contextNote = hasPriorArchitecture
    ? "There is prior architecture output in this conversation."
    : "This is the first message in the conversation.";

  const { object } = await generateObject({
    model: makeModel(),
    providerOptions: agentProviderOptions,
    schema: routerSchema,
    system: `You are a request classifier for an AI cloud architect system.

Classify the user's message as exactly one of:
- "pipeline": the user is describing a new system they want to build and needs a full architectural recommendation. This includes: new system descriptions, "design me an X", "architect a Y", "I want to build Z", or substantially modified/new requirements.
- "followup": the user is asking a general cloud question, requesting a cost estimate, asking for a comparison between services, asking a follow-up about a previous recommendation in this conversation, asking for clarification, or making small adjustments to an existing design without requesting a full redesign.

${contextNote}

Respond with the JSON object only.`,
    prompt: userMessage,
    abortSignal,
  });

  return object.intent;
}
