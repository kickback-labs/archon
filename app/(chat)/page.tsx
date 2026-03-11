"use client";

import { BotIcon } from "lucide-react";
import { createNewChat } from "@/app/actions/chat";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function ChatHomePage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleNewChat = () => {
    startTransition(async () => {
      const { id } = await createNewChat();
      router.push(`/chat/${id}`);
    });
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center px-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <BotIcon className="size-8" />
      </div>
      <div>
        <h1 className="text-2xl font-semibold">Archon</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your expert cloud architect AI assistant
        </p>
      </div>
      <button
        type="button"
        onClick={handleNewChat}
        disabled={isPending}
        className="rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
      >
        Start a new chat
      </button>
    </div>
  );
}
