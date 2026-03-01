import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { HIFlowApiClient } from "../api-client.js";

export function registerKbTools(server: McpServer, api: HIFlowApiClient): void {
  server.tool(
    "kb_list",
    "List available Knowledge Bases.",
    {},
    async () => {
      try {
        const items = await api.getKbList();
        return { content: [{ type: "text" as const, text: JSON.stringify(items) }] };
      } catch (e: unknown) {
        return { content: [{ type: "text" as const, text: `Error: ${(e as Error).message}` }], isError: true };
      }
    },
  );

  server.tool(
    "kb_query",
    "Query Knowledge Base with natural language. Automatically converts to SQL and returns results.",
    { query: z.string().describe("Natural language query") },
    async ({ query }) => {
      try {
        const result = await api.queryKb(query);
        const answer = result.data?.answer ?? JSON.stringify(result);
        return { content: [{ type: "text" as const, text: answer }] };
      } catch (e: unknown) {
        return { content: [{ type: "text" as const, text: `Error: ${(e as Error).message}` }], isError: true };
      }
    },
  );

  server.tool(
    "kb_info",
    "Get Knowledge Base schema and column information by KB id.",
    { kbId: z.string().describe("Knowledge Base ID") },
    async ({ kbId }) => {
      try {
        const info = await api.getKbInfo(kbId);
        return { content: [{ type: "text" as const, text: JSON.stringify(info) }] };
      } catch (e: unknown) {
        return { content: [{ type: "text" as const, text: `Error: ${(e as Error).message}` }], isError: true };
      }
    },
  );
}
