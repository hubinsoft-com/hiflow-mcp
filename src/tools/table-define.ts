import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { HIFlowApiClient } from "../api-client.js";

export function registerTableDefineTools(server: McpServer, api: HIFlowApiClient): void {
  server.tool(
    "table_define_list",
    "Get table/DB design list for selected project. Returns id, title, dbType.",
    {},
    async () => {
      try {
        const items = await api.getTableDefineList();
        return { content: [{ type: "text" as const, text: JSON.stringify({ count: items.length, items }) }] };
      } catch (e: unknown) {
        return { content: [{ type: "text" as const, text: `Error: ${(e as Error).message}` }], isError: true };
      }
    },
  );

  server.tool(
    "table_define_get",
    "Get table definition detail by id. Returns full definition including DBML.",
    { id: z.string().describe("Table definition ID") },
    async ({ id }) => {
      try {
        const item = await api.getTableDefine(id);
        return { content: [{ type: "text" as const, text: item ? JSON.stringify(item) : "Table definition not found" }] };
      } catch (e: unknown) {
        return { content: [{ type: "text" as const, text: `Error: ${(e as Error).message}` }], isError: true };
      }
    },
  );

  server.tool(
    "table_define_save",
    "Create or update a table/DB definition.",
    {
      id: z.string().optional().describe("Table definition ID. Omit for new definition."),
      title: z.string().optional(),
      dbType: z.string().optional().describe("Database type (e.g. PostgreSQL, MySQL)"),
      dbml: z.string().optional().describe("DBML schema definition"),
    },
    async (args) => {
      try {
        const result = await api.saveTableDefine(args);
        return { content: [{ type: "text" as const, text: JSON.stringify({ success: result.success, message: result.message, id: result.id }) }] };
      } catch (e: unknown) {
        return { content: [{ type: "text" as const, text: `Error: ${(e as Error).message}` }], isError: true };
      }
    },
  );

  server.tool(
    "table_define_delete",
    "Delete a table definition (soft delete).",
    { id: z.string().describe("Table definition ID") },
    async ({ id }) => {
      try {
        const result = await api.deleteTableDefine(id);
        return { content: [{ type: "text" as const, text: JSON.stringify({ success: result.success, message: result.message }) }] };
      } catch (e: unknown) {
        return { content: [{ type: "text" as const, text: `Error: ${(e as Error).message}` }], isError: true };
      }
    },
  );
}
