# YAPI Plus Testing Suite - Complete Implementation Guide

## 测试方案概述

### 1. 测试架构

```
┌─────────────────────────────────────────────────────────────────┐
│                    YAPI Plus Testing Framework                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │  UI Tests   │  │Functional  │  │  AI Agent   │              │
│  │   (POM)     │  │   Tests    │  │   Tests     │              │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘              │
│         │                │                │                     │
│  ┌──────▼────────────────▼────────────────▼──────┐              │
│  │          Test Utilities & Framework           │              │
│  │  - TestUtils.js - AIAgentTestFramework        │              │
│  │  - Page Objects - Test Case Library           │              │
│  └──────────────────────┬────────────────────────┘              │
│                         │                                        │
│  ┌──────────────────────▼────────────────────────┐              │
│  │            Playwright Test Runner              │              │
│  │  - Browser automation - Assertions              │              │
│  │  - Screenshots - Video recording               │              │
│  └────────────────────────────────────────────────┘              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 2. 测试模块

#### 2.1 UI测试 (ui-tests.test.js)

| 测试项 | 描述 | 覆盖页面 |
|--------|------|----------|
| 页面渲染 | 验证页面元素正确加载 | Home, Login, Register, Setup |
| 表单元素 | 输入框、按钮、链接可见性 | Login, Register, AddProject |
| 导航 | 页面跳转和URL变化 | 所有页面 |
| 响应式 | 不同视口下布局正确 | Home, Project List |
| 验证错误 | 表单验证提示 | Login, Register |

#### 2.2 功能测试 (functional-tests.test.js)

| 测试项 | 描述 | 覆盖功能 |
|--------|------|----------|
| 认证流程 | 登录、登出、注册 | 身份验证 |
| 项目管理 | 创建、查看、删除项目 | CRUD操作 |
| 接口管理 | 创建、搜索、运行接口 | API操作 |
| 权限控制 | 管理员页面访问 | 路由守卫 |

#### 2.3 AI Agent测试 (ai-agent-tests.test.js)

| 测试项 | 描述 |
|--------|------|
| 框架初始化 | 测试框架加载 |
| 用例执行 | 执行预定义测试用例 |
| 自然语言生成 | 从描述生成测试 |
| 报告生成 | JSON/HTML格式导出 |

#### 2.4 深度审计修复验证测试 (deep-audit-fixes.test.js)

> 验证 2026-05-06 深度流程审计中修复的所有问题。

| 测试项 | 描述 | 对应修复 |
|--------|------|----------|
| Header 退出登录 | useMessage 已注入，退出不崩溃 | NT1 |
| 项目列表编辑按钮 | useRouter 已注入，编辑不崩溃 | NT2 |
| 关注列表 API | 使用 `/api/follow/list` 而非旧路径 | NT3-NT4 |
| 集合 API 路径 | 使用 `/api/col/*` 而非 `/api/interfaceCol/*` | NT3-NT4 |
| 分组成员 API | 使用 `/api/group/add_member` 等 | NT3-NT4 |
| 项目成员 API | 使用 `/api/project/add_member` 等 | NT3-NT4 |
| 数据导出 API | 使用 `/api/open/export_data` | NT3 |
| 用户详情 API | 使用 `/api/user/find` | NT3 |
| 修改密码方法 | 使用 POST 方法和正确路径 | NT3 |
| 动态列表 API | 使用 `/api/log/list` | NT3 |
| 系统设置 API | 统一使用 `/api/config/save` | NT3 |
| exportData 权限 | 有权限用户可正常导出 | NT7 |
| activity 权限 | 有权限用户可查看活动 | NT8 |
| 接口表单校验 | 空标题/路径不能提交 | NT10 |
| 项目字段映射 | 使用 `project_type` 而非 `permission` | NT12 |
| 接口搜索功能 | 搜索输入框可用 | NT13 |
| Activity 页面 | 使用 axios 而非 fetch | NT14 |
| 测试用例表格 | 使用 `n-data-table` 而非 `n-editable-table` | NT15 |
| 全局错误处理 | 服务器错误返回 JSON | NT25 |
| CORS 中间件 | 响应头包含 CORS 字段 | NT26 |
| 后端错误处理 | 异常不导致服务器崩溃 | NT27 |
| 项目设置字段 | 使用 `project_type` | NT33 |
| 配置保存安全 | 密码不泄露到日志 | NT34 |
| runCaseScript | 参数正确传递 | NT37 |
| Token 常量 | 旧版格式使用常量 | NT54 |
| 集成工作流 | 完整流程: 登录→创建→编辑→退出 | 全部 |

#### 2.5 性能测试 (performance-tests.test.js)

| 测试项 | 指标 |
|--------|------|
| 页面加载时间 | < 3秒 |
| TTFB | < 1秒 |
| 响应式视口 | 4种尺寸 |
| 控制台错误 | 无关键错误 |

### 3. Page Object Model

```
pages/
├── AuthPages.js          # 认证相关页面
│   ├── LoginPage        # 登录页面
│   ├── RegisterPage     # 注册页面
│   ├── HomePage         # 首页
│   └── SetupPage        # 初始化页面
│
├── ProjectPages.js      # 项目管理页面
│   ├── HeaderComponent  # 公共头部组件 (含 useMessage / Naive UI Dropdown)
│   ├── ProjectListPage  # 项目列表 (含 useRouter)
│   ├── AddProjectPage   # 添加项目 (project_type 字段 / Naive UI Select)
│   ├── ProjectSettingPage  # 项目设置
│   ├── InterfaceListPage   # 接口列表 (含搜索功能)
│   ├── InterfaceEditPage   # 接口编辑 (含表单校验)
│   ├── GroupPage        # 分组页面
│   ├── AddGroupPage     # 添加分组
│   ├── FollowsPage      # 关注列表
│   ├── NewsPage        # 动态/消息列表
│   └── ProjectDataPage  # 项目数据导出/导入
│
└── AiAgentPages.js      # AI Agent页面
    ├── AiAgentPage       # AI助手管理
    ├── UserSettingsPage  # 用户设置 (POST 方法 / 正确路径)
    └── SystemSettingsPage # 系统设置 (统一 /api/config/save)
```

### 4. AI Agent自动化框架

#### 4.1 核心功能

```javascript
// 1. 测试执行
await framework.executeTestCase(testCase);

// 2. 自然语言生成
const testCase = framework.generateTestCaseFromNaturalLanguage(
  '测试用户登录功能，首先打开登录页面...'
);

// 3. 报告导出
const report = framework.exportReport('html');
```

#### 4.2 预定义测试用例库

```javascript
AI_TEST_CASES = {
  authentication: {
    loginWithValidCredentials: {...},
    loginWithInvalidCredentials: {...},
  },
  projectManagement: {
    createProject: {...},
    viewProjectList: {...},
  },
  interfaceManagement: {
    createInterface: {...},
    searchInterface: {...},
  },
  aiAgent: {
    viewAiAgentPage: {...},
  },
}
```

#### 4.3 支持的操作类型

| Action | 描述 | 参数 |
|--------|------|------|
| navigate | 导航到页面 | value: URL |
| click | 点击元素 | selector |
| fill | 填写输入框 | selector, value |
| type | 输入文本 | selector, value |
| select | 选择选项 | selector, value |
| wait | 等待 | value: ms |
| waitForSelector | 等待元素 | selector |
| hover | 悬停 | selector |
| dblclick | 双击 | selector |
| press | 按键 | selector, value |
| evaluate | 执行JS | value: function |
| screenshot | 截图 | value: filename |

### 5. 运行命令

```bash
# 安装依赖
npm install

# 启动MongoDB (必需)
mongod --dbpath <data-path>

# 启动开发服务器
npm run dev

# 运行所有测试
npm run test:e2e

# 运行特定测试
npm run test:ui          # UI测试
npm run test:functional  # 功能测试
npm run test:ai          # AI Agent测试
npm run test:perf        # 性能测试

# 交互模式
npm run test:e2e:headed  # 显示浏览器
npm run test:e2e:ui      # UI调试模式

# 生成报告
npm run test:e2e:report
```

### 6. 测试数据

默认测试账户:
- 邮箱: admin@admin.com
- 密码: 12345678 (管理员安装后设置的密码)
- 角色: 管理员

> 注意：深度审计修复后，所有测试已更新为使用修复后的 API 路径和字段名。
> 详见 `deep-audit-fixes.test.js` 中的完整修复验证列表。

### 7. 故障排除

| 问题 | 解决方案 |
|------|----------|
| MongoDB连接失败 | 启动mongod服务 |
| 端口占用 | 检查3000/4000端口 |
| 测试超时 | 增加timeout配置 |
| 截图失败 | 检查test-results目录权限 |