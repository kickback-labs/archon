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
 * all Tier-1 docs for the pillar unconditionally, then performs RAG on
 * Tier-2/3 docs for the top_k semantic results. Specialists only need to
 * specify their query, pillar, and optional provider/managed filters.
 */
export const retrieveTool = tool({
  description:
    "Retrieve cloud service documents relevant to a specific architectural decision. " +
    "Always returns all Tier-1 (foundational) services for the pillar, plus the top " +
    "semantically matching Tier-2/3 services. Call this exactly once per specialist " +
    "invocation with a precise, context-grounded query — not the raw user prompt.",
  inputSchema: z.object({
    query: z
      .string()
      .describe(
        "A precise retrieval query grounded in the selected architectural pattern and " +
          "requirements. Example: 'serverless container compute for event-driven microservices " +
          "with burst scaling, managed, moderate budget'.",
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
    filters: z
      .object({
        managed: z
          .boolean()
          .optional()
          .describe(
            "Filter by whether the service is fully managed by the provider.",
          ),
        pricing_model: z
          .string()
          .optional()
          .describe(
            "Filter by pricing model: 'on-demand', 'serverless', 'reserved', 'per-request', 'subscription'.",
          ),
      })
      .optional()
      .describe("Optional metadata filters to narrow the search."),
    top_k: z
      .number()
      .int()
      .min(1)
      .max(10)
      .optional()
      .describe(
        "Maximum number of Tier-2/3 semantic results to return (default 5). " +
          "Tier-1 docs are always included regardless of this value.",
      ),
  }),
  execute: async ({ query, pillar, providers, filters, top_k }) => {
    const docs = await retrieve({ query, pillar, providers, filters, top_k });
    return { documents: docs };
  },
});
