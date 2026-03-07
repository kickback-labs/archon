import { auth } from "@/lib/auth";
import { getChatsByUser } from "@/lib/db/queries";
import { ChatSidebar } from "@/components/chat-sidebar";
import { headers } from "next/headers";

export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  const chats = session?.user ? await getChatsByUser(session.user.id) : [];

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <ChatSidebar chats={chats} />
      <main className="flex flex-1 flex-col overflow-hidden">
        {children}
      </main>
    </div>
  );
}
