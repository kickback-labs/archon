import { auth } from "@/lib/auth";
import {
  type ArchonAgentUIMessage,
  classifyIntent,
  runArchonPipeline,
  runFollowup,
} from "@/lib/agents/archon-agent";
import {
  getChatById,
  getMessagesByChatId,
  getUserSettings,
  updateChatTitle,
  upsertMessages,
} from "@/lib/db/queries";
import { createUIMessageStreamResponse, generateId, type UIMessage } from "ai";
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
  const previousMessages = await getMessagesByChatId(id);
  const uiMessages = [...previousMessages, message] as ArchonAgentUIMessage[];

  // Extract the user's text for the router
  const userText = message.parts
    .filter((p) => p.type === "text")
    .map((p) => (p.type === "text" ? p.text : ""))
    .join("\n");

  // Load user settings (may be null if not configured yet)
  const userSettings = await getUserSettings(session.user.id);

  // Classify intent — single structured-output call, no tool loop
  const intent = await classifyIntent(userText, previousMessages);

  // Build the shared onFinish callback
  const onFinish = async ({ messages: finishedMessages }: { messages: UIMessage[] }) => {
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
  };

  const stream =
    intent === "pipeline"
      ? runArchonPipeline({
          uiMessages,
          originalMessages: uiMessages,
          generateMessageId: generateId,
          userSettings,
          onFinish,
        })
      : runFollowup({
          uiMessages,
          originalMessages: uiMessages,
          generateMessageId: generateId,
          userSettings,
          onFinish,
        });

  return createUIMessageStreamResponse({ stream });
}
