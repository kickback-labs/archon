"use client";

import { Loader2 } from "lucide-react";
import type { ServiceCard } from "@/lib/agents/pipeline";

// ─── Provider label ───────────────────────────────────────────────────────────

const PROVIDER_TEXT: Record<string, string> = {
  AWS: "text-orange-400/60 dark:text-orange-400/50",
  Azure: "text-blue-400/60 dark:text-blue-400/50",
  GCP: "text-green-500/60 dark:text-green-400/50",
};

function ProviderLabel({ provider }: { provider: string }) {
  const cls = PROVIDER_TEXT[provider] ?? "text-muted-foreground/50";
  return (
    <span className={`text-[12px] font-medium ${cls}`}>{provider}</span>
  );
}

// ─── Core service card ────────────────────────────────────────────────────────

function CoreServiceItem({ service }: { service: ServiceCard }) {
  return (
    <div className="px-3 py-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-base font-medium leading-snug text-foreground">
          {service.serviceName}
        </span>
        <ProviderLabel provider={service.provider} />
      </div>
      <div className="mt-0.5 flex items-center gap-2">
        {service.coreTag && (
          <span className="text-[12px] font-medium text-muted-foreground">
            {service.coreTag}
          </span>
        )}
        {service.coreTag && (
          <span className="text-muted-foreground/30">·</span>
        )}
        <span className="text-[11px] text-muted-foreground/45">
          {service.pillarLabel}
        </span>
      </div>
      <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
        {service.description}
      </p>
    </div>
  );
}

// ─── Secondary service card ───────────────────────────────────────────────────

function SecondaryServiceItem({ service }: { service: ServiceCard }) {
  return (
    <div className="px-3 py-3">
      <div className="flex items-center justify-between gap-1">
        <span className="text-sm font-medium text-foreground">
          {service.serviceName}
        </span>
        <ProviderLabel provider={service.provider} />
      </div>
      <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground/80">
        {service.description}
      </p>
    </div>
  );
}

// ─── Section wrapper (blocky border) ─────────────────────────────────────────

function CoreServiceList({ services }: { services: ServiceCard[] }) {
  return (
    <div className="border border-border">
      {services.map((svc, i) => (
        <div key={`core-${i}`} className={i > 0 ? "border-t border-border" : ""}>
          <CoreServiceItem service={svc} />
        </div>
      ))}
    </div>
  );
}

function SecondaryServiceList({ services }: { services: ServiceCard[] }) {
  return (
    <div className="border border-border">
      <div className="grid grid-cols-2">
        {services.map((svc, i) => {
          const isRightCol = i % 2 === 1;
          const isNotFirstRow = i >= 2;
          return (
            <div
              key={`secondary-${i}`}
              className={[
                isRightCol ? "border-l border-border" : "",
                isNotFirstRow ? "border-t border-border" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <SecondaryServiceItem service={svc} />
            </div>
          );
        })}
        {/* Empty right-col cell when item count is odd — closes the last row visually */}
        {services.length % 2 === 1 && (
          <div className="border-l border-t border-border" />
        )}
      </div>
    </div>
  );
}

// ─── Section label ────────────────────────────────────────────────────────────

function SectionLabel({ title }: { title: string }) {
  return (
    <p className="px-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground/70">
      {title}
    </p>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────

export type ServicesPanelState =
  | { state: "generating" }
  | { state: "complete"; coreServices: ServiceCard[]; secondaryServices: ServiceCard[] }
  | { state: "error"; error: string };

interface ServicesPanelProps {
  services: ServicesPanelState;
}

// ─── Main panel ───────────────────────────────────────────────────────────────

export function ServicesPanel({ services }: ServicesPanelProps) {
  if (services.state === "generating") {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin opacity-50" />
        <p className="text-xs tracking-wide opacity-50">Analysing services…</p>
      </div>
    );
  }

  if (services.state === "error") {
    return (
      <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
        <p className="text-xs opacity-50">Services data unavailable</p>
      </div>
    );
  }

  const { coreServices, secondaryServices } = services;
  const hasCore = coreServices.length > 0;
  const hasSecondary = secondaryServices.length > 0;

  if (!hasCore && !hasSecondary) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
        <p className="text-xs opacity-50">No services data</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="space-y-4 p-3 pt-3 pb-4">
          {hasCore && (
            <div className="space-y-2">
              <SectionLabel title="Core Services" />
              <CoreServiceList services={coreServices} />
            </div>
          )}

          {hasSecondary && (
            <div className="space-y-2">
              <SectionLabel title="Secondary Services" />
              <SecondaryServiceList services={secondaryServices} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
