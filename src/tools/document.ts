import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { HIFlowApiClient } from "../api-client.js";

export function registerDocumentTools(server: McpServer, api: HIFlowApiClient): void {
  server.tool(
    "document_export_markdown",
    "Export project development documents (requirements, process, GUI, code definitions) as a single Markdown document.",
    {},
    async () => {
      try {
        const markdown = await api.exportDocumentMarkdown();
        return { content: [{ type: "text" as const, text: markdown }] };
      } catch (e: unknown) {
        return { content: [{ type: "text" as const, text: `Error: ${(e as Error).message}` }], isError: true };
      }
    },
  );
}
