import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { HIFlowApiClient } from "../api-client.js";

export function registerRequirementsTools(server: McpServer, api: HIFlowApiClient): void {
  server.tool(
    "requirements_list",
    "Get requirements tree list for selected project. Returns id, parentId, title, level, category, define, mandatoryYn, orderIndex.",
    {},
    async () => {
      try {
        const items = await api.getRequirementsList();
        return { content: [{ type: "text" as const, text: JSON.stringify({ count: items.length, items }) }] };
      } catch (e: unknown) {
        return { content: [{ type: "text" as const, text: `Error: ${(e as Error).message}` }], isError: true };
      }
    },
  );

  server.tool(
    "requirements_get",
    "Get requirement detail by id. Returns full detail including define, reason, detail (HTML), relId.",
    { id: z.string().describe("Requirement ID") },
    async ({ id }) => {
      try {
        const item = await api.getRequirements(id);
        return { content: [{ type: "text" as const, text: item ? JSON.stringify(item) : "Requirement not found" }] };
      } catch (e: unknown) {
        return { content: [{ type: "text" as const, text: `Error: ${(e as Error).message}` }], isError: true };
      }
    },
  );

  server.tool(
    "requirements_save",
    "Save requirements tree. Creates new items or updates existing ones (id, parent_id, title, level, order_index).",
    {
      items: z.array(z.object({
        id: z.string(), parent_id: z.string(), title: z.string(),
        level: z.number().int(), order_index: z.number().int(),
      })).describe("Tree items array"),
    },
    async ({ items }) => {
      try {
        const result = await api.saveRequirementsTree(items);
        return { content: [{ type: "text" as const, text: JSON.stringify({ success: result.success, message: result.message }) }] };
      } catch (e: unknown) {
        return { content: [{ type: "text" as const, text: `Error: ${(e as Error).message}` }], isError: true };
      }
    },
  );

  server.tool(
    "requirements_save_detail",
    "Save requirement detail (category, define, reason, relId, detail, mandatoryYn) with history tracking.",
    {
      id: z.string().describe("Requirement ID"),
      mandatoryYn: z.string().optional().describe("Y or N"),
      category: z.string().optional(),
      define: z.string().optional(),
      reason: z.string().optional(),
      relId: z.string().optional(),
      detail: z.string().optional().describe("HTML content"),
    },
    async (args) => {
      try {
        const result = await api.saveRequirementsDetail(args);
        return { content: [{ type: "text" as const, text: JSON.stringify({ success: result.success, message: result.message }) }] };
      } catch (e: unknown) {
        return { content: [{ type: "text" as const, text: `Error: ${(e as Error).message}` }], isError: true };
      }
    },
  );

  server.tool(
    "requirements_delete",
    "Delete a requirement (soft delete).",
    { id: z.string().describe("Requirement ID") },
    async ({ id }) => {
      try {
        const result = await api.deleteRequirements(id);
        return { content: [{ type: "text" as const, text: JSON.stringify({ success: result.success, message: result.message }) }] };
      } catch (e: unknown) {
        return { content: [{ type: "text" as const, text: `Error: ${(e as Error).message}` }], isError: true };
      }
    },
  );

  server.tool(
    "requirements_export_markdown",
    "Export all requirements as a Markdown document.",
    {},
    async () => {
      try {
        const markdown = await api.exportRequirementsMarkdown();
        return { content: [{ type: "text" as const, text: markdown }] };
      } catch (e: unknown) {
        return { content: [{ type: "text" as const, text: `Error: ${(e as Error).message}` }], isError: true };
      }
    },
  );

  server.tool(
    "requirements_snapshot_create",
    "Create a new requirements snapshot for version tracking.",
    {},
    async () => {
      try {
        const result = await api.createRequirementsSnapshot();
        return { content: [{ type: "text" as const, text: JSON.stringify({ success: result.success, message: result.message }) }] };
      } catch (e: unknown) {
        return { content: [{ type: "text" as const, text: `Error: ${(e as Error).message}` }], isError: true };
      }
    },
  );

  server.tool(
    "requirements_snapshot_list",
    "Get requirements snapshot by version number.",
    { version: z.number().int().describe("Snapshot version index") },
    async ({ version }) => {
      try {
        const items = await api.getRequirementsSnapshotList(version);
        return { content: [{ type: "text" as const, text: JSON.stringify({ count: items.length, version, items }) }] };
      } catch (e: unknown) {
        return { content: [{ type: "text" as const, text: `Error: ${(e as Error).message}` }], isError: true };
      }
    },
  );
}
