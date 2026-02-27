import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { HIFlowApiClient } from "../api-client.js";

export function registerUiuxTools(server: McpServer, api: HIFlowApiClient): void {
  server.tool(
    "uiux_list",
    "Get UI/UX design list for selected project.",
    {},
    async () => {
      try {
        const items = await api.getUiuxList();
        return { content: [{ type: "text" as const, text: JSON.stringify({ count: items.length, items }) }] };
      } catch (e: unknown) {
        return { content: [{ type: "text" as const, text: `Error: ${(e as Error).message}` }], isError: true };
      }
    },
  );

  server.tool(
    "uiux_get",
    "Get UI/UX design detail by id. Returns title, processId, content, html.",
    { id: z.string().describe("UI/UX design ID") },
    async ({ id }) => {
      try {
        const item = await api.getUiux(id);
        return { content: [{ type: "text" as const, text: item ? JSON.stringify(item) : "UI/UX design not found" }] };
      } catch (e: unknown) {
        return { content: [{ type: "text" as const, text: `Error: ${(e as Error).message}` }], isError: true };
      }
    },
  );

  server.tool(
    "uiux_save",
    "Create or update a UI/UX design.",
    {
      id: z.string().optional().describe("UI/UX ID. Omit for new design."),
      processId: z.string().optional().describe("Related process definition ID"),
      title: z.string().optional(),
      content: z.string().optional().describe("Design description (HTML)"),
      html: z.string().optional().describe("UI/UX HTML mockup"),
    },
    async (args) => {
      try {
        const result = await api.saveUiux(args);
        return { content: [{ type: "text" as const, text: JSON.stringify({ success: result.success, message: result.message, id: result.id }) }] };
      } catch (e: unknown) {
        return { content: [{ type: "text" as const, text: `Error: ${(e as Error).message}` }], isError: true };
      }
    },
  );

  server.tool(
    "uiux_delete",
    "Delete a UI/UX design (soft delete).",
    { id: z.string().describe("UI/UX design ID") },
    async ({ id }) => {
      try {
        const result = await api.deleteUiux(id);
        return { content: [{ type: "text" as const, text: JSON.stringify({ success: result.success, message: result.message }) }] };
      } catch (e: unknown) {
        return { content: [{ type: "text" as const, text: `Error: ${(e as Error).message}` }], isError: true };
      }
    },
  );
}
