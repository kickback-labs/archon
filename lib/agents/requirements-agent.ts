import { InferAgentUIMessage, stepCountIs, ToolLoopAgent } from "ai";
import { makeModel, agentProviderOptions } from "./model";
import fs from "fs";
import path from "path";

const instructions = fs.readFileSync(
  path.join(process.cwd(), "data", "prompts", "requirements.md"),
  "utf-8",
);

export const requirementsAgent = new ToolLoopAgent({
  model: makeModel(),
  providerOptions: agentProviderOptions,
  instructions,
  tools: {},
  stopWhen: stepCountIs(2),
});

export type RequirementsAgentUIMessage = InferAgentUIMessage<
  typeof requirementsAgent
>;
