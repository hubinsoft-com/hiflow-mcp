import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { HIFlowApiClient } from "../api-client.js";

export function registerProcessDefineTools(server: McpServer, api: HIFlowApiClient): void {
  server.tool(
    "process_list",
    "Get process definition tree list for selected project.",
    {},
    async () => {
      try {
        const items = await api.getProcessList();
        return { content: [{ type: "text" as const, text: JSON.stringify({ count: items.length, items }) }] };
      } catch (e: unknown) {
        return { content: [{ type: "text" as const, text: `Error: ${(e as Error).message}` }], isError: true };
      }
    },
  );

  server.tool(
    "process_get",
    "Get process definition detail by id. Returns description, requirementsId, usingEntity.",
    { id: z.string().describe("Process definition ID") },
    async ({ id }) => {
      try {
        const item = await api.getProcess(id);
        return { content: [{ type: "text" as const, text: item ? JSON.stringify(item) : "Process not found" }] };
      } catch (e: unknown) {
        return { content: [{ type: "text" as const, text: `Error: ${(e as Error).message}` }], isError: true };
      }
    },
  );

  server.tool(
    "process_save",
    "Save process definition tree. Creates new items or updates existing ones.",
    {
      items: z.array(z.object({
        id: z.string(), parent_id: z.string(), title: z.string(),
        level: z.number().int(), order_index: z.number().int(),
      })).describe("Tree items array"),
    },
    async ({ items }) => {
      try {
        const result = await api.saveProcessTree(items);
        return { content: [{ type: "text" as const, text: JSON.stringify({ success: result.success, message: result.message }) }] };
      } catch (e: unknown) {
        return { content: [{ type: "text" as const, text: `Error: ${(e as Error).message}` }], isError: true };
      }
    },
  );

  server.tool(
    "process_save_detail",
    "Save process definition detail (description, requirementsId, usingEntity) with history tracking.",
    {
      id: z.string().describe("Process definition ID"),
      description: z.string().optional().describe("HTML description"),
      requirementsId: z.string().optional().describe("Related requirement IDs (JSON array string)"),
      usingEntity: z.string().optional().describe("Related table/entity names (JSON array string)"),
    },
    async (args) => {
      try {
        const result = await api.saveProcessDetail(args);
        return { content: [{ type: "text" as const, text: JSON.stringify({ success: result.success, message: result.message }) }] };
      } catch (e: unknown) {
        return { content: [{ type: "text" as const, text: `Error: ${(e as Error).message}` }], isError: true };
      }
    },
  );

  server.tool(
    "process_delete",
    "Delete a process definition (soft delete, cascades to children).",
    { id: z.string().describe("Process definition ID") },
    async ({ id }) => {
      try {
        const result = await api.deleteProcess(id);
        return { content: [{ type: "text" as const, text: JSON.stringify({ success: result.success, message: result.message }) }] };
      } catch (e: unknown) {
        return { content: [{ type: "text" as const, text: `Error: ${(e as Error).message}` }], isError: true };
      }
    },
  );

  server.tool(
    "process_convert_from_requirements",
    "Convert all requirements to process definitions. Replaces existing process definitions.",
    {},
    async () => {
      try {
        const result = await api.convertReqToProcess();
        return { content: [{ type: "text" as const, text: JSON.stringify({ success: result.success, message: result.message }) }] };
      } catch (e: unknown) {
        return { content: [{ type: "text" as const, text: `Error: ${(e as Error).message}` }], isError: true };
      }
    },
  );
}
