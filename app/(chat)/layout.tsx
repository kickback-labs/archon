import Image from "next/image";
import { auth } from "@/lib/auth";
import { getChatsByUser } from "@/lib/db/queries";
import { ChatSidebar } from "@/components/chat-sidebar";
import { headers } from "next/headers";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  const chats = session?.user ? await getChatsByUser(session.user.id) : [];

  return (
    <SidebarProvider className="h-screen min-h-0">
      <ChatSidebar chats={chats} user={session?.user ?? null} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-10 shrink-0 items-center gap-2 border-b px-3 md:hidden">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-10" />
          <div className="size-6 shrink-0 overflow-hidden rounded-full">
            <Image
              src="/archon-logo.png"
              alt="Archon"
              width={96}
              height={96}
              className="size-6 scale-[2.75] object-contain"
            />
          </div>
          <span className="font-serif text-sm font-medium tracking-tight">
            Archon
          </span>
        </header>
        <main className="flex flex-1 flex-col overflow-hidden">{children}</main>
      </div>
    </SidebarProvider>
  );
}
