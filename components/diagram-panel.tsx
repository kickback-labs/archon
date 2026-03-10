"use client";

import Image from "next/image";
import { Loader2, AlertTriangle, ImageOff } from "lucide-react";

export type DiagramState =
  | { state: "generating" }
  | { state: "complete"; imagePath: string }
  | { state: "error"; error: string };

interface DiagramPanelProps {
  diagram: DiagramState;
}

/** Convert an absolute filesystem path to a /api/diagrams/... URL. */
function toApiUrl(absolutePath: string): string {
  // Strip leading slash so we can build /api/diagrams/<rest>
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
    <div className="flex h-full flex-col items-center justify-start gap-3 overflow-auto p-4">
      <p className="text-sm font-semibold text-foreground">
        Infrastructure Diagram
      </p>
      <div className="relative w-full flex-1 overflow-hidden rounded-lg border border-border bg-white">
        <Image
          src={src}
          alt="Infrastructure architecture diagram"
          fill
          className="object-contain p-2"
          unoptimized
          priority
        />
      </div>
      <a
        href={src}
        download
        className="text-xs text-muted-foreground underline hover:text-foreground"
      >
        Download PNG
      </a>
    </div>
  );
}
