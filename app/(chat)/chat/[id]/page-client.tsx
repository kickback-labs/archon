"use client";

import { useState, useCallback } from "react";
import { Chat } from "@/components/chat";
import { ChatLayout } from "@/components/chat-layout";
import type { DiagramState } from "@/components/diagram-panel";
import type { ServicesPanelState } from "@/components/services-panel";
import type { UIMessage } from "ai";
import type { ArchitectureService } from "@/lib/db/schema";

interface ChatPageClientProps {
  id: string;
  initialMessages: UIMessage[];
  initialServices: ArchitectureService[];
}

type DiagramData = {
  state: "generating" | "complete" | "error";
  imagePath?: string;
  error?: string;
};

type ServicesData = {
  state: "generating" | "complete" | "error";
  coreServices?: Array<{
    tier: "core" | "secondary";
    provider: "AWS" | "Azure" | "GCP";
    serviceName: string;
    pillarLabel: string;
    coreTag?: string;
    description: string;
    sortOrder: number;
  }>;
  secondaryServices?: Array<{
    tier: "core" | "secondary";
    provider: "AWS" | "Azure" | "GCP";
    serviceName: string;
    pillarLabel: string;
    coreTag?: string;
    description: string;
    sortOrder: number;
  }>;
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

/** Derive the services state from already-loaded messages. */
function getServicesFromMessages(messages: UIMessage[]): ServicesPanelState | null {
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];
    if (msg.role !== "assistant") continue;
    const part = msg.parts.findLast((p) => p.type === "data-archon-services");
    if (part && "data" in part) {
      const d = part.data as ServicesData;
      if (
        d.state === "complete" &&
        d.coreServices !== undefined &&
        d.secondaryServices !== undefined
      ) {
        return {
          state: "complete",
          coreServices: d.coreServices,
          secondaryServices: d.secondaryServices,
        };
      }
      if (d.state === "generating") return { state: "generating" };
      if (d.state === "error") return { state: "error", error: d.error ?? "Unknown error" };
    }
  }
  return null;
}

/** Hydrate services from the DB rows when not present in message parts. */
function getServicesFromDB(
  dbServices: ArchitectureService[],
): ServicesPanelState | null {
  if (dbServices.length === 0) return null;

  const coreServices = dbServices
    .filter((s) => s.tier === "core")
    .map((s) => ({
      tier: s.tier as "core",
      provider: s.provider as "AWS" | "Azure" | "GCP",
      serviceName: s.serviceName,
      pillarLabel: s.pillarLabel,
      coreTag: s.coreTag ?? undefined,
      description: s.description,
      sortOrder: s.sortOrder,
    }));

  const secondaryServices = dbServices
    .filter((s) => s.tier === "secondary")
    .map((s) => ({
      tier: s.tier as "secondary",
      provider: s.provider as "AWS" | "Azure" | "GCP",
      serviceName: s.serviceName,
      pillarLabel: s.pillarLabel,
      description: s.description,
      sortOrder: s.sortOrder,
    }));

  return { state: "complete", coreServices, secondaryServices };
}

export function ChatPageClient({
  id,
  initialMessages,
  initialServices,
}: ChatPageClientProps) {
  // Initialise from already-loaded messages so the panel renders immediately
  // without triggering the entrance animation when switching between chats.
  const [diagram, setDiagram] = useState<DiagramState | null>(() =>
    getDiagramFromMessages(initialMessages),
  );

  const [services, setServices] = useState<ServicesPanelState | null>(() => {
    // Prefer messages (in case page-client is used without DB hydration)
    const fromMessages = getServicesFromMessages(initialMessages);
    if (fromMessages) return fromMessages;
    return getServicesFromDB(initialServices);
  });

  const handleDiagramChange = useCallback((next: DiagramState | null) => {
    setDiagram(next);
  }, []);

  const handleServicesChange = useCallback(
    (next: ServicesPanelState | null) => {
      setServices(next);
    },
    [],
  );

  return (
    <ChatLayout diagram={diagram} services={services}>
      <Chat
        id={id}
        initialMessages={initialMessages}
        onDiagramChange={handleDiagramChange}
        onServicesChange={handleServicesChange}
      />
    </ChatLayout>
  );
}
