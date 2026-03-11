"use client";

import { useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { DiagramPanel, type DiagramState } from "./diagram-panel";

interface ChatLayoutProps {
  diagram: DiagramState | null;
  children: React.ReactNode;
}

const ANIMATION_DURATION = 0.4;

export function ChatLayout({ diagram, children }: ChatLayoutProps) {
  const hasDiagram = diagram !== null;

  // Skip the entrance animation if the diagram was already present at mount
  // (i.e. user switched to a chat that already has a diagram).
  const mountedWithDiagramRef = useRef(hasDiagram);
  const skipAnimation = mountedWithDiagramRef.current;

  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* Chat — fills all remaining space; shrinks naturally as the right panel expands */}
      <div className="flex h-full min-w-0 flex-1 flex-col">{children}</div>

      {/* Right panel — outer shell animates width 0→45% (clips content as it opens).
          Inner shell is absolutely positioned at the final width so content never
          squishes during the expand animation. */}
      <AnimatePresence>
        {hasDiagram && (
          <motion.div
            key="right-column"
            className="relative h-full flex-shrink-0 overflow-hidden border-l border-border"
            initial={skipAnimation ? false : { width: 0 }}
            animate={{ width: "45%" }}
            exit={{ width: 0 }}
            transition={{
              duration: ANIMATION_DURATION,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            {/* Inner shell — pinned to the right edge so content slides in with the panel */}
            <div className="absolute inset-y-0 right-0 flex w-full flex-col">
              <div className="flex-[0_0_38%] overflow-hidden border-b border-border bg-muted/30">
                <DiagramPanel diagram={diagram} />
              </div>
              <div className="flex-1 bg-background" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
