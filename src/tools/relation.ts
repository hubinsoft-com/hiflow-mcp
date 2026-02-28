import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { HIFlowApiClient } from "../api-client.js";

export function registerRelationTools(server: McpServer, api: HIFlowApiClient): void {
  server.tool(
    "relation_export_markdown",
    "Export project traceability matrix (relation map) as Markdown. Shows linkages between requirements, process definitions, WBS tasks, UI/UX, tables, and tests.",
    {},
    async () => {
      try {
        const markdown = await api.exportRelationMarkdown();
        return { content: [{ type: "text" as const, text: markdown }] };
      } catch (e: unknown) {
        return { content: [{ type: "text" as const, text: `Error: ${(e as Error).message}` }], isError: true };
      }
    },
  );
}
