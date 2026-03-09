import { tool } from "ai";
import { z } from "zod";
import { retrieve } from "@/lib/embedding";

export const CATEGORY_SLUGS = [
  "compute",
  "storage",
  "database",
  "networking",
  "security_identity",
  "ai_ml",
  "analytics",
  "integration_messaging",
  "devops",
  "migration_hybrid",
  "other",
] as const;

export type CategorySlug = (typeof CATEGORY_SLUGS)[number];

/**
 * A tool that wraps the retrieve() function for use by specialist agents.
 *
 * Tier-1 handling is transparent to the caller — retrieve() always fetches
 * ALL Tier-1 docs for the pillar (scoped to the requested providers), then
 * performs RAG on Tier-2/3 docs for the top_k semantic results. The merged
 * result is: all T1 docs first, then the top_k T2/T3 semantic matches.
 *
 * Specialists call this exactly once per invocation.
 */
export const retrieveTool = tool({
  description:
    "Retrieve cloud service documents relevant to a specific architectural decision. " +
    "Always returns ALL Tier-1 (foundational) services for the pillar, plus the top 5 " +
    "semantically matching Tier-2/3 services. Call this exactly ONCE per specialist " +
    "invocation with a precise, context-grounded query — not the raw user prompt. " +
    "Do NOT add filters for managed status or pricing model — those are handled internally.",
  inputSchema: z.object({
    query: z
      .string()
      .describe(
        "A precise retrieval query grounded in the selected architectural pattern and " +
          "requirements. Example: 'serverless container compute for event-driven microservices " +
          "with burst scaling, moderate budget'.",
      ),
    pillar: z
      .enum(CATEGORY_SLUGS)
      .describe("The architectural pillar to scope the search to."),
    providers: z
      .array(z.enum(["AWS", "Azure", "GCP"]))
      .optional()
      .describe(
        "Restrict results to specific cloud providers. Omit to search all providers.",
      ),
  }),
  execute: async ({ query, pillar, providers }) => {
    const docs = await retrieve({ query, pillar, providers, top_k: 5 });
    return { documents: docs };
  },
});
