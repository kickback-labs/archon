"use client";

import { AnimatePresence, motion } from "motion/react";
import { DiagramPanel, type DiagramState } from "./diagram-panel";

interface ChatLayoutProps {
  diagram: DiagramState | null;
  children: React.ReactNode;
}

/**
 * Wraps the chat content with a split-panel layout.
 *
 * - When `diagram` is null: chat takes full width.
 * - When `diagram` is set: chat takes ~55% width and the right column slides in.
 *   The right column is split vertically — diagram panel on top (~55% height),
 *   leaving the bottom free for future content.
 *
 * The chat column itself is NOT animated so switching between chats never
 * triggers an unwanted slide. Only the right column fades/slides in and out.
 */
export function ChatLayout({ diagram, children }: ChatLayoutProps) {
  const hasDiagram = diagram !== null;

  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* Chat area — width controlled by CSS only, no motion animation */}
      <div
        className="flex h-full min-w-0 flex-col transition-none"
        style={{ width: hasDiagram ? "55%" : "100%" }}
      >
        {children}
      </div>

      {/* Right column — slides in from the right when a diagram is present */}
      <AnimatePresence>
        {hasDiagram && (
          <motion.div
            key="right-column"
            className="flex h-full flex-shrink-0 flex-col border-l border-border"
            style={{ width: "45%" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {/* Top: infrastructure diagram — takes upper portion of the right column */}
            <div className="flex-[0_0_38%] overflow-hidden border-b border-border bg-muted/30">
              <DiagramPanel diagram={diagram} />
            </div>

            {/* Bottom: reserved for future content */}
            <div className="flex-1 bg-background" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
