import { writeFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { HIFlowApiClient } from "../api-client.js";

export function registerSourceTools(server: McpServer, api: HIFlowApiClient): void {
  server.tool(
    "source_list",
    "List all Source Power Tool database connections in the selected project.",
    {},
    async () => {
      try {
        const items = await api.getSourceList();
        // Mask passwords
        const masked = items.map((item) => ({ ...item, dbPassword: "***" }));
        return { content: [{ type: "text" as const, text: JSON.stringify(masked) }] };
      } catch (e: unknown) {
        return { content: [{ type: "text" as const, text: `Error: ${(e as Error).message}` }], isError: true };
      }
    },
  );

  server.tool(
    "source_get",
    "Get details of a specific Source Power Tool connection by ID.",
    { id: z.string().describe("Source Power Tool connection ID") },
    async ({ id }) => {
      try {
        const item = await api.getSource(id);
        if (item) item.dbPassword = "***";
        return { content: [{ type: "text" as const, text: item ? JSON.stringify(item) : "Source connection not found" }] };
      } catch (e: unknown) {
        return { content: [{ type: "text" as const, text: `Error: ${(e as Error).message}` }], isError: true };
      }
    },
  );

  server.tool(
    "source_tables",
    "List all tables in the database connected by a Source Power Tool connection.",
    { id: z.string().describe("Source Power Tool connection ID") },
    async ({ id }) => {
      try {
        const tables = await api.getSourceTables(id);
        return { content: [{ type: "text" as const, text: JSON.stringify({ count: tables.length, tables }) }] };
      } catch (e: unknown) {
        return { content: [{ type: "text" as const, text: `Error: ${(e as Error).message}` }], isError: true };
      }
    },
  );

  server.tool(
    "source_table_schema",
    "Get detailed schema for a specific table including columns, types, primary keys, foreign keys, and comments.",
    {
      id: z.string().describe("Source Power Tool connection ID"),
      table: z.string().describe("Table name to inspect"),
    },
    async ({ id, table }) => {
      try {
        const schema = await api.getSourceTableSchema(id, table);
        return { content: [{ type: "text" as const, text: JSON.stringify(schema) }] };
      } catch (e: unknown) {
        return { content: [{ type: "text" as const, text: `Error: ${(e as Error).message}` }], isError: true };
      }
    },
  );

  server.tool(
    "source_generate",
    "Generate boilerplate source code for a specific table. Supports Java, ASP.NET Core, WPF, or user-defined template output.",
    {
      id: z.string().describe("Source Power Tool connection ID"),
      table: z.string().describe("Table name to generate code for"),
      outputType: z.string().optional().describe("Code generation target: Java, Aspnet, WPF_API, WPF_DB, WPF_JSON, Template. If omitted, uses connection's configured outputType."),
    },
    async ({ id, table, outputType }) => {
      try {
        const resolvedType = outputType || await api.resolveOutputType(id);
        const generated = await api.generateSource(id, table, resolvedType);

        const fileNameMap: Record<string, string[]> = {
          Java: ["Model.java", "Mapper.java", "Mapper.xml", "Controller.java", "list.jsp", "post.jsp", "onepage.jsp"],
          Aspnet: ["Controller.cs", "ApiController.cs", "Index.cshtml", "Post.cshtml", "OnePage.cshtml", "Model.cs"],
          WPF_API: ["ViewModel.cs", "List.xaml", "List.xaml.cs", "Write.xaml", "Write.xaml.cs"],
          WPF_DB: ["ViewModel.cs", "List.xaml", "List.xaml.cs", "Write.xaml", "Write.xaml.cs"],
          WPF_JSON: ["ViewModel.cs", "List.xaml", "List.xaml.cs", "Write.xaml", "Write.xaml.cs"],
        };

        let files: unknown;
        if (resolvedType === "Template") {
          files = generated;
        } else {
          const names = fileNameMap[resolvedType] ?? [];
          const sources = Array.isArray(generated) ? generated : [];
          files = sources.map((src: unknown, i: number) => ({
            name: i < names.length ? names[i] : `file_${i}`,
            source: src,
          }));
        }

        return { content: [{ type: "text" as const, text: JSON.stringify({ outputType: resolvedType, table, files }) }] };
      } catch (e: unknown) {
        return { content: [{ type: "text" as const, text: `Error: ${(e as Error).message}` }], isError: true };
      }
    },
  );

  server.tool(
    "source_generate_dbcontext",
    "Generate ASP.NET Core DbContext code for all tables in a Source Power Tool connection. Returns complete EF Core DbContext with DbSet definitions and OnModelCreating mappings.",
    { id: z.string().describe("Source Power Tool connection ID") },
    async ({ id }) => {
      try {
        const code = await api.generateSourceDbContext(id);
        return { content: [{ type: "text" as const, text: code }] };
      } catch (e: unknown) {
        return { content: [{ type: "text" as const, text: `Error: ${(e as Error).message}` }], isError: true };
      }
    },
  );

  server.tool(
    "source_generate_dbcontext_file",
    "Generate ASP.NET Core DbContext code and save it directly to a file. Creates parent directories automatically if they don't exist.",
    {
      id: z.string().describe("Source Power Tool connection ID"),
      filePath: z.string().describe("Absolute or relative file path to save the generated DbContext code"),
    },
    async ({ id, filePath }) => {
      try {
        const code = await api.generateSourceDbContext(id);
        await mkdir(dirname(filePath), { recursive: true });
        await writeFile(filePath, code, "utf-8");
        return { content: [{ type: "text" as const, text: `DbContext code saved to ${filePath}` }] };
      } catch (e: unknown) {
        return { content: [{ type: "text" as const, text: `Error: ${(e as Error).message}` }], isError: true };
      }
    },
  );

  server.tool(
    "source_template_list",
    "List all user-defined code generation templates in the selected project.",
    {},
    async () => {
      try {
        const templates = await api.getSourceTemplateList();
        return { content: [{ type: "text" as const, text: JSON.stringify(templates) }] };
      } catch (e: unknown) {
        return { content: [{ type: "text" as const, text: `Error: ${(e as Error).message}` }], isError: true };
      }
    },
  );

  server.tool(
    "source_template_get",
    "Get a specific template with its file definitions (detail list).",
    { id: z.string().describe("Template ID") },
    async ({ id }) => {
      try {
        const template = await api.getSourceTemplate(id);
        return { content: [{ type: "text" as const, text: JSON.stringify(template) }] };
      } catch (e: unknown) {
        return { content: [{ type: "text" as const, text: `Error: ${(e as Error).message}` }], isError: true };
      }
    },
  );
}
