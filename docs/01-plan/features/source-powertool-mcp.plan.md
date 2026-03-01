# Source Power Tool MCP 서버 계획서

## 1. 개요

### 1.1 배경
HIFlowApp의 Source Power Tool은 데이터베이스 스키마를 기반으로 Java, ASP.NET Core, WPF 소스 코드를 자동 생성하는 기능이다. 현재 웹 UI를 통해서만 접근 가능하며, MCP(Model Context Protocol)를 통해 AI 에이전트가 직접 소스 코드를 생성할 수 있도록 확장이 필요하다.

### 1.2 목표
- Claude 등 AI 에이전트가 MCP 프로토콜을 통해 Source Power Tool의 코드 생성 기능을 사용할 수 있도록 한다
- **카테고리별 생성**: 모델, 컨트롤러, 뷰 등 개별 카테고리 단위로 소스를 생성 (테이블 선택 필요)
- **컨텍스트 기반 생성**: DbContext처럼 테이블을 선택하지 않고도 전체 데이터베이스 대상으로 소스를 생성

### 1.3 범위
- **IN**: hiflow-mcp TypeScript MCP 서버에 Source Power Tool 도구 추가
- **IN**: HIFlowApp REST API에 카테고리별 생성 엔드포인트 추가 (필요시)
- **OUT**: 기존 웹 UI 변경, 새로운 언어/프레임워크 지원 추가

---

## 2. 현황 분석

### 2.1 기존 HIFlowApp REST API 엔드포인트

| 엔드포인트 | 메서드 | 설명 | 테이블 선택 |
|------------|--------|------|-------------|
| `/api/SourcePowertool` | GET | 설정 목록 조회 | - |
| `/api/SourcePowertool/{id}` | GET | 설정 상세 조회 | - |
| `/api/SourcePowertool` | POST | 설정 등록/수정 | - |
| `/api/SourcePowertool/{id}` | DELETE | 설정 삭제 | - |
| `/api/SourcePowertool/Table/{id}` | GET | 테이블 목록 조회 | - |
| `/api/SourcePowertool/Java/{id}?table=xxx` | GET | Java 전체 생성 (7개 파일) | **필요** |
| `/api/SourcePowertool/Aspnet/{id}?table=xxx` | GET | ASP.NET Core 전체 생성 (6개 파일) | **필요** |
| `/api/SourcePowertool/Wpf/{id}?table=xxx&type=xxx` | GET | WPF 전체 생성 (5개 파일) | **필요** |
| `/api/SourcePowertool/Template/{id}?table=xxx` | GET | 커스텀 템플릿 생성 | **필요** |
| `/api/SourcePowertool/AspnetDbContext/{id}` | GET | DbContext 생성 (전체 테이블) | **불필요** |

### 2.2 카테고리별 생성 파일 현황

#### ASP.NET Core (OutputType: "Asp.net Core")
| Index | 카테고리 | 파일명 | 파서 메서드 |
|-------|----------|--------|-------------|
| 0 | Controller | `{Class}Controller.cs` | `Net.GetController(t)` |
| 1 | API Controller | `Api/{Class}Controller.cs` | `Net.GetApiController(dbType, t)` |
| 2 | View - Index | `Views/{Class}/Index.cshtml` | `Net.GetIndex(t)` |
| 3 | View - Post | `Views/{Class}/Post.cshtml` | `Net.GetPost(t)` |
| 4 | View - OnePage | `Views/{Class}/OnePage.cshtml` | `Net.GetOnePage(t)` |
| 5 | Model | `Models/{Class}.cs` | `Net.GetModel(dbType, t)` |

#### Java (OutputType: "Java")
| Index | 카테고리 | 파일명 | 파서 메서드 |
|-------|----------|--------|-------------|
| 0 | Model | `model/{Class}.java` | `Java.GetModelClass(t)` |
| 1 | Mapper Interface | `repo/{Class}Mapper.java` | `Java.GetInterface(t)` |
| 2 | Mapper XML | `repo/{Class}Mapper.xml` | `Java.GetQuery(t)` |
| 3 | Controller | `controller/{Class}Controller.java` | `Java.GetController(t)` |
| 4 | View - List | `webapp/{class}/index.jsp` | `Java.GetList(t)` |
| 5 | View - Post | `webapp/{class}/post.jsp` | `Java.GetPost(t)` |
| 6 | View - OnePage | `webapp/{class}/onepage.jsp` | `Java.GetOnePage(t)` |

#### WPF (OutputType: "WPF API/DB/JSON")
| Index | 카테고리 | 파일명 | 파서 메서드 |
|-------|----------|--------|-------------|
| 0 | ViewModel | `{Class}ViewModel.cs` | `WPF.GetCommon(t, type)` |
| 1 | View - List XAML | `{Class}List.xaml` | `WPF.GetListXaml(t)` |
| 2 | View - List CS | `{Class}List.xaml.cs` | `WPF.GetCommon(t, "ListCS")` |
| 3 | View - Write XAML | `{Class}Write.xaml` | `WPF.GetWriteXaml(t)` |
| 4 | View - Write CS | `{Class}Write.xaml.cs` | `WPF.GetWriteCs(t)` |

### 2.3 기존 hiflow-mcp 서버 구조
- **54개 도구** 등록 (12개 카테고리 파일)
- **패턴**: `registerXxxTools(server, api)` 함수 → `server.tool()` 호출
- **API 클라이언트**: `HIFlowApiClient` 클래스에서 REST API 호출
- **Source Power Tool 도구**: 현재 없음 (신규 추가 필요)

---

## 3. MCP 도구 설계

### 3.1 도구 분류 체계

```
Source Power Tool MCP Tools
├── A. 설정/스키마 도구 (Configuration & Schema)
│   ├── source_config_list          - 설정 목록 조회
│   ├── source_config_get           - 설정 상세 조회
│   ├── source_table_list           - 테이블 목록 조회
│   └── source_table_info           - 테이블 스키마 상세 조회
│
├── B. 카테고리별 소스 생성 (테이블 선택 필요)
│   ├── source_generate_model       - 모델/엔티티 클래스 생성
│   ├── source_generate_controller  - 컨트롤러 생성 (MVC/Spring)
│   ├── source_generate_api         - API 컨트롤러 생성 (REST)
│   ├── source_generate_view        - 뷰 생성 (index/post/onepage)
│   ├── source_generate_mapper      - 매퍼 생성 (Java: Interface+XML)
│   └── source_generate_full        - 전체 소스 일괄 생성
│
└── C. 컨텍스트 기반 생성 (테이블 선택 불필요)
    ├── source_generate_dbcontext   - EF Core DbContext 생성
    └── source_generate_all_models  - 전체 테이블 모델 일괄 생성
```

### 3.2 Group A: 설정 및 스키마 도구

#### `source_config_list`
- **설명**: 현재 프로젝트의 Source Power Tool 설정 목록 조회
- **입력**: 없음
- **출력**: `[{ id, name, dbType, outputType, namespace, templateYn }]`
- **API**: `GET /api/SourcePowertool`

#### `source_config_get`
- **설명**: 특정 Source Power Tool 설정 상세 조회
- **입력**: `{ id: string }`
- **출력**: `{ id, name, dbType, dbHost, dbPort, dbName, outputType, namespace, templateYn, templateId }`
- **API**: `GET /api/SourcePowertool/{id}`

#### `source_table_list`
- **설명**: 설정된 데이터베이스의 테이블 목록 조회
- **입력**: `{ configId: string }`
- **출력**: `{ tables: string[], count: number }`
- **API**: `GET /api/SourcePowertool/Table/{id}`

#### `source_table_info`
- **설명**: 특정 테이블의 컬럼, PK, FK 등 스키마 상세 정보 조회
- **입력**: `{ configId: string, tableName: string }`
- **출력**: 테이블 스키마 정보 (컬럼, 타입, 코멘트, PK, FK)
- **API**: 기존 API로는 직접 노출 안됨 → **신규 API 필요** 또는 전체 생성 후 파싱
- **대안**: `GetAspnet` 호출 후 모델 파일에서 스키마 정보 추출

### 3.3 Group B: 카테고리별 소스 생성 (테이블 선택 필요)

#### `source_generate_model`
- **설명**: 엔티티/모델 클래스 생성
- **입력**: `{ configId: string, tableName: string }`
- **출력**: `{ fileName: string, source: string, language: string }`
- **동작**:
  - OutputType에 따라 적절한 API 호출
  - ASP.NET Core → `GET /api/SourcePowertool/Aspnet/{id}?table=xxx` → index 5 (Model)
  - Java → `GET /api/SourcePowertool/Java/{id}?table=xxx` → index 0 (POJO)
  - WPF → `GET /api/SourcePowertool/Wpf/{id}?table=xxx&type=Api` → index 0 (ViewModel)

#### `source_generate_controller`
- **설명**: MVC/Spring 컨트롤러 생성
- **입력**: `{ configId: string, tableName: string }`
- **출력**: `{ fileName: string, source: string, language: string }`
- **동작**:
  - ASP.NET Core → index 0 (Controller)
  - Java → index 3 (Spring Controller)
  - WPF → 해당 없음

#### `source_generate_api`
- **설명**: REST API 컨트롤러 생성
- **입력**: `{ configId: string, tableName: string }`
- **출력**: `{ fileName: string, source: string, language: string }`
- **동작**:
  - ASP.NET Core → index 1 (API Controller)
  - Java → 해당 없음 (Controller에 통합)
  - WPF → 해당 없음

#### `source_generate_view`
- **설명**: 뷰 파일 생성 (타입 선택 가능)
- **입력**: `{ configId: string, tableName: string, viewType: "index" | "post" | "onepage" }`
- **출력**: `{ fileName: string, source: string, language: string }`
- **동작**:
  - ASP.NET Core → index 2/3/4 (Index/Post/OnePage)
  - Java → index 4/5/6 (List/Post/OnePage)
  - WPF → index 1-4 (ListXaml/ListCS/WriteXaml/WriteCS)

#### `source_generate_mapper`
- **설명**: 매퍼/리포지토리 생성 (Java 전용)
- **입력**: `{ configId: string, tableName: string }`
- **출력**: `{ files: [{ fileName, source }], language: "java" }`
- **동작**:
  - Java → index 1 (Interface) + index 2 (MyBatis XML)
  - 기타 → 지원하지 않음 알림

#### `source_generate_full`
- **설명**: 특정 테이블에 대한 전체 소스 일괄 생성
- **입력**: `{ configId: string, tableName: string }`
- **출력**: `{ files: [{ fileName, source }], language: string, count: number }`
- **동작**:
  - ASP.NET Core → 6개 파일 전체
  - Java → 7개 파일 전체
  - WPF → 5개 파일 전체
  - Template → 템플릿 정의 수만큼

### 3.4 Group C: 컨텍스트 기반 생성 (테이블 선택 불필요)

#### `source_generate_dbcontext`
- **설명**: EF Core DbContext 생성 (전체 테이블 대상, 테이블 선택 불필요)
- **입력**: `{ configId: string }`
- **출력**: `{ fileName: "DataContext.cs", source: string }`
- **API**: `GET /api/SourcePowertool/AspnetDbContext/{id}`
- **비고**: ASP.NET Core 전용, 전체 테이블 스캔하여 DbSet, 릴레이션 자동 생성

#### `source_generate_all_models`
- **설명**: 전체 테이블의 모델 클래스 일괄 생성 (테이블 선택 불필요)
- **입력**: `{ configId: string }`
- **출력**: `{ files: [{ tableName, fileName, source }], count: number }`
- **동작**:
  1. `source_table_list`로 전체 테이블 목록 조회
  2. 각 테이블에 대해 모델 생성 API 호출
  3. 결과를 배열로 취합하여 반환
- **비고**: 테이블 수에 따라 시간이 소요될 수 있음

---

## 4. 구현 전략

### 4.1 접근 방식: 기존 API 활용 + 클라이언트 측 인덱스 필터링

기존 HIFlowApp REST API는 언어별 전체 소스를 `List<string>` 형태로 반환한다. 카테고리별 생성은 MCP 서버에서 전체 생성 API를 호출한 후, 인덱스 기반으로 필요한 카테고리만 추출하는 방식으로 구현한다.

```
MCP Tool (source_generate_model)
  → API Client (getAspnetSource(configId, tableName))
    → HIFlowApp REST API (GET /api/SourcePowertool/Aspnet/{id}?table=xxx)
      ← List<string> [Controller, ApiController, Index, Post, OnePage, Model]
  ← Extract index[5] → Model only
```

**장점**: HIFlowApp API 변경 없이 구현 가능
**단점**: 불필요한 코드도 함께 생성됨 (성능에 큰 영향 없음)

### 4.2 카테고리-인덱스 매핑 테이블

```typescript
const CATEGORY_INDEX_MAP = {
  "Asp.net Core": {
    model: 5,
    controller: 0,
    apiController: 1,
    viewIndex: 2,
    viewPost: 3,
    viewOnePage: 4,
  },
  "Java": {
    model: 0,
    mapperInterface: 1,
    mapperXml: 2,
    controller: 3,
    viewIndex: 4,
    viewPost: 5,
    viewOnePage: 6,
  },
  "WPF API": {
    viewModel: 0,
    viewListXaml: 1,
    viewListCs: 2,
    viewWriteXaml: 3,
    viewWriteCs: 4,
  },
} as const;
```

### 4.3 파일 구조 (신규 파일)

```
hiflow-mcp/src/
├── tools/
│   └── source-powertool.ts      # Source Power Tool MCP 도구 등록 (신규)
├── api-client.ts                 # API 클라이언트 메서드 추가 (수정)
├── types.ts                      # DTO 타입 추가 (수정)
└── index.ts                      # 도구 등록 추가 (수정)
```

### 4.4 API 클라이언트 추가 메서드

```typescript
// api-client.ts에 추가할 메서드
class HIFlowApiClient {
  // Group A: 설정/스키마
  async getSourcePowertoolList(): Promise<SourcePowertoolDto[]>
  async getSourcePowertool(id: string): Promise<SourcePowertoolDto>
  async getSourceTableList(configId: string): Promise<string[]>

  // Group B: 카테고리별 생성
  async generateAspnetSource(configId: string, table: string): Promise<string[]>
  async generateJavaSource(configId: string, table: string): Promise<string[]>
  async generateWpfSource(configId: string, table: string, type: string): Promise<string[]>
  async generateTemplateSource(configId: string, table: string): Promise<SourcePairDto[]>

  // Group C: 컨텍스트 기반 생성
  async generateDbContext(configId: string): Promise<string>
}
```

---

## 5. 구현 계획

### Phase 1: 기반 구축 (설정/스키마 도구)
1. `types.ts`에 `SourcePowertoolDto`, `SourcePairDto` 타입 추가
2. `api-client.ts`에 설정/스키마 API 호출 메서드 추가
3. `tools/source-powertool.ts` 파일 생성
4. Group A 도구 4개 구현:
   - `source_config_list`
   - `source_config_get`
   - `source_table_list`
   - `source_table_info`
5. `index.ts`에 도구 등록

### Phase 2: 카테고리별 생성 도구 (테이블 선택 필요)
1. `api-client.ts`에 소스 생성 API 호출 메서드 추가
2. 카테고리-인덱스 매핑 로직 구현
3. Group B 도구 6개 구현:
   - `source_generate_model`
   - `source_generate_controller`
   - `source_generate_api`
   - `source_generate_view`
   - `source_generate_mapper`
   - `source_generate_full`

### Phase 3: 컨텍스트 기반 생성 도구 (테이블 선택 불필요)
1. `api-client.ts`에 컨텍스트 기반 생성 메서드 추가
2. Group C 도구 2개 구현:
   - `source_generate_dbcontext`
   - `source_generate_all_models`

### Phase 4: 테스트 및 마무리
1. 전체 도구 빌드 검증 (`npm run build`)
2. MCP Inspector 또는 Claude Desktop으로 도구 동작 테스트
3. README 업데이트 (도구 목록 추가)
4. 버전 업데이트

---

## 6. 도구 상세 스펙

### 6.1 MCP 도구 입출력 스펙

#### source_config_list
```
Input:  {}
Output: { count, configs: [{ id, name, dbType, outputType, namespace }] }
```

#### source_config_get
```
Input:  { configId: string }
Output: { id, name, dbType, dbHost, dbPort, dbName, outputType, namespace, templateYn, templateId }
```

#### source_table_list
```
Input:  { configId: string }
Output: { count, tables: string[] }
```

#### source_table_info
```
Input:  { configId: string, tableName: string }
Output: { tableName, columns: [{ name, type, dbType, comment }] }
```

#### source_generate_model
```
Input:  { configId: string, tableName: string }
Output: { language, category: "model", source: string }
```

#### source_generate_controller
```
Input:  { configId: string, tableName: string }
Output: { language, category: "controller", source: string }
```

#### source_generate_api
```
Input:  { configId: string, tableName: string }
Output: { language, category: "api_controller", source: string }
```

#### source_generate_view
```
Input:  { configId: string, tableName: string, viewType: "index" | "post" | "onepage" }
Output: { language, category: "view", viewType, source: string }
```

#### source_generate_mapper
```
Input:  { configId: string, tableName: string }
Output: { language: "java", category: "mapper", files: [{ type, source }] }
```

#### source_generate_full
```
Input:  { configId: string, tableName: string }
Output: { language, count, files: [{ category, source }] }
```

#### source_generate_dbcontext
```
Input:  { configId: string }
Output: { language: "csharp", category: "dbcontext", source: string }
```

#### source_generate_all_models
```
Input:  { configId: string }
Output: { language, count, models: [{ tableName, source }] }
```

---

## 7. 의존성 및 제약사항

### 7.1 의존성
- HIFlowApp REST API 서버가 실행 중이어야 함
- MCP 서버에서 HIFlowApp API 접근 가능 (네트워크)
- 인증된 세션 (JWT) 필요
- 프로젝트 선택 상태 필요

### 7.2 제약사항
- 카테고리별 생성 시 전체 생성 API를 호출 후 인덱스로 추출하므로, 생성 시간은 전체 생성과 동일
- `source_table_info`는 기존 API에 전용 엔드포인트가 없어, 전체 생성 후 모델에서 스키마를 추출하거나 별도 구현 필요
- WPF type 파라미터 ("Api", "Db", "Json")에 따라 ViewModel 생성 방식이 다름
- Template 기반 생성은 카테고리별 분리가 아닌, 템플릿 정의대로 전체 생성

### 7.3 리스크
- 대량 테이블 (100개 이상) 시 `source_generate_all_models` 응답 시간 지연 가능
- DB 커넥션 정보가 사설 IP인 경우 hubinsoft.com 계정만 허용 (기존 정책)

---

## 8. 예상 도구 총 수

| 그룹 | 도구 수 | 비고 |
|------|---------|------|
| A. 설정/스키마 | 4개 | source_config_*, source_table_* |
| B. 카테고리별 생성 | 6개 | source_generate_model/controller/api/view/mapper/full |
| C. 컨텍스트 기반 생성 | 2개 | source_generate_dbcontext/all_models |
| **합계** | **12개** | |

기존 54개 도구 + 신규 12개 = **총 66개 도구**
