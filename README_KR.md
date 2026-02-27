# @hubinsoft/hiflow-mcp

**HIFlow App**용 MCP (Model Context Protocol) 서버 - 프로젝트 관리, WBS, 요구사항, 설계 문서, 회의록 등을 지원합니다.

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

## 사용 가능한 도구 (50개)

### 인증 (2개)
| 도구 | 설명 |
|------|------|
| `auth_login` | 사용자ID/비밀번호로 로그인하여 JWT 발급 |
| `auth_use_token` | 기존 JWT 토큰 적용 |

### 프로젝트 (2개)
| 도구 | 설명 |
|------|------|
| `project_list` | 사용자의 프로젝트 목록 조회 |
| `project_select` | 활성 프로젝트 설정 |

### 할일 (4개)
| 도구 | 설명 |
|------|------|
| `todo_list` | 할일 목록 조회 (상태별 필터링) |
| `todo_today` | 오늘의 할일 조회 |
| `todo_upsert` | 할일 생성/수정 |
| `todo_complete` | 완료/미완료 처리 |

### WBS (10개)
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

### 요구사항 (8개)
| 도구 | 설명 |
|------|------|
| `requirements_list` | 요구사항 트리 목록 조회 |
| `requirements_get` | 요구사항 상세 조회 |
| `requirements_save` | 요구사항 트리 저장 |
| `requirements_save_detail` | 요구사항 상세 저장 |
| `requirements_delete` | 요구사항 삭제 |
| `requirements_export_markdown` | 마크다운으로 내보내기 |

### 프로세스 정의 (6개)
| 도구 | 설명 |
|------|------|
| `process_list` | 프로세스 정의 목록 조회 |
| `process_get` | 프로세스 상세 조회 |
| `process_save` | 프로세스 트리 저장 |
| `process_save_detail` | 프로세스 상세 저장 |
| `process_delete` | 프로세스 삭제 |
| `process_convert_from_requirements` | 요구사항을 프로세스로 변환 |

### 회의록 (5개)
| 도구 | 설명 |
|------|------|
| `meeting_list` | 회의록 목록 조회 |
| `meeting_get` | 회의록 상세 조회 |
| `meeting_save` | 회의록 생성/수정 |
| `meeting_delete` | 회의록 삭제 |
| `meeting_archive` | 회의록 보관 처리 |

### 연구 노트 (5개)
| 도구 | 설명 |
|------|------|
| `research_info_list` | 연구 주제 목록 조회 |
| `research_list` | 주제별 연구 노트 조회 |
| `research_get` | 연구 노트 상세 조회 |
| `research_save` | 연구 노트 생성/수정 |
| `research_delete` | 연구 노트 삭제 |

### UI/UX 설계 (4개)
| 도구 | 설명 |
|------|------|
| `uiux_list` | UI/UX 설계 목록 조회 |
| `uiux_get` | UI/UX 상세 조회 |
| `uiux_save` | UI/UX 설계 생성/수정 |
| `uiux_delete` | UI/UX 설계 삭제 |

### 테이블/DB 설계 (4개)
| 도구 | 설명 |
|------|------|
| `table_define_list` | 테이블 설계 목록 조회 |
| `table_define_get` | 테이블 상세 조회 (DBML) |
| `table_define_save` | 테이블 정의 생성/수정 |
| `table_define_delete` | 테이블 정의 삭제 |

## 일반적인 사용 흐름

```
auth_login -> project_list -> project_select -> (원하는 도구 사용)
```

1. **로그인**: `auth_login` (또는 환경 변수를 통한 자동 로그인)
2. **프로젝트 선택**: `project_list`로 목록 확인 후 `project_select`로 선택
3. **도구 사용**: 나머지 모든 도구는 프로젝트가 선택된 상태에서 사용 가능

## 개발

```bash
cd hiflow-mcp
npm install
npm run build
npm start
```

## 라이선스

MIT
