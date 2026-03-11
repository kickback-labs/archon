"use client";

import { useState, useCallback } from "react";
import { Chat } from "@/components/chat";
import { ChatLayout } from "@/components/chat-layout";
import type { DiagramState } from "@/components/diagram-panel";
import type { UIMessage } from "ai";

interface ChatPageClientProps {
  id: string;
  initialMessages: UIMessage[];
}

type DiagramData = {
  state: "generating" | "complete" | "error";
  imagePath?: string;
  error?: string;
};

/** Derive the diagram state from already-loaded messages (no animation needed). */
function getDiagramFromMessages(messages: UIMessage[]): DiagramState | null {
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];
    if (msg.role !== "assistant") continue;
    const part = msg.parts.findLast((p) => p.type === "data-archon-diagram");
    if (part && "data" in part) {
      const d = part.data as DiagramData;
      if (d.state === "complete" && d.imagePath) {
        return { state: "complete", imagePath: d.imagePath };
      }
      if (d.state === "generating") return { state: "generating" };
      if (d.state === "error") return { state: "error", error: d.error ?? "Unknown error" };
    }
  }
  return null;
}

export function ChatPageClient({ id, initialMessages }: ChatPageClientProps) {
  // Initialise from already-loaded messages so the panel renders immediately
  // without triggering the entrance animation when switching between chats.
  const [diagram, setDiagram] = useState<DiagramState | null>(() =>
    getDiagramFromMessages(initialMessages)
  );

  const handleDiagramChange = useCallback((next: DiagramState | null) => {
    setDiagram(next);
  }, []);

  return (
    <ChatLayout diagram={diagram}>
      <Chat
        id={id}
        initialMessages={initialMessages}
        onDiagramChange={handleDiagramChange}
      />
    </ChatLayout>
  );
}
