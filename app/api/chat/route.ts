import { auth } from "@/lib/auth";
import {
  archonAgent,
  type ArchonAgentUIMessage,
} from "@/lib/agents/archon-agent";
import {
  getChatById,
  getMessagesByChatId,
  updateChatTitle,
  upsertMessages,
  upsertDecisionLog,
  type DecisionLogEntry,
} from "@/lib/db/queries";
import type { WaveOutput } from "@/lib/agents/wave-tools";
import { createAgentUIStreamResponse, generateId, type UIMessage } from "ai";
import { headers } from "next/headers";

export const maxDuration = 300;

export async function POST(req: Request) {
  // Auth check
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { message, id }: { message: UIMessage; id: string } = await req.json();

  // Ensure chat exists (the client already created it via the server action)
  const existingChat = await getChatById(id);
  if (!existingChat) {
    return new Response("Chat not found", { status: 404 });
  }

  // Load previous messages from DB, then append the new user message.
  // Cast to ArchonAgentUIMessage[] — messages stored in DB are structurally
  // compatible; the narrow tool types are only needed by TypeScript's inference.
  const previousMessages = await getMessagesByChatId(id);
  const uiMessages = [...previousMessages, message] as ArchonAgentUIMessage[];

  return createAgentUIStreamResponse({
    agent: archonAgent,
    uiMessages,
    generateMessageId: generateId,
    originalMessages: uiMessages,
    onFinish: async ({ messages: finishedMessages }) => {
      // Auto-title the chat from the first user message
      if (existingChat.title === "New Chat" && finishedMessages.length >= 2) {
        const firstUserMessage = finishedMessages.find(
          (m) => m.role === "user",
        );
        if (firstUserMessage) {
          const textPart = firstUserMessage.parts.find(
            (p) => p.type === "text",
          );
          if (textPart && textPart.type === "text") {
            const title = textPart.text.slice(0, 60);
            await updateChatTitle(id, title);
          }
        }
      }

      // Extract decisions_resolved from all wave tool outputs and persist them
      const decisionEntries: DecisionLogEntry[] = [];

      for (const msg of finishedMessages as ArchonAgentUIMessage[]) {
        for (const part of msg.parts) {
          if (
            part.type !== "tool-run_wave1_specialists" &&
            part.type !== "tool-run_wave2_specialists"
          ) {
            continue;
          }
          if (part.state !== "output-available") continue;

          const waveOutput = part.output as WaveOutput;
          if (!waveOutput) continue;

          for (const [pillar, specialistMsg] of Object.entries(waveOutput)) {
            if (!specialistMsg) continue;

            // The specialist's final message is the raw JSON text part
            const lastTextPart = specialistMsg.parts.findLast(
              (p) => p.type === "text",
            );
            if (!lastTextPart || lastTextPart.type !== "text") continue;

            let pillarRec: {
              decisions_resolved?: Array<{
                decision: string;
                chosen: string;
                rejected_alternatives: string[];
                rationale: string;
              }>;
            };

            try {
              pillarRec = JSON.parse(lastTextPart.text);
            } catch {
              continue;
            }

            for (const d of pillarRec.decisions_resolved ?? []) {
              decisionEntries.push({
                pillar,
                decision: d.decision,
                chosen: d.chosen,
                rejected_alternatives: d.rejected_alternatives ?? [],
                rationale: d.rationale,
              });
            }
          }
        }
      }

      // Persist messages and decision log entries in parallel
      await Promise.all([
        upsertMessages({ chatId: id, messages: finishedMessages }),
        upsertDecisionLog({ chatId: id, entries: decisionEntries }),
      ]);
    },
  });
}
