# YApi Plus — 开发任务计划

> 检测日期: 2026-04-28 (第 3 次)
> 后端: ~95% | 前端: ~97% | 测试: ~5%

---

## 进度总览

| 维度 | v1 (初始) | v2 (第1轮AI) | v3 (第2轮AI) | 变化 |
|------|-----------|-------------|-------------|------|
| Vue 文件数 | 72 | 79 | **88** | +16 |
| Pinia Store | 0/4 | 4/4 ✅ | 4/4 ✅ | — |
| 严重阻塞项 | 3 | 0 ✅ | 0 ✅ | — |
| 占位符页面 | 3 | 0 ✅ | 0 ✅ | — |
| 组子页面缺失 | 4 | 0 ✅ | 0 ✅ | — |
| InterfaceCol 子页面 | 5 缺失 | 4 缺失 | **0 缺失 ✅** | +4 |
| Run.vue (接口测试) | ❌ | ❌ | **✅ 已实现** | +1 |
| Project 设置页面 | 4 缺失 | 3 缺失 | **0 缺失 ✅** | +3 |
| TODO 代码残留 | 3 处 | 2 处 | **0 处 ✅** | 全部清理 |
| React 冗余依赖 | 存在 | 存在 | **已移除 ✅** | 清理完成 |
| 路由配置 | 基础 | 扩展 | **完整 ✅** | InterfaceCol/Case/Run等全量路由 |

### 本阶段新增完成 (第 2 轮 AI)

**缺失页面 (P2):**
- [x] `InterfaceColContent.vue` — 集合内容展示页
- [x] `InterfaceCaseContent.vue` — 用例详情/编辑页
- [x] `CaseReport.vue` — 测试运行报告页
- [x] `ImportInterface.vue` — 导入接口弹窗
- [x] `Run.vue` — 接口测试运行页
- [x] `ProjectMock.vue` — Mock 设置页
- [x] `ProjectRequest.vue` — 请求设置页
- [x] `ProjectTag.vue` — 标签管理页
- [x] `Search/` — 搜索结果页 (新建)

**功能完善 (P3):**
- [x] `Search.vue` — 搜索功能实现 (TODO 已移除)
- [x] `Notify.vue` — 通知面板功能实现 (TODO 已移除)
- [x] `router/index.js` — 管理员权限守卫实现 (TODO 已移除)
- [x] 路由新增: InterfaceCol 子路由、InterfaceCase 路由、ProjectMock/Request/Tag 路由

**清理优化 (P4):**
- [x] `package.json` — React/Redux 依赖已移除
- [x] `vite.config.js` — React plugin 和 vendor chunk 已移除

---

## 剩余极少量任务

### Phase 4 — 清理与优化 (P4)

#### Task 4.2: 补充测试

**框架:** Ava (已配置)

**建议覆盖:**
- Store 逻辑测试 (user, project, interfaceCol)
- 核心 API 集成测试 (接口 CRUD、用户认证)
- Mock 服务器测试 (已有 `mockServer.test.js` 可扩展)

#### Task 4.3: 空目录清理/确认

以下 3 个目录为空, 需确认是废弃还是待实现:

| 路径 | 状态 | 建议 |
|------|------|------|
| `containers/DevTools/` | 完全空目录 | 确认是否废弃, 如不需要则删除 |
| `components/MyPopConfirm/` | 完全空目录 | 确认是否仍需要, 如需要则实现 |
| `components/UsernameAutoComplete/` | 完全空目录 | 确认是否仍需要, 如需要则实现 |

---

## 工作量预估 (最终版)

| 项目 | 预估 |
|------|------|
| 补充测试 (P4.2) | 2-3 天 |
| 空目录清理 (P4.3) | 0.5 天 |
| **合计** | **2.5-3.5 天** |

---

## 关键文件索引

### 后端 API 参考
- `server/router.js` — 所有 API 路由定义
- `server/controllers/` — 控制器实现
- `server/models/` — Mongoose 数据模型

### 前端实现参考
- `client/store/` — 4 个 Pinia Store (已全部实现)
- `client/router/index.js` — 完整路由配置
- `client/components/` — 可复用组件库 (26 个组件目录)
- `client/containers/` — 全部页面容器
- `client/constants/variable.js` — 共享常量
