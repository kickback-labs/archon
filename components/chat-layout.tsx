"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { DiagramPanel, type DiagramState } from "./diagram-panel";
import { ServicesPanel, type ServicesPanelState } from "./services-panel";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { ImageIcon, ServerIcon } from "lucide-react";

interface ChatLayoutProps {
  diagram: DiagramState | null;
  services: ServicesPanelState | null;
  children: React.ReactNode;
}

const ANIMATION_DURATION = 0.4;

export function ChatLayout({ diagram, services, children }: ChatLayoutProps) {
  const hasDiagram = diagram !== null;
  const hasServices = services !== null;
  const hasRightPanel = hasDiagram || hasServices;

  const [diagramOpen, setDiagramOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  // Skip the entrance animation if the right panel was already present at mount
  const mountedWithPanelRef = useRef(hasRightPanel);
  const skipAnimation = mountedWithPanelRef.current;

  return (
    <>
      <div className="flex h-full w-full overflow-hidden">
        {/* Chat — fills all remaining space */}
        <div className="flex h-full min-w-0 flex-1 flex-col">
          {/* Mobile: panel toggle buttons (hidden on lg+) */}
          {hasRightPanel && (
            <div className="flex shrink-0 items-center gap-2 border-b px-3 py-1.5 lg:hidden">
              {hasDiagram && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDiagramOpen(true)}
                >
                  <ImageIcon data-icon="inline-start" />
                  Diagram
                </Button>
              )}
              {hasServices && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setServicesOpen(true)}
                >
                  <ServerIcon data-icon="inline-start" />
                  Services
                </Button>
              )}
            </div>
          )}
          {children}
        </div>

        {/* Desktop: right panel (hidden on < lg) */}
        <AnimatePresence>
          {hasRightPanel && (
            <motion.div
              key="right-column"
              className="relative hidden h-full flex-shrink-0 overflow-hidden border-l border-border lg:block"
              initial={skipAnimation ? false : { width: 0 }}
              animate={{ width: "45%" }}
              exit={{ width: 0 }}
              transition={{
                duration: ANIMATION_DURATION,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              <div className="absolute inset-y-0 right-0 flex w-full flex-col">
                {hasDiagram && (
                  <div className="flex-[0_0_38%] overflow-hidden border-b border-border bg-muted/30">
                    <DiagramPanel diagram={diagram} />
                  </div>
                )}

                {hasServices && (
                  <div className="min-h-0 flex-1 overflow-hidden bg-background flex flex-col">
                    <ServicesPanel services={services} />
                  </div>
                )}

                {hasDiagram && !hasServices && (
                  <div className="flex-1 bg-background" />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile: diagram sheet */}
      {hasDiagram && diagram && (
        <Sheet open={diagramOpen} onOpenChange={setDiagramOpen}>
          <SheetContent
            side="bottom"
            className="flex max-h-[85vh] flex-col overflow-hidden"
            showCloseButton
          >
            <SheetHeader>
              <SheetTitle>Infrastructure Diagram</SheetTitle>
              <SheetDescription className="sr-only">
                View the generated infrastructure architecture diagram.
              </SheetDescription>
            </SheetHeader>
            <div className="min-h-0 flex-1 overflow-y-auto">
              <DiagramPanel diagram={diagram} />
            </div>
          </SheetContent>
        </Sheet>
      )}

      {/* Mobile: services sheet */}
      {hasServices && services && (
        <Sheet open={servicesOpen} onOpenChange={setServicesOpen}>
          <SheetContent
            side="bottom"
            className="flex max-h-[85vh] flex-col overflow-hidden"
            showCloseButton
          >
            <SheetHeader>
              <SheetTitle>Cloud Services</SheetTitle>
              <SheetDescription className="sr-only">
                View recommended cloud services for your architecture.
              </SheetDescription>
            </SheetHeader>
            <div className="min-h-0 flex-1 overflow-y-auto">
              <ServicesPanel services={services} />
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}
