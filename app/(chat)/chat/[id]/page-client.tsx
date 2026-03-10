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

export function ChatPageClient({ id, initialMessages }: ChatPageClientProps) {
  const [diagram, setDiagram] = useState<DiagramState | null>(null);

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
