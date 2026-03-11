import { NextRequest, NextResponse } from "next/server";
import { readFile, mkdir } from "fs/promises";
import path from "path";
import os from "os";

/**
 * GET /api/diagrams/[...path]
 *
 * Serves PNG diagram files from the filesystem.
 * The full absolute path is encoded in the URL segments joined by "/".
 *
 * Example:
 *   imagePath = "/tmp/archon-diagrams/generated-diagrams/diagram_abc123.png"
 *   URL       = /api/diagrams/tmp/archon-diagrams/generated-diagrams/diagram_abc123.png
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path: segments } = await params;

  // Reconstruct the absolute path from URL segments.
  const absolutePath = "/" + segments.join("/");
  const resolved = path.resolve(absolutePath);

  // Path traversal guard: allow files under DIAGRAM_OUTPUT_DIR or under the
  // system temp dir (the MCP server falls back to /tmp/generated-diagrams if
  // the workspace_dir doesn't exist yet).
  const configuredBase = process.env.DIAGRAM_OUTPUT_DIR ?? "/tmp/archon-diagrams";
  const tmpBase = os.tmpdir(); // typically /tmp

  if (!resolved.startsWith(configuredBase) && !resolved.startsWith(tmpBase)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  // Ensure the configured output directory exists for future requests.
  await mkdir(configuredBase, { recursive: true }).catch(() => {});

  try {
    const data = await readFile(resolved);
    return new NextResponse(data, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400, immutable",
      },
    });
  } catch {
    return new NextResponse("Not Found", { status: 404 });
  }
}
