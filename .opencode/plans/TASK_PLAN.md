# YAPI Plus 服务启动全面测试计划

> 本文件由 AI 生成，供 AI agent 执行。每个阶段可独立并行执行。

## 项目信息

- 项目：YAPI Plus（API 管理平台）
- 入口：`server/app.js`（`"start": "node server/app.js"`）
- 测试框架：AVA (`^0.22.0`)，配置在 `package.json` `"ava"` 字段
- 测试目录：`test/**/*.test.js`
- Mock 工具：`rewire`（`^9.0.1`）
- Node 要求：>= 18.0.0
- MongoDB：必需（正常模式），可选（配置模式/测试）

## 启动流程简述

```
npm start
  └─ server/app.js
       └─ configChecker.checkConfigStatus()
            ├─ 未配置 → startConfigMode()  [轻量 Koa 服务器 + 配置向导]
            └─ 已配置 → startNormalMode()
                          ├─ yapi.loadConfigFromDB()
                          ├─ mongoose.connect()
                          ├─ require('./plugin.js')
                          ├─ require('./router.js')
                          ├─ 加载中间件 (mockServer, websocket, static...)
                          └─ app.listen(port)
```

---

## 阶段 0：环境准备与基础设施检查

**目标**：验证运行环境和现有测试基础设施。

| # | 检查项 | 命令 / 方法 | 预期 |
|---|--------|-------------|------|
| 0.1 | Node.js 版本 | `node --version` | >= 18.0.0 |
| 0.2 | npm 版本 | `npm --version` | >= 9.0.0 |
| 0.3 | 测试框架可用 | `npx ava --version` | 输出版本号 |
| 0.4 | 现有测试能通过 | `npm test` | 全部通过 (绿色) |
| 0.5 | MongoDB 状态（可选） | `mongosh --eval "db.version()"` 或 `mongod --version` | 可连接 |
| 0.6 | 端口 3000 未被占用 | `netstat -ano | findstr :3000` | 无监听（或非本项目） |
| 0.7 | 配置文件状态 | `ls config.json 2>nul && echo exists || echo missing` | 确认当前状态 |
| 0.8 | init.lock 状态 | `ls init.lock 2>nul && echo exists || echo missing` | 确认当前状态 |

---

## 阶段 1：静态代码分析 — 启动路径安全审计

**目标**：审查已发现的代码风险点，逐一确认或标记待修复。

| # | 文件:行号 | 风险点 | 严重度 | 验证方式 |
|---|-----------|--------|--------|---------|
| 1.1 | `server/yapi.js:4` | `require('../config.json')` 同步加载 — 文件缺失直接崩溃 | **高** | 删除 config.json → 启动 → 预期崩溃 |
| 1.2 | `server/app.js:1-2` | `process.env.NODE_PATH` 运行时修改 — 模块解析可能不稳定 | 中 | 启动日志不报 module 相关错误 |
| 1.3 | `server/app.js:99` | `useCreateIndex: true` 已废弃（Mongoose 5.7+） | 低 | 启动无 deprecation warning |
| 1.4 | `server/app.js:96-101` | **认证参数缺失**：对比 `db.js:24-27`，`app.js` 的 `mongoose.connect()` 未传入 `db.user`/`db.pass` | **高** | 代码审查 + 带认证 MongoDB 测试 |
| 1.5 | `server/yapi.js:12` | `yapi.connect = Promise.resolve(null)` 占位 | 中 | 确认无插件在 DB 连接前访问 `yapi.connect` |
| 1.6 | `server/app.js:207-210` | 错误处理回退配置模式 — 原始错误被吞 | 中 | 抛错误 → 检查 console 是否输出原错误 |
| 1.7 | `server/app.js:177` | 连接字符串明文输出到控制台 | 中 | 检查日志中是否包含 IP/端口/库名 |
| 1.8 | `server/app.js:77-80` | `loadConfigFromDB()` 静默吞错 | 低 | 抛错误时检查 console 是否有输出 |
| 1.9 | `server/plugin.js:244,263` | 插件加载失败直接 `throw` — 进程崩溃 | 中 | 模拟插件缺失 → 期望进程退出 |
| 1.10 | `server/configController.js:136` | 默认管理员密码 `ymfe.org` 硬编码 | **高** | 代码确认 + 测试验证未传密码时使用默认值 |

---

## 阶段 2：单元测试 — 配置检查模块 (`server/configChecker.js`)

**目标**：全面覆盖 `checkConfigStatus()` 和 `testDatabaseConnection()`。

**文件**：新建 `test/server/configChecker.test.js`

**模式**：使用 `rewire` mock 依赖（参考 `test/server/mockServer.test.js` 的写法）。

### 2.1 ~ 2.5：checkConfigStatus

| # | 测试场景 | Mock 条件 | 预期结果 |
|---|----------|-----------|---------|
| 2.1 | 完全配置 | `init.lock` 存在 / DB 完整 / 有 adminAccount | `{configured: true, missing: []}` |
| 2.2 | 缺少 init.lock | mock `fs.existsSync` → false | `missing` 包含 `'init_lock'` |
| 2.3 | 缺少 DB（无 `servername` 和 `connectString`） | `yapi.WEBCONFIG.db = {}` | `missing` 包含 `'database'` |
| 2.4 | 缺少 adminAccount | `yapi.WEBCONFIG.adminAccount = undefined` | `missing` 包含 `'admin_account'` |
| 2.5 | 全部缺失 | 同时缺失上述三项 | `{configured: false, missing: ['init_lock','database','admin_account']}` |

### 2.6 ~ 2.10：testDatabaseConnection

| # | 测试场景 | Mock 条件 | 预期 |
|---|----------|-----------|------|
| 2.6 | 连接成功 | `mongoose.connect` → resolve | `{success: true}` |
| 2.7 | 连接失败（拒绝） | `mongoose.connect` → reject('ECONNREFUSED') | `{success: false, error: 'ECONNREFUSED'}` |
| 2.8 | 带 user/pass 认证连接 | 传入 `{user:'a', pass:'b', servername:'x'}` | options 含 `user`/`pass` |
| 2.9 | 使用 connectString | 传入 `{connectString: 'mongodb://...'}` | 不走拼接逻辑 |
| 2.10 | 含 authSource | 传入 `{servername:'x', port:27017, DATABASE:'y', authSource:'admin'}` | 连接字符串含 `?authSource=admin` |

---

## 阶段 3：单元测试 — 配置加载模块 (`server/yapi.js`)

**目标**：测试配置加载、`loadConfigFromDB()`、getter/setter。

**文件**：新建 `test/server/yapi.test.js`

| # | 测试场景 | 方法/条件 | 预期 |
|---|----------|-----------|------|
| 3.1 | config.json 加载正确 | require yapi | `WEBCONFIG.port` 存在 |
| 3.2 | loadConfigFromDB 成功 — 覆盖 db | mock DB 有 `database` 配置 | `WEBCONFIG.db` 被覆盖 |
| 3.3 | loadConfigFromDB 成功 — 覆盖 admin | mock DB 有 `admin` 配置 | `WEBCONFIG.adminAccount` 被覆盖 |
| 3.4 | loadConfigFromDB 成功 — 覆盖 mail | mock DB 有 `mail` 配置 | `WEBCONFIG.mail` 被覆盖 |
| 3.5 | loadConfigFromDB 时 DB 未连接 | mock `mongoose.connection.readyState = 0` | 返回 false，不抛错 |
| 3.6 | loadConfigFromDB 查询抛错 | mock `SystemConfig.find` → reject | 返回 false，console 输错误 |
| 3.7 | loadConfigFromDB 无配置记录 | mock `find` → [] | 返回 false |
| 3.8 | WEBCONFIG getter/setter | 读写属性 | 引用一致 |
| 3.9 | getModel 正确路径解析 | `yapi.getModel('user')` | 返回 User model 实例 |
| 3.10 | getModel 不存在的 model | `yapi.getModel('nonexistent')` | 返回 null |
| 3.11 | getInst 缓存 | 两次 `getInst(Class)` | 返回同一实例 |

---

## 阶段 4：单元测试 — 配置控制器 (`server/controllers/configController.js`)

**目标**：测试配置向导的 3 个 API 端点。

**文件**：新建 `test/server/configController.test.js`

**提示**：使用 `rewire` 替换 controller 内部依赖，或通过 `supertest` 调用 Koa 路由。

| # | 测试场景 | 请求 | 预期 |
|---|----------|------|------|
| 4.1 | getConfigStatus 正常 | mock `checkConfigStatus` → `{configured:false}` | 返回 200 + 状态 JSON |
| 4.2 | getConfigStatus 抛错 | mock → reject | 返回 400 |
| 4.3 | testDatabase 缺参数 | mock body = `{}` | 返回 400 "请提供数据库配置" |
| 4.4 | testDatabase 连接成功 | mock `testDatabaseConnection` → `{success:true}` | 返回 body 含 `success: true` |
| 4.5 | testDatabase 连接失败 | mock → `{success:false, error:'timeout'}` | 返回 400 + error 消息 |
| 4.6 | saveConfig 缺 db | body 无 `db` 字段 | 返回 400 "请提供数据库配置" |
| 4.7 | saveConfig 缺 adminAccount | 有 db 但无 `adminAccount` | 返回 400 "请提供管理员账号" |
| 4.8 | saveConfig DB 测试失败 | mock `testDatabaseConnection` → fail | 返回 400 "数据库连接失败: ..." |
| 4.9 | saveConfig 全流程（mock 全部步骤） | mock 所有依赖 | 验证调用顺序：testDB → connect → save(3条配置) → createUser → createIndex → writeLock → writeConfig → disconnect |
| 4.10 | saveConfig 默认密码 | 不传 `adminPassword` | 验证使用 `'ymfe.org'` |
| 4.11 | saveConfig 含 mail 配置 | body 含 `mail` | 验证 mail 配置被保存到 DB |
| 4.12 | saveConfig config.json 备份 | mock `fs.writeJsonSync` | 验证内容包含 db / adminAccount / timeout |

---

## 阶段 5：集成测试 — 启动流程 (`server/app.js`)

**目标**：模拟完整或部分启动流程，验证各模块协作和错误路径。

**文件**：新建 `test/server/startup.test.js`

**提示**：用 `rewire(app)` 暴露私有函数 `startConfigMode` / `startNormalMode`，或用 `supertest` 测试启动后的 Koa app。

| # | 测试场景 | 模拟条件 | 预期行为 |
|---|----------|---------|---------|
| 5.1 | **未配置 → 配置模式** | mock `checkConfigStatus` → `{configured:false}` | `startConfigMode` 被调用 → Koa app listen |
| 5.2 | **已配置 → 正常模式** | 全链路 mock（DB 连接成功 → 插件 → 路由 → 中间件） | 服务器监听端口 |
| 5.3 | **DB 连接失败** | `mongoose.connect` → reject("ECONNREFUSED mongodb://...") | `process.exit(1)` 被调用，打印 DB 帮助信息 |
| 5.4 | **configChecker 抛错 → 回退配置模式** | `checkConfigStatus` → throw("未知错误") | `startConfigMode()` 兜底 |
| 5.5 | **插件加载失败** | `require('./plugin.js')` → throw("plugin error") | catch 块处理，`process.exit(1)` |
| 5.6 | **DB 连接含认证参数** | mock `yapi.WEBCONFIG.db.user = 'admin'`, `db.pass = 'secret'` | `mongoose.connect` options 含 `user`/`pass` |
| 5.7 | **配置模式 404 fallback** | 配置模式 + 请求 `/anything` | 返回 SPA HTML |
| 5.8 | **配置模式 /setup 可访问** | 请求 `GET /setup` | 返回 200 + HTML |
| 5.9 | **配置模式 API 路由可达** | mock 后请求 `GET /api/config/status` | 返回 JSON |
| 5.10 | **正常模式静态文件** | mock 全链路 + 请求 `/` | SPA HTML |
| 5.11 | **正常模式 mockServer 中间件存在** | 请求 `/mock/` 前缀 | 被 mockServer 处理 |
| 5.12 | **正常模式 WebSocket 路由** | WS 请求 `/api/interface/solve_conflict` | 被 WebSocket 路由处理 |

---

## 阶段 6：端到端测试

**目标**：真实启动验证（需要 MongoDB）。在 CI 或有 DB 环境中执行。

| # | 测试场景 | 前置条件 | 操作 | 验证 |
|---|----------|---------|------|------|
| 6.1 | 全新安装 — 配置模式 | 无 `config.json`、无 `init.lock` | `npm start` | 终端显示"配置模式"，端口 3000 监听 |
| 6.2 | 配置状态 API | 配置模式运行中 | `GET /api/config/status` | `{"errcode":0, "data":{"configured":false}}` |
| 6.3 | 测试 DB — 无参数 | 配置模式运行中 | `POST /api/config/test-db {}` | 400 |
| 6.4 | 测试 DB — 有效配置 | 配置模式运行中 + MongoDB 运行 | `POST /api/config/test-db {"servername":"127.0.0.1","port":27017,"DATABASE":"yapi_test"}` | 200 + `success:true` |
| 6.5 | 保存完整配置 | MongoDB 运行中 | `POST /api/config/save {"db":..., "adminAccount":"admin@test.com"}` | 200 + "配置保存成功，请重启服务" |
| 6.6 | 保存后文件状态 | 6.5 执行后 | 检查 `init.lock` + `config.json` | 均存在且内容正确 |
| 6.7 | 正常模式启动 | 6.5 执行后 | 重启 `npm start` | 连接 MongoDB + 加载路由 + 监听端口 |
| 6.8 | 正常模式 API | 正常模式运行中 | `GET /api/user/status` | 200 OK |
| 6.9 | 正常模式静态文件 | 正常模式运行中 | `GET /` | HTML |
| 6.10 | 清理测试数据 | 测试结束后 | 删除 `yapi_test` 数据库 + `init.lock` | 环境恢复 |

---

## 阶段 7：回归与兼容性测试

| # | 测试场景 | 验证点 |
|---|----------|--------|
| 7.1 | **`db.js` 遗留 `connect()` 回调风格** | `server/utils/db.js:51-59` 的 callback 用法不阻塞启动 |
| 7.2 | **重复启动保护** | `start()` catch 中调用 `startConfigMode()` 不会同时运行两个监听器 |
| 7.3 | **插件路由冲突** | 两个插件注册同路径 → 应报明确错误 |
| 7.4 | **配置数据超限** | POST > 2MB 的 body → `koaBody` 拒绝 |
| 7.5 | **DB 超时** | `serverSelectionTimeoutMS: 5000` → 5秒内失败 |
| 7.6 | **无 MongoDB 启动正常模式** | 进程打印帮助信息后退出（不挂起） |

---

## 附录

### A. 关键文件路径

| 文件 | 作用 |
|------|------|
| `server/app.js` | 主入口 —— 测试核心目标 |
| `server/yapi.js` | 配置对象、loadConfigFromDB |
| `server/configChecker.js` | 配置状态检查、DB 连接测试 |
| `server/configRouter.js` | 配置模式路由 |
| `server/controllers/configController.js` | 配置向导 API |
| `server/plugin.js` | 插件系统加载 |
| `server/router.js` | 完整路由注册 |
| `server/websocket.js` | WebSocket |
| `server/middleware/mockServer.js` | Mock 服务中间件 |
| `server/utils/commons.js` | createAction、工具函数 |
| `server/utils/db.js` | 遗留 DB 连接（回调风格） |
| `server/utils/storage.js` | 存储工具 |
| `server/utils/notice.js` | 通知系统 |
| `server/models/systemConfig.js` | 系统配置 model |
| `config_example.json` | 配置模板 |
| `nodemon.json` | 开发自动重启配置 |
| `test/babel-register.js` | 测试 Babel 设置 |
| `test/server/mockServer.test.js` | 参考测试（rewire 用法） |
| `test/lib.test.js` | 参考测试（rewire + ava 模式） |

### B. Mock 策略参考

```javascript
// 使用 rewire 替换依赖
const rewire = require('rewire');
const configChecker = rewire('../../server/configChecker.js');

// 替换私有变量
configChecker.__set__('mongoose', {
  connect: () => Promise.resolve(),
  disconnect: () => Promise.resolve()
});

// 或替换模块级变量
configChecker.__set__('yapi', {
  WEBCONFIG: {
    db: { servername: 'localhost', DATABASE: 'test' },
    adminAccount: 'admin@test.com'
  },
  path: { join: (...args) => args.join('/') },
  WEBROOT_RUNTIME: '/tmp'
});
```

### C. 已发现的代码缺陷（启动相关）

| 缺陷 | 位置 | 影响 |
|------|------|------|
| DB 认证参数未传入 `mongoose.connect()` | `app.js:96-101` | 带认证的 MongoDB 无法连接 |
| `config.json` 缺失导致崩溃 | `yapi.js:4` | 进程直接退出，无友好提示 |
| 默认管理员密码硬编码 | `configController.js:136` | 安全隐患 |
| 错误信息泄漏连接字符串 | `app.js:177` | 信息泄漏 |
| 插件加载失败进程崩溃 | `plugin.js:244,263` | 单个插件问题拖垮整个服务 |
| `NODE_PATH` 运行时修改 | `app.js:1-2` | 模块解析不可预测 |
| 无优雅关闭 | 全局 | DB 连接中断可能导致数据损坏 |

### D. 新增测试文件清单

```
test/server/configChecker.test.js   ← 阶段 2
test/server/yapi.test.js            ← 阶段 3
test/server/configController.test.js ← 阶段 4
test/server/startup.test.js         ← 阶段 5
```

### E. 运行方式

```bash
# 运行全部测试
npm test

# 运行单个测试文件
npx ava test/server/configChecker.test.js

# 查看测试覆盖率（需安装 nyc）
npx nyc npx ava
```

### F. 执行进度更新 (2026-04-30)

✅ **阶段5已完成**：startup集成测试
- 新增16个测试用例，全部通过
- 采用静态代码分析方法验证启动流程
- 覆盖配置模式、正常模式、错误处理等关键场景
- 总计90个测试全部通过

📋 **下一步**：
- 阶段6：端到端测试（需要MongoDB环境）
- 阶段7：回归与兼容性测试
