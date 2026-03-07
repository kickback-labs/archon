"use client";

import { cn } from "@/lib/utils";
import { createNewChat, deleteChatAction } from "@/app/actions/chat";
import { type Chat } from "@/lib/db/schema";
import {
  BotIcon,
  MessageSquarePlusIcon,
  TrashIcon,
  MoonIcon,
  MonitorIcon,
  SunIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useSession, signOut } from "@/lib/auth-client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useOptimistic, useTransition } from "react";

interface ChatSidebarProps {
  chats: Chat[];
}

export function ChatSidebar({ chats: initialChats }: ChatSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { setTheme } = useTheme();
  const { data: session } = useSession();
  const [isPending, startTransition] = useTransition();

  const [chats, removeChat] = useOptimistic(
    initialChats,
    (state: Chat[], deletedId: string) => state.filter((c) => c.id !== deletedId)
  );

  const handleDelete = (id: string) => {
    startTransition(async () => {
      removeChat(id);
      await deleteChatAction(id);
      if (pathname === `/chat/${id}`) {
        router.push("/");
      }
    });
  };

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-sidebar">
      {/* Logo / Brand */}
      <div className="flex items-center gap-2 px-4 py-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <BotIcon className="size-3.5" />
        </div>
        <span className="text-sm font-semibold">Archon</span>
        <p className="ml-0.5 text-xs text-muted-foreground hidden sm:block">Cloud AI</p>
      </div>

      <Separator />

      {/* New chat button */}
      <div className="px-3 py-2">
        <form action={createNewChat}>
          <button
            type="submit"
            className="flex w-full items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-accent disabled:opacity-50"
            disabled={isPending}
          >
            <MessageSquarePlusIcon className="size-4" />
            New Chat
          </button>
        </form>
      </div>

      {/* Chat history */}
      <ScrollArea className="flex-1 px-2">
        <div className="py-2 space-y-0.5">
          {chats.length === 0 ? (
            <p className="px-2 py-4 text-center text-xs text-muted-foreground">
              No conversations yet
            </p>
          ) : (
            chats.map((chat) => {
              const isActive = pathname === `/chat/${chat.id}`;
              return (
                <div
                  key={chat.id}
                  className={cn(
                    "group flex items-center gap-1 rounded-md px-2 py-1.5 text-sm hover:bg-accent",
                    isActive && "bg-accent text-accent-foreground"
                  )}
                >
                  <Link
                    href={`/chat/${chat.id}`}
                    className="flex-1 truncate text-xs leading-5"
                    title={chat.title}
                  >
                    {chat.title}
                  </Link>
                  <button
                    onClick={() => handleDelete(chat.id)}
                    className="shrink-0 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
                    aria-label="Delete chat"
                  >
                    <TrashIcon className="size-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>

      <Separator />

      {/* Footer: theme + user */}
      <div className="px-3 py-3 flex flex-col gap-0.5">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs hover:bg-accent text-left cursor-default select-none outline-none">
            <SunIcon className="size-3.5 shrink-0 dark:hidden" />
            <MoonIcon className="size-3.5 shrink-0 hidden dark:block" />
            Theme
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="top">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              <SunIcon data-icon="inline-start" />
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              <MoonIcon data-icon="inline-start" />
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              <MonitorIcon data-icon="inline-start" />
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {session?.user ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="flex w-full items-center rounded-md px-2 py-1.5 text-xs hover:bg-accent text-left cursor-default select-none outline-none">
              <span className="truncate">{session.user.name}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="top">
              <DropdownMenuItem
                onClick={async () => {
                  await signOut();
                  router.push("/login");
                }}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link
            href="/login"
            className="block px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            Login
          </Link>
        )}
      </div>
    </aside>
  );
}
