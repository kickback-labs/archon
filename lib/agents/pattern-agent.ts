import { InferAgentUIMessage, stepCountIs, ToolLoopAgent } from "ai";
import { makeModel, agentProviderOptions } from "./model";
import { readFilesTool } from "@/lib/tools/read-file-tool";
import fs from "fs";
import path from "path";

const PATTERNS_CONTEXT = fs.readFileSync(
  path.join(process.cwd(), "data", "PATTERNS_CONTEXT.md"),
  "utf-8",
);

const instructions = fs
  .readFileSync(
    path.join(process.cwd(), "data", "prompts", "pattern.md"),
    "utf-8",
  )
  .replace("{{PATTERNS_CONTEXT}}", PATTERNS_CONTEXT);

export const patternAgent = new ToolLoopAgent({
  model: makeModel(),
  providerOptions: agentProviderOptions,
  instructions,
  tools: {
    read_files: readFilesTool,
  },
  stopWhen: stepCountIs(3),
});

export type PatternAgentUIMessage = InferAgentUIMessage<typeof patternAgent>;
