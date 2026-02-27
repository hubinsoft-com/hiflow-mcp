import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { HIFlowApiClient } from "../api-client.js";

export function registerProjectTools(server: McpServer, api: HIFlowApiClient): void {
  server.tool(
    "project_list",
    "Get project simple list for the current user.",
    {},
    async () => {
      try {
        const list = await api.getSimpleProjects();
        const projects = list.filter((x) => x.id).map((x) => ({ id: x.id, name: x.name }));
        return { content: [{ type: "text" as const, text: JSON.stringify({ count: projects.length, projects }) }] };
      } catch (e: unknown) {
        return { content: [{ type: "text" as const, text: `Error: ${(e as Error).message}` }], isError: true };
      }
    },
  );

  server.tool(
    "project_select",
    "Set active project in server session by project id.",
    { projectId: z.string().describe("Project ID") },
    async ({ projectId }) => {
      try {
        const result = await api.selectProject(projectId);
        return { content: [{ type: "text" as const, text: JSON.stringify({ success: result.success, message: result.message, projectId }) }] };
      } catch (e: unknown) {
        return { content: [{ type: "text" as const, text: `Error: ${(e as Error).message}` }], isError: true };
      }
    },
  );
}
