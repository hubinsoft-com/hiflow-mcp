// ── Common API response ──
export interface ApiResponse {
  success: boolean;
  message?: string;
  accessToken?: string;
  id?: string;
  data?: unknown;
}

// ── Auth ──
export interface AuthResult {
  userId: string;
  message: string;
  tokenPreview: string;
}

// ── Project ──
export interface ProjectDto {
  id?: string;
  name?: string;
}

// ── Todo ──
export interface TodoDto {
  id?: string;
  projectId?: string;
  wbsId?: string;
  userId?: string;
  title?: string;
  startDate?: string;
  endDate?: string;
  complete?: string;
  completeYn?: string;
  memo?: string;
  assignId?: string;
  tag?: string;
  priority?: number;
  category?: string;
}

export interface TodoUpsertRequest {
  id?: string;
  wbsId?: string;
  title?: string;
  startDate?: string;
  endDate?: string;
  memo?: string;
  assignId?: string;
  tag?: string;
  priority?: number;
  category?: string;
}

// ── WBS ──
export interface WbsDto {
  id?: string;
  projectId?: string;
  parentId?: string;
  title?: string;
  level?: number;
  orderIndex?: number;
  startDate?: string;
  endDate?: string;
  duration?: number;
  processId?: string;
  resource?: string;
  complete?: number;
  todoCount?: number;
  delay?: number;
  memo?: string;
  addItems?: unknown;
}

export interface WbsTaskSummaryDto {
  id?: string;
  title?: string;
  startDate?: string;
  endDate?: string;
  projectId?: string;
  projectName?: string;
}

export interface WbsAddItemRequest {
  projectId?: string;
  parentId?: string;
  title?: string;
  level?: number;
  startDate?: string;
  endDate?: string;
  memo?: string;
  resource?: string;
}

export interface WbsTreeItemRequest {
  id: string;
  parent_id: string;
  title: string;
  level: number;
  start_date: string;
  end_date: string;
  order_index: number;
}

export interface WbsUpdateRequest {
  id?: string;
  startDate?: string;
  endDate?: string;
  processId?: string;
  resource?: string;
  memo?: string;
  addItems?: Array<{ id?: string; val?: string }>;
}

// ── Requirements ──
export interface RequirementsDto {
  id?: string;
  parentId?: string;
  category?: string;
  level?: number;
  title?: string;
  define?: string;
  relId?: string;
  mandatoryYn?: string;
  orderIndex?: number;
  regDate?: string;
  reason?: string;
  detail?: string;
  userId?: string;
}

export interface RequirementsDetailSaveRequest {
  id: string;
  mandatoryYn?: string;
  category?: string;
  define?: string;
  reason?: string;
  relId?: string;
  detail?: string;
}

// ── ProcessDefine ──
export interface ProcessDefineDto {
  id?: string;
  parentId?: string;
  projectId?: string;
  level?: number;
  orderIndex?: number;
  title?: string;
  description?: string;
  requirementsId?: string;
  usingEntity?: string;
  useYn?: string;
  regDate?: string;
  userId?: string;
}

export interface ProcessDefineDetailSaveRequest {
  id: string;
  description?: string;
  requirementsId?: string;
  usingEntity?: string;
}

// ── MeetingMinutes ──
export interface MeetingMinutesDto {
  id?: string;
  projectId?: string;
  title?: string;
  meetingDate?: string;
  location?: string;
  attendees?: string;
  content?: string;
  conclusion?: string;
  userId?: string;
  archiveYn?: string;
  regDate?: string;
}

// ── ResearchNote ──
export interface ResearchNoteDto {
  id?: string;
  infoId?: string;
  projectId?: string;
  title?: string;
  content?: string;
  userId?: string;
  userName?: string;
  useYn?: string;
  regDate?: string;
}

export interface ResearchNoteInfoDto {
  id?: string;
  projectId?: string;
  title?: string;
  description?: string;
  useYn?: string;
  regDate?: string;
}

// ── UI/UX ──
export interface UiuxDto {
  id?: string;
  projectId?: string;
  processId?: string;
  title?: string;
  content?: string;
  html?: string;
  useYn?: string;
  regDate?: string;
  userId?: string;
}

// ── TableDefine ──
export interface TableDefineDto {
  id?: string;
  projectId?: string;
  title?: string;
  dbType?: string;
  dbml?: string;
  useYn?: string;
  regDate?: string;
  userId?: string;
}

// ── Tree item (shared for Requirements & ProcessDefine tree save) ──
export interface TreeItem {
  id: string;
  parent_id: string;
  title: string;
  level: number;
  order_index: number;
}

// ── Snapshot ──
export interface SnapshotDto {
  snapshotIdx?: number;
  [key: string]: unknown;
}
