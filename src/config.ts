export interface AppConfig {
  baseUrl: string;
  defaultUserId?: string;
  defaultPassword?: string;
  timeoutMs: number;
}

export function loadConfig(): AppConfig {
  return {
    baseUrl: (process.env.HIFLOW_API_BASE_URL ?? "https://app.hubinflow.ai:2825").replace(/\/+$/, ""),
    defaultUserId: process.env.HIFLOW_MCP_USER,
    defaultPassword: process.env.HIFLOW_MCP_PASS,
    timeoutMs: parseInt(process.env.HIFLOW_API_TIMEOUT ?? "15000", 10),
  };
}
