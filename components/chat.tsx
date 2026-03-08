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
import {
  BotIcon,
  CopyIcon,
  FileTextIcon,
  LayersIcon,
  RefreshCcwIcon,
} from "lucide-react";
import { useState, Fragment, useRef } from "react";
import { useRouter } from "next/navigation";

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

// ─── Pattern Agent progress renderer ─────────────────────────────────────────

/**
 * Renders the nested PatternAgentUIMessage inside the run_pattern_agent tool part.
 * Shows read_file tool calls as steps and the final text (JSON result) collapsed.
 */
function PatternAgentProgress({
  nestedMessage,
  isStreaming,
}: {
  nestedMessage: PatternAgentUIMessage;
  isStreaming: boolean;
}) {
  const parts = nestedMessage.parts ?? [];

  // Collect read_file calls and the final text part
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
      {/* Each read_file call becomes a step */}
      {readFileParts.map((part, i) => {
        const rawPath =
          part.state === "input-streaming"
            ? null
            : ((part.input as { path?: string })?.path ?? null);

        // Convert "data/patterns/container-microservices.md" → "Container Microservices"
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

      {/* Show the final JSON output as a step once the pattern agent is done */}
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

// ─── run_pattern_agent tool part renderer ────────────────────────────────────

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

  // The output is a nested PatternAgentUIMessage
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
        // While input is still being generated, show a minimal placeholder
        <ChainOfThoughtContent>
          <ChainOfThoughtStep label="Analysing requirements…" status="active" />
        </ChainOfThoughtContent>
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

                  // Skip all other part types for now
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
