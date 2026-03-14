/**
 * Archon Agent — Public API
 *
 * The Archon orchestrator was previously a ToolLoopAgent that called phase
 * tools in sequence, passing large JSON payloads verbatim as tool arguments
 * (token-by-token). This caused significant inter-phase latency.
 *
 * It has been replaced by:
 * 1. A lightweight router  (lib/agents/router.ts)   — classifies intent in one
 *    structured-output LLM call (no tool loop, no context accumulation).
 * 2. A deterministic pipeline (lib/agents/pipeline.ts) — calls each phase
 *    directly as TypeScript, passing results as in-memory objects with no LLM
 *    orchestrator between phases.
 */

import type { UIMessage } from "ai";

/** Type alias for messages produced by the Archon pipeline. */
export type ArchonAgentUIMessage = UIMessage;

export { classifyIntent } from "./router";
export { runArchonPipeline } from "./pipeline";
export { runFollowup } from "./followup";
export type { ServiceCard } from "./pipeline";
