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
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  PromptInputActionMenu,
  PromptInputActionMenuTrigger,
  PromptInputActionMenuContent,
  PromptInputActionAddAttachments,
  type PromptInputMessage,
  usePromptInputAttachments,
} from "@/components/ai-elements/prompt-input";
import {
  Attachment,
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
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import type { ArchonAgentUIMessage } from "@/lib/agents/archon-agent";
import type { PatternAgentUIMessage } from "@/lib/agents/pattern-agent";
import type { RequirementsAgentUIMessage } from "@/lib/agents/requirements-agent";
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
  MessageSquareIcon,
  MonitorIcon,
  NetworkIcon,
  RefreshCcwIcon,
  ServerIcon,
  ShieldIcon,
  SparklesIcon,
  TruckIcon,
  type LucideIcon,
} from "lucide-react";
import { useState, Fragment, useRef } from "react";
import { useRouter } from "next/navigation";

// ─── Pillar metadata ──────────────────────────────────────────────────────────

const PILLAR_META: Record<CategorySlug, { label: string; icon: LucideIcon }> =
  {
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

// ─── Attachment display ───────────────────────────────────────────────────────

const AttachmentsDisplay = () => {
  const attachments = usePromptInputAttachments();
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
          <AttachmentRemove />
        </Attachment>
      ))}
    </Attachments>
  );
};

// ─── Requirements Agent tool part renderer ───────────────────────────────────

function RequirementsAgentToolPart({
  part,
}: {
  part: Extract<
    ArchonAgentUIMessage["parts"][number],
    { type: "tool-run_requirements_agent" }
  >;
}) {
  const isStreaming =
    part.state === "input-streaming" ||
    part.state === "input-available" ||
    (part.state === "output-available" && part.preliminary === true);

  const isComplete = part.state === "output-available" && !part.preliminary;

  const headerLabel = isComplete
    ? "Requirements extracted"
    : "Extracting requirements…";

  const nestedMessage =
    part.state === "output-available"
      ? (part.output as RequirementsAgentUIMessage | undefined)
      : undefined;

  const hasSchema =
    nestedMessage?.parts.some((p) => p.type === "text") ?? false;

  return (
    <ChainOfThought
      defaultOpen={isStreaming}
      open={isStreaming ? true : undefined}
    >
      <ChainOfThoughtHeader>{headerLabel}</ChainOfThoughtHeader>
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

// ─── Pattern Agent progress renderer ─────────────────────────────────────────

function PatternAgentProgress({
  nestedMessage,
  isStreaming,
}: {
  nestedMessage: PatternAgentUIMessage;
  isStreaming: boolean;
}) {
  const parts = nestedMessage.parts ?? [];

  const readFileParts = parts.filter(
    (p) => p.type === "tool-read_file",
  ) as Extract<
    PatternAgentUIMessage["parts"][number],
    { type: "tool-read_file" }
  >[];

  const textParts = parts.filter((p) => p.type === "text") as Extract<
    PatternAgentUIMessage["parts"][number],
    { type: "text" }
  >[];

  return (
    <ChainOfThoughtContent>
      {readFileParts.map((part, i) => {
        const rawPath =
          part.state === "input-streaming"
            ? null
            : ((part.input as { path?: string })?.path ?? null);

        const patternName = rawPath
          ? rawPath
              .replace("data/patterns/", "")
              .replace(".md", "")
              .split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")
          : null;

        const isActive =
          part.state === "input-available" || part.state === "input-streaming";
        const isComplete = part.state === "output-available";

        return (
          <ChainOfThoughtStep
            key={`read-${i}`}
            icon={FileTextIcon}
            label={
              patternName
                ? `Reading ${patternName} pattern`
                : "Reading pattern file…"
            }
            status={isActive ? "active" : isComplete ? "complete" : "pending"}
          />
        );
      })}

      {!isStreaming && textParts.length > 0 && (
        <ChainOfThoughtStep
          icon={LayersIcon}
          label="Pattern selection complete"
          status="complete"
        />
      )}
    </ChainOfThoughtContent>
  );
}

// ─── Pattern Agent tool part renderer ────────────────────────────────────────

function PatternAgentToolPart({
  part,
}: {
  part: Extract<
    ArchonAgentUIMessage["parts"][number],
    { type: "tool-run_pattern_agent" }
  >;
}) {
  const isStreaming =
    part.state === "input-streaming" ||
    part.state === "input-available" ||
    (part.state === "output-available" && part.preliminary === true);

  const isComplete = part.state === "output-available" && !part.preliminary;

  const headerLabel = isComplete
    ? "Architectural patterns selected"
    : "Selecting architectural patterns…";

  const nestedMessage =
    part.state === "output-available"
      ? (part.output as PatternAgentUIMessage | undefined)
      : undefined;

  return (
    <ChainOfThought
      defaultOpen={isStreaming}
      open={isStreaming ? true : undefined}
    >
      <ChainOfThoughtHeader>{headerLabel}</ChainOfThoughtHeader>
      {nestedMessage ? (
        <PatternAgentProgress
          nestedMessage={nestedMessage}
          isStreaming={isStreaming}
        />
      ) : (
        <ChainOfThoughtContent>
          <ChainOfThoughtStep label="Analysing requirements…" status="active" />
        </ChainOfThoughtContent>
      )}
    </ChainOfThought>
  );
}

// ─── Wave progress renderer ───────────────────────────────────────────────────

/**
 * Renders one ChainOfThoughtStep per pillar.
 * A pillar is "complete" once it appears in waveOutput.
 * The first incomplete pillar is "active" while streaming.
 */
function WaveProgress({
  pillars,
  waveOutput,
  isStreaming,
}: {
  pillars: CategorySlug[];
  waveOutput: WaveOutput;
  isStreaming: boolean;
}) {
  const firstPendingIndex = pillars.findIndex((p) => !(p in waveOutput));

  return (
    <ChainOfThoughtContent>
      {pillars.map((pillar, i) => {
        const meta = PILLAR_META[pillar];
        const isDone = pillar in waveOutput;
        const isActive = isStreaming && !isDone && i === firstPendingIndex;

        return (
          <ChainOfThoughtStep
            key={pillar}
            icon={meta.icon}
            label={meta.label}
            status={isDone ? "complete" : isActive ? "active" : "pending"}
          />
        );
      })}
    </ChainOfThoughtContent>
  );
}

// ─── Wave 1 tool part renderer ────────────────────────────────────────────────

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

function Wave1ToolPart({
  part,
}: {
  part: Extract<
    ArchonAgentUIMessage["parts"][number],
    { type: "tool-run_wave1_specialists" }
  >;
}) {
  const isStreaming =
    part.state === "input-streaming" ||
    part.state === "input-available" ||
    (part.state === "output-available" && part.preliminary === true);

  const isComplete = part.state === "output-available" && !part.preliminary;

  const waveOutput: WaveOutput =
    part.state === "output-available" ? (part.output as WaveOutput) ?? {} : {};

  // When complete, only show the pillars that actually ran
  const pillarsToShow: CategorySlug[] =
    isComplete && Object.keys(waveOutput).length > 0
      ? (Object.keys(waveOutput) as CategorySlug[])
      : WAVE1_PILLARS;

  const headerLabel = isComplete
    ? "Wave 1 specialists complete"
    : "Running Wave 1 specialists…";

  return (
    <ChainOfThought
      defaultOpen={isStreaming}
      open={isStreaming ? true : undefined}
    >
      <ChainOfThoughtHeader>{headerLabel}</ChainOfThoughtHeader>
      {part.state === "input-streaming" || part.state === "input-available" ? (
        <ChainOfThoughtContent>
          <ChainOfThoughtStep
            icon={ServerIcon}
            label="Preparing specialists…"
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

// ─── Wave 2 tool part renderer ────────────────────────────────────────────────

const WAVE2_PILLARS: CategorySlug[] = [
  "networking",
  "devops",
  "security_identity",
];

function Wave2ToolPart({
  part,
}: {
  part: Extract<
    ArchonAgentUIMessage["parts"][number],
    { type: "tool-run_wave2_specialists" }
  >;
}) {
  const isStreaming =
    part.state === "input-streaming" ||
    part.state === "input-available" ||
    (part.state === "output-available" && part.preliminary === true);

  const isComplete = part.state === "output-available" && !part.preliminary;

  const waveOutput: WaveOutput =
    part.state === "output-available" ? (part.output as WaveOutput) ?? {} : {};

  const headerLabel = isComplete
    ? "Wave 2 specialists complete"
    : "Running Wave 2 specialists…";

  return (
    <ChainOfThought
      defaultOpen={isStreaming}
      open={isStreaming ? true : undefined}
    >
      <ChainOfThoughtHeader>{headerLabel}</ChainOfThoughtHeader>
      {part.state === "input-streaming" || part.state === "input-available" ? (
        <ChainOfThoughtContent>
          <ChainOfThoughtStep
            icon={NetworkIcon}
            label="Preparing specialists…"
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

// ─── Main Chat component ──────────────────────────────────────────────────────

interface ChatProps {
  id: string;
  initialMessages?: UIMessage[];
}

export function Chat({ id, initialMessages }: ChatProps) {
  const [text, setText] = useState("");
  const router = useRouter();
  const refreshedRef = useRef(false);

  const { messages, status, sendMessage, regenerate } =
    useChat<ArchonAgentUIMessage>({
      id,
      messages: initialMessages as ArchonAgentUIMessage[] | undefined,
      transport: new DefaultChatTransport({
        api: "/api/chat",
        // Only send the last (new) message — server loads history from DB
        prepareSendMessagesRequest({ messages, id }) {
          return { body: { message: messages[messages.length - 1], id } };
        },
      }),
      onFinish: () => {
        // Refresh the layout once after the first assistant reply so the
        // sidebar picks up the new chat (and its auto-generated title).
        if (!refreshedRef.current) {
          refreshedRef.current = true;
          router.refresh();
        }
      },
    });

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
      <Conversation>
        <ConversationContent>
          {messages.length === 0 ? (
            <ConversationEmptyState
              icon={<BotIcon className="size-12 text-muted-foreground" />}
              title="How can I help you?"
              description="Describe a system you want to build and I'll design a cloud architecture for it."
            />
          ) : (
            messages.map((message, messageIndex) => (
              <Fragment key={message.id}>
                {message.parts.map((part, i) => {
                  const key = `${message.id}-${i}`;

                  // ── Requirements Agent tool part ─────────────────────────
                  if (part.type === "tool-run_requirements_agent") {
                    return (
                      <RequirementsAgentToolPart
                        key={key}
                        part={
                          part as Extract<
                            ArchonAgentUIMessage["parts"][number],
                            { type: "tool-run_requirements_agent" }
                          >
                        }
                      />
                    );
                  }

                  // ── Pattern Agent tool part ──────────────────────────────
                  if (part.type === "tool-run_pattern_agent") {
                    return (
                      <PatternAgentToolPart
                        key={key}
                        part={
                          part as Extract<
                            ArchonAgentUIMessage["parts"][number],
                            { type: "tool-run_pattern_agent" }
                          >
                        }
                      />
                    );
                  }

                  // ── Wave 1 tool part ─────────────────────────────────────
                  if (part.type === "tool-run_wave1_specialists") {
                    return (
                      <Wave1ToolPart
                        key={key}
                        part={
                          part as Extract<
                            ArchonAgentUIMessage["parts"][number],
                            { type: "tool-run_wave1_specialists" }
                          >
                        }
                      />
                    );
                  }

                  // ── Wave 2 tool part ─────────────────────────────────────
                  if (part.type === "tool-run_wave2_specialists") {
                    return (
                      <Wave2ToolPart
                        key={key}
                        part={
                          part as Extract<
                            ArchonAgentUIMessage["parts"][number],
                            { type: "tool-run_wave2_specialists" }
                          >
                        }
                      />
                    );
                  }

                  // ── Text parts ───────────────────────────────────────────
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
                        {isLastAssistantMessage && (
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

                  // Skip all other part types
                  return null;
                })}
              </Fragment>
            ))
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="py-4">
        <PromptInput onSubmit={handleSubmit} globalDrop multiple>
          <div className="px-3 pt-2">
            <AttachmentsDisplay />
          </div>
          <PromptInputBody>
            <PromptInputTextarea
              value={text}
              placeholder="Describe a system to architect…"
              onChange={(e) => setText(e.target.value)}
            />
          </PromptInputBody>
          <PromptInputFooter>
            <PromptInputTools>
              <PromptInputActionMenu>
                <PromptInputActionMenuTrigger />
                <PromptInputActionMenuContent>
                  <PromptInputActionAddAttachments />
                </PromptInputActionMenuContent>
              </PromptInputActionMenu>
            </PromptInputTools>
            <PromptInputSubmit
              status={status}
              disabled={!text.trim() && status !== "streaming"}
            />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
}
