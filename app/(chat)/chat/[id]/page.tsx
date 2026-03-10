import { auth } from "@/lib/auth";
import { getChatById, getMessagesByChatId } from "@/lib/db/queries";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { ChatPageClient } from "./page-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ChatPage({ params }: PageProps) {
  const { id } = await params;

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/login");

  const chat = await getChatById(id);
  if (!chat) notFound();

  // Only the owner can view the chat (unless it's public)
  if (chat.userId !== session.user.id && chat.visibility !== "public") {
    notFound();
  }

  const initialMessages = await getMessagesByChatId(id);

  return <ChatPageClient id={id} initialMessages={initialMessages} />;
}
