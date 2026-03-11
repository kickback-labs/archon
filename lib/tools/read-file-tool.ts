import { tool } from "ai";
import * as fs from "fs";
import * as path from "path";
import { z } from "zod";

const DATA_DIR = path.resolve(process.cwd(), "data");

function readSingleFile(filePath: string): { path: string; content: string } {
  // Security: ensure path stays within data/
  const normalized = path.normalize(filePath);
  if (!normalized.startsWith("data/") && normalized !== "data") {
    throw new Error(
      `Access denied: path must start with 'data/'. Got: '${filePath}'`
    );
  }

  const absolutePath = path.resolve(process.cwd(), normalized);

  // Double-check resolved path is within DATA_DIR
  if (!absolutePath.startsWith(DATA_DIR)) {
    throw new Error(`Access denied: path escapes data directory.`);
  }

  if (!fs.existsSync(absolutePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const content = fs.readFileSync(absolutePath, "utf-8");
  return { path: filePath, content };
}

export const readFilesTool = tool({
  description:
    "Read multiple files from the knowledge base in parallel. Use this to load all selected architectural pattern detail files at once (e.g. ['data/patterns/serverless-event-driven.md', 'data/patterns/saga.md']). All paths must start with 'data/'.",
  inputSchema: z.object({
    paths: z
      .array(z.string())
      .describe(
        "Array of relative file paths, e.g. ['data/patterns/serverless-event-driven.md', 'data/patterns/saga.md']"
      ),
  }),
  execute: async ({ paths }) => {
    const results = await Promise.all(
      paths.map((filePath) => Promise.resolve(readSingleFile(filePath)))
    );
    return results;
  },
});
