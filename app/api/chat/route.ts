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
} from "@/lib/db/queries";
import { createAgentUIStreamResponse, generateId, type UIMessage } from "ai";
import { headers } from "next/headers";

export const maxDuration = 120;

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

      await upsertMessages({
        chatId: id,
        messages: finishedMessages,
      });
    },
  });
}
