#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { loadConfig } from "./config.js";
import { HIFlowApiClient } from "./api-client.js";
import { registerAuthTools } from "./tools/auth.js";
import { registerProjectTools } from "./tools/project.js";
import { registerTodoTools } from "./tools/todo.js";
import { registerWbsTools } from "./tools/wbs.js";
import { registerRequirementsTools } from "./tools/requirements.js";
import { registerProcessDefineTools } from "./tools/process-define.js";
import { registerMeetingTools } from "./tools/meeting.js";
import { registerResearchTools } from "./tools/research.js";
import { registerUiuxTools } from "./tools/uiux.js";
import { registerTableDefineTools } from "./tools/table-define.js";

async function main(): Promise<void> {
  const config = loadConfig();
  const apiClient = new HIFlowApiClient(config);

  const server = new McpServer({
    name: "hiflow-mcp",
    version: "0.1.0",
  });

  // Register all tool groups
  registerAuthTools(server, apiClient);
  registerProjectTools(server, apiClient);
  registerTodoTools(server, apiClient);
  registerWbsTools(server, apiClient);
  registerRequirementsTools(server, apiClient);
  registerProcessDefineTools(server, apiClient);
  registerMeetingTools(server, apiClient);
  registerResearchTools(server, apiClient);
  registerUiuxTools(server, apiClient);
  registerTableDefineTools(server, apiClient);

  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error("hiflow-mcp server started on stdio");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
