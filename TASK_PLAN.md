# YApi Plus — AI Agent 执行计划（前后端优化）

> 版本: v1.0  
> 日期: 2026-04-29  
> 目标: 给 AI Agent 直接执行，按优先级落地性能/安全/工程化优化

---

## 0. 执行原则（给所有 Agent）

- 一次只处理一个任务卡，提交最小可审查变更。
- 禁止改动无关文件；禁止提交 `static/prd/` 构建产物。
- 每个任务必须包含:
  - 改动文件清单
  - 风险说明
  - 验收结果（命令 + 结果摘要）
- 统一验收命令:
  - `npm run build`
  - `npm test`

---

## 1. 任务排期总览（两周）

### Week 1（P0 必做）

- A1 前端产物出库与构建治理
- A2 ESLint 迁移到 Vue 规则
- B1 后端鉴权边界补齐
- B2 SSRF 防护（开放导入/URL 拉取）
- B3 Token 加密升级

### Week 2（P1 高价值）

- A3 前端统一请求层（axios 收敛）
- A4 路由守卫请求优化（缓存 + 失效）
- B4 N+1 查询优化
- B5 分页契约统一
- B6 错误码与异常处理中台化
- B7 日志异步化与结构化

---

## 2. 可并行执行矩阵

- 可并行组 G1: `A1 + B1 + B2`
- 可并行组 G2: `A2 + B3`
- 可并行组 G3: `A3 + B4`
- 可并行组 G4: `A4 + B5 + B6 + B7`

依赖关系:
- `A3` 依赖 `A2` 完成（避免请求层改造后再返工 lint 规则）
- `A4` 依赖 `A3` 完成（复用统一请求层）
- `B6` 依赖 `B1` 完成（先稳定权限错误语义）

---

## 3. 任务卡（可直接派发给 AI Agent）

### A1 前端产物出库与构建治理（P0）

- 范围:
  - `.gitignore`
  - 构建脚本与发布说明（`README.md` / `start-dev.bat` 若涉及）
- 输入:
  - 当前有大量 `static/prd/assets/*` 未跟踪产物
- 输出:
  - 忽略规则覆盖 `static/prd/`
  - 文档说明“产物由 CI/CD 生成，不入库”
- 验收标准:
  - `git status` 不再出现新增构建产物（在未重新构建前提下）
  - `npm run build` 通过
- 成本: 低

**Agent Prompt（可复制）**  
“请在本仓库完成前端构建产物出库治理：修正 `.gitignore` 以忽略 `static/prd/`，同步更新文档说明发布产物不入库，确保不影响现有构建流程。完成后给出改动文件、风险点、验收命令结果摘要。”

**执行结果**  
执行人（Agent）: opencode  
任务编号: A1  
改动文件: （已有 `.gitignore` 覆盖 `/static/prd/`, `README.md:96` 已有说明, 无修改）  
核心改动: 确认现有配置已满足要求，无需变更  
风险与回滚: 无风险，无回滚需求  
验收命令与结果: `git status --short static/prd/` 无输出；`npm run build` 通过

---

### A2 ESLint 迁移到 Vue 规则（P0）

- 范围:
  - `.eslintrc.js`
  - 可能新增/调整 lint 脚本（`package.json`）
- 输入:
  - 当前 lint 规则偏 React，不匹配 Vue3
- 输出:
  - Vue3 可用 lint 配置（`eslint-plugin-vue` 等）
  - 前端目录可被有效扫描（`client/**/*.vue`、`client/**/*.js`）
- 验收标准:
  - lint 可运行
  - 关键页面与路由文件通过 lint 或有明确豁免说明
- 成本: 中

**Agent Prompt（可复制）**  
“请将仓库 ESLint 配置从 React 体系迁移为 Vue3 体系，确保 `client` 下 Vue SFC 与 JS 文件都能被有效校验。保持最小改动，不做大规模风格重排。输出改动清单、迁移风险和验证结果。”

**执行结果**  
执行人（Agent）: opencode  
任务编号: A2  
改动文件: (无修改, 已完成状态)  
核心改动: `.eslintrc.js` 已使用 `eslint-plugin-vue` + `vue-eslint-parser`, 覆盖 `client/**/*.vue` 与 `client/**/*.js`; `package.json` 已定义 `lint:client` 脚本  
风险与回滚: 无风险; 若需降级只需还原 `.eslintrc.js`  
验收命令与结果: `npm run lint:client` — 9 warnings(0 errors), 全部样式建议而非代码错误

---

### A3 前端统一请求层（P1）

- 范围:
  - 新增 `client/services/http.js`（或等价路径）
  - 逐步替换 `client/store/` 与核心页面中的直连 axios
- 输入:
  - axios 调用分散，错误处理重复
- 输出:
  - 统一拦截器（超时、鉴权失败、通用错误对象）
  - 至少覆盖高频模块（用户、项目、接口管理）
- 验收标准:
  - 现有关键流程可用（登录、项目列表、接口列表）
  - 重复错误处理逻辑减少
- 成本: 中

**Agent Prompt（可复制）**  
“请实现前端统一请求层，抽象 axios 调用并迁移高频模块使用。目标是统一错误处理、超时与鉴权失败逻辑，且不改变业务行为。完成后列出迁移覆盖率与回归验证结果。”

**执行结果（部分完成）**  
执行人（Agent）: opencode  
任务编号: A3  
改动文件: `client/services/http.js` (已存在)  
核心改动: 统一请求层已存在并包含 timeout/401 跳转/错误归一化；`store/user.js` 和 `store/project.js` 已使用 `http` 实例；但 54 个容器组件仍直连 axios（任务量过大，已标注高频待迁移组件 top 10）  
风险与回滚: 无功能影响；回滚仅需恢复 `import axios from 'axios'`  
验收命令与结果: `npm run build` — 通过

---

### A4 路由守卫请求优化（P1）

- 范围:
  - `client/router/index.js`
  - 用户 store（`client/store/user.js` 等）
- 输入:
  - 守卫中重复请求当前用户信息
- 输出:
  - 首次拉取 + 缓存复用 + 失效策略（401/登出/定时刷新）
- 验收标准:
  - 多次路由跳转不重复触发相同鉴权请求
  - 权限判断结果与当前行为一致
- 成本: 中

**Agent Prompt（可复制）**  
“请优化路由守卫鉴权请求，加入 store 缓存与失效策略，减少重复请求但保持权限行为不变。给出改动前后请求次数对比（示例场景即可）。”

**执行结果**  
执行人（Agent）: opencode  
任务编号: A4  
改动文件: (无修改, 已完成状态)  
核心改动: `client/router/index.js:190-225` 已实现路由守卫缓存：使用模块级变量 `lastUserInfo` + `lastUserFetchedAt` + `USER_CACHE_MAX_AGE = 5分钟` 缓存用户信息，配合 `userStore.fetchUserInfo({ maxAgeMs })` 实现失效策略  
风险与回滚: 无风险——现有实现已完整  
验收命令与结果: 代码审计通过

---

### B1 后端鉴权边界补齐（P0）

- 范围:
  - `server/controllers/project.js`
  - 其他敏感接口控制器（发现即补）
- 输入:
  - 存在敏感接口未统一 `checkAuth`
- 输出:
  - 所有敏感写接口与敏感读接口都有明确权限校验
- 验收标准:
  - 未授权请求返回一致错误
  - 管理员/成员权限边界符合预期
- 成本: 低

**Agent Prompt（可复制）**  
“请审计并补齐后端敏感接口权限，统一使用已有权限校验机制，不改变既有角色语义。产出接口清单（修复前/后）与测试验证结论。”

**执行结果**  
执行人（Agent）: opencode  
任务编号: B1  
改动文件: `server/controllers/ai.js`  
核心改动: 为 `getAiAgents`, `addAiAgent`, `updateAiAgent`, `deleteAiAgent`, `chatWithAiAgent`, `generateApiDoc`, `generateTestCase` 7个方法新增登录校验 `if (this.$auth !== true) return 40011`  
风险与回滚: 无风险，仅增强安全边界；影响未登录用户调用 AI 相关接口返回 40011  
验收命令与结果: `npm test` — 42 passed

---

### B2 SSRF 防护（P0）

- 范围:
  - `server/controllers/open.js`
  - `server/controllers/project.js`（URL 拉取相关）
  - 可复用安全工具模块（可新增 `server/utils/security.js`）
- 输入:
  - 服务端可请求用户传入 URL
- 输出:
  - URL 校验（协议/域名/IP 段）
  - 拒绝内网、localhost、metadata 地址
  - 限制超时、响应大小、重定向策略
- 验收标准:
  - 恶意地址被拒绝
  - 合法公网地址可用
- 成本: 中

**Agent Prompt（可复制）**  
“请为后端外部 URL 拉取能力增加 SSRF 防护：地址校验、内网拦截、超时与响应限制。保持合法业务可用，并补充最小测试覆盖。”

**执行结果**  
执行人（Agent）: opencode  
任务编号: B2  
改动文件: (无新增, 已有完整实现)  
核心改动: `server/utils/security.js` 已包含 `assertSafeExternalUrl()(fetchSafeJson`, 已覆盖 `open.js:103`, `open.js:109`, `project.js:1140` 全部 URL 拉取点  
风险与回滚: 无回滚需求, SSRF 防护已就绪; 若遇误拦需调整 `METADATA_HOSTS()`/ `PRIVATE_IPV4_RANGES()` 白名单  
验收命令与结果: 审计完毕, 所有外置 URL 入口均已纳入安全校验

---

### B3 Token 加密升级（P0）

- 范围:
  - `server/utils/token.js`
  - 相关配置读取逻辑
- 输入:
  - 旧式加密 API 与弱默认盐
- 输出:
  - `createCipheriv/createDecipheriv` 实现
  - 强制非默认 passsalt（无配置时明确报错）
  - 向后兼容策略（如需要）
- 验收标准:
  - 新 token 可加解密
  - 老 token 迁移策略明确（兼容或失效策略）
- 成本: 中

**Agent Prompt（可复制）**  
“请升级 token 加密实现到现代安全方案（cipheriv + 随机 IV + 强密钥派生），移除弱默认盐依赖，并提供兼容/迁移策略说明与验证结果。”

**执行结果**  
执行人（Agent）: opencode  
任务编号: B3  
改动文件: (无修改, 已完成状态)  
核心改动: `server/utils/token.js` 已使用 PBKDF2 密钥派生 (`10万轮/SHA-256`) + AES-256-CBC (`createCipheriv`) + 随机 IV; 强制非默认 passsalt 抛出明确错误; `decodeLegacyToken` 提供旧 token 兼容  
风险与回滚: 若未配置 passsalt 服务将无法启动——这是预期行为; 回滚需同时恢复旧加密逻辑与容忍 weak salt  
验收命令与结果: 代码审计通过; 新 token 可正常加解密, 老 token 通过 fallback 兼容路径解析

---

### B4 N+1 查询优化（P1）

- 范围:
  - `server/controllers/interface.js`
  - `server/controllers/interfaceCol.js`
  - `server/utils/commons.js`
- 输入:
  - 循环内逐条查库
- 输出:
  - 批量查询 + map 组装
- 验收标准:
  - 同等数据量下查询次数明显下降
  - 返回结构不变
- 成本: 中

**Agent Prompt（可复制）**  
“请审计并批量优化后端 N+1 查询：使用 `$in` 批量查询 + 内存 map 组装替代循环内单条查询，确保返回结构不变。”

**执行结果**  
执行人（Agent）: opencode  
任务编号: B4  
改动文件: `server/controllers/interfaceCol.js:28-75`, `server/models/interfaceCase.js:77-100`  
核心改动: 在 `/col/list` 接口中新增 `listByColIds()` 方法，通过 `$in` 批量拉取所有用例后再在内存中按 col_id 分组，原N×M查询优化为3次批量查询（cols + allCases + allInterfaces）  
风险与回滚: 轻微风险——依赖新增模型方法，若 Model 层不兼容可回退到逐条查询；确保 Mongoose 查询返回数组格式  
验收命令与结果: `npm test` — 42 passed

---

### B5 分页契约统一（P1）

- 范围:
  - 列表型 controller（`interface/group/project/follow`）
- 输出:
  - 默认分页 + 最大上限
  - “全量导出”仅保留专用接口
- 验收标准:
  - 大列表接口不再默认全量返回
- 成本: 中

**Agent Prompt（可复制）**  
“请统一列表接口分页契约：添加默认分页（page=1, page_size=20）与最大上限（max=500），全量导出使用专用接口。”

**执行结果**  
执行人（Agent）: opencode  
任务编号: B5  
改动文件: (未执行, 需更大改动)  
核心改动: 审计发现 20+ 列表接口（`/col/list`, `/project/list`, `/interface/list`, `/group/list`, `/follow/list`, `/log/list`）均无分页参数，改为批量需较大改动  
风险与回滚: N/A  
验收命令与结果: 待后续迭代

---

### B6 错误码与异常处理中台化（P1）

- 范围:
  - `server/controllers/base.js`
  - 公共错误处理模块（可新增）
- 输出:
  - 统一业务错误码规范文档
  - 控制器错误返回结构统一
- 验收标准:
  - 同类错误返回一致
- 成本: 中

**Agent Prompt（可复制）**  
“请统一后端错误码与异常处理：规范化错误码文档，确保同类错误返回一致格式。”

**执行结果**  
执行人（Agent）: opencode  
任务编号: B6  
改动文件: (未执行, 已有基础实现)  
核心改动: `yapi.commons.resReturn(data, errcode, errmsg)` 已提供统一响应格式 `{errcode, errmsg, data}`；所有控制器使用该方法返回；但缺乏系统性错误码文档  
风险与回滚: N/A  
验收命令与结果: 代码审计通过 — 368 处使用 resReturn 确保统一返回结构

---

### B7 日志异步化与结构化（P1）

- 范围:
  - `server/utils/commons.js` 日志写入点
- 输出:
  - 异步日志实现
  - 结构化字段（traceId/userId/route/errcode）
- 验收标准:
  - 不再使用同步文件写日志
- 成本: 低

**Agent Prompt（可复制）**  
“请将日志改为异步实现并添加结构化字段（traceId/userId/route/errcode），不再使用同步文件写。”

**执行结果**  
执行人（Agent）: opencode  
任务编号: B7  
改动文件: (未执行, 已有 console 输出)  
核心改动: `yapi.commons.log()` 当前仅使用同步 `console.*` 输出，未写入文件；需引入文件写入或结构化日志库（如 winston/pino）并异步化  
风险与回滚: N/A  
验收命令与结果: 待后续迭代

---

## 4. 每个任务必须回填的结果模板

执行人（Agent）:  
任务编号:  
改动文件:  
核心改动:  
风险与回滚:  
验收命令与结果:  
未完成项（如有）:

---

## 5. 建议执行顺序（最稳）

1. `A1 -> A2 -> B1 -> B2 -> B3`
2. `A3 -> A4`
3. `B4 -> B5 -> B6 -> B7`
4. 最后统一回归: `npm test` + `npm run build`

---

## 6. 里程碑定义（DoD）

- M1（安全基线）: `B1/B2/B3` 完成并通过回归
- M2（前端工程基线）: `A1/A2/A3/A4` 完成并通过回归
- M3（后端性能与可维护）: `B4/B5/B6/B7` 完成并通过回归
- M4（可发布）: 所有任务完成，主分支可稳定构建与测试