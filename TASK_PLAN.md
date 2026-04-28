# YApi Plus — 开发任务计划

> 检测生成日期: 2026-04-28
> 后端: ~95% | 前端: ~80% | 测试: ~5%

---

## 当前进度 (与上次对比)

| 维度 | 上次 (v1) | 本次 (v2) | 变化 |
|------|-----------|-----------|------|
| Vue 文件总数 | 72 | 79 | +7 |
| Pinia Store | 0/4 | **4/4 ✅** | +4 |
| 严重阻塞项 | 3 个 | **0 个 ✅** | 全部修复 |
| 占位符页面 | 3 个 | **0 个 ✅** | 全部替换 |
| 组子页面缺失 | 4 个 | **0 个 ✅** | 全部实现 |
| 项目 Activity 页 | ❌ | **✅ 已实现** | +1 |
| HeaderEditor | ❌ | **✅ 已实现** | +1 |
| InterfaceColMenu | ❌ | **✅ 已实现** | +1 |
| 路由配置 | 基础 | **完整 (含 Group 子路由) ✅** | 大幅扩展 |
| TODO 残留 | 3 处 | 2 处 | 路由守卫未修 |

### 已完成的 15 个任务

- [x] Task 0.1 — `client/store/user.js`
- [x] Task 0.2 — `client/store/project.js`
- [x] Task 0.3 — `client/store/interfaceCol.js`
- [x] Task 0.4 — `client/store/group.js`
- [x] Task 0.5 — `InterfaceColMenu.vue`
- [x] Task 0.6 — `HeaderEditor.vue`
- [x] Task 1.1 — `Group.vue` (完整页面)
- [x] Task 1.2 — `Project.vue` (完整布局, 侧边栏, 路由)
- [x] Task 1.3 — `User.vue` (个人主页, 资料编辑)
- [x] Task 2.3 — Group 子页面全部: `GroupSetting.vue`, `MemberList.vue`, `ProjectList.vue`, `GroupLog.vue`
- [x] Task 2.4 (部分) — `Project/Activity/Activity.vue`
- [x] 路由配置 — Group 完整子路由、路由重定向

---

## 剩余任务

### Phase 2 — 缺失页面实现 (P2)

#### Task 2.1: InterfaceCol 子页面 (剩余 4 个)

**路径:** `client/containers/Project/Interface/InterfaceCol/`

| 文件 | 状态 | 说明 |
|------|------|------|
| InterfaceColMenu.vue | **✅ 已完成** | 集合菜单组件 |
| InterfaceColContent.vue | ❌ 待创建 | 集合内容展示页，显示用例列表，支持运行 |
| InterfaceCaseContent.vue | ❌ 待创建 | 单个用例详情/编辑页 |
| CaseReport.vue | ❌ 待创建 | 测试运行报告页 |
| ImportInterface.vue | ❌ 待创建 | 导入接口到集合的弹窗/页面 |

**已存在 SCSS:** `InterfaceColMenu.scss`, `InterfaceCaseContent.scss`

**依赖 Store:** `useInterfaceColStore` (已实现)

**后端参考:**
- `server/controllers/interfaceCol.js`
- `server/models/interfaceCol.js`, `server/models/interfaceCase.js`

**实现的 Interface.vue 页面** (`client/containers/Project/Interface/Interface.vue`) 已预留了 InterfaceCol 区域, 等待这 4 个组件完成后集成。

#### Task 2.2: 接口测试运行页面

**路径:** `client/containers/Project/Interface/InterfaceList/Run/Run.vue`
**已存在 SCSS:** `Run.scss`

**实现要求:**
- 单个接口的测试运行页面
- 展示请求参数 (Params、Headers、Body)
- 发送请求并展示响应结果 (状态码、响应体、响应头)
- 支持保存为测试用例到集合
- 支持预设环境变量

#### Task 2.4: Project 子页面 (剩余 3 个)

| 路径 | 当前状态 | 说明 |
|------|----------|------|
| `Project/Activity/Activity.vue` | **✅ 已完成** | — |
| `Project/Setting/ProjectMock/ProjectMock.vue` | ❌ 空目录 | Mock 设置 (延迟、规则等) |
| `Project/Setting/ProjectRequest/ProjectRequest.vue` | ❌ 仅 .scss | 请求设置 (代理、跨域等) |
| `Project/Setting/ProjectMessage/ProjectTag.vue` | ❌ 仅 .scss | 消息通知设置 / 标签管理 |

---

### Phase 3 — 功能完善 (P3)

#### Task 3.1: 搜索功能

**文件:** `client/components/Header/Search/Search.vue:26`
**当前:** `// TODO: 实现搜索功能，跳转到搜索结果页`

**实现要求:**
- 实现搜索逻辑, 调用后端搜索 API
- 跳转到搜索结果页面 (或下拉即时搜索)
- 搜索范围: 接口名称、路径、项目名称

#### Task 3.2: 通知面板

**文件:** `client/components/Notify/Notify.vue:22`
**当前:** `// TODO: 打开通知面板`

**实现要求:**
- 实现通知下拉面板
- 展示未读通知列表
- 支持标记已读
- 对接后端: `server/models/log.js`

#### Task 3.3: 路由守卫 — 管理员权限检查

**文件:** `client/router/index.js:115`
**当前:** 注释掉的 TODO

**实现要求:**
- 实现 `router.beforeEach` 中的管理员权限检查
- 非管理员访问 `requiresAdmin` 页面时重定向到登录或首页
- 依赖 Store: `useUserStore` (检查 `role`)

---

### Phase 4 — 清理与优化 (P4)

#### Task 4.1: 移除 React 冗余依赖

**涉及文件:** `package.json`, `vite.config.js`

**操作:**
- 从 `dependencies` 移除: `react`, `react-dom`, `redux`, `react-redux`, `react-router-dom`
- 从 `vite.config.js` 移除 React plugin 和 vendor chunk
- 验证确认没有 JSX 文件残留

#### Task 4.2: 补充测试

**框架:** Ava (已配置)

**建议覆盖:**
- Store 逻辑测试 (user, project, interfaceCol)
- 核心 API 集成测试 (接口 CRUD、用户认证)
- Mock 服务器测试 (已有 `mockServer.test.js` 可扩展)

#### Task 4.3: DevTools 目录

**路径:** `client/containers/DevTools/`
**当前状态:** 完全空目录

**说明:** 需确认功能需求后再实现。

---

## 工作量预估 (更新版)

| Phase | 任务数 | 预估人天 | 依赖 |
|-------|--------|----------|------|
| P2 — 缺失页面 | 8 (4 InterfaceCol + 1 Run + 3 Project设置) | 5-7 天 | Store 已就绪 |
| P3 — 功能完善 | 3 (搜索 + 通知 + 路由守卫) | 2-3 天 | `useUserStore` 已就绪 |
| P4 — 清理优化 | 3 (React 清理 + 测试 + DevTools) | 1-2 天 | — |
| **合计** | **~14** | **8-12 天** | |

---

## 关键文件索引

### 后端 API 参考
- `server/router.js` — 所有 API 路由定义
- `server/controllers/` — 控制器实现
- `server/models/` — Mongoose 数据模型

### 前端实现参考
- `client/main.js` — 入口 (Vue 3 + Pinia + Router + Naive UI)
- `client/components/` — 已完成的可复用组件 (24 个)
- `client/containers/` — 页面容器 (含新实现的页面)
- `client/store/` — 4 个 Pinia Store (已全部实现)
- `client/router/index.js` — 路由配置
- `client/constants/variable.js` — 共享常量

### 文档参考
- `ARCHITECTURE.md` — 架构说明
- `VUE3_MIGRATION_STATUS.md` — 迁移状态
- `VUE3_MIGRATION_PROGRESS.md` — 迁移进度 (含 React → Vue 3 转换指南和代码示例)
