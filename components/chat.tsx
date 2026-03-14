"use client";

import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
  MessageActions,
  MessageAction,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputBody,
  PromptInputButton,
  PromptInputFooter,
  PromptInputProvider,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  type PromptInputMessage,
  usePromptInputAttachments,
  useProviderAttachments,
} from "@/components/ai-elements/prompt-input";
import {
  Attachment,
  AttachmentInfo,
  AttachmentPreview,
  AttachmentRemove,
  Attachments,
} from "@/components/ai-elements/attachments";
import {
  ChainOfThought,
  ChainOfThoughtContent,
  ChainOfThoughtHeader,
  ChainOfThoughtStep,
} from "@/components/ai-elements/chain-of-thought";
import {
  Task,
  TaskContent,
  TaskTrigger,
  TaskItem,
} from "@/components/ai-elements/task";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import type { ArchonAgentUIMessage } from "@/lib/agents/archon-agent";
import type { ArchonDataTypes } from "@/lib/agents/pipeline";
import type { DiagramState } from "@/components/diagram-panel";
import type { ServicesPanelState } from "@/components/services-panel";
import type { PatternAgentUIMessage } from "@/lib/agents/pattern-agent";
import type { ValidatorAgentUIMessage } from "@/lib/agents/validator-agent";
import type { WaveOutput } from "@/lib/agents/wave-tools";
import type { CategorySlug } from "@/lib/tools/retrieve-tool";
import {
  BotIcon,
  BrainCircuitIcon,
  CheckCircleIcon,
  CopyIcon,
  DatabaseIcon,
  FileTextIcon,
  GitBranchIcon,
  LayersIcon,
  LoaderCircleIcon,
  MessageSquareIcon,
  MonitorIcon,
  NetworkIcon,
  PaperclipIcon,
  RefreshCcwIcon,
  SearchIcon,
  ServerIcon,
  ShieldIcon,
  SparklesIcon,
  TruckIcon,
  type LucideIcon,
} from "lucide-react";
import { useState, Fragment, useRef, useMemo, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";

// ─── Pillar metadata ──────────────────────────────────────────────────────────

const PILLAR_META: Record<CategorySlug, { label: string; icon: LucideIcon }> = {
  compute: { label: "Compute", icon: ServerIcon },
  storage: { label: "Storage", icon: MonitorIcon },
  database: { label: "Database", icon: DatabaseIcon },
  analytics: { label: "Analytics", icon: BrainCircuitIcon },
  ai_ml: { label: "AI / ML", icon: SparklesIcon },
  integration_messaging: {
    label: "Integration & Messaging",
    icon: MessageSquareIcon,
  },
  migration_hybrid: { label: "Migration & Hybrid", icon: TruckIcon },
  other: { label: "Other Services", icon: LayersIcon },
  networking: { label: "Networking", icon: NetworkIcon },
  devops: { label: "DevOps", icon: GitBranchIcon },
  security_identity: { label: "Security & Identity", icon: ShieldIcon },
};

// ─── Data part type helpers ───────────────────────────────────────────────────

type RequirementsData = ArchonDataTypes["archon-requirements"];
type PatternsData = ArchonDataTypes["archon-patterns"];
type Wave1Data = ArchonDataTypes["archon-wave1"];
type Wave2Data = ArchonDataTypes["archon-wave2"];
type ValidatorData = ArchonDataTypes["archon-validator"];
type DiagramData = ArchonDataTypes["archon-diagram"];
type ServicesData = ArchonDataTypes["archon-services"];

/** Find the last data part of a given archon type in a message's parts array. */
function findLastDataPart<T>(
  parts: UIMessage["parts"],
  type: `data-archon-${string}`,
): T | undefined {
  const last = parts.findLast((p) => p.type === type);
  return last && "data" in last ? (last.data as T) : undefined;
}

// ─── Attachment display ───────────────────────────────────────────────────────

const AttachmentsDisplay = () => {
  const attachments = useProviderAttachments();
  if (attachments.files.length === 0) return null;

  return (
    <Attachments variant="inline">
      {attachments.files.map((attachment) => (
        <Attachment
          data={attachment}
          key={attachment.id}
          onRemove={() => attachments.remove(attachment.id)}
        >
          <AttachmentPreview />
          <AttachmentInfo />
          <AttachmentRemove />
        </Attachment>
      ))}
    </Attachments>
  );
};

// ─── Requirements phase renderer ─────────────────────────────────────────────

function RequirementsPart({ data }: { data: RequirementsData }) {
  const isStreaming = data.state === "streaming";
  const isComplete = data.state === "complete";

  const hasSchema = data.output?.parts.some((p) => p.type === "text") ?? false;

  return (
    <ChainOfThought
      defaultOpen={isStreaming}
      open={isStreaming ? true : undefined}
      isStreaming={isStreaming}
    >
      <ChainOfThoughtHeader>
        {isComplete ? "Requirements extracted" : "Extracting requirements…"}
      </ChainOfThoughtHeader>
      <ChainOfThoughtContent>
        {isComplete && hasSchema ? (
          <ChainOfThoughtStep
            icon={CheckCircleIcon}
            label="Requirements schema ready"
            status="complete"
          />
        ) : (
          <ChainOfThoughtStep
            icon={FileTextIcon}
            label="Analysing system description…"
            status={isStreaming ? "active" : "pending"}
          />
        )}
      </ChainOfThoughtContent>
    </ChainOfThought>
  );
}

// ─── Pattern phase renderer ───────────────────────────────────────────────────

function PatternAgentProgress({
  nestedMessage,
  isStreaming,
}: {
  nestedMessage: PatternAgentUIMessage;
  isStreaming: boolean;
}) {
  const parts = nestedMessage.parts ?? [];

  const readFilesPart = parts.find((p) => p.type === "tool-read_files") as
    | Extract<
        PatternAgentUIMessage["parts"][number],
        { type: "tool-read_files" }
      >
    | undefined;

  const paths = (readFilesPart?.input as { paths?: string[] })?.paths ?? [];

  function patternNameFromPath(rawPath: string): string {
    return rawPath
      .replace("data/patterns/", "")
      .replace(".md", "")
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  return (
    <ChainOfThoughtContent>
      {paths.map((rawPath, i) => (
        <ChainOfThoughtStep
          key={`read-${i}`}
          icon={FileTextIcon}
          label={patternNameFromPath(rawPath)}
          status="complete"
        />
      ))}
      {isStreaming ? (
        <ChainOfThoughtStep
          icon={FileTextIcon}
          label="Reading architectural patterns…"
          status="active"
        />
      ) : (
        <ChainOfThoughtStep
          icon={CheckCircleIcon}
          label="Patterns selected"
          status="complete"
        />
      )}
    </ChainOfThoughtContent>
  );
}

function PatternsPart({ data }: { data: PatternsData }) {
  const isStreaming = data.state === "streaming";
  const isComplete = data.state === "complete";

  return (
    <ChainOfThought
      defaultOpen={isStreaming}
      open={isStreaming ? true : undefined}
      isStreaming={isStreaming}
    >
      <ChainOfThoughtHeader>
        {isComplete
          ? "Architectural patterns selected"
          : "Selecting architectural patterns…"}
      </ChainOfThoughtHeader>
      {data.output ? (
        <PatternAgentProgress
          nestedMessage={data.output as PatternAgentUIMessage}
          isStreaming={isStreaming}
        />
      ) : (
        <ChainOfThoughtContent>
          <ChainOfThoughtStep
            icon={FileTextIcon}
            label="Reading architectural patterns…"
            status={isStreaming ? "active" : "complete"}
          />
        </ChainOfThoughtContent>
      )}
    </ChainOfThought>
  );
}

// ─── Wave progress renderer ───────────────────────────────────────────────────

function WaveProgress({
  pillars,
  waveOutput,
  isStreaming,
}: {
  pillars: CategorySlug[];
  waveOutput: WaveOutput;
  isStreaming: boolean;
}) {
  const donePillars = pillars.filter((p) => p in waveOutput);

  return (
    <ChainOfThoughtContent>
      {donePillars.map((pillar) => {
        const meta = PILLAR_META[pillar];
        return (
          <ChainOfThoughtStep
            key={pillar}
            icon={meta.icon}
            label={meta.label}
            status="complete"
          />
        );
      })}
      {isStreaming && (
        <ChainOfThoughtStep
          icon={ServerIcon}
          label="Running specialist agents…"
          status="active"
        />
      )}
    </ChainOfThoughtContent>
  );
}

// ─── Wave 1 renderer ──────────────────────────────────────────────────────────

const WAVE1_PILLARS: CategorySlug[] = [
  "compute",
  "storage",
  "database",
  "analytics",
  "ai_ml",
  "integration_messaging",
  "migration_hybrid",
  "other",
];

function Wave1Part({ data }: { data: Wave1Data }) {
  const isComplete = data.complete === true;
  const isStreaming = !isComplete;

  // Extract just the WaveOutput keys (exclude the `complete` flag)
  const waveOutput: WaveOutput = Object.fromEntries(
    Object.entries(data).filter(([k]) => k !== "complete"),
  ) as WaveOutput;

  const pillarsToShow: CategorySlug[] =
    isComplete && Object.keys(waveOutput).length > 0
      ? (Object.keys(waveOutput) as CategorySlug[])
      : WAVE1_PILLARS;

  const doneCount = Object.keys(waveOutput).length;
  const totalCount = pillarsToShow.length;

  const headerLabel = isComplete
    ? `Wave 1 specialists complete (${totalCount}/${totalCount})`
    : doneCount > 0
      ? `Running Wave 1 specialists… (${doneCount}/${totalCount})`
      : "Running Wave 1 specialists…";

  return (
    <ChainOfThought
      defaultOpen={isStreaming}
      open={isStreaming ? true : undefined}
      isStreaming={isStreaming}
    >
      <ChainOfThoughtHeader>{headerLabel}</ChainOfThoughtHeader>
      {doneCount === 0 && isStreaming ? (
        <ChainOfThoughtContent>
          <ChainOfThoughtStep
            icon={ServerIcon}
            label="Delegating tasks…"
            status="active"
          />
        </ChainOfThoughtContent>
      ) : (
        <WaveProgress
          pillars={pillarsToShow}
          waveOutput={waveOutput}
          isStreaming={isStreaming}
        />
      )}
    </ChainOfThought>
  );
}

// ─── Wave 2 renderer ──────────────────────────────────────────────────────────

const WAVE2_PILLARS: CategorySlug[] = [
  "networking",
  "devops",
  "security_identity",
];

function Wave2Part({ data }: { data: Wave2Data }) {
  const isComplete = data.complete === true;
  const isStreaming = !isComplete;

  const waveOutput: WaveOutput = Object.fromEntries(
    Object.entries(data).filter(([k]) => k !== "complete"),
  ) as WaveOutput;

  const doneCount = Object.keys(waveOutput).length;
  const totalCount = WAVE2_PILLARS.length;

  const headerLabel = isComplete
    ? `Wave 2 specialists complete (${totalCount}/${totalCount})`
    : doneCount > 0
      ? `Running Wave 2 specialists… (${doneCount}/${totalCount})`
      : "Running Wave 2 specialists…";

  return (
    <ChainOfThought
      defaultOpen={isStreaming}
      open={isStreaming ? true : undefined}
      isStreaming={isStreaming}
    >
      <ChainOfThoughtHeader>{headerLabel}</ChainOfThoughtHeader>
      {doneCount === 0 && isStreaming ? (
        <ChainOfThoughtContent>
          <ChainOfThoughtStep
            icon={NetworkIcon}
            label="Delegating tasks…"
            status="active"
          />
        </ChainOfThoughtContent>
      ) : (
        <WaveProgress
          pillars={WAVE2_PILLARS}
          waveOutput={waveOutput}
          isStreaming={isStreaming}
        />
      )}
    </ChainOfThought>
  );
}

// ─── Validator phase renderer ─────────────────────────────────────────────────

function ValidatorPart({ data }: { data: ValidatorData }) {
  const isStreaming = data.state === "streaming";
  const isComplete = data.state === "complete";

  return (
    <ChainOfThought
      defaultOpen={isStreaming}
      open={isStreaming ? true : undefined}
      isStreaming={isStreaming}
    >
      <ChainOfThoughtHeader>
        {isComplete
          ? "Well-Architected review complete"
          : "Reviewing against Well-Architected framework…"}
      </ChainOfThoughtHeader>
      <ChainOfThoughtContent>
        {isComplete ? (
          <ChainOfThoughtStep
            icon={CheckCircleIcon}
            label="Architecture validated"
            status="complete"
          />
        ) : (
          <ChainOfThoughtStep
            icon={ShieldIcon}
            label="Validating architecture…"
            status="active"
          />
        )}
      </ChainOfThoughtContent>
    </ChainOfThought>
  );
}

// ─── Followup agent tool-call renderer (merged) ───────────────────────────────

type FollowupToolPart = { type: string; state: string; input?: unknown; output?: unknown };

const FOLLOWUP_TOOL_TYPES = new Set([
  "tool-list_service_docs",
  "tool-read_service_doc",
  "tool-update_architecture",
]);

function FollowupAgentProgress({
  parts,
  isMessageStreaming,
}: {
  parts: FollowupToolPart[];
  /** True while the parent message is still being streamed — derived from
   *  useChat's status, not from parts' states, so the header stays stable
   *  between tool calls when all parts are momentarily "output-available". */
  isMessageStreaming: boolean;
}) {
  // A part is "active" if the model is currently waiting for its result.
  // isMessageStreaming covers the gap between tool calls where all parts have
  // output-available but the stream hasn't finished yet.
  const isAnyActive = parts.some((p) => p.state !== "output-available");
  const isRunning = isMessageStreaming || isAnyActive;

  return (
    <Task defaultOpen>
      <TaskTrigger
        title={isRunning ? "Researching service options…" : "Research complete"}
      />
      <TaskContent>
        {parts.map((p, i) => {
          const isActive = p.state !== "output-available";

          if (p.type === "tool-list_service_docs") {
            const input = p.input as
              | { provider?: string; pillar?: string }
              | undefined;
            const provider = input?.provider ?? "";
            const pillar = input?.pillar;
            const label = pillar
              ? `Searching ${provider}/${pillar} docs`
              : `Searching ${provider} service docs`;
            return (
              <TaskItem key={i} className="flex items-center gap-1.5">
                {isActive ? (
                  <LoaderCircleIcon className="size-3.5 shrink-0 animate-spin text-primary" />
                ) : (
                  <SearchIcon className="size-3.5 shrink-0" />
                )}
                <span className={isActive ? "text-foreground" : ""}>
                  {label}
                </span>
              </TaskItem>
            );
          }

          if (p.type === "tool-read_service_doc") {
            const input = p.input as { path?: string } | undefined;
            const docPath = input?.path ?? "service doc";
            return (
              <TaskItem key={i} className="flex items-center gap-1.5">
                {isActive ? (
                  <LoaderCircleIcon className="size-3.5 shrink-0 animate-spin text-primary" />
                ) : (
                  <FileTextIcon className="size-3.5 shrink-0" />
                )}
                <span className={isActive ? "text-foreground" : ""}>
                  Read {docPath}
                </span>
              </TaskItem>
            );
          }

          if (p.type === "tool-update_architecture") {
            return (
              <TaskItem key={i} className="flex items-center gap-1.5">
                {isActive ? (
                  <LoaderCircleIcon className="size-3.5 shrink-0 animate-spin text-primary" />
                ) : (
                  <LayersIcon className="size-3.5 shrink-0" />
                )}
                <span className={isActive ? "text-foreground" : ""}>
                  {isActive
                    ? "Applying changes and regenerating diagram…"
                    : "Services and diagram updated"}
                </span>
              </TaskItem>
            );
          }

          return null;
        })}
      </TaskContent>
    </Task>
  );
}

// ─── Attach PDF button ────────────────────────────────────────────────────────

function AttachPDFButton() {
  const attachments = usePromptInputAttachments();
  return (
    <PromptInputButton
      tooltip="Attach PDF"
      onClick={() => attachments.openFileDialog()}
    >
      <PaperclipIcon className="size-4" />
    </PromptInputButton>
  );
}

// ─── Main Chat component ──────────────────────────────────────────────────────

/** Detect the current active phase label from the last assistant message parts. */
function useCurrentPhase(messages: ArchonAgentUIMessage[]): string | null {
  return useMemo(() => {
    const last = messages.findLast((m) => m.role === "assistant");
    if (!last) return null;

    const parts = last.parts;

    // Find the last data-archon-* part that indicates an active phase
    for (let i = parts.length - 1; i >= 0; i--) {
      const part = parts[i];
      if (!("data" in part)) continue;

      if (part.type === "data-archon-requirements") {
        const d = part.data as RequirementsData;
        if (d.state === "streaming") return "Extracting requirements";
      }
      if (part.type === "data-archon-patterns") {
        const d = part.data as PatternsData;
        if (d.state === "streaming") return "Selecting architectural patterns";
      }
      if (part.type === "data-archon-wave1") {
        const d = part.data as Wave1Data;
        if (!d.complete) {
          const done = Object.keys(d).filter((k) => k !== "complete").length;
          return done > 0
            ? `Running Wave 1 specialists (${done} done)`
            : "Running Wave 1 specialists";
        }
      }
      if (part.type === "data-archon-wave2") {
        const d = part.data as Wave2Data;
        if (!d.complete) {
          const done = Object.keys(d).filter((k) => k !== "complete").length;
          return done > 0
            ? `Running Wave 2 specialists (${done} done)`
            : "Running Wave 2 specialists";
        }
      }
      if (part.type === "data-archon-validator") {
        const d = part.data as ValidatorData;
        if (d.state === "streaming") return "Reviewing architecture";
      }
    }

    // Text streaming = synthesis phase
    const lastPart = parts[parts.length - 1];
    if (lastPart?.type === "text") return "Writing architecture";

    return "Thinking";
  }, [messages]);
}

// Pulsing "thinking" dots shown while waiting for the first content to appear
function ThinkingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-1 py-2 text-muted-foreground">
      <BotIcon className="size-4 shrink-0" />
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="size-1.5 rounded-full bg-muted-foreground/60 animate-bounce"
            style={{ animationDelay: `${i * 150}ms`, animationDuration: "1s" }}
          />
        ))}
      </div>
    </div>
  );
}

interface ChatProps {
  id: string;
  initialMessages?: UIMessage[];
  onDiagramChange?: (diagram: DiagramState | null) => void;
  onServicesChange?: (services: ServicesPanelState | null) => void;
}

export function Chat({
  id,
  initialMessages,
  onDiagramChange,
  onServicesChange,
}: ChatProps) {
  const [text, setText] = useState("");
  const router = useRouter();
  const refreshedRef = useRef(false);

  // Stable references that must not be recreated on every render —
  // a new transport object causes useChat to reinitialize, which produces
  // a new `messages` array reference, which re-triggers the effects below,
  // which call setDiagram/setServices, which re-renders the parent, ad infinitum.
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        prepareSendMessagesRequest({ messages, id: chatId }) {
          return { body: { message: messages[messages.length - 1], id: chatId } };
        },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const handleFinish = useCallback(() => {
    if (!refreshedRef.current) {
      refreshedRef.current = true;
      router.refresh();
    }
  }, [router]);

  const { messages, status, sendMessage, regenerate } =
    useChat<ArchonAgentUIMessage>({
      id,
      messages: initialMessages as ArchonAgentUIMessage[] | undefined,
      transport,
      onFinish: handleFinish,
    });

  const isStreaming = status === "streaming";
  const currentPhase = useCurrentPhase(messages);

  // Ref-based deduplication: skip the callback when the derived state hasn't
  // actually changed. Without this guard, every parent re-render (triggered by
  // setDiagram/setServices) can produce a new messages reference and re-fire the
  // effect with the same value, causing an infinite update loop.
  const lastDiagramKeyRef = useRef<string>("");
  const lastServicesKeyRef = useRef<string>("");

  // Notify parent whenever the diagram state changes.
  useEffect(() => {
    if (!onDiagramChange) return;
    // Find the last data-archon-diagram part across all assistant messages.
    let diagramData: DiagramData | undefined;
    for (let i = messages.length - 1; i >= 0; i--) {
      const msg = messages[i];
      if (msg.role !== "assistant") continue;
      const part = msg.parts.findLast((p) => p.type === "data-archon-diagram");
      if (part && "data" in part) {
        diagramData = part.data as DiagramData;
        break;
      }
    }

    // Compute a stable key for the current diagram state.
    const key = diagramData
      ? `${diagramData.state}|${diagramData.imagePath ?? ""}|${diagramData.error ?? ""}`
      : "";
    if (key === lastDiagramKeyRef.current) return;
    lastDiagramKeyRef.current = key;

    if (!diagramData) {
      onDiagramChange(null);
      return;
    }

    if (diagramData.state === "generating") {
      onDiagramChange({ state: "generating" });
    } else if (diagramData.state === "complete" && diagramData.imagePath) {
      onDiagramChange({ state: "complete", imagePath: diagramData.imagePath });
    } else if (diagramData.state === "error") {
      onDiagramChange({
        state: "error",
        error: diagramData.error ?? "Unknown error",
      });
    } else {
      onDiagramChange(null);
    }
  }, [messages, onDiagramChange]);

  // Notify parent whenever the services state changes.
  useEffect(() => {
    if (!onServicesChange) return;
    // Find the last data-archon-services part across all assistant messages.
    let servicesData: ServicesData | undefined;
    for (let i = messages.length - 1; i >= 0; i--) {
      const msg = messages[i];
      if (msg.role !== "assistant") continue;
      const part = msg.parts.findLast((p) => p.type === "data-archon-services");
      if (part && "data" in part) {
        servicesData = part.data as ServicesData;
        break;
      }
    }

    // Compute a stable key. For "complete" state, fingerprint the service list
    // by name so we don't re-emit when the object reference changes but the data
    // is identical.
    const key = servicesData
      ? servicesData.state === "complete"
        ? `complete|${(servicesData.coreServices ?? []).map((s) => s.serviceName).join(",")}|${(servicesData.secondaryServices ?? []).map((s) => s.serviceName).join(",")}`
        : `${servicesData.state}`
      : "";
    if (key === lastServicesKeyRef.current) return;
    lastServicesKeyRef.current = key;

    if (!servicesData) {
      onServicesChange(null);
      return;
    }

    if (servicesData.state === "generating") {
      onServicesChange({ state: "generating" });
    } else if (
      servicesData.state === "complete" &&
      servicesData.coreServices !== undefined &&
      servicesData.secondaryServices !== undefined
    ) {
      onServicesChange({
        state: "complete",
        coreServices: servicesData.coreServices,
        secondaryServices: servicesData.secondaryServices,
      });
    } else if (servicesData.state === "error") {
      onServicesChange({
        state: "error",
        error: servicesData.error ?? "Unknown error",
      });
    } else {
      onServicesChange(null);
    }
  }, [messages, onServicesChange]);

  // Determine if we're waiting for the very first content (submitted but no assistant parts yet)
  const lastMessage = messages[messages.length - 1];
  const isWaitingForFirstContent = isStreaming && lastMessage?.role === "user";

  const handleSubmit = (message: PromptInputMessage) => {
    const hasText = Boolean(message.text?.trim());
    const hasFiles = Boolean(message.files?.length);
    if (!hasText && !hasFiles) return;

    sendMessage({
      text: message.text || "Sent with attachments",
      files: message.files,
    });
    setText("");
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col overflow-hidden px-4">
      {/* Global streaming status bar */}
      {isStreaming && currentPhase && (
        <div className="flex items-center gap-2 border-b border-border/50 bg-muted/30 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur-sm">
          <span className="relative flex size-2 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-primary" />
          </span>
          <span>{currentPhase}…</span>
        </div>
      )}
      <Conversation>
        <ConversationContent>
          {messages.length === 0 ? (
            <ConversationEmptyState
              icon={<BotIcon className="size-12 text-muted-foreground" />}
              title="How can I help you?"
              description="Describe a system you want to build and I'll design a cloud architecture for it."
            />
          ) : (
            <>
              {(() => {
                // Find the index of the last assistant message that ran the
                // FULL pipeline. We discriminate on data-archon-requirements
                // because that part is emitted exclusively by the pipeline —
                // followup messages may also carry data-archon-diagram /
                // data-archon-services (written by update_architecture) but
                // never data-archon-requirements. Using .startsWith("data-archon-")
                // as the discriminator caused followup messages with panel data
                // to steal the index, making the pipeline CoT sections vanish.
                const lastPipelineMessageIndex = messages.reduce(
                  (lastIdx, msg, idx) =>
                    msg.role === "assistant" &&
                    msg.parts.some((p) => p.type === "data-archon-requirements")
                      ? idx
                      : lastIdx,
                  -1,
                );

                return messages.map((message, messageIndex) => {
                  // For assistant messages, deduplicate data-archon-* parts:
                  // only render the *last* part of each type (which holds the
                  // latest snapshot), skipping intermediate incremental updates.
                  // We track the original index so keys stay stable across renders.
                  const lastIndexByType = new Map<string, number>();
                  if (message.role === "assistant") {
                    message.parts.forEach((part, idx) => {
                      if (part.type.startsWith("data-archon-")) {
                        lastIndexByType.set(part.type, idx);
                      }
                    });
                  }
                  const partsToRender =
                    message.role === "assistant"
                      ? message.parts
                          .map((part, idx) => ({ part, idx }))
                          .filter(({ part, idx }) => {
                            if (part.type.startsWith("data-archon-")) {
                              // Only render pipeline phases for the most recent
                              // pipeline message; skip them for older ones.
                              if (messageIndex !== lastPipelineMessageIndex) {
                                return false;
                              }
                              // Only render the last occurrence of each type
                              return lastIndexByType.get(part.type) === idx;
                            }
                            return true;
                          })
                      : message.parts.map((part, idx) => ({ part, idx }));

                  // Collect all followup tool parts so FollowupAgentProgress
                  // can receive the complete list in one merged Task block.
                  const followupToolParts =
                    message.role === "assistant"
                      ? (message.parts.filter((p) =>
                          FOLLOWUP_TOOL_TYPES.has(p.type),
                        ) as FollowupToolPart[])
                      : [];

                  // True only while this specific message is the active stream.
                  // Derived from the overall status (not from parts' states) so
                  // the Task header stays stable between tool calls.
                  const isThisMessageStreaming =
                    isStreaming && messageIndex === messages.length - 1;

                  // Flag: render the merged component only on the FIRST
                  // followup tool part encountered in partsToRender.
                  let followupGroupRendered = false;

                  return (
                    <Fragment key={message.id}>
                      {partsToRender.map(({ part, idx }) => {
                        // For data-archon-* parts we use the type string as key
                        // (unique per message) so React updates in place instead
                        // of remounting when the last-occurrence index shifts.
                        // For all other parts, use the original index.
                        const key = part.type.startsWith("data-archon-")
                          ? `${message.id}-${part.type}`
                          : `${message.id}-${idx}`;

                        // ── Requirements phase ────────────────────────────
                        if (part.type === "data-archon-requirements") {
                          return (
                            <RequirementsPart
                              key={key}
                              data={part.data as RequirementsData}
                            />
                          );
                        }

                        // ── Pattern phase ─────────────────────────────────
                        if (part.type === "data-archon-patterns") {
                          return (
                            <PatternsPart
                              key={key}
                              data={part.data as PatternsData}
                            />
                          );
                        }

                        // ── Wave 1 ────────────────────────────────────────
                        if (part.type === "data-archon-wave1") {
                          return (
                            <Wave1Part
                              key={key}
                              data={part.data as Wave1Data}
                            />
                          );
                        }

                        // ── Wave 2 ────────────────────────────────────────
                        if (part.type === "data-archon-wave2") {
                          return (
                            <Wave2Part
                              key={key}
                              data={part.data as Wave2Data}
                            />
                          );
                        }

                        // ── Validator ─────────────────────────────────────
                        if (part.type === "data-archon-validator") {
                          return (
                            <ValidatorPart
                              key={key}
                              data={part.data as ValidatorData}
                            />
                          );
                        }

                        // ── Followup tool calls (merged into one Task block) ──
                        if (FOLLOWUP_TOOL_TYPES.has(part.type)) {
                          if (followupGroupRendered) return null;
                          followupGroupRendered = true;
                          return (
                            <FollowupAgentProgress
                              key={`${message.id}-followup`}
                              parts={followupToolParts}
                              isMessageStreaming={isThisMessageStreaming}
                            />
                          );
                        }

                        // ── Text parts ────────────────────────────────────
                        if (part.type === "text") {
                          const isLastAssistantMessage =
                            message.role === "assistant" &&
                            messageIndex === messages.length - 1;

                          return (
                            <Fragment key={key}>
                              <Message from={message.role}>
                                <MessageContent>
                                  <MessageResponse>{part.text}</MessageResponse>
                                </MessageContent>
                              </Message>
                              {isLastAssistantMessage && !isStreaming && (
                                <MessageActions>
                                  <MessageAction
                                    onClick={() => regenerate()}
                                    label="Regenerate"
                                  >
                                    <RefreshCcwIcon className="size-3" />
                                  </MessageAction>
                                  <MessageAction
                                    onClick={() =>
                                      navigator.clipboard.writeText(part.text)
                                    }
                                    label="Copy"
                                  >
                                    <CopyIcon className="size-3" />
                                  </MessageAction>
                                </MessageActions>
                              )}
                            </Fragment>
                          );
                        }

                        // ── File (PDF) parts ──────────────────────────────
                        if (part.type === "file") {
                          return (
                            <div
                              key={key}
                              className="flex w-full ml-auto items-start"
                            >
                              <Attachments variant="inline">
                                <Attachment
                                  data={{
                                    type: "file",
                                    id: key,
                                    filename: part.filename ?? "document.pdf",
                                    mediaType: part.mediaType,
                                    url: part.url,
                                  }}
                                >
                                  <AttachmentPreview />
                                  <AttachmentInfo />
                                </Attachment>
                              </Attachments>
                            </div>
                          );
                        }

                        // Skip all other part types
                        return null;
                      })}
                    </Fragment>
                  );
                });
              })()}
              {/* Show thinking indicator while waiting for first assistant content */}
              {isWaitingForFirstContent && <ThinkingIndicator />}
            </>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="py-4 flex flex-col gap-2">
        <PromptInputProvider>
          <AttachmentsDisplay />
          <PromptInput
            onSubmit={handleSubmit}
            globalDrop
            multiple
            accept="application/pdf"
          >
            <PromptInputBody>
              <PromptInputTextarea
                value={text}
                placeholder="Describe a system to architect…"
                onChange={(e) => setText(e.target.value)}
              />
            </PromptInputBody>
            <PromptInputFooter>
              <PromptInputTools>
                <AttachPDFButton />
              </PromptInputTools>
              <PromptInputSubmit
                status={status}
                disabled={!text.trim() && status !== "streaming"}
              />
            </PromptInputFooter>
          </PromptInput>
        </PromptInputProvider>
      </div>
    </div>
  );
}
