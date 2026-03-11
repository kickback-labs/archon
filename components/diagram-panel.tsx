"use client";

import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { Loader2, AlertTriangle, Download } from "lucide-react";

export type DiagramState =
  | { state: "generating" }
  | { state: "complete"; imagePath: string }
  | { state: "error"; error: string };

interface DiagramPanelProps {
  diagram: DiagramState;
}

/** Convert an absolute filesystem path to a /api/diagrams/... URL. */
function toApiUrl(absolutePath: string): string {
  const withoutLeadingSlash = absolutePath.startsWith("/")
    ? absolutePath.slice(1)
    : absolutePath;
  return `/api/diagrams/${withoutLeadingSlash}`;
}

export function DiagramPanel({ diagram }: DiagramPanelProps) {
  if (diagram.state === "generating") {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="text-sm font-medium">Generating diagram…</p>
      </div>
    );
  }

  if (diagram.state === "error") {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground">
        <AlertTriangle className="h-8 w-8 text-destructive" />
        <p className="text-sm font-medium text-destructive">
          Diagram generation failed
        </p>
        <p className="max-w-xs text-center text-xs text-muted-foreground">
          {diagram.error}
        </p>
      </div>
    );
  }

  // state === "complete"
  const src = toApiUrl(diagram.imagePath);

  return (
    <div className="flex flex-col items-center gap-2 p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Infrastructure Diagram
      </p>
      <div className="group relative w-full rounded-lg border border-border bg-white p-2">
        <Zoom>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt="Infrastructure architecture diagram"
            style={{ maxHeight: "calc(38vh - 80px)" }}
            className="mx-auto max-w-full object-contain"
          />
        </Zoom>
        {/* Download button — appears on hover in the bottom-right corner */}
        <a
          href={src}
          download
          className="absolute bottom-2 right-2 flex items-center gap-1 rounded-md bg-black/60 px-2 py-1 text-xs text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100"
        >
          <Download className="h-3 w-3" />
          PNG
        </a>
      </div>
    </div>
  );
}
