"use client";

import { cn } from "@/lib/utils";
import { createNewChat, deleteChatAction } from "@/app/actions/chat";
import { type Chat } from "@/lib/db/schema";
import Image from "next/image";
import {
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
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
  SidebarGroup,
  SidebarGroupContent,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { useOptimistic, useTransition, useEffect } from "react";

interface ChatSidebarProps {
  chats: Chat[];
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  } | null;
}

const OPTIMISTIC_NEW_CHAT_ID = "__new__";

export function ChatSidebar({ chats: initialChats, user }: ChatSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { setTheme } = useTheme();
  const [isPending, startTransition] = useTransition();
  const { isMobile, setOpenMobile } = useSidebar();

  // Close mobile sidebar on navigation
  useEffect(() => {
    if (isMobile) {
      setOpenMobile(false);
    }
  }, [pathname, isMobile, setOpenMobile]);

  type OptimisticAction =
    | { type: "delete"; id: string }
    | { type: "add"; chat: Chat };

  const [chats, dispatchOptimistic] = useOptimistic(
    initialChats,
    (state: Chat[], action: OptimisticAction) => {
      if (action.type === "delete") {
        return state.filter((c) => c.id !== action.id);
      }
      if (state.some((c) => c.id === action.chat.id)) return state;
      return [action.chat, ...state];
    },
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
    <Sidebar>
      <SidebarHeader className="px-4 py-4">
        <div className="flex items-center gap-2.5">
          <div className="size-8 shrink-0 overflow-hidden rounded-full">
            <Image
              src="/archon-logo.png"
              alt="Archon"
              width={96}
              height={96}
              className="size-8 scale-[2.75] object-contain"
            />
          </div>
          <span className="font-serif text-base font-medium tracking-tight">
            Archon
          </span>
        </div>
      </SidebarHeader>

      <SidebarSeparator className={"-ml-1"} />

      {/* New chat — outside SidebarContent so it stays pinned above the scroll */}
      <SidebarGroup className="py-1 mt-1">
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                variant="outline"
                onClick={handleNewChat}
                disabled={isPending}
              >
                <MessageSquarePlusIcon />
                <span>New Chat</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {chats.length === 0 ? (
                <p className="px-2 py-4 text-center text-sm text-muted-foreground">
                  No conversations yet
                </p>
              ) : (
                chats.map((chat) => {
                  const isActive = pathname === `/chat/${chat.id}`;
                  const isOptimistic = chat.id === OPTIMISTIC_NEW_CHAT_ID;
                  return (
                    <SidebarMenuItem key={chat.id}>
                      <SidebarMenuButton
                        render={<Link href={`/chat/${chat.id}`} />}
                        isActive={isActive}
                        className={cn(
                          "text-[13px]",
                          isOptimistic && "opacity-60",
                        )}
                        title={chat.title}
                      >
                        <span className="truncate">{chat.title}</span>
                      </SidebarMenuButton>
                      {!isOptimistic && (
                        <SidebarMenuAction
                          showOnHover
                          onClick={() => handleDelete(chat.id)}
                          aria-label="Delete chat"
                          className="hover:text-destructive"
                        >
                          <TrashIcon />
                        </SidebarMenuAction>
                      )}
                    </SidebarMenuItem>
                  );
                })
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter className="px-3 py-3 gap-1">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-left cursor-default select-none outline-none">
            <SunIcon className="size-4 shrink-0 dark:hidden" />
            <MoonIcon className="size-4 shrink-0 hidden dark:block" />
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
            "flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-left select-none",
            pathname === "/settings" &&
              "bg-sidebar-accent text-sidebar-accent-foreground",
          )}
        >
          <SettingsIcon className="size-4 shrink-0" />
          Settings
        </Link>

        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-left cursor-default select-none outline-none">
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
            className="block px-2 py-2 text-sm text-muted-foreground hover:text-foreground"
          >
            Login
          </Link>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
