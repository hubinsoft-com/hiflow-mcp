import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { HIFlowApiClient } from "../api-client.js";

export function registerTodoTools(server: McpServer, api: HIFlowApiClient): void {
  server.tool(
    "todo_list",
    "Get todo list for current selected project. status: All/NotStarted/InProgress/Completed",
    { status: z.string().optional().describe("All | NotStarted | InProgress | Completed") },
    async ({ status }) => {
      try {
        const items = await api.getTodos(status ?? "All");
        return { content: [{ type: "text" as const, text: JSON.stringify({ count: items.length, status: status ?? "All", todos: items }) }] };
      } catch (e: unknown) {
        return { content: [{ type: "text" as const, text: `Error: ${(e as Error).message}` }], isError: true };
      }
    },
  );

  server.tool(
    "todo_today",
    "Get today's todo list for current user in the selected project.",
    {},
    async () => {
      try {
        const items = await api.getTodayTodos();
        return { content: [{ type: "text" as const, text: JSON.stringify({ count: items.length, todos: items }) }] };
      } catch (e: unknown) {
        return { content: [{ type: "text" as const, text: `Error: ${(e as Error).message}` }], isError: true };
      }
    },
  );

  server.tool(
    "todo_upsert",
    "Create or update a todo. If id is omitted, creates a new todo.",
    {
      id: z.string().optional(),
      wbsId: z.string().optional(),
      title: z.string().optional(),
      startDate: z.string().optional().describe("yyyy-MM-dd"),
      endDate: z.string().optional().describe("yyyy-MM-dd"),
      memo: z.string().optional(),
      assignId: z.string().optional(),
      tag: z.string().optional(),
      priority: z.number().int().optional(),
      category: z.string().optional(),
    },
    async (args) => {
      try {
        if (!args.title && !args.id) {
          return { content: [{ type: "text" as const, text: "Error: title is required when id is not provided." }], isError: true };
        }
        const result = await api.upsertTodo(args);
        return { content: [{ type: "text" as const, text: JSON.stringify({ success: result.success, message: result.message }) }] };
      } catch (e: unknown) {
        return { content: [{ type: "text" as const, text: `Error: ${(e as Error).message}` }], isError: true };
      }
    },
  );

  server.tool(
    "todo_complete",
    "Mark todo complete or incomplete.",
    {
      id: z.string().describe("Todo ID"),
      completeYn: z.string().describe("Y or N"),
    },
    async ({ id, completeYn }) => {
      try {
        const yn = completeYn.toUpperCase();
        if (yn !== "Y" && yn !== "N") {
          return { content: [{ type: "text" as const, text: "Error: completeYn must be 'Y' or 'N'" }], isError: true };
        }
        const result = await api.completeTodo(id, yn);
        return { content: [{ type: "text" as const, text: JSON.stringify({ success: result.success, message: result.message, id, completeYn: yn }) }] };
      } catch (e: unknown) {
        return { content: [{ type: "text" as const, text: `Error: ${(e as Error).message}` }], isError: true };
      }
    },
  );
}
