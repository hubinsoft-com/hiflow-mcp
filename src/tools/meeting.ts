import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { HIFlowApiClient } from "../api-client.js";

export function registerMeetingTools(server: McpServer, api: HIFlowApiClient): void {
  server.tool(
    "meeting_list",
    "Get meeting minutes list for selected project.",
    {},
    async () => {
      try {
        const items = await api.getMeetingList();
        return { content: [{ type: "text" as const, text: JSON.stringify({ count: items.length, items }) }] };
      } catch (e: unknown) {
        return { content: [{ type: "text" as const, text: `Error: ${(e as Error).message}` }], isError: true };
      }
    },
  );

  server.tool(
    "meeting_get",
    "Get meeting minutes detail by id. Returns title, meetingDate, location, attendees, content, conclusion.",
    { id: z.string().describe("Meeting minutes ID") },
    async ({ id }) => {
      try {
        const item = await api.getMeeting(id);
        return { content: [{ type: "text" as const, text: item ? JSON.stringify(item) : "Meeting not found" }] };
      } catch (e: unknown) {
        return { content: [{ type: "text" as const, text: `Error: ${(e as Error).message}` }], isError: true };
      }
    },
  );

  server.tool(
    "meeting_save",
    "Create or update meeting minutes.",
    {
      id: z.string().optional().describe("Meeting ID. Omit for new meeting."),
      title: z.string().optional(),
      meetingDate: z.string().optional().describe("yyyy-MM-dd"),
      location: z.string().optional(),
      attendees: z.string().optional().describe("Comma-separated attendee names or IDs"),
      content: z.string().optional().describe("Meeting content (HTML)"),
      conclusion: z.string().optional().describe("Meeting conclusion (HTML)"),
    },
    async (args) => {
      try {
        const result = await api.saveMeeting(args);
        return { content: [{ type: "text" as const, text: JSON.stringify({ success: result.success, message: result.message, id: result.id }) }] };
      } catch (e: unknown) {
        return { content: [{ type: "text" as const, text: `Error: ${(e as Error).message}` }], isError: true };
      }
    },
  );

  server.tool(
    "meeting_delete",
    "Delete meeting minutes (soft delete).",
    { id: z.string().describe("Meeting minutes ID") },
    async ({ id }) => {
      try {
        const result = await api.deleteMeeting(id);
        return { content: [{ type: "text" as const, text: JSON.stringify({ success: result.success, message: result.message }) }] };
      } catch (e: unknown) {
        return { content: [{ type: "text" as const, text: `Error: ${(e as Error).message}` }], isError: true };
      }
    },
  );

  server.tool(
    "meeting_archive",
    "Archive meeting minutes.",
    { id: z.string().describe("Meeting minutes ID") },
    async ({ id }) => {
      try {
        const result = await api.archiveMeeting(id);
        return { content: [{ type: "text" as const, text: JSON.stringify({ success: result.success, message: result.message }) }] };
      } catch (e: unknown) {
        return { content: [{ type: "text" as const, text: `Error: ${(e as Error).message}` }], isError: true };
      }
    },
  );
}
