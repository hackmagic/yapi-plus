# YApi Plus — 开发任务计划

> 检测日期: 2026-04-29 (第 4 次)
> 后端: ~95% | 前端: ~98% | 测试: 基线可用
> 进度单一真实来源: `TASK_PLAN.md`（其他迁移文档仅作历史记录）

---

## 已修复错误记录

### 编译错误
- [x] Vue 组件导入路径错误修复
- [x] TypeScript 类型声明补全
- [x] ESLint 规则配置优化
- [x] Vite 构建配置清理（移除 React 相关）

### 运行时错误
- [x] 异步数据加载时序问题修复
- [x] 路由守卫权限验证逻辑完善
- [x] API 请求错误处理统一
- [x] 组件生命周期管理优化

### 数据问题
- [x] Mock 服务器数据格式标准化
- [x] 接口测试数据验证逻辑
- [x] 用户会话状态管理修复
- [x] 项目配置数据同步机制

### @vicons 构建阻塞
- **问题描述**: `@vicons/ionicons5` 导出名与代码引用不匹配，导致前端构建失败
- **状态**: 已修复并验证通过 ✅
- **结果**: `npm run build` 可成功产出

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

## 当前剩余任务

### Phase 4 — 清理与优化 (P4)

#### Task 4.1: 依赖与运行时修复
- [x] 修复 @vicons 导出名不匹配导致的构建失败
- [x] 补齐测试依赖 `rewire`
- [x] 修复 Node 22 + Babel6 测试运行兼容问题（测试启动器显式注册 Babel）

#### Task 4.2: 补充测试

**框架:** Ava (已配置)

**本轮已完成:**
- [x] 接口参数合并逻辑测试（`handleParamsValue`）
- [x] 鉴权判定逻辑测试（`checkAuth`）
- [x] Mock 路由匹配扩展测试（`matchApi` 复杂路径）

#### Task 4.3: 文档收敛与治理

- [x] 确认并移除重复/过时迁移进度文档
- [x] 统一以 `TASK_PLAN.md` 作为唯一真实进度来源
- [ ] 清理测试阶段 Node 循环依赖告警（不阻塞）
- [ ] 评估并优化前端大包体告警（不阻塞）

---

## 本轮验收结果（2026-04-29）

- [x] `npm run build` 成功
- [x] `npm test` 成功（38 passed）
- [x] 已补充接口/鉴权/Mock 核心测试
- [x] 文档入口统一，`TASK_PLAN.md` 为唯一真实进度源

## 后续工作量预估（仅剩治理项）

| 项目 | 预估 |
|------|------|
| 测试循环依赖告警治理 | 0.5-1 天 |
| 前端包体拆分与构建优化 | 0.5-1.5 天 |
| 文档持续维护 | 按需 |
| **合计** | **1-2.5 天** |

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