import { embed, embedMany } from "ai";
import { db } from "@/lib/db";
import { serviceEmbedding } from "@/lib/db/schema";
import { cosineDistance, desc, gt, sql, and, eq, inArray, notInArray } from "drizzle-orm";

// text-embedding-3-small: 1536 dims
const embeddingModel = "openai/text-embedding-3-small";

// ─── Generate embeddings ──────────────────────────────────────────────────────

/** Embed a single string (used at query time). */
export async function generateEmbedding(value: string): Promise<number[]> {
  const input = value.replaceAll("\n", " ");
  const { embedding } = await embed({
    model: embeddingModel,
    value: input,
  });
  return embedding;
}

/** Embed many strings in one batched call (used at ingest time). */
export async function generateEmbeddings(
  values: string[],
): Promise<number[][]> {
  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: values.map((v) => v.replaceAll("\n", " ")),
    maxParallelCalls: 3,
  });
  return embeddings;
}

// ─── Retrieval ────────────────────────────────────────────────────────────────

export type RetrieveOptions = {
  query: string;
  pillar: string; // CategorySlug — scopes to one service_category
  providers?: string[]; // [] or omitted = all providers
  filters?: {
    managed?: boolean;
    pricing_model?: string;
  };
  top_k?: number; // defaults to 5; applies only to Tier-2/3 semantic search
};

export type RetrievedDocument = {
  id: string;
  cloudProvider: string;
  serviceName: string;
  serviceCategory: string;
  pricingModel: string;
  managed: boolean;
  tier: number;
  content: string;
  filePath: string;
  similarity: number;
};

/**
 * Retrieve service documents for a given query.
 *
 * Strategy:
 * 1. Always fetch ALL Tier-1 docs for the pillar (metadata filter only, no
 *    similarity threshold). These are foundational — every architect must
 *    consider them when the category is active.
 * 2. Perform semantic RAG exclusively on Tier-2 and Tier-3 docs, returning
 *    the top `top_k` (default 5) by cosine similarity.
 * 3. Merge: Tier-1 docs first, then Tier-2/3 semantic results (de-duplicated
 *    by id to guard against any overlap).
 */
export async function retrieve(
  opts: RetrieveOptions,
): Promise<RetrievedDocument[]> {
  const { query, pillar, providers = [], filters = {}, top_k = 5 } = opts;

  // Build shared provider + managed conditions (reused in both queries)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sharedConditions: any[] = [];
  if (providers.length > 0) {
    sharedConditions.push(
      inArray(
        serviceEmbedding.cloudProvider,
        providers as ("AWS" | "Azure" | "GCP")[],
      ),
    );
  }
  if (filters.managed !== undefined) {
    sharedConditions.push(eq(serviceEmbedding.managed, filters.managed));
  }
  if (filters.pricing_model) {
    sharedConditions.push(
      eq(serviceEmbedding.pricingModel, filters.pricing_model),
    );
  }

  // ── 1. Tier-1 fetch (always, no similarity threshold) ────────────────────
  const tier1Results = await db
    .select({
      id: serviceEmbedding.id,
      cloudProvider: serviceEmbedding.cloudProvider,
      serviceName: serviceEmbedding.serviceName,
      serviceCategory: serviceEmbedding.serviceCategory,
      pricingModel: serviceEmbedding.pricingModel,
      managed: serviceEmbedding.managed,
      tier: serviceEmbedding.tier,
      content: serviceEmbedding.content,
      filePath: serviceEmbedding.filePath,
      similarity: sql<number>`1`, // No similarity score for tier-1 (not ranked)
    })
    .from(serviceEmbedding)
    .where(
      and(
        eq(serviceEmbedding.serviceCategory, pillar),
        eq(serviceEmbedding.tier, 1),
        ...sharedConditions,
      ),
    );

  // Collect Tier-1 ids so we can exclude them from the semantic search
  const tier1Ids = tier1Results.map((r) => r.id);

  // ── 2. Tier-2/3 semantic search ───────────────────────────────────────────
  const queryEmbedding = await generateEmbedding(query);

  const similarity = sql<number>`1 - (${cosineDistance(
    serviceEmbedding.embedding,
    queryEmbedding,
  )})`;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const semanticConditions: any[] = [
    eq(serviceEmbedding.serviceCategory, pillar),
    gt(similarity, 0.3),
    // Exclude tier-1 docs (already included above)
    ...(tier1Ids.length > 0
      ? [notInArray(serviceEmbedding.id, tier1Ids)]
      : []),
    ...sharedConditions,
  ];

  const semanticResults = await db
    .select({
      id: serviceEmbedding.id,
      cloudProvider: serviceEmbedding.cloudProvider,
      serviceName: serviceEmbedding.serviceName,
      serviceCategory: serviceEmbedding.serviceCategory,
      pricingModel: serviceEmbedding.pricingModel,
      managed: serviceEmbedding.managed,
      tier: serviceEmbedding.tier,
      content: serviceEmbedding.content,
      filePath: serviceEmbedding.filePath,
      similarity,
    })
    .from(serviceEmbedding)
    .where(and(...semanticConditions))
    .orderBy(desc(similarity))
    .limit(top_k);

  // ── 3. Merge: Tier-1 first, then Tier-2/3 semantic (de-duplicated) ───────
  const seen = new Set<string>();
  const merged: RetrievedDocument[] = [];

  for (const doc of [...tier1Results, ...semanticResults]) {
    if (!seen.has(doc.id)) {
      seen.add(doc.id);
      merged.push(doc as RetrievedDocument);
    }
  }

  return merged;
}
