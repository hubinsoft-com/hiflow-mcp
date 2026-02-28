import type { AppConfig } from "./config.js";
import type {
  ApiResponse,
  AuthResult,
  ProjectDto,
  TodoDto,
  TodoUpsertRequest,
  WbsDto,
  WbsTaskSummaryDto,
  WbsAddItemRequest,
  WbsTreeItemRequest,
  WbsUpdateRequest,
  RequirementsDto,
  RequirementsDetailSaveRequest,
  ProcessDefineDto,
  ProcessDefineDetailSaveRequest,
  MeetingMinutesDto,
  ResearchNoteDto,
  ResearchNoteInfoDto,
  UiuxDto,
  TableDefineDto,
  TreeItem,
  SnapshotDto,
} from "./types.js";

export class HIFlowApiClient {
  private readonly config: AppConfig;
  private accessToken?: string;
  private currentUserId?: string;
  private selectedProjectId?: string;
  private readonly cookies: Map<string, string> = new Map();

  get isProjectSelected(): boolean {
    return !!this.selectedProjectId;
  }

  constructor(config: AppConfig) {
    this.config = config;
  }

  // ──────────────────────── Auth ────────────────────────

  async loginAndIssueJwt(userId?: string, password?: string): Promise<AuthResult> {
    userId ??= this.config.defaultUserId;
    password ??= this.config.defaultPassword;

    if (!userId || !password) {
      throw new Error("Missing credentials. Provide userId/password or set HIFLOW_MCP_USER/HIFLOW_MCP_PASS.");
    }

    const resp = await this.rawPost("/api/Account/Login", { UserId: userId, Password: password }, false);
    const body: ApiResponse = await resp.json() as ApiResponse;

    if (!body.success) {
      throw new Error(`Login failed: ${body.message ?? "unknown error"}`);
    }
    if (!body.accessToken) {
      throw new Error("Login succeeded but no accessToken returned.");
    }

    this.accessToken = body.accessToken;
    this.currentUserId = userId;

    return {
      userId,
      tokenPreview: this.accessToken.length > 18 ? this.accessToken.slice(0, 18) + "..." : this.accessToken,
      message: "JWT issued successfully",
    };
  }

  useAccessToken(accessToken: string, userId?: string): AuthResult {
    if (!accessToken.trim()) {
      throw new Error("accessToken is required.");
    }
    this.accessToken = accessToken.trim();
    this.currentUserId = userId?.trim() || "token-user";

    return {
      userId: this.currentUserId,
      tokenPreview: this.accessToken.length > 18 ? this.accessToken.slice(0, 18) + "..." : this.accessToken,
      message: "JWT access token applied",
    };
  }

  // ──────────────────────── Project ────────────────────────

  async getSimpleProjects(): Promise<ProjectDto[]> {
    await this.ensureAuthenticated();
    return this.jwtGet<ProjectDto[]>("/api/Project/SimpleList");
  }

  async selectProject(projectId: string): Promise<ApiResponse> {
    await this.ensureAuthenticated();
    const result = await this.jwtGet<ApiResponse>(`/api/Project/projectId/${encodeURIComponent(projectId)}`);
    if (result.success) {
      this.selectedProjectId = projectId;
    }
    return result;
  }

  // ──────────────────────── Todo ────────────────────────

  async getTodos(status: string): Promise<TodoDto[]> {
    await this.ensureAuthenticated();
    this.ensureProjectSelected();
    return this.jwtGet<TodoDto[]>(`/api/Todo?status=${encodeURIComponent(status || "All")}`);
  }

  async getTodayTodos(): Promise<TodoDto[]> {
    await this.ensureAuthenticated();
    this.ensureProjectSelected();
    return this.jwtGet<TodoDto[]>("/api/Todo/MyToday");
  }

  async upsertTodo(data: TodoUpsertRequest): Promise<ApiResponse> {
    await this.ensureAuthenticated();
    this.ensureProjectSelected();
    return this.jwtPost<ApiResponse>("/api/Todo", data);
  }

  async completeTodo(id: string, completeYn: string): Promise<ApiResponse> {
    await this.ensureAuthenticated();
    this.ensureProjectSelected();
    return this.jwtPost<ApiResponse>(`/api/Todo/Complete/${encodeURIComponent(id)}`, { Id: id, CompleteYn: completeYn });
  }

  // ──────────────────────── WBS ────────────────────────

  async getWbsList(withAddItems: boolean): Promise<WbsDto[]> {
    await this.ensureAuthenticated();
    this.ensureProjectSelected();
    const endpoint = withAddItems ? "/api/Wbs/ListWithAddItems" : "/api/Wbs";
    return this.jwtGet<WbsDto[]>(endpoint);
  }

  async getWbs(id: string): Promise<WbsDto | null> {
    await this.ensureAuthenticated();
    this.ensureProjectSelected();
    return this.jwtGet<WbsDto | null>(`/api/Wbs/${encodeURIComponent(id)}`);
  }

  async addWbsItem(data: WbsAddItemRequest): Promise<ApiResponse> {
    await this.ensureAuthenticated();
    this.ensureProjectSelected();
    data.projectId = this.selectedProjectId;
    return this.jwtPost<ApiResponse>("/api/Wbs/Add", data);
  }

  async saveWbsTree(items: WbsTreeItemRequest[]): Promise<ApiResponse> {
    await this.ensureAuthenticated();
    this.ensureProjectSelected();
    return this.jwtPost<ApiResponse>("/api/Wbs", items);
  }

  async updateWbs(id: string, data: WbsUpdateRequest): Promise<ApiResponse> {
    await this.ensureAuthenticated();
    this.ensureProjectSelected();
    data.id = id;
    data.addItems ??= [];
    return this.jwtPost<ApiResponse>(`/api/Wbs/${encodeURIComponent(id)}`, data);
  }

  async deleteWbs(id: string): Promise<ApiResponse> {
    await this.ensureAuthenticated();
    this.ensureProjectSelected();
    return this.jwtDelete<ApiResponse>(`/api/Wbs/${encodeURIComponent(id)}`);
  }

  async getWbsTodayTasks(): Promise<WbsTaskSummaryDto[]> {
    await this.ensureAuthenticated();
    this.ensureProjectSelected();
    return this.jwtGet<WbsTaskSummaryDto[]>("/api/Wbs/TodayTasks");
  }

  async getWbsPastTasks(): Promise<WbsTaskSummaryDto[]> {
    await this.ensureAuthenticated();
    this.ensureProjectSelected();
    return this.jwtGet<WbsTaskSummaryDto[]>("/api/Wbs/PastTasks");
  }

  async getWbsMilestones(): Promise<WbsDto[]> {
    await this.ensureAuthenticated();
    this.ensureProjectSelected();
    return this.jwtGet<WbsDto[]>("/api/Wbs/Milestones");
  }

  async createWbsSnapshot(): Promise<ApiResponse> {
    await this.ensureAuthenticated();
    this.ensureProjectSelected();
    return this.jwtPost<ApiResponse>("/api/Wbs/Snapshot", {});
  }

  async getWbsSnapshotIdx(): Promise<number[]> {
    await this.ensureAuthenticated();
    this.ensureProjectSelected();
    return this.jwtGet<number[]>("/api/Wbs/SnapshotIdx");
  }

  async getWbsSnapshotList(version: number): Promise<SnapshotDto[]> {
    await this.ensureAuthenticated();
    this.ensureProjectSelected();
    return this.jwtGet<SnapshotDto[]>(`/api/Wbs/Snapshot?version=${version}`);
  }

  async getWbsSnapshotInfo(id: string, version: number): Promise<SnapshotDto | null> {
    await this.ensureAuthenticated();
    this.ensureProjectSelected();
    return this.jwtGet<SnapshotDto | null>(`/api/Wbs/Snapshot/${encodeURIComponent(id)}?version=${version}`);
  }

  // ──────────────────────── Requirements ────────────────────────

  async getRequirementsList(): Promise<RequirementsDto[]> {
    await this.ensureAuthenticated();
    this.ensureProjectSelected();
    return this.jwtGet<RequirementsDto[]>("/api/Requirements");
  }

  async getRequirementsAll(): Promise<RequirementsDto[]> {
    await this.ensureAuthenticated();
    this.ensureProjectSelected();
    return this.jwtGet<RequirementsDto[]>("/api/Requirements/All");
  }

  async getRequirements(id: string): Promise<RequirementsDto | null> {
    await this.ensureAuthenticated();
    this.ensureProjectSelected();
    return this.jwtGet<RequirementsDto | null>(`/api/Requirements/${encodeURIComponent(id)}`);
  }

  async saveRequirementsTree(items: TreeItem[]): Promise<ApiResponse> {
    await this.ensureAuthenticated();
    this.ensureProjectSelected();
    return this.jwtPost<ApiResponse>("/api/Requirements", items);
  }

  async saveRequirementsDetail(data: RequirementsDetailSaveRequest): Promise<ApiResponse> {
    await this.ensureAuthenticated();
    this.ensureProjectSelected();
    return this.jwtPost<ApiResponse>(`/api/Requirements/${encodeURIComponent(data.id)}`, data);
  }

  async deleteRequirements(id: string): Promise<ApiResponse> {
    await this.ensureAuthenticated();
    this.ensureProjectSelected();
    return this.jwtDelete<ApiResponse>(`/api/Requirements/${encodeURIComponent(id)}`);
  }

  async exportRequirementsMarkdown(): Promise<string> {
    await this.ensureAuthenticated();
    this.ensureProjectSelected();
    const resp = await this.rawJwtRequest("GET", "/api/Requirements/ExportMarkdown");
    if (!resp.ok) {
      throw new Error(`Export markdown failed: HTTP ${resp.status}`);
    }
    return resp.text();
  }

  async createRequirementsSnapshot(): Promise<ApiResponse> {
    await this.ensureAuthenticated();
    this.ensureProjectSelected();
    return this.jwtPost<ApiResponse>("/api/Requirements/Snapshot", {});
  }

  async getRequirementsSnapshotIdx(): Promise<number[]> {
    await this.ensureAuthenticated();
    this.ensureProjectSelected();
    return this.jwtGet<number[]>("/api/Requirements/SnapshotIdx");
  }

  async getRequirementsSnapshotList(version: number): Promise<SnapshotDto[]> {
    await this.ensureAuthenticated();
    this.ensureProjectSelected();
    return this.jwtGet<SnapshotDto[]>(`/api/Requirements/Snapshot?version=${version}`);
  }

  // ──────────────────────── ProcessDefine ────────────────────────

  async getProcessList(): Promise<ProcessDefineDto[]> {
    await this.ensureAuthenticated();
    this.ensureProjectSelected();
    return this.jwtGet<ProcessDefineDto[]>("/api/ProcessDefine");
  }

  async getProcess(id: string): Promise<ProcessDefineDto | null> {
    await this.ensureAuthenticated();
    this.ensureProjectSelected();
    return this.jwtGet<ProcessDefineDto | null>(`/api/ProcessDefine/${encodeURIComponent(id)}`);
  }

  async saveProcessTree(items: TreeItem[]): Promise<ApiResponse> {
    await this.ensureAuthenticated();
    this.ensureProjectSelected();
    return this.jwtPost<ApiResponse>("/api/ProcessDefine", items);
  }

  async saveProcessDetail(data: ProcessDefineDetailSaveRequest): Promise<ApiResponse> {
    await this.ensureAuthenticated();
    this.ensureProjectSelected();
    return this.jwtPost<ApiResponse>(`/api/ProcessDefine/${encodeURIComponent(data.id)}`, data);
  }

  async deleteProcess(id: string): Promise<ApiResponse> {
    await this.ensureAuthenticated();
    this.ensureProjectSelected();
    return this.jwtDelete<ApiResponse>(`/api/ProcessDefine/${encodeURIComponent(id)}`);
  }

  async convertReqToProcess(): Promise<ApiResponse> {
    await this.ensureAuthenticated();
    this.ensureProjectSelected();
    return this.jwtPost<ApiResponse>("/api/ProcessDefine/ConvertReqToProcess", {});
  }

  // ──────────────────────── MeetingMinutes ────────────────────────

  async getMeetingList(): Promise<MeetingMinutesDto[]> {
    await this.ensureAuthenticated();
    this.ensureProjectSelected();
    return this.jwtGet<MeetingMinutesDto[]>("/api/MeetingMinutes");
  }

  async getMeeting(id: string): Promise<MeetingMinutesDto | null> {
    await this.ensureAuthenticated();
    this.ensureProjectSelected();
    return this.jwtGet<MeetingMinutesDto | null>(`/api/MeetingMinutes/${encodeURIComponent(id)}`);
  }

  async saveMeeting(data: MeetingMinutesDto): Promise<ApiResponse> {
    await this.ensureAuthenticated();
    this.ensureProjectSelected();
    return this.jwtPost<ApiResponse>("/api/MeetingMinutes", data);
  }

  async deleteMeeting(id: string): Promise<ApiResponse> {
    await this.ensureAuthenticated();
    this.ensureProjectSelected();
    return this.jwtDelete<ApiResponse>(`/api/MeetingMinutes/${encodeURIComponent(id)}`);
  }

  async archiveMeeting(id: string): Promise<ApiResponse> {
    await this.ensureAuthenticated();
    this.ensureProjectSelected();
    return this.jwtPost<ApiResponse>(`/api/MeetingMinutes/Archive/${encodeURIComponent(id)}`, {});
  }

  // ──────────────────────── ResearchNote ────────────────────────

  async getResearchNoteList(infoId: string): Promise<ResearchNoteDto[]> {
    await this.ensureAuthenticated();
    this.ensureProjectSelected();
    return this.jwtGet<ResearchNoteDto[]>(`/api/ResearchNote/List/${encodeURIComponent(infoId)}`);
  }

  async getResearchNote(id: string): Promise<ResearchNoteDto | null> {
    await this.ensureAuthenticated();
    this.ensureProjectSelected();
    return this.jwtGet<ResearchNoteDto | null>(`/api/ResearchNote/${encodeURIComponent(id)}`);
  }

  async saveResearchNote(data: ResearchNoteDto): Promise<ApiResponse> {
    await this.ensureAuthenticated();
    this.ensureProjectSelected();
    return this.jwtPost<ApiResponse>("/api/ResearchNote", data);
  }

  async deleteResearchNote(id: string): Promise<ApiResponse> {
    await this.ensureAuthenticated();
    this.ensureProjectSelected();
    return this.jwtDelete<ApiResponse>(`/api/ResearchNote/${encodeURIComponent(id)}`);
  }

  async getResearchNoteInfoList(): Promise<ResearchNoteInfoDto[]> {
    await this.ensureAuthenticated();
    this.ensureProjectSelected();
    return this.jwtGet<ResearchNoteInfoDto[]>("/api/ResearchNote/Info");
  }

  // ──────────────────────── UI/UX ────────────────────────

  async getUiuxList(): Promise<UiuxDto[]> {
    await this.ensureAuthenticated();
    this.ensureProjectSelected();
    return this.jwtGet<UiuxDto[]>("/api/Uiux");
  }

  async getUiux(id: string): Promise<UiuxDto | null> {
    await this.ensureAuthenticated();
    this.ensureProjectSelected();
    return this.jwtGet<UiuxDto | null>(`/api/Uiux/${encodeURIComponent(id)}`);
  }

  async saveUiux(data: UiuxDto): Promise<ApiResponse> {
    await this.ensureAuthenticated();
    this.ensureProjectSelected();
    return this.jwtPost<ApiResponse>("/api/Uiux", data);
  }

  async deleteUiux(id: string): Promise<ApiResponse> {
    await this.ensureAuthenticated();
    this.ensureProjectSelected();
    return this.jwtDelete<ApiResponse>(`/api/Uiux/${encodeURIComponent(id)}`);
  }

  // ──────────────────────── Relation ────────────────────────

  async exportRelationMarkdown(): Promise<string> {
    await this.ensureAuthenticated();
    this.ensureProjectSelected();
    const resp = await this.rawJwtRequest("GET", "/api/Relation/ExportMarkdown");
    if (!resp.ok) {
      const body = await resp.text();
      throw new Error(`Export relation markdown failed: HTTP ${resp.status} - ${trimForError(body)}`);
    }
    return resp.text();
  }

  // ──────────────────────── TableDefine ────────────────────────

  async getTableDefineList(): Promise<TableDefineDto[]> {
    await this.ensureAuthenticated();
    this.ensureProjectSelected();
    return this.jwtGet<TableDefineDto[]>("/api/TableDefine");
  }

  async getTableDefine(id: string): Promise<TableDefineDto | null> {
    await this.ensureAuthenticated();
    this.ensureProjectSelected();
    return this.jwtGet<TableDefineDto | null>(`/api/TableDefine/${encodeURIComponent(id)}`);
  }

  async saveTableDefine(data: TableDefineDto): Promise<ApiResponse> {
    await this.ensureAuthenticated();
    this.ensureProjectSelected();
    return this.jwtPost<ApiResponse>("/api/TableDefine", data);
  }

  async deleteTableDefine(id: string): Promise<ApiResponse> {
    await this.ensureAuthenticated();
    this.ensureProjectSelected();
    return this.jwtDelete<ApiResponse>(`/api/TableDefine/${encodeURIComponent(id)}`);
  }

  // ──────────────────────── Internal HTTP helpers ────────────────────────

  private async ensureAuthenticated(): Promise<void> {
    if (this.accessToken) return;
    await this.loginAndIssueJwt(this.config.defaultUserId, this.config.defaultPassword);
  }

  private ensureProjectSelected(): void {
    if (!this.selectedProjectId) {
      throw new Error("Project is not selected. Call project_select first.");
    }
  }

  private async jwtGet<T>(path: string): Promise<T> {
    const resp = await this.rawJwtRequest("GET", path);
    const body = await resp.text();
    if (!resp.ok) {
      throw new Error(`GET ${path} failed: HTTP ${resp.status} - ${trimForError(body)}`);
    }
    return JSON.parse(body) as T;
  }

  private async jwtPost<T>(path: string, data: unknown): Promise<T> {
    const resp = await this.rawJwtRequest("POST", path, data);
    const body = await resp.text();
    if (!resp.ok) {
      throw new Error(`POST ${path} failed: HTTP ${resp.status} - ${trimForError(body)}`);
    }
    return JSON.parse(body) as T;
  }

  private async jwtDelete<T>(path: string): Promise<T> {
    const resp = await this.rawJwtRequest("DELETE", path);
    const body = await resp.text();
    if (!resp.ok) {
      throw new Error(`DELETE ${path} failed: HTTP ${resp.status} - ${trimForError(body)}`);
    }
    return JSON.parse(body) as T;
  }

  private async rawJwtRequest(method: string, path: string, body?: unknown): Promise<Response> {
    if (!this.accessToken) {
      throw new Error("Not authenticated. Call auth_login first.");
    }

    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.accessToken}`,
      Accept: "application/json",
    };

    const cookieStr = this.buildCookieHeader();
    if (cookieStr) headers["Cookie"] = cookieStr;

    const init: RequestInit = {
      method,
      headers,
      signal: AbortSignal.timeout(this.config.timeoutMs),
    };

    if (body !== undefined) {
      headers["Content-Type"] = "application/json";
      init.body = JSON.stringify(body);
    }

    const resp = await fetch(`${this.config.baseUrl}${path}`, init);
    this.captureCookies(resp);
    return resp;
  }

  private async rawPost(path: string, data: unknown, useJwt: boolean): Promise<Response> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    if (useJwt && this.accessToken) {
      headers["Authorization"] = `Bearer ${this.accessToken}`;
    }

    const cookieStr = this.buildCookieHeader();
    if (cookieStr) headers["Cookie"] = cookieStr;

    const resp = await fetch(`${this.config.baseUrl}${path}`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
      signal: AbortSignal.timeout(this.config.timeoutMs),
    });

    this.captureCookies(resp);
    return resp;
  }

  private captureCookies(resp: Response): void {
    const setCookies = resp.headers.getSetCookie?.() ?? [];
    for (const raw of setCookies) {
      const firstSegment = raw.split(";", 2)[0];
      const idx = firstSegment.indexOf("=");
      if (idx <= 0) continue;
      const key = firstSegment.slice(0, idx).trim();
      const value = firstSegment.slice(idx + 1).trim();
      if (key) this.cookies.set(key, value);
    }
  }

  private buildCookieHeader(): string {
    if (this.cookies.size === 0) return "";
    return Array.from(this.cookies.entries())
      .map(([k, v]) => `${k}=${v}`)
      .join("; ");
  }
}

function trimForError(value: string): string {
  if (!value?.trim()) return "empty body";
  const trimmed = value.trim();
  return trimmed.length <= 220 ? trimmed : trimmed.slice(0, 220) + "...";
}
