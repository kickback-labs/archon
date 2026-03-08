import { tool } from "ai";
import * as fs from "fs";
import * as path from "path";
import { z } from "zod";

const DATA_DIR = path.resolve(process.cwd(), "data");

export const readFileTool = tool({
  description:
    "Read a file from the knowledge base. Use this to load architectural pattern detail files (e.g. data/patterns/serverless-event-driven.md). The path must start with 'data/'.",
  inputSchema: z.object({
    path: z
      .string()
      .describe(
        "Relative path to the file, e.g. 'data/patterns/serverless-event-driven.md'"
      ),
  }),
  execute: async ({ path: filePath }) => {
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
  },
});
