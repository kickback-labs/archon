import { BotIcon } from "lucide-react";
import { createNewChat } from "@/app/actions/chat";

export default function ChatHomePage() {
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
      <form action={createNewChat}>
        <button
          type="submit"
          className="rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Start a new chat
        </button>
      </form>
    </div>
  );
}
