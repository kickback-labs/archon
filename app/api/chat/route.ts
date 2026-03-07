import { auth } from "@/lib/auth";
import {
  getChatById,
  getMessagesByChatId,
  updateChatTitle,
  upsertMessages,
} from "@/lib/db/queries";
import { convertToModelMessages, generateId, streamText, type UIMessage } from "ai";
import { headers } from "next/headers";

export const maxDuration = 60;

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

  // Load previous messages from DB, then append the new user message
  const previousMessages = await getMessagesByChatId(id);
  const messages = [...previousMessages, message];

  const result = streamText({
    model: "openai/gpt-4.1-mini",
    system:
      "You are Archon, an expert cloud architect AI assistant. You help users design, plan, and optimize cloud infrastructure and architecture. You provide clear, practical guidance on cloud platforms (AWS, GCP, Azure), infrastructure patterns, cost optimization, security, and best practices.",
    messages: await convertToModelMessages(messages),
  });

  // Consume the stream so it runs to completion even if the client disconnects
  result.consumeStream();

  return result.toUIMessageStreamResponse({
    generateMessageId: generateId,
    originalMessages: messages,
    onFinish: async ({ messages: finishedMessages }) => {
      // Auto-title the chat from the first user message
      if (existingChat.title === "New Chat" && finishedMessages.length >= 2) {
        const firstUserMessage = finishedMessages.find((m) => m.role === "user");
        if (firstUserMessage) {
          const textPart = firstUserMessage.parts.find((p) => p.type === "text");
          if (textPart && textPart.type === "text") {
            const title = textPart.text.slice(0, 60);
            await updateChatTitle(id, title);
          }
        }
      }

      await upsertMessages({ chatId: id, messages: finishedMessages });
    },
  });
}
