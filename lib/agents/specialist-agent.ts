import { InferAgentUIMessage, stepCountIs, ToolLoopAgent } from "ai";
import { makeModel, agentProviderOptions } from "./model";
import { retrieveTool, type CategorySlug } from "@/lib/tools/retrieve-tool";
import fs from "fs";
import path from "path";

// ─── Prompt templates ─────────────────────────────────────────────────────────

const SPECIALIST_TEMPLATE = fs.readFileSync(
  path.join(process.cwd(), "data", "prompts", "specialist.md"),
  "utf-8",
);

const GUIDANCE_DIR = path.join(
  process.cwd(),
  "data",
  "prompts",
  "specialist-guidance",
);

const PILLAR_SLUGS = [
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
] as const satisfies readonly CategorySlug[];

const PILLAR_GUIDANCE = Object.fromEntries(
  PILLAR_SLUGS.map((slug) => [
    slug,
    fs.readFileSync(path.join(GUIDANCE_DIR, `${slug}.md`), "utf-8").trim(),
  ]),
) as Record<CategorySlug, string>;

// ─── Shared output type ───────────────────────────────────────────────────────

/**
 * The combined output of a wave: a record from pillar slug to the specialist's
 * final UIMessage. The UI reads individual specialist states from this record
 * to drive progress rendering.
 */
export type WaveOutput = Partial<Record<CategorySlug, SpecialistAgentUIMessage>>;

// ─── Instructions builder ─────────────────────────────────────────────────────

function buildSpecialistInstructions(
  pillar: CategorySlug,
  wave: 1 | 2,
): string {
  const wave2Context =
    wave === 2
      ? `
## Wave 2 Context

You are a Wave 2 specialist. Your pillar (${pillar}) is structurally dependent on what Wave 1 chose. You will receive the full Wave 1 recommendations in your prompt. Read them carefully — your retrieval query and every decision you make must be grounded in the specific services Wave 1 already selected. Do NOT reason in a vacuum. Do NOT ignore the Wave 1 context.
`
      : "";

  return SPECIALIST_TEMPLATE.replace(/\{\{PILLAR\}\}/g, pillar)
    .replace("{{WAVE_CONTEXT}}", wave2Context)
    .replace("{{PILLAR_GUIDANCE}}", PILLAR_GUIDANCE[pillar]);
}

// ─── Specialist agent factory ─────────────────────────────────────────────────

export type SpecialistAgentUIMessage = InferAgentUIMessage<
  ReturnType<typeof createSpecialistAgent>
>;

export function createSpecialistAgent(pillar: CategorySlug, wave: 1 | 2) {
  return new ToolLoopAgent({
    model: makeModel(),
    providerOptions: agentProviderOptions,
    instructions: buildSpecialistInstructions(pillar, wave),
    tools: { retrieve: retrieveTool },
    // One retrieve call + one reasoning step = 3 steps max (input → tool → output)
    stopWhen: stepCountIs(3),
  });
}

// ─── Wave 1 specialists (pre-instantiated) ────────────────────────────────────

export const wave1Specialists = {
  compute: createSpecialistAgent("compute", 1),
  storage: createSpecialistAgent("storage", 1),
  database: createSpecialistAgent("database", 1),
  analytics: createSpecialistAgent("analytics", 1),
  ai_ml: createSpecialistAgent("ai_ml", 1),
  integration_messaging: createSpecialistAgent("integration_messaging", 1),
  migration_hybrid: createSpecialistAgent("migration_hybrid", 1),
  other: createSpecialistAgent("other", 1),
} as const;

export const WAVE1_PILLARS = Object.keys(wave1Specialists) as CategorySlug[];

// ─── Wave 2 specialists (pre-instantiated) ────────────────────────────────────

export const wave2Specialists = {
  networking: createSpecialistAgent("networking", 2),
  devops: createSpecialistAgent("devops", 2),
  security_identity: createSpecialistAgent("security_identity", 2),
} as const;

export const WAVE2_PILLARS = Object.keys(wave2Specialists) as CategorySlug[];
