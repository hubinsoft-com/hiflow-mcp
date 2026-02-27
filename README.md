# @hubinsoft/hiflow-mcp

MCP (Model Context Protocol) server for **HIFlow App** - Project management, WBS, requirements, design documents, meeting minutes, and more.

## Installation

### Claude Code

```bash
claude mcp add hiflow -t stdio \
  -e HIFLOW_API_BASE_URL=https://your-server:2825 \
  -e HIFLOW_MCP_USER=your-id \
  -e HIFLOW_MCP_PASS=your-pw \
  -- npx -y @hubinsoft/hiflow-mcp
```

### Local Development

```bash
claude mcp add hiflow -t stdio \
  -e HIFLOW_API_BASE_URL=https://your-server:2825 \
  -e HIFLOW_MCP_USER=your-id \
  -e HIFLOW_MCP_PASS=your-pw \
  -- node /path/to/hiflow-mcp/build/index.js
```

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `HIFLOW_API_BASE_URL` | No | `https://app.hubinflow.ai:2825` | HIFlow API server URL |
| `HIFLOW_MCP_USER` | No | - | Auto-login user ID |
| `HIFLOW_MCP_PASS` | No | - | Auto-login password |
| `HIFLOW_API_TIMEOUT` | No | `15000` | API timeout in milliseconds |

## Available Tools (50)

### Auth (2)
| Tool | Description |
|------|-------------|
| `auth_login` | Login with userId/password, get JWT |
| `auth_use_token` | Apply existing JWT token |

### Project (2)
| Tool | Description |
|------|-------------|
| `project_list` | List user's projects |
| `project_select` | Set active project |

### Todo (4)
| Tool | Description |
|------|-------------|
| `todo_list` | List todos (filter by status) |
| `todo_today` | Today's todos |
| `todo_upsert` | Create/update todo |
| `todo_complete` | Mark complete/incomplete |

### WBS (10)
| Tool | Description |
|------|-------------|
| `wbs_list` | WBS tree list |
| `wbs_get` | WBS item detail |
| `wbs_add` | Add WBS item |
| `wbs_update` | Update WBS detail |
| `wbs_delete` | Delete WBS item |
| `wbs_save_tree` | Save full WBS tree |
| `wbs_today_tasks` | Today's WBS tasks |
| `wbs_past_tasks` | Delayed/past tasks |
| `wbs_milestones` | Project milestones |
| `wbs_snapshot_create` | Create WBS snapshot |

### Requirements (8)
| Tool | Description |
|------|-------------|
| `requirements_list` | Requirements tree list |
| `requirements_get` | Requirement detail |
| `requirements_save` | Save requirements tree |
| `requirements_save_detail` | Save requirement detail |
| `requirements_delete` | Delete requirement |
| `requirements_export_markdown` | Export as Markdown |
| `requirements_snapshot_create` | Create snapshot |
| `requirements_snapshot_list` | Get snapshot by version |

### Process Define (6)
| Tool | Description |
|------|-------------|
| `process_list` | Process definition list |
| `process_get` | Process detail |
| `process_save` | Save process tree |
| `process_save_detail` | Save process detail |
| `process_delete` | Delete process |
| `process_convert_from_requirements` | Convert requirements to processes |

### Meeting Minutes (5)
| Tool | Description |
|------|-------------|
| `meeting_list` | Meeting minutes list |
| `meeting_get` | Meeting detail |
| `meeting_save` | Create/update meeting |
| `meeting_delete` | Delete meeting |
| `meeting_archive` | Archive meeting |

### Research Notes (5)
| Tool | Description |
|------|-------------|
| `research_info_list` | Research topics list |
| `research_list` | Research notes by topic |
| `research_get` | Research note detail |
| `research_save` | Create/update note |
| `research_delete` | Delete note |

### UI/UX Design (4)
| Tool | Description |
|------|-------------|
| `uiux_list` | UI/UX design list |
| `uiux_get` | UI/UX detail |
| `uiux_save` | Create/update design |
| `uiux_delete` | Delete design |

### Table/DB Design (4)
| Tool | Description |
|------|-------------|
| `table_define_list` | Table design list |
| `table_define_get` | Table detail (DBML) |
| `table_define_save` | Create/update definition |
| `table_define_delete` | Delete definition |

## Typical Workflow

```
auth_login -> project_list -> project_select -> (use any tool)
```

1. **Login**: `auth_login` (or auto-login via env vars)
2. **Select project**: `project_list` then `project_select`
3. **Use tools**: All other tools require a selected project

## Development

```bash
cd hiflow-mcp
npm install
npm run build
npm start
```

## License

MIT
