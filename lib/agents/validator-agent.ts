import { InferAgentUIMessage, stepCountIs, ToolLoopAgent } from "ai";
import { makeModel, agentProviderOptions } from "./model";
import fs from "fs";
import path from "path";

const WELL_ARCHITECTED = fs.readFileSync(
  path.join(process.cwd(), "data", "WELL_ARCHITECTED.md"),
  "utf-8",
);

const instructions = fs
  .readFileSync(
    path.join(process.cwd(), "data", "prompts", "validator.md"),
    "utf-8",
  )
  .replace("{{WELL_ARCHITECTED}}", WELL_ARCHITECTED);

export const validatorAgent = new ToolLoopAgent({
  model: makeModel(),
  providerOptions: agentProviderOptions,
  instructions,
  tools: {},
  stopWhen: stepCountIs(2),
});

export type ValidatorAgentUIMessage = InferAgentUIMessage<
  typeof validatorAgent
>;
