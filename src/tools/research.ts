import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { HIFlowApiClient } from "../api-client.js";

export function registerResearchTools(server: McpServer, api: HIFlowApiClient): void {
  server.tool(
    "research_info_list",
    "Get research note info (topic) list for selected project.",
    {},
    async () => {
      try {
        const items = await api.getResearchNoteInfoList();
        return { content: [{ type: "text" as const, text: JSON.stringify({ count: items.length, items }) }] };
      } catch (e: unknown) {
        return { content: [{ type: "text" as const, text: `Error: ${(e as Error).message}` }], isError: true };
      }
    },
  );

  server.tool(
    "research_list",
    "Get research notes list by info (topic) id.",
    { infoId: z.string().describe("Research info/topic ID") },
    async ({ infoId }) => {
      try {
        const items = await api.getResearchNoteList(infoId);
        return { content: [{ type: "text" as const, text: JSON.stringify({ count: items.length, items }) }] };
      } catch (e: unknown) {
        return { content: [{ type: "text" as const, text: `Error: ${(e as Error).message}` }], isError: true };
      }
    },
  );

  server.tool(
    "research_get",
    "Get research note detail by id.",
    { id: z.string().describe("Research note ID") },
    async ({ id }) => {
      try {
        const item = await api.getResearchNote(id);
        return { content: [{ type: "text" as const, text: item ? JSON.stringify(item) : "Research note not found" }] };
      } catch (e: unknown) {
        return { content: [{ type: "text" as const, text: `Error: ${(e as Error).message}` }], isError: true };
      }
    },
  );

  server.tool(
    "research_save",
    "Create or update a research note.",
    {
      id: z.string().optional().describe("Research note ID. Omit for new note."),
      infoId: z.string().optional().describe("Research info/topic ID"),
      title: z.string().optional(),
      content: z.string().optional().describe("Note content (HTML)"),
    },
    async (args) => {
      try {
        const result = await api.saveResearchNote(args);
        return { content: [{ type: "text" as const, text: JSON.stringify({ success: result.success, message: result.message, id: result.id }) }] };
      } catch (e: unknown) {
        return { content: [{ type: "text" as const, text: `Error: ${(e as Error).message}` }], isError: true };
      }
    },
  );

  server.tool(
    "research_delete",
    "Delete a research note (soft delete).",
    { id: z.string().describe("Research note ID") },
    async ({ id }) => {
      try {
        const result = await api.deleteResearchNote(id);
        return { content: [{ type: "text" as const, text: JSON.stringify({ success: result.success, message: result.message }) }] };
      } catch (e: unknown) {
        return { content: [{ type: "text" as const, text: `Error: ${(e as Error).message}` }], isError: true };
      }
    },
  );
}
