# @hubinsoft/hiflow-mcp

**HIFlow App**용 MCP (Model Context Protocol) 서버 - 프로젝트 관리, WBS, 요구사항, 설계 문서, 회의록, 소스 코드 생성, 지식 베이스 등을 지원합니다.

## 설치

### Claude Code

```bash
claude mcp add hiflow -t stdio \
  -e HIFLOW_API_BASE_URL=https://app.hubinflow.ai \
  -e HIFLOW_MCP_USER=your-id \
  -e HIFLOW_MCP_PASS=your-pw \
  -- npx -y @hubinsoft/hiflow-mcp
```

### 로컬 개발

```bash
claude mcp add hiflow -t stdio \
  -e HIFLOW_API_BASE_URL=https://app.hubinflow.ai \
  -e HIFLOW_MCP_USER=your-id \
  -e HIFLOW_MCP_PASS=your-pw \
  -- node /path/to/hiflow-mcp/build/index.js
```

## 환경 변수

| 변수 | 필수 | 기본값 | 설명 |
|------|------|--------|------|
| `HIFLOW_API_BASE_URL` | 아니오 | `https://app.hubinflow.ai` | HIFlow API 서버 URL |
| `HIFLOW_MCP_USER` | 아니오 | - | 자동 로그인 사용자 ID |
| `HIFLOW_MCP_PASS` | 아니오 | - | 자동 로그인 비밀번호 |
| `HIFLOW_API_TIMEOUT` | 아니오 | `15000` | API 타임아웃 (밀리초) |

## 사용 가능한 도구 (70개)

### 인증 (2개)
| 도구 | 설명 |
|------|------|
| `auth_login` | 사용자 ID/비밀번호로 로그인하여 JWT 발급 |
| `auth_use_token` | 기존 JWT 토큰 직접 적용 |

### 프로젝트 (2개)
| 도구 | 설명 |
|------|------|
| `project_list` | 사용자 프로젝트 목록 조회 |
| `project_select` | 활성 프로젝트 선택 |

### 할 일 (5개)
| 도구 | 설명 |
|------|------|
| `todo_list` | 할 일 목록 조회 (상태별 필터) |
| `todo_today` | 오늘의 할 일 조회 |
| `todo_upsert` | 할 일 생성/수정 |
| `todo_complete` | 완료/미완료 처리 |
| `todo_export_markdown` | 할 일 Markdown 내보내기 |

### WBS (14개)
| 도구 | 설명 |
|------|------|
| `wbs_list` | WBS 트리 목록 조회 |
| `wbs_get` | WBS 항목 상세 조회 |
| `wbs_add` | WBS 항목 추가 |
| `wbs_update` | WBS 상세 수정 |
| `wbs_delete` | WBS 항목 삭제 |
| `wbs_save_tree` | WBS 트리 전체 저장 |
| `wbs_today_tasks` | 오늘의 WBS 작업 조회 |
| `wbs_past_tasks` | 지연/과거 작업 조회 |
| `wbs_milestones` | 프로젝트 마일스톤 조회 |
| `wbs_snapshot_create` | WBS 스냅샷 생성 |
| `wbs_snapshot_idx` | 스냅샷 버전 목록 조회 |
| `wbs_snapshot_list` | 버전별 스냅샷 목록 조회 |
| `wbs_snapshot_get` | 스냅샷 항목 상세 조회 |
| `wbs_export_markdown` | WBS Markdown 내보내기 |

### 요구사항 (8개)
| 도구 | 설명 |
|------|------|
| `requirements_list` | 요구사항 트리 목록 조회 |
| `requirements_get` | 요구사항 상세 조회 |
| `requirements_save` | 요구사항 트리 저장 |
| `requirements_save_detail` | 요구사항 상세 저장 (이력 추적) |
| `requirements_delete` | 요구사항 삭제 |
| `requirements_export_markdown` | Markdown 내보내기 |
| `requirements_snapshot_create` | 스냅샷 생성 |
| `requirements_snapshot_list` | 버전별 스냅샷 조회 |

### 프로세스 정의 (7개)
| 도구 | 설명 |
|------|------|
| `process_list` | 프로세스 정의 목록 조회 |
| `process_get` | 프로세스 정의 상세 조회 |
| `process_save` | 프로세스 정의 트리 저장 |
| `process_save_detail` | 프로세스 정의 상세 저장 |
| `process_delete` | 프로세스 정의 삭제 |
| `process_convert_from_requirements` | 요구사항에서 프로세스 자동 변환 |
| `process_export_markdown` | Markdown 내보내기 |

### 회의록 (5개)
| 도구 | 설명 |
|------|------|
| `meeting_list` | 회의록 목록 조회 |
| `meeting_get` | 회의록 상세 조회 |
| `meeting_save` | 회의록 생성/수정 |
| `meeting_delete` | 회의록 삭제 |
| `meeting_archive` | 회의록 아카이브 |

### 리서치 노트 (5개)
| 도구 | 설명 |
|------|------|
| `research_info_list` | 리서치 주제 목록 조회 |
| `research_list` | 주제별 리서치 노트 목록 조회 |
| `research_get` | 리서치 노트 상세 조회 |
| `research_save` | 리서치 노트 생성/수정 |
| `research_delete` | 리서치 노트 삭제 |

### UI/UX 설계 (4개)
| 도구 | 설명 |
|------|------|
| `uiux_list` | UI/UX 설계 목록 조회 |
| `uiux_get` | UI/UX 설계 상세 조회 |
| `uiux_save` | UI/UX 설계 생성/수정 |
| `uiux_delete` | UI/UX 설계 삭제 |

### 테이블/DB 설계 (4개)
| 도구 | 설명 |
|------|------|
| `table_define_list` | 테이블 설계 목록 조회 |
| `table_define_get` | 테이블 정의 상세 조회 (DBML 포함) |
| `table_define_save` | 테이블 정의 생성/수정 |
| `table_define_delete` | 테이블 정의 삭제 |

### 관계 추적 (1개)
| 도구 | 설명 |
|------|------|
| `relation_export_markdown` | 추적성 매트릭스 Markdown 내보내기 |

### 문서 (1개)
| 도구 | 설명 |
|------|------|
| `document_export_markdown` | 프로젝트 개발 문서 통합 Markdown 내보내기 |

### 소스 파워툴 (9개)
| 도구 | 설명 |
|------|------|
| `source_list` | DB 연결 목록 조회 |
| `source_get` | DB 연결 상세 조회 |
| `source_tables` | 연결된 DB의 테이블 목록 조회 |
| `source_table_schema` | 테이블 스키마 상세 조회 (컬럼, PK, FK, 코멘트) |
| `source_generate` | 테이블 기반 보일러플레이트 코드 생성 |
| `source_generate_dbcontext` | ASP.NET Core EF Core DbContext 코드 생성 |
| `source_generate_dbcontext_file` | DbContext 코드 생성 후 파일로 저장 |
| `source_template_list` | 코드 생성 템플릿 목록 조회 |
| `source_template_get` | 템플릿 상세 조회 |

### 지식 베이스 (3개)
| 도구 | 설명 |
|------|------|
| `kb_list` | 지식 베이스 목록 조회 |
| `kb_query` | 자연어 질의 (자동 SQL 변환) |
| `kb_info` | 지식 베이스 스키마/컬럼 정보 조회 |

## 일반적인 사용 흐름

```
auth_login -> project_list -> project_select -> (도구 사용)
```

1. **로그인**: `auth_login` (또는 환경 변수를 통한 자동 로그인)
2. **프로젝트 선택**: `project_list`로 목록 조회 후 `project_select`로 선택
3. **도구 사용**: 이후 모든 도구는 선택된 프로젝트 기준으로 동작

## 도구별 상세 사용 가이드

### 인증

로그인 후 발급된 JWT 토큰으로 모든 API를 호출합니다. 환경 변수(`HIFLOW_MCP_USER`, `HIFLOW_MCP_PASS`)가 설정되어 있으면 자동 로그인됩니다.

| 도구 | 파라미터 | 설명 |
|------|----------|------|
| `auth_login` | `userId` (선택), `password` (선택) | 환경 변수 설정 시 파라미터 생략 가능 |
| `auth_use_token` | `accessToken` (필수), `userId` (선택) | 이미 발급된 JWT 토큰 직접 적용 |

```
# 직접 로그인
auth_login(userId: "admin", password: "1234")
→ { userId: "admin", message: "Login successful", tokenPreview: "eyJ...", authMode: "JWT" }

# 기존 토큰 사용
auth_use_token(accessToken: "eyJhbGciOi...")
→ { userId: "admin", message: "Token applied", authMode: "JWT_TOKEN" }
```

---

### 프로젝트

모든 도구는 프로젝트가 선택된 상태에서 동작합니다. 반드시 `project_select`를 먼저 호출해야 합니다.

| 도구 | 파라미터 | 설명 |
|------|----------|------|
| `project_list` | 없음 | 사용자가 접근 가능한 프로젝트 목록 (id, name) |
| `project_select` | `projectId` (필수) | 이후 모든 도구의 기준 프로젝트 설정 |

```
project_list
→ { count: 3, projects: [{ id: "p1", name: "HIFlow" }, { id: "p2", name: "Portal" }, ...] }

project_select(projectId: "p1")
→ { success: true, message: "Project selected", projectId: "p1" }
```

---

### 할 일 (Todo)

WBS와 연계하여 업무를 관리합니다. 담당자 배정, 우선순위, 태그, 카테고리를 지원합니다.

| 도구 | 파라미터 | 설명 |
|------|----------|------|
| `todo_list` | `status` (선택): `All` \| `NotStarted` \| `InProgress` \| `Completed` | 상태별 필터 (기본값: All) |
| `todo_today` | 없음 | 현재 사용자의 오늘 할 일 |
| `todo_upsert` | `id` (선택), `wbsId` (선택), `title` (선택), `startDate` (선택), `endDate` (선택), `memo` (선택), `assignId` (선택), `tag` (선택), `priority` (선택), `category` (선택) | id 생략 시 신규 생성, title 필수 |
| `todo_complete` | `id` (필수), `completeYn` (필수): `Y` \| `N` | 완료/미완료 토글 |
| `todo_export_markdown` | 없음 | WBS 기준으로 그룹핑된 Markdown 내보내기 |

```
# 진행 중인 할 일 조회
todo_list(status: "InProgress")

# 새 할 일 생성
todo_upsert(title: "API 설계 문서 작성", startDate: "2026-03-01", endDate: "2026-03-05", priority: 1)

# 완료 처리
todo_complete(id: "t1", completeYn: "Y")
```

---

### WBS

프로젝트의 작업 분류 체계(Work Breakdown Structure)를 트리 구조로 관리합니다. 스냅샷으로 버전 관리가 가능합니다.

| 도구 | 파라미터 | 설명 |
|------|----------|------|
| `wbs_list` | `withAddItems` (선택, 기본 true) | WBS 트리 전체 목록 |
| `wbs_get` | `id` (필수) | 단일 항목 상세 조회 |
| `wbs_add` | `title` (필수), `parentId` (선택), `startDate` (선택), `endDate` (선택), `memo` (선택), `resource` (선택) | parentId 생략 시 최상위 항목 |
| `wbs_update` | `id` (필수), `startDate` (필수), `endDate` (필수), `processId` (선택), `resource` (선택), `memo` (선택), `addItems` (선택) | 상세 정보 수정 |
| `wbs_delete` | `id` (필수) | 소프트 삭제 |
| `wbs_save_tree` | `items` (필수): `[{id, parent_id, title, level, start_date, end_date, order_index}]` | 트리 전체 일괄 저장 |
| `wbs_today_tasks` | 없음 | 회사 전체 프로젝트의 오늘 작업 |
| `wbs_past_tasks` | 없음 | 회사 전체 프로젝트의 지연 작업 |
| `wbs_milestones` | 없음 | 최상위 마일스톤 항목 |
| `wbs_snapshot_create` | 없음 | 현재 WBS 상태를 스냅샷으로 저장 |
| `wbs_snapshot_idx` | 없음 | 저장된 스냅샷 버전 목록 |
| `wbs_snapshot_list` | `version` (필수) | 특정 버전의 스냅샷 목록 |
| `wbs_snapshot_get` | `id` (필수), `version` (필수) | 스냅샷 항목 상세 |
| `wbs_export_markdown` | 없음 | 계층 구조 Markdown 내보내기 |

```
# WBS 항목 추가
wbs_add(title: "백엔드 개발", startDate: "2026-03-01", endDate: "2026-03-31")
→ { success: true, id: "w1" }

# 하위 항목 추가
wbs_add(parentId: "w1", title: "API 설계", startDate: "2026-03-01", endDate: "2026-03-07")

# 스냅샷 생성 후 비교
wbs_snapshot_create
wbs_snapshot_idx
→ { count: 2, versions: [1, 2] }
wbs_snapshot_list(version: 1)
```

---

### 요구사항

요구사항을 트리 구조로 관리하며, 상세 정보에 카테고리/정의/사유/필수여부를 포함합니다. 변경 이력이 자동으로 추적됩니다.

| 도구 | 파라미터 | 설명 |
|------|----------|------|
| `requirements_list` | 없음 | 요구사항 트리 (id, parentId, title, level, category, define, mandatoryYn) |
| `requirements_get` | `id` (필수) | 상세 조회 (define, reason, detail(HTML), relId 포함) |
| `requirements_save` | `items` (필수): `[{id, parent_id, title, level, order_index}]` | 트리 구조 일괄 저장 |
| `requirements_save_detail` | `id` (필수), `mandatoryYn` (선택), `category` (선택), `define` (선택), `reason` (선택), `relId` (선택), `detail` (선택, HTML) | 상세 정보 저장 (이력 추적) |
| `requirements_delete` | `id` (필수) | 소프트 삭제 |
| `requirements_export_markdown` | 없음 | Markdown 문서 내보내기 |
| `requirements_snapshot_create` | 없음 | 현재 상태 스냅샷 생성 |
| `requirements_snapshot_list` | `version` (필수) | 특정 버전 스냅샷 조회 |

```
# 요구사항 목록 조회
requirements_list
→ { count: 15, items: [{ id: "r1", title: "사용자 인증", level: 1, category: "기능", mandatoryYn: "Y" }, ...] }

# 상세 정보 저장
requirements_save_detail(id: "r1", define: "OAuth 2.0 기반 인증", reason: "보안 강화", mandatoryYn: "Y")

# Markdown 내보내기
requirements_export_markdown
```

---

### 프로세스 정의

요구사항 기반으로 업무 프로세스를 정의합니다. 요구사항에서 자동 변환하거나 직접 생성할 수 있습니다.

| 도구 | 파라미터 | 설명 |
|------|----------|------|
| `process_list` | 없음 | 프로세스 정의 트리 목록 |
| `process_get` | `id` (필수) | 상세 조회 (description, requirementsId, usingEntity) |
| `process_save` | `items` (필수): `[{id, parent_id, title, level, order_index}]` | 트리 일괄 저장 |
| `process_save_detail` | `id` (필수), `description` (선택, HTML), `requirementsId` (선택, JSON 배열 문자열), `usingEntity` (선택, JSON 배열 문자열) | 상세 저장 (이력 추적) |
| `process_delete` | `id` (필수) | 소프트 삭제 (하위 항목 포함) |
| `process_convert_from_requirements` | 없음 | 요구사항 전체를 프로세스로 자동 변환 (기존 데이터 대체) |
| `process_export_markdown` | 없음 | 관련 요구사항/테이블 포함 Markdown 내보내기 |

```
# 요구사항에서 자동 변환
process_convert_from_requirements
→ { success: true, message: "Converted" }

# 프로세스 상세 저장 (관련 요구사항/엔티티 연결)
process_save_detail(id: "pd1", description: "<p>로그인 처리</p>", requirementsId: "[\"r1\",\"r2\"]", usingEntity: "[\"users\",\"sessions\"]")
```

---

### 회의록

프로젝트 회의록을 관리합니다. 날짜, 장소, 참석자, 내용, 결론을 기록하고 아카이브할 수 있습니다.

| 도구 | 파라미터 | 설명 |
|------|----------|------|
| `meeting_list` | 없음 | 회의록 목록 |
| `meeting_get` | `id` (필수) | 상세 조회 (title, meetingDate, location, attendees, content, conclusion) |
| `meeting_save` | `id` (선택), `title` (선택), `meetingDate` (선택, yyyy-MM-dd), `location` (선택), `attendees` (선택, 콤마 구분), `content` (선택, HTML), `conclusion` (선택, HTML) | id 생략 시 신규 생성 |
| `meeting_delete` | `id` (필수) | 소프트 삭제 |
| `meeting_archive` | `id` (필수) | 아카이브 처리 |

```
# 회의록 생성
meeting_save(title: "킥오프 미팅", meetingDate: "2026-03-01", location: "회의실A", attendees: "홍길동,김철수", content: "<p>프로젝트 범위 논의</p>", conclusion: "<p>3월 말까지 MVP 완성</p>")
→ { success: true, id: "m1" }

# 아카이브
meeting_archive(id: "m1")
```

---

### 리서치 노트

주제(Topic)별로 리서치 노트를 작성합니다. 주제 목록 조회 후 해당 주제에 노트를 추가합니다.

| 도구 | 파라미터 | 설명 |
|------|----------|------|
| `research_info_list` | 없음 | 리서치 주제 목록 |
| `research_list` | `infoId` (필수) | 주제별 노트 목록 |
| `research_get` | `id` (필수) | 노트 상세 조회 |
| `research_save` | `id` (선택), `infoId` (선택), `title` (선택), `content` (선택, HTML) | id 생략 시 신규 생성 |
| `research_delete` | `id` (필수) | 소프트 삭제 |

```
# 주제 목록 확인
research_info_list
→ { count: 3, items: [{ id: "ri1", title: "기술 조사" }, ...] }

# 해당 주제에 노트 추가
research_save(infoId: "ri1", title: "MCP 프로토콜 분석", content: "<p>MCP는 Model Context Protocol의 약자로...</p>")
```

---

### UI/UX 설계

프로세스 정의와 연계하여 화면 설계를 관리합니다. HTML 목업을 포함할 수 있습니다.

| 도구 | 파라미터 | 설명 |
|------|----------|------|
| `uiux_list` | 없음 | UI/UX 설계 목록 |
| `uiux_get` | `id` (필수) | 상세 조회 (title, processId, content, html) |
| `uiux_save` | `id` (선택), `processId` (선택), `title` (선택), `content` (선택, HTML), `html` (선택, HTML 목업) | id 생략 시 신규 생성 |
| `uiux_delete` | `id` (필수) | 소프트 삭제 |

```
# UI/UX 설계 생성 (프로세스와 연결)
uiux_save(processId: "pd1", title: "로그인 화면", content: "<p>이메일/비밀번호 입력 폼</p>", html: "<form>...</form>")
→ { success: true, id: "u1" }
```

---

### 테이블/DB 설계

DBML(Database Markup Language) 형식으로 데이터베이스 스키마를 설계합니다.

| 도구 | 파라미터 | 설명 |
|------|----------|------|
| `table_define_list` | 없음 | 테이블 설계 목록 (id, title, dbType) |
| `table_define_get` | `id` (필수) | 상세 조회 (DBML 포함) |
| `table_define_save` | `id` (선택), `title` (선택), `dbType` (선택, 예: PostgreSQL, MySQL), `dbml` (선택) | id 생략 시 신규 생성 |
| `table_define_delete` | `id` (필수) | 소프트 삭제 |

```
# 테이블 설계 생성
table_define_save(title: "사용자 테이블", dbType: "PostgreSQL", dbml: "Table users {\n  id int [pk]\n  email varchar\n  name varchar\n}")
→ { success: true, id: "td1" }
```

---

### 관계 추적/문서 내보내기

프로젝트 산출물 간의 추적성 매트릭스와 통합 문서를 Markdown으로 내보냅니다.

| 도구 | 파라미터 | 설명 |
|------|----------|------|
| `relation_export_markdown` | 없음 | 요구사항 ↔ 프로세스 ↔ WBS ↔ UI/UX ↔ 테이블 ↔ 테스트 간 연결 관계 |
| `document_export_markdown` | 없음 | 요구사항, 프로세스, GUI, 코드 정의를 하나의 문서로 통합 |

```
# 추적성 매트릭스
relation_export_markdown
→ "# 추적성 매트릭스\n| 요구사항 | 프로세스 | WBS | UI/UX | 테이블 |\n..."

# 통합 문서
document_export_markdown
→ "# 프로젝트 개발 문서\n## 1. 요구사항\n..."
```

---

### 지식 베이스 (Knowledge Base)

등록된 데이터 소스에 자연어로 질의하면 자동으로 SQL로 변환하여 결과를 반환합니다.

| 도구 | 파라미터 | 설명 |
|------|----------|------|
| `kb_list` | 없음 | 사용 가능한 지식 베이스 목록 |
| `kb_query` | `query` (필수) | 자연어 질의 → 자동 SQL 변환 → 결과 반환 |
| `kb_info` | `kbId` (필수) | KB의 스키마/컬럼 정보 조회 |

```
# KB 목록 확인
kb_list
→ [{ id: "kb1", title: "매출 데이터" }, ...]

# 스키마 확인
kb_info(kbId: "kb1")
→ { columns: [{ name: "date", type: "date" }, { name: "amount", type: "int" }, ...] }

# 자연어 질의
kb_query(query: "2026년 1월 매출 합계를 알려줘")
→ "2026년 1월 매출 합계는 15,000,000원입니다."
```

---

### 소스 파워툴

HIFlow App에 등록된 DB 연결 정보를 기반으로 테이블 목록/스키마를 조회하고, 보일러플레이트 코드를 자동 생성하는 도구입니다.

### 사용 흐름

```
source_list → source_tables → source_table_schema → source_generate
```

### 도구별 파라미터

| 도구 | 파라미터 | 설명 |
|------|----------|------|
| `source_list` | 없음 | 프로젝트의 모든 DB 연결 목록 반환 (비밀번호 마스킹) |
| `source_get` | `id` (필수) | 특정 DB 연결의 상세 정보 조회 |
| `source_tables` | `id` (필수) | 연결된 DB의 모든 테이블명 반환 |
| `source_table_schema` | `id` (필수), `table` (필수) | 컬럼명, 타입, PK, FK, 코멘트 등 스키마 상세 |
| `source_generate` | `id` (필수), `table` (필수), `outputType` (선택) | 테이블 기반 코드 자동 생성 |
| `source_generate_dbcontext` | `id` (필수) | 전체 테이블 기반 EF Core DbContext 코드 생성 |
| `source_generate_dbcontext_file` | `id` (필수), `filePath` (필수) | DbContext 코드 생성 후 지정 경로에 파일 저장 |
| `source_template_list` | 없음 | 사용자 정의 코드 생성 템플릿 목록 |
| `source_template_get` | `id` (필수) | 템플릿 상세 (제목, 언어, 파일 정의) |

### 코드 생성 outputType

| outputType | 생성 파일 |
|------------|-----------|
| `Java` | Model.java, Mapper.java, Mapper.xml, Controller.java, list.jsp, post.jsp, onepage.jsp |
| `Aspnet` | Controller.cs, ApiController.cs, Index.cshtml, Post.cshtml, OnePage.cshtml, Model.cs |
| `WPF_API` | ViewModel.cs, List.xaml, List.xaml.cs, Write.xaml, Write.xaml.cs |
| `WPF_DB` | ViewModel.cs, List.xaml, List.xaml.cs, Write.xaml, Write.xaml.cs |
| `WPF_JSON` | ViewModel.cs, List.xaml, List.xaml.cs, Write.xaml, Write.xaml.cs |
| `Template` | 사용자 정의 템플릿 기반 생성 |

> `outputType`을 생략하면 해당 연결에 설정된 기본값을 사용합니다. `templateYn`이 `"Y"`인 연결은 자동으로 `Template` 모드가 적용됩니다.

### 사용 예시

```
# 1. DB 연결 목록 확인
source_list
→ [{ id: "abc123", title: "운영DB", dbType: "PostgreSQL", ... }]

# 2. 테이블 목록 조회
source_tables(id: "abc123")
→ { count: 42, tables: ["users", "projects", "wbs", ...] }

# 3. 테이블 스키마 확인
source_table_schema(id: "abc123", table: "users")
→ { columns: [{ name: "id", type: "int4", pk: true }, ...] }

# 4. ASP.NET Core 코드 생성
source_generate(id: "abc123", table: "users", outputType: "Aspnet")
→ { outputType: "Aspnet", table: "users", files: [
    { name: "Controller.cs", source: "..." },
    { name: "ApiController.cs", source: "..." },
    { name: "Model.cs", source: "..." }, ...
  ]}

# 5. EF Core DbContext 코드 생성 (전체 테이블 대상)
source_generate_dbcontext(id: "abc123")
→ "public class AppDbContext : DbContext {\n  public DbSet<Users> Users { get; set; }\n  ..."

# 6. DbContext 코드 생성 후 파일로 저장
source_generate_dbcontext_file(id: "abc123", filePath: "./Data/AppDbContext.cs")
→ "DbContext code saved to ./Data/AppDbContext.cs"
```

## 개발

```bash
cd hiflow-mcp
npm install
npm run build
npm start
```

## 라이선스

MIT
