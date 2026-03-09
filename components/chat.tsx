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
import { useState, Fragment, useRef, useMemo } from "react";
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
      isStreaming={isStreaming}
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

  // Only show pattern files that have finished reading (output-available)
  const completedReads = readFileParts.filter(
    (p) => p.state === "output-available",
  );

  return (
    <ChainOfThoughtContent>
      {completedReads.map((part, i) => {
        const rawPath = (part.input as { path?: string })?.path ?? null;

        const patternName = rawPath
          ? rawPath
              .replace("data/patterns/", "")
              .replace(".md", "")
              .split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")
          : null;

        return (
          <ChainOfThoughtStep
            key={`read-${i}`}
            icon={FileTextIcon}
            label={patternName ? `${patternName}` : "Pattern file"}
            status="complete"
          />
        );
      })}

      {/* While still reading patterns, show a spinner at the bottom */}
      {isStreaming && (
        <ChainOfThoughtStep
          icon={FileTextIcon}
          label="Reading architectural patterns…"
          status="active"
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
      isStreaming={isStreaming}
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
 * Renders only the finished pillars as completed steps, then — while still
 * streaming — a single spinner row at the bottom ("Running specialist agents…").
 * Nothing is shown for pillars that haven't finished yet.
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
  // Only show pillars that have actually finished, in the order they appear in
  // the pillars array (which matches arrival order once the wave runs).
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

      {/* While specialists are still running, show a single spinner at the bottom */}
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

  const doneCount = Object.keys(waveOutput).length;
  const totalCount = pillarsToShow.length;

  const headerLabel = isComplete
    ? `Wave 1 specialists complete (${totalCount}/${totalCount})`
    : isStreaming && doneCount > 0
      ? `Running Wave 1 specialists… (${doneCount}/${totalCount})`
      : "Running Wave 1 specialists…";

  return (
    <ChainOfThought
      defaultOpen={isStreaming}
      open={isStreaming ? true : undefined}
      isStreaming={isStreaming}
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

  const doneCount = Object.keys(waveOutput).length;
  const totalCount = WAVE2_PILLARS.length;

  const headerLabel = isComplete
    ? `Wave 2 specialists complete (${totalCount}/${totalCount})`
    : isStreaming && doneCount > 0
      ? `Running Wave 2 specialists… (${doneCount}/${totalCount})`
      : "Running Wave 2 specialists…";

  return (
    <ChainOfThought
      defaultOpen={isStreaming}
      open={isStreaming ? true : undefined}
      isStreaming={isStreaming}
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

// Detects the current active phase label from the last assistant message parts
function useCurrentPhase(messages: ArchonAgentUIMessage[]): string | null {
  return useMemo(() => {
    const last = messages.findLast((m) => m.role === "assistant");
    if (!last) return null;

    const parts = last.parts as Array<{ type: string; state?: string; preliminary?: boolean; output?: unknown }>;

    // Scan parts from the end to find the most-recent in-progress tool
    for (let i = parts.length - 1; i >= 0; i--) {
      const part = parts[i];
      const isActive =
        part.state === "input-streaming" ||
        part.state === "input-available" ||
        (part.state === "output-available" && part.preliminary === true);

      if (!isActive) continue;

      if (part.type === "tool-run_requirements_agent") return "Extracting requirements";
      if (part.type === "tool-run_pattern_agent") return "Selecting architectural patterns";
      if (part.type === "tool-run_wave1_specialists") {
        const out = part.state === "output-available" ? (part.output as WaveOutput) ?? {} : {};
        const done = Object.keys(out).length;
        return done > 0 ? `Running Wave 1 specialists (${done} done)` : "Running Wave 1 specialists";
      }
      if (part.type === "tool-run_wave2_specialists") {
        const out = part.state === "output-available" ? (part.output as WaveOutput) ?? {} : {};
        const done = Object.keys(out).length;
        return done > 0 ? `Running Wave 2 specialists (${done} done)` : "Running Wave 2 specialists";
      }
    }

    // If we have text streaming
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

  const isStreaming = status === "streaming";
  const currentPhase = useCurrentPhase(messages);

  // Determine if we're waiting for the very first content (submitted but no assistant parts yet)
  const lastMessage = messages[messages.length - 1];
  const isWaitingForFirstContent =
    isStreaming &&
    lastMessage?.role === "user";

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
              {messages.map((message, messageIndex) => (
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

                    // Skip all other part types
                    return null;
                  })}
                </Fragment>
              ))}
              {/* Show thinking indicator while waiting for first assistant content */}
              {isWaitingForFirstContent && <ThinkingIndicator />}
            </>
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
