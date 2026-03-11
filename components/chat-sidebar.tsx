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
  SettingsIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { signOut } from "@/lib/auth-client";
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
  user: { id: string; name: string; email: string; image?: string | null } | null;
}

const OPTIMISTIC_NEW_CHAT_ID = "__new__";

export function ChatSidebar({ chats: initialChats, user }: ChatSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { setTheme } = useTheme();
  const [isPending, startTransition] = useTransition();

  type OptimisticAction =
    | { type: "delete"; id: string }
    | { type: "add"; chat: Chat };

  const [chats, dispatchOptimistic] = useOptimistic(
    initialChats,
    (state: Chat[], action: OptimisticAction) => {
      if (action.type === "delete") {
        return state.filter((c) => c.id !== action.id);
      }
      // Prepend the new chat, avoiding duplicates if the server re-render
      // already included it.
      if (state.some((c) => c.id === action.chat.id)) return state;
      return [action.chat, ...state];
    }
  );

  const handleNewChat = () => {
    startTransition(async () => {
      const now = new Date();
      dispatchOptimistic({
        type: "add",
        chat: {
          id: OPTIMISTIC_NEW_CHAT_ID,
          userId: user?.id ?? "",
          title: "New Chat",
          createdAt: now,
          updatedAt: now,
          visibility: "private",
        },
      });
      const { id } = await createNewChat();
      router.push(`/chat/${id}`);
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      dispatchOptimistic({ type: "delete", id });
      await deleteChatAction(id);
      if (pathname === `/chat/${id}`) {
        router.push("/");
      } else {
        router.refresh();
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
        <button
          type="button"
          onClick={handleNewChat}
          className="flex w-full items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-accent disabled:opacity-50"
          disabled={isPending}
        >
          <MessageSquarePlusIcon className="size-4" />
          New Chat
        </button>
      </div>

      {/* Chat history */}
      <ScrollArea className="min-h-0 flex-1 px-2">
        <div className="py-2 space-y-0.5">
          {chats.length === 0 ? (
            <p className="px-2 py-4 text-center text-xs text-muted-foreground">
              No conversations yet
            </p>
          ) : (
            chats.map((chat) => {
              const isActive = pathname === `/chat/${chat.id}`;
              const isOptimistic = chat.id === OPTIMISTIC_NEW_CHAT_ID;
              return (
                <div
                  key={chat.id}
                  className={cn(
                    "group flex items-center gap-1 rounded-md px-2 py-1.5 text-sm hover:bg-accent",
                    isActive && "bg-accent text-accent-foreground",
                    isOptimistic && "opacity-60"
                  )}
                >
                  <Link
                    href={`/chat/${chat.id}`}
                    className="flex-1 truncate text-xs leading-5"
                    title={chat.title}
                  >
                    {chat.title}
                  </Link>
                  {!isOptimistic && (
                    <button
                      onClick={() => handleDelete(chat.id)}
                      className="shrink-0 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
                      aria-label="Delete chat"
                    >
                      <TrashIcon className="size-3.5" />
                    </button>
                  )}
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

        <Link
          href="/settings"
          className={cn(
            "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs hover:bg-accent text-left select-none",
            pathname === "/settings" && "bg-accent text-accent-foreground"
          )}
        >
          <SettingsIcon className="size-3.5 shrink-0" />
          Settings
        </Link>

        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="flex w-full items-center rounded-md px-2 py-1.5 text-xs hover:bg-accent text-left cursor-default select-none outline-none">
              <span className="truncate">{user.name}</span>
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
