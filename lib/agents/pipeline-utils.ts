import fs from "fs";
import path from "path";

/**
 * Load a prompt template from data/prompts/<name>.md.
 * Called at module initialisation time (synchronous).
 */
export function loadPrompt(name: string): string {
  return fs.readFileSync(
    path.join(process.cwd(), "data", "prompts", `${name}.md`),
    "utf-8",
  );
}

/**
 * Load the diagram generation system prompt and inject the output directory path.
 */
export function loadDiagramPrompt(workspaceDir: string): string {
  return loadPrompt("diagram").replace(/\{\{WORKSPACE_DIR\}\}/g, workspaceDir);
}

/**
 * Extract plain text from an MCP tool's raw output.
 *
 * The @ai-sdk/mcp execute() return is the MCP CallToolResult:
 *   { content: [{ type: "text", text: "..." }, ...], isError?: bool }
 * toolResult.output may also be the SDK-transformed shape:
 *   { type: "content", value: [...] }  or  { type: "json", value: <raw> }
 */
export function extractTextFromOutput(output: unknown): string {
  if (!output || typeof output !== "object") return String(output ?? "");
  const o = output as Record<string, unknown>;

  // Raw MCP CallToolResult: { content: [...], isError?: bool }
  if (Array.isArray(o.content)) {
    return (o.content as unknown[])
      .filter(
        (item): item is { type: string; text: string } =>
          typeof item === "object" &&
          item !== null &&
          (item as Record<string, unknown>).type === "text" &&
          typeof (item as Record<string, unknown>).text === "string",
      )
      .map((item) => item.text)
      .join("\n");
  }

  // @ai-sdk/mcp transformed shape: { type: "content", value: [...] }
  if (o.type === "content" && Array.isArray(o.value)) {
    return (o.value as unknown[])
      .filter(
        (item): item is { type: string; text: string } =>
          typeof item === "object" &&
          item !== null &&
          (item as Record<string, unknown>).type === "text" &&
          typeof (item as Record<string, unknown>).text === "string",
      )
      .map((item) => item.text)
      .join("\n");
  }

  // { type: "json", value: <raw> }
  if (o.type === "json") return JSON.stringify(o.value);

  return JSON.stringify(o);
}

type Step = {
  toolCalls?: Array<{ toolName?: string; input?: unknown }>;
  toolResults?: Array<{ toolName?: string; output?: unknown }>;
};

/**
 * Walk the steps from a generateText result to extract the generate_diagram
 * tool call's Python code, the returned image path, and any error message.
 */
export function extractDiagramStepResults(steps: Step[]): {
  imagePath?: string;
  diagramCode?: string;
  lastGenerateError?: string;
} {
  let imagePath: string | undefined;
  let diagramCode: string | undefined;
  let lastGenerateError: string | undefined;

  for (const step of steps) {
    for (const call of step.toolCalls ?? []) {
      if (!("toolName" in call) || call.toolName !== "generate_diagram")
        continue;
      const inp = (call as { input?: unknown }).input as
        | Record<string, unknown>
        | undefined;
      if (inp && typeof inp.code === "string") diagramCode = inp.code;
    }

    for (const toolResult of step.toolResults ?? []) {
      if (
        !("toolName" in toolResult) ||
        toolResult.toolName !== "generate_diagram"
      )
        continue;
      const text = extractTextFromOutput(toolResult.output);
      const match = text.match(/PNG diagram:\s*(.+\.png)/i);
      if (match) {
        imagePath = match[1].trim();
      } else {
        lastGenerateError =
          text.replace(/^Error:\s*/i, "").trim() ||
          "generate_diagram returned no output";
      }
    }
  }

  return { imagePath, diagramCode, lastGenerateError };
}
