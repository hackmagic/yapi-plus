# AGENTS.md — YAPI Plus

> 基于 YAPI 改造的现代化 API 管理平台（Vue 3 + VitePlus + Koa + MongoDB）

此文件为 AI Agent 提供精确的项目执行指南。每条都经过验证，省略通用建议。

---

## 项目快览

- **前端**：Vue 3 + VitePlus + Naive UI，端口 `4000`，热更新启用
- **后端**：Koa + MongoDB，端口 `3000`，`nodemon` 热重启
- **开发模式**：前后端分离，前端代理 `/api/*` 到后端
- **生产模式**：统一服务，静态文件 + API 同端口
- **测试**：Ava + Babel（需 `test/babel-register.js`）
- **代码质量**：ESLint（Vue 规则）+ Prettier（`vp check` / `vp fmt`）

---

## 立即开始（新人 5 分钟）

```bash
# 1. 安装依赖（根目录）
npm install

# 2. 启动 MongoDB（必需）
#    Windows：确保 mongod 在 PATH 中或设置 YAPI_MONGOD_PATH
#    macOS/Linux：brew services start mongodb-community 或 mongod --fork

# 3. 初始化数据库（首次）
npm run install-server
#    管理员邮箱：admin@admin.com
#    管理员密码：ymfe.org（首次登录后立即修改）

# 4. 开发环境（推荐，一键前后端）
npm run dev
#   - 前端：http://localhost:4000
#   - 后端：http://127.0.0.1:3000
```

---

## 命令速查（精确名称）

| 用途     | 命令                          | 备注                       |
| -------- | ----------------------------- | -------------------------- |
| **开发** | `npm run dev`                 | 前后端同时启动（推荐）     |
|          | `npm run dev:fast`            | 跳过图标复制，更快         |
|          | `npm run dev-server`          | 仅后端（Koa + nodemon）    |
|          | `npm run dev-client`          | 仅前端（VitePlus + HMR）   |
| **生产** | `npm run start`               | 仅后端（单进程）           |
|          | `npm run start:all`           | 前后端统一（concurrently） |
|          | `vp preview`                  | 预览生产构建               |
| **构建** | `npm run build` 或 `vp build` | 输出到 `static/prd/`       |
| **质量** | `npm run check` / `vp check`  | ESLint + 类型检查 + 格式   |
|          | `npm run lint` / `vp lint`    | 仅 ESLint                  |
|          | `npm run lint:client`         | ESLint 仅 `client/**`      |
|          | `npm run fmt` / `vp fmt`      | Prettier 格式化            |
| **测试** | `npm test`                    | 运行所有 Ava 测试          |
|          | `npm run test:e2e`            | Playwright E2E 测试        |
|          | `npm run test:ui`             | UI 测试                   |
|          | `npm run test:functional`     | 功能测试                  |
|          | `npm run test:ai`             | AI Agent 自动化测试       |
|          | `npm run test:perf`           | 性能测试                  |
|          | `npm run test:e2e:headed`     | 显示浏览器运行            |
|          | `npm run test:e2e:report`    | 生成 HTML 测试报告        |
| **打包** | `npm run package`             | 生成平台特定 zip/tar.gz    |
| **发布** | `npm run release`             | git tag → GitHub Actions   |

---

## 关键路径与入口点

```
server/app.js              ← 后端入口（Koa 应用）
server/yapi.js             ← 核心配置、DB 连接、插件加载
client/main.js             ← 前端入口（Vue 3 挂载）
client/App.vue             ← 根组件
vite.config.js             ← VitePlus 配置（别名、代理、chunks）
```

**目录职责**：

- `server/` — Koa 后端（控制器、模型、工具、插件集成）
- `client/` — Vue 3 前端（组件、页面、状态管理、路由）
- `common/` — 前后端共享代码（工具函数、常量）
- `exts/` — YAPI 插件集合（每个子目录为独立插件）
- `static/` — 静态资源，`static/prd/` 为生产构建（**不入库**）
- `test/` — Ava 测试（`test/**/*.test.js`）

---

## 开发流程要点

### 1. 数据库先行

- 修改后端逻辑前，**先确认 MongoDB 正在运行**。
- 开发模式使用 `config.json` 或 Web 配置向导（`/setup`）。
- 数据库变更涉及模型文件在 `server/models/`。

### 2. 前端开发

- 修改 Vue 组件后，HMR 自动生效；如遇问题，手动刷新 `http://localhost:4000`。
- 别名：`@` → `client/`，`common/`、`exts/` 也配置了别名。
- 样式：全局样式在 `client/styles/`，组件级样式用 `<style scoped>`。

### 3. 后端开发

- 使用 `nodemon` 监视 `server/`、`common/`、`exts/`（见 `nodemon.json`）。
- 日志输出到 `log/` 目录，调试时查看。

### 4. 构建与部署

- `npm run build` 生成 `static/prd/`，供生产环境统一服务加载。
- 生产启动脚本（`start.bat` / `start.sh`）同时启动 Koa 和静态文件服务。
- **永远不要提交 `static/prd/` 内容**（已在 `.gitignore`）。

---

## 测试约定

- **框架**：Ava + Babel（`test/babel-register.js` 自动注册）。
- **位置**：`test/**/*.test.js`（包括 `test/server/`、`test/common/`）。
- **运行**：`npm test`。
- **单个测试**：`npx ava test/server/yapi.test.js`。

**测试模式**：多数测试直接 `require` 后端模块，不启动 HTTP 服务器。

---

## 代码质量与风格

- **Prettier**：`printWidth: 100`，`singleQuote: true`，`semi: true`。
- **ESLint**：Vue 规则用于 `client/**/*.vue` 和 `client/**/*.js`。
- **检查**：`vp check`（lint + 类型 + 格式），`vp fmt` 自动格式化。
- **提交规范**： Conventional Commits（`feat`/`fix`/`docs`/`test`/`chore`/`refactor`/`opti`），由 `ghooks` 校验。

---

## 插件系统

插件目录：`exts/`，每个插件为独立 YAPI 插件结构。

**注册插件**：修改 `plugin.json` 添加元数据，插件自动加载。

**示例插件**：

- `yapi-plugin-wiki` — Wiki 页面功能
- `yapi-plugin-import-swagger` — Swagger 导入
- `yapi-plugin-statistics` — 统计面板
- `yapi-plugin-advanced-mock` — 高级 Mock

---

## AI 功能配置

YAPI Plus 内置 AI 助手管理（支持 DeepSeek、OpenAI、Claude、Gemini、Custom）。

**创建助手**：在管理页面填写：

- `name`、`description`、`type`（提供商）
- `apiKey`、`model`、`baseURL`（可选）
- `temperature`（默认 0.7）、`maxTokens`（默认 1000）

---

## 环境变量与配置

| 变量                | 用途                                                     |
| ------------------- | -------------------------------------------------------- |
| `YAPI_MONGOD_PATH`  | Windows 下指定 `mongod.exe` 路径（`start-dev.bat` 使用） |
| `YAPI_MONGO_DBPATH` | MongoDB 数据目录（可选）                                 |
| `NODE_ENV`          | `development` / `production`                             |
| `PORT`              | 后端端口（默认 3000，可覆盖 `config.json`）              |

**配置文件优先级**：启动时按顺序加载 `config.json` → Web 配置向导 → 环境变量。

---

## Windows 特别说明

- 使用 `start-dev.bat` / `start.bat` 一键启动。
- 若 `mongod` 不在 `PATH`，先设置：
  ```bat
  set YAPI_MONGOD_PATH=C:\MongoDB\bin\mongod.exe
  set YAPI_MONGO_DBPATH=C:\MongoDB\data
  start-dev.bat
  ```

---

## 故障排除

| 现象                 | 检查点                                                                       |
| -------------------- | ---------------------------------------------------------------------------- |
| 前端请求 404 /api/\* | 确认 `vite.config.js` 代理到 `http://localhost:3000`，后端已启动             |
| 数据库连接失败       | `mongod` 是否运行；`config.json` 连接参数是否正确                            |
| `npm run build` 失败 | 检查 `node_modules` 版本冲突；删除 `node_modules` + `package-lock.json` 重装 |
| 测试失败             | 确认 `test/babel-register.js` 被正确加载（`ava` 配置的 `require` 字段）      |
| 端口占用             | 3000/4000 是否被其他进程占用                                                 |

---

## 引用资源

- **计划与进度**：`TASK_PLAN.md`（唯一真实进度源）
- **迁移指南**：`MIGRATION_GUIDE.md`、`MIGRATION_COMPLETE.md`（历史参考）
- **架构总览**：`ARCHITECTURE.md`
- **快速启动**：`START_GUIDE.md`、`SETUP_GUIDE.md`
- **文档生成**：`VITEPLUS_GUIDE.md`、`docs/devops/release.md`

---

**维护提示**：此文件应保持简洁，只保留**必须知道、否则会出错**的信息。通用开发建议请放到项目 Wiki 或独立文档中。
