import { createMCPClient } from "@ai-sdk/mcp";

/**
 * Creates and returns a connected MCP client for the infrastructure diagram server.
 * Caller is responsible for calling client.close() when done.
 */
export async function createDiagramMCPClient() {
  const url = process.env.MCP_SERVER_URL ?? "http://localhost:8000/mcp";

  const client = await createMCPClient({
    name: "archon-diagram-client",
    transport: {
      type: "http",
      url,
    },
  });

  return client;
}
