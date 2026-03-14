import {
  openai,
  type OpenAILanguageModelResponsesOptions,
} from "@ai-sdk/openai";
import { devToolsMiddleware } from "@ai-sdk/devtools";
import { wrapLanguageModel, type LanguageModel } from "ai";

export const MODEL_ID = "gpt-5.1";

export const REASONING_EFFORT: OpenAILanguageModelResponsesOptions["reasoningEffort"] =
  "none";

export const agentProviderOptions = {
  openai: {
    reasoningEffort: REASONING_EFFORT,
    textVerbosity: "low",
  } satisfies OpenAILanguageModelResponsesOptions,
};

export function makeModel(): LanguageModel {
  const base = openai(MODEL_ID);

  return process.env.NODE_ENV === "development"
    ? wrapLanguageModel({ model: base, middleware: devToolsMiddleware() })
    : base;
}
