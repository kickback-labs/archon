"use client";

import { AnimatePresence, motion } from "motion/react";
import { DiagramPanel, type DiagramState } from "./diagram-panel";

interface ChatLayoutProps {
  diagram: DiagramState | null;
  children: React.ReactNode;
}

/**
 * Wraps the chat content with an animated split-panel layout.
 *
 * - When `diagram` is null: chat takes full width.
 * - When `diagram` is set (generating, complete, or error): chat slides left to
 *   ~55% width and a diagram panel slides in from the right.
 *
 * Uses Framer Motion (available as `motion/react`) for smooth transitions.
 */
export function ChatLayout({ diagram, children }: ChatLayoutProps) {
  const hasDiagram = diagram !== null;

  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* Chat area */}
      <motion.div
        layout
        className="flex h-full min-w-0 flex-col"
        animate={{ width: hasDiagram ? "55%" : "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 35 }}
      >
        {children}
      </motion.div>

      {/* Diagram panel — slides in from the right */}
      <AnimatePresence>
        {hasDiagram && (
          <motion.div
            key="diagram-panel"
            className="h-full flex-shrink-0 overflow-hidden border-l border-border bg-muted/30"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "45%", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 35 }}
          >
            <DiagramPanel diagram={diagram} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
