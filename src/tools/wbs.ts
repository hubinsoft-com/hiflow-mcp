import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { HIFlowApiClient } from "../api-client.js";

export function registerWbsTools(server: McpServer, api: HIFlowApiClient): void {
  server.tool(
    "wbs_list",
    "Get WBS list for selected project.",
    { withAddItems: z.boolean().optional().describe("default true; calls /api/Wbs/ListWithAddItems") },
    async ({ withAddItems }) => {
      try {
        const items = await api.getWbsList(withAddItems ?? true);
        return { content: [{ type: "text" as const, text: JSON.stringify({ count: items.length, items }) }] };
      } catch (e: unknown) {
        return { content: [{ type: "text" as const, text: `Error: ${(e as Error).message}` }], isError: true };
      }
    },
  );

  server.tool(
    "wbs_get",
    "Get single WBS by id.",
    { id: z.string().describe("WBS item ID") },
    async ({ id }) => {
      try {
        const item = await api.getWbs(id);
        return { content: [{ type: "text" as const, text: item ? JSON.stringify(item) : "WBS item not found" }] };
      } catch (e: unknown) {
        return { content: [{ type: "text" as const, text: `Error: ${(e as Error).message}` }], isError: true };
      }
    },
  );

  server.tool(
    "wbs_add",
    "Add a single WBS task/item to the selected project. Use parentId to create a sub-task under an existing WBS item.",
    {
      parentId: z.string().optional().describe("Parent WBS item ID. Omit for top-level item."),
      title: z.string().describe("WBS item title"),
      startDate: z.string().optional().describe("yyyy-MM-dd"),
      endDate: z.string().optional().describe("yyyy-MM-dd"),
      memo: z.string().optional().describe("Optional memo"),
      resource: z.string().optional().describe("Optional resource assignment"),
    },
    async (args) => {
      try {
        const result = await api.addWbsItem(args);
        return { content: [{ type: "text" as const, text: JSON.stringify({ success: result.success, message: result.message, id: result.id }) }] };
      } catch (e: unknown) {
        return { content: [{ type: "text" as const, text: `Error: ${(e as Error).message}` }], isError: true };
      }
    },
  );

  server.tool(
    "wbs_update",
    "Update WBS detail via POST /api/Wbs/{id}.",
    {
      id: z.string().describe("WBS item ID"),
      startDate: z.string().describe("yyyy-MM-dd"),
      endDate: z.string().describe("yyyy-MM-dd"),
      processId: z.string().optional(),
      resource: z.string().optional(),
      memo: z.string().optional(),
      addItems: z.array(z.object({ id: z.string().optional(), val: z.string().optional() })).optional().describe("Optional [{id,val}] list"),
    },
    async ({ id, startDate, endDate, processId, resource, memo, addItems }) => {
      try {
        const result = await api.updateWbs(id, { startDate, endDate, processId, resource, memo, addItems });
        return { content: [{ type: "text" as const, text: JSON.stringify({ success: result.success, message: result.message }) }] };
      } catch (e: unknown) {
        return { content: [{ type: "text" as const, text: `Error: ${(e as Error).message}` }], isError: true };
      }
    },
  );

  server.tool(
    "wbs_delete",
    "Delete WBS item (soft delete) via DELETE /api/Wbs/{id}.",
    { id: z.string().describe("WBS item ID") },
    async ({ id }) => {
      try {
        const result = await api.deleteWbs(id);
        return { content: [{ type: "text" as const, text: JSON.stringify({ success: result.success, message: result.message }) }] };
      } catch (e: unknown) {
        return { content: [{ type: "text" as const, text: `Error: ${(e as Error).message}` }], isError: true };
      }
    },
  );

  server.tool(
    "wbs_save_tree",
    "Save WBS tree items via POST /api/Wbs.",
    {
      items: z.array(z.object({
        id: z.string(), parent_id: z.string(), title: z.string(),
        level: z.number().int(), start_date: z.string(), end_date: z.string(), order_index: z.number().int(),
      })).describe("Tree items array"),
    },
    async ({ items }) => {
      try {
        const result = await api.saveWbsTree(items);
        return { content: [{ type: "text" as const, text: JSON.stringify({ success: result.success, message: result.message }) }] };
      } catch (e: unknown) {
        return { content: [{ type: "text" as const, text: `Error: ${(e as Error).message}` }], isError: true };
      }
    },
  );

  server.tool(
    "wbs_today_tasks",
    "Get today's WBS tasks across company projects.",
    {},
    async () => {
      try {
        const items = await api.getWbsTodayTasks();
        return { content: [{ type: "text" as const, text: JSON.stringify({ count: items.length, tasks: items }) }] };
      } catch (e: unknown) {
        return { content: [{ type: "text" as const, text: `Error: ${(e as Error).message}` }], isError: true };
      }
    },
  );

  server.tool(
    "wbs_past_tasks",
    "Get delayed or past WBS tasks across company projects.",
    {},
    async () => {
      try {
        const items = await api.getWbsPastTasks();
        return { content: [{ type: "text" as const, text: JSON.stringify({ count: items.length, tasks: items }) }] };
      } catch (e: unknown) {
        return { content: [{ type: "text" as const, text: `Error: ${(e as Error).message}` }], isError: true };
      }
    },
  );

  server.tool(
    "wbs_milestones",
    "Get project milestone WBS items (top-level).",
    {},
    async () => {
      try {
        const items = await api.getWbsMilestones();
        return { content: [{ type: "text" as const, text: JSON.stringify({ count: items.length, milestones: items }) }] };
      } catch (e: unknown) {
        return { content: [{ type: "text" as const, text: `Error: ${(e as Error).message}` }], isError: true };
      }
    },
  );

  server.tool(
    "wbs_snapshot_create",
    "Create new WBS snapshot for selected project.",
    {},
    async () => {
      try {
        const result = await api.createWbsSnapshot();
        return { content: [{ type: "text" as const, text: JSON.stringify({ success: result.success, message: result.message }) }] };
      } catch (e: unknown) {
        return { content: [{ type: "text" as const, text: `Error: ${(e as Error).message}` }], isError: true };
      }
    },
  );

  server.tool(
    "wbs_snapshot_idx",
    "Get available WBS snapshot versions.",
    {},
    async () => {
      try {
        const versions = await api.getWbsSnapshotIdx();
        return { content: [{ type: "text" as const, text: JSON.stringify({ count: versions.length, versions }) }] };
      } catch (e: unknown) {
        return { content: [{ type: "text" as const, text: `Error: ${(e as Error).message}` }], isError: true };
      }
    },
  );

  server.tool(
    "wbs_snapshot_list",
    "Get WBS snapshot list by version.",
    { version: z.number().int().describe("Snapshot version number") },
    async ({ version }) => {
      try {
        const items = await api.getWbsSnapshotList(version);
        return { content: [{ type: "text" as const, text: JSON.stringify({ version, count: items.length, items }) }] };
      } catch (e: unknown) {
        return { content: [{ type: "text" as const, text: `Error: ${(e as Error).message}` }], isError: true };
      }
    },
  );

  server.tool(
    "wbs_snapshot_get",
    "Get WBS snapshot item by id and version.",
    {
      id: z.string().describe("WBS item ID"),
      version: z.number().int().describe("Snapshot version number"),
    },
    async ({ id, version }) => {
      try {
        const item = await api.getWbsSnapshotInfo(id, version);
        return { content: [{ type: "text" as const, text: item ? JSON.stringify(item) : "Snapshot item not found" }] };
      } catch (e: unknown) {
        return { content: [{ type: "text" as const, text: `Error: ${(e as Error).message}` }], isError: true };
      }
    },
  );

  server.tool(
    "wbs_export_markdown",
    "Export WBS as a Markdown document with hierarchical tree structure.",
    {},
    async () => {
      try {
        const markdown = await api.exportWbsMarkdown();
        return { content: [{ type: "text" as const, text: markdown }] };
      } catch (e: unknown) {
        return { content: [{ type: "text" as const, text: `Error: ${(e as Error).message}` }], isError: true };
      }
    },
  );
}
