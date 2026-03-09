#!/usr/bin/env tsx
/**
 * scripts/ingest-embeddings.ts
 *
 * Reads every service markdown file under data/{aws,azure,gcp}/**\/*.md,
 * parses its YAML frontmatter, generates a text-embedding-3-small vector
 * for the full document content, and upserts it into the service_embedding table.
 *
 * Run:
 *   pnpm tsx scripts/ingest-embeddings.ts
 *
 * Re-running is safe — existing rows are updated in place (upsert on file_path).
 */

import "dotenv/config";
import fs from "fs";
import path from "path";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "../lib/db/schema";
import { embedMany } from "ai";

// ─── DB ───────────────────────────────────────────────────────────────────────

const db = drizzle(process.env.DATABASE_URL!, { schema });

// ─── Embedding model ──────────────────────────────────────────────────────────

// text-embedding-3-small: 1536 dims
const embeddingModel = "openai/text-embedding-3-small";

// ─── Frontmatter parser ───────────────────────────────────────────────────────

type Frontmatter = {
  cloud_provider: "AWS" | "Azure" | "GCP";
  service_category: string;
  service_name: string;
  pricing_model: string;
  managed: boolean;
  tier: 1 | 2 | 3;
};

function parseFrontmatter(raw: string): { meta: Frontmatter; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) throw new Error("No YAML frontmatter found");

  const yamlBlock = match[1];
  const body = match[2].trim();

  // Minimal YAML parser — keys are simple scalars only (no nesting needed here)
  const meta: Record<string, unknown> = {};
  for (const line of yamlBlock.split("\n")) {
    const colon = line.indexOf(":");
    if (colon === -1) continue;
    const key = line.slice(0, colon).trim();
    const rawVal = line
      .slice(colon + 1)
      .trim()
      .replace(/^["']|["']$/g, "");
    if (rawVal === "true") meta[key] = true;
    else if (rawVal === "false") meta[key] = false;
    else if (/^\d+$/.test(rawVal)) meta[key] = parseInt(rawVal, 10);
    else meta[key] = rawVal;
  }

  return { meta: meta as unknown as Frontmatter, body };
}

// ─── File discovery ───────────────────────────────────────────────────────────

function discoverServiceFiles(dataDir: string): string[] {
  const results: string[] = [];

  for (const provider of ["aws", "azure", "gcp"]) {
    const providerDir = path.join(dataDir, provider);
    if (!fs.existsSync(providerDir)) continue;

    for (const category of fs.readdirSync(providerDir)) {
      const categoryDir = path.join(providerDir, category);
      if (!fs.statSync(categoryDir).isDirectory()) continue;

      for (const file of fs.readdirSync(categoryDir)) {
        if (file.endsWith(".md")) {
          results.push(path.join(categoryDir, file));
        }
      }
    }
  }

  return results;
}

// ─── Batch helpers ────────────────────────────────────────────────────────────

const BATCH_SIZE = 50; // embed 50 docs at a time

async function processBatch(
  batch: Array<{
    meta: Frontmatter;
    content: string;
    filePath: string; // relative to data/
  }>,
) {
  const texts = batch.map((b) => b.content.replaceAll("\n", " "));

  const { embeddings, usage } = await embedMany({
    model: embeddingModel,
    values: texts,
    maxParallelCalls: 3,
  });

  console.log(
    `  Embedded ${batch.length} docs — ${usage.tokens} tokens used this batch`,
  );

  await db
    .insert(schema.serviceEmbedding)
    .values(
      batch.map((b, i) => ({
        cloudProvider: b.meta.cloud_provider,
        serviceCategory: b.meta.service_category,
        serviceName: b.meta.service_name,
        pricingModel: b.meta.pricing_model,
        managed: b.meta.managed,
        tier: b.meta.tier,
        content: b.content,
        filePath: b.filePath,
        embedding: embeddings[i],
      })),
    )
    .onConflictDoUpdate({
      target: schema.serviceEmbedding.filePath,
      set: {
        cloudProvider: schema.serviceEmbedding.cloudProvider,
        serviceCategory: schema.serviceEmbedding.serviceCategory,
        serviceName: schema.serviceEmbedding.serviceName,
        pricingModel: schema.serviceEmbedding.pricingModel,
        managed: schema.serviceEmbedding.managed,
        tier: schema.serviceEmbedding.tier,
        content: schema.serviceEmbedding.content,
        embedding: schema.serviceEmbedding.embedding,
      },
    });
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const dataDir = path.join(process.cwd(), "data");
  const files = discoverServiceFiles(dataDir);

  console.log(`Found ${files.length} service documents. Starting ingest...`);

  const docs: Array<{ meta: Frontmatter; content: string; filePath: string }> =
    [];

  let parseErrors = 0;
  for (const absPath of files) {
    const raw = fs.readFileSync(absPath, "utf-8");
    const relPath = path.relative(dataDir, absPath); // e.g. "aws/compute/fargate.md"
    try {
      const { meta, body } = parseFrontmatter(raw);
      // The text we embed is the full document: frontmatter values + body.
      // Including the provider, category and service name in the text gives
      // the embedding strong semantic grounding without extra chunking.
      const content = [
        `Provider: ${meta.cloud_provider}`,
        `Category: ${meta.service_category}`,
        `Service: ${meta.service_name}`,
        `Pricing: ${meta.pricing_model}`,
        `Managed: ${meta.managed}`,
        body,
      ].join("\n\n");

      docs.push({ meta, content, filePath: relPath });
    } catch (err) {
      console.warn(`  SKIP (parse error): ${relPath} — ${err}`);
      parseErrors++;
    }
  }

  console.log(
    `Parsed ${docs.length} docs (${parseErrors} skipped). Embedding in batches of ${BATCH_SIZE}...`,
  );

  let totalDone = 0;
  for (let i = 0; i < docs.length; i += BATCH_SIZE) {
    const batch = docs.slice(i, i + BATCH_SIZE);
    console.log(
      `\nBatch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(docs.length / BATCH_SIZE)}:`,
    );
    await processBatch(batch);
    totalDone += batch.length;
    console.log(`  Progress: ${totalDone}/${docs.length}`);
  }

  console.log(`\nDone! ${totalDone} service embeddings stored.`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Ingest failed:", err);
  process.exit(1);
});
