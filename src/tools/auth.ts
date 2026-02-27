import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { HIFlowApiClient } from "../api-client.js";

export function registerAuthTools(server: McpServer, api: HIFlowApiClient): void {
  server.tool(
    "auth_login",
    "Login to HIFlow API and issue JWT access token. Uses JWT for subsequent API calls.",
    {
      userId: z.string().optional().describe("HIFlow user id"),
      password: z.string().optional().describe("HIFlow password"),
    },
    async ({ userId, password }) => {
      try {
        const auth = await api.loginAndIssueJwt(userId, password);
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ userId: auth.userId, message: auth.message, tokenPreview: auth.tokenPreview, authMode: "JWT" }) }],
        };
      } catch (e: unknown) {
        return { content: [{ type: "text" as const, text: `Error: ${(e as Error).message}` }], isError: true };
      }
    },
  );

  server.tool(
    "auth_use_token",
    "Use an already-issued JWT access token without password login.",
    {
      accessToken: z.string().describe("JWT bearer access token"),
      userId: z.string().optional().describe("Optional user id label"),
    },
    async ({ accessToken, userId }) => {
      try {
        const auth = api.useAccessToken(accessToken, userId);
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ userId: auth.userId, message: auth.message, tokenPreview: auth.tokenPreview, authMode: "JWT_TOKEN" }) }],
        };
      } catch (e: unknown) {
        return { content: [{ type: "text" as const, text: `Error: ${(e as Error).message}` }], isError: true };
      }
    },
  );
}
