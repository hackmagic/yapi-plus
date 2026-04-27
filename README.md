# YAPI Plus

YAPI Plus 是基于 YAPI 项目进行改造的现代化 API 管理平台，使用 **Vue 3 + VitePlus + Naive UI** 构建，并添加了 AI agent 相关功能。

## 功能特性

### 核心功能
- **API 管理**：完整的 API 接口管理，支持 RESTful API 设计
- **Mock 服务**：强大的Mock 功能，支持自定义 Mock 规则
- **测试用例**：内置测试用例管理，支持自动化测试
- **团队协作**：支持团队协作，权限管理
- **插件系统**：可扩展的插件系统

### 新特性
- **Vue 3 + VitePlus**：使用 Vue 3 和 VitePlus 构建，加载速度更快，开发体验更好
- **现代化 UI**：使用 Naive UI，界面更现代化，交互更流畅
- **AI 助手**：支持 AI 助手管理、对话、API 文档生成和测试用例生成

## 快速开始

### 环境要求
- Node.js >= 18.0.0
- MongoDB >= 3.6.0

### 安装依赖

```bash
npm install
```

### 初始化数据库

```bash
npm run install-server
```

**初始管理员账号**：
- **邮箱**：`admin@admin.com`（或配置的 adminAccount）
- **密码**：`ymfe.org`

> ⚠️ 首次登录后请立即修改密码！

### 启动开发服务器

```bash
npm run dev
# 或使用 VitePlus 命令
vp dev
```

### 构建生产版本

```bash
npm run build
# 或使用 VitePlus 命令
vp build
```

### 启动生产服务

```bash
npm run start
```

## 项目结构

```
├── client/            # 前端代码 (Vue 3)
│   ├── components/    # Vue 组件
│   ├── containers/    # Vue 页面容器
│   ├── store/         # Pinia 状态管理
│   ├── router/        # Vue Router 路由
│   ├── styles/        # 样式
│   ├── main.js        # Vue 3 入口
│   └── App.vue        # Vue 根组件
├── server/            # 后端代码 (保持不变)
│   ├── controllers/   # 控制器
│   ├── models/        # 模型
│   ├── utils/         # 工具
│   ├── app.js         # 后端入口
│   └── router.js      # 路由配置
├── common/            # 公共代码
├── exts/              # 插件代码
├── static/            # 静态资源
├── docs/              # 文档
├── vite.config.js     # VitePlus 配置
└── package.json       # 项目配置
```

## 技术栈

### 前端
- **Vue 3**：使用 Composition API 和 `<script setup>` 语法
- **VitePlus**：现代化前端构建工具（极速构建）
- **Naive UI**：现代化的 Vue 3 UI 库
- **Vue Router 4**：路由管理
- **Pinia**：Vue 3 官方推荐的状态管理库
- **Sass/Less**：CSS 预处理器

### 后端
- **Node.js**：运行环境
- **Koa**：Web 框架
- **MongoDB**：数据库
- **Mongoose**：MongoDB ORM

### AI 集成
- **DeepSeek**：DeepSeek API (推荐, https://api-docs.deepseek.com/zh-cn/)
- **OpenAI**：GPT 系列模型
- **Claude**：Anthropic 的 Claude 模型
- **Gemini**：Google 的 Gemini 模型
- **Custom**：自定义模型

## AI 功能使用

### 1. AI 助手管理

1. **进入 AI 助手管理页面**：在系统菜单中找到 AI 助手管理
2. **创建 AI 助手**：填写以下信息
   - **名称**：AI 助手的名称
   - **描述**：AI 助手的描述
   - **类型**：选择 AI 模型类型（DeepSeek/OpenAI/Claude/Gemini/Custom）
   - **API Key**：输入对应 AI 服务的 API Key
   - **模型**：选择具体的模型（如 deepseek-chat、gpt-4 等）
   - **Base URL**：自定义 API 地址（可选）
   - **温度**：设置生成文本的随机性（0-1，默认 0.7）
   - **最大令牌数**：设置生成文本的最大长度（默认 1000）

### 2. AI 对话

1. **进入 AI 对话页面**：在系统菜单中找到 AI 对话
2. **选择 AI 助手**：从下拉菜单中选择已创建的 AI 助手
3. **输入问题**：在输入框中输入关于 API 的问题
4. **发送消息**：点击发送按钮，AI 助手会生成回复

### 3. 生成 API 文档

1. **进入 API 详情页面**：选择一个 API 接口
2. **点击"生成文档"按钮**：系统会使用 AI 生成 API 文档
3. **编辑和保存**：根据需要编辑生成的文档，然后保存

### 4. 生成测试用例

1. **进入 API 详情页面**：选择一个 API 接口
2. **点击"生成测试用例"按钮**：系统会使用 AI 生成测试用例
3. **编辑和保存**：根据需要编辑生成的测试用例，然后保存

## 配置说明

### Vite 配置

Vite 配置文件位于 `vite.config.js`，包含了构建选项、别名配置和开发服务器配置。

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client'),
      'client': path.resolve(__dirname, './client'),
      'common': path.resolve(__dirname, './common'),
      'exts': path.resolve(__dirname, './exts')
    }
  },
  server: {
    port: 4000,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'static/prd',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'redux', 'react-redux', 'react-router-dom'],
          lib: ['axios', 'moment', 'mockjs'],
          ui: ['naive-ui']
        }
      }
    }
  }
})
```

### AI 配置

AI 相关配置可以在创建 AI 助手时设置，包括 AI 模型类型、API Key、模型参数等。

#### 配置示例

| 模型类型 | API Key | 模型 | 温度 | 最大令牌数 | Base URL |
|---------|---------|------|------|------------|----------|
| DeepSeek | sk-xxxxxxxxxxxxxxxx | deepseek-v4-flash | 0.7 | 1000 | https://api.deepseek.com |
| OpenAI | sk-xxxxxxxxxxxxxxxx | gpt-4 | 0.7 | 1000 | https://api.openai.com |
| Claude | sk-ant-xxxxxxxxxxxxxxxx | claude-3-opus | 0.7 | 1000 | https://api.anthropic.com |
| Gemini | AIzaSyxxxxxxxxxxxxxxxx | gemini-pro | 0.7 | 1000 | https://generativelanguage.googleapis.com |
| Custom | 自定义 API Key | 自定义模型 | 0.7 | 1000 | 自定义地址 |

## 打包与发布

### 一键打包

```bash
npm run package
```

自动构建前端、组装代码、安装生产依赖，生成当前平台的发布压缩包到 `release/` 目录：

| 平台 | 输出文件 |
|------|---------|
| Windows | `release/yapi-plus-v{version}-win-x64.zip` |
| Linux | `release/yapi-plus-v{version}-linux-x64.tar.gz` |
| macOS | `release/yapi-plus-v{version}-darwin-x64.tar.gz` |

### 发布到 GitHub Releases

推送 git tag 触发 GitHub Actions 自动打包三平台并发布：

```bash
npm run release
```

详细文档见 [打包与发布](docs/devops/release.md)。

## 部署

从 Release 下载对应平台的压缩包后：

1. 解压到部署目录
2. 在解压目录的**父目录**创建 `config.json`（参考 `config_example.json`）
3. 启动服务：`./start.sh` 或 `start.bat`

推荐使用 PM2 管理进程：

```bash
npm install -g pm2
pm2 start server/app.js --name yapi-plus
```

## 开发指南

### 前端开发

1. **启动开发服务器**：`npm run dev-client` 或 `vp dev`
2. **构建生产版本**：`npm run build` 或 `vp build`
3. **代码检查**：`vp check`
4. **代码格式化**：`vp fmt`

### 后端开发

1. **启动开发服务器**：`npm run dev-server`
2. **测试**：`npm test`
3. **代码规范**：使用 ESLint 进行代码检查

## 插件开发

YAPI Plus 支持插件开发，您可以通过插件扩展系统功能。插件开发指南请参考 `docs/plugin-dev.md`。

## 故障排除

### 常见问题

1. **API Key 错误**：检查 API Key 是否正确，是否有访问权限
2. **模型不可用**：检查所选模型是否存在，是否在当前 API Key 的权限范围内
3. **请求超时**：AI 生成可能需要一些时间，耐心等待
4. **构建失败**：检查依赖是否安装正确，代码是否有语法错误
5. **数据库连接失败**：检查 MongoDB 是否运行，连接字符串是否正确

### 日志

系统日志位于 `log` 目录，您可以查看日志文件以了解系统运行情况。

## 贡献指南

欢迎贡献代码和提出建议，共同改进 YAPI Plus。

### 贡献流程

1. **Fork 仓库**：在 GitHub 上 Fork 本仓库
2. **创建分支**：创建一个新的分支用于开发
3. **提交代码**：提交您的代码更改
4. **创建 Pull Request**：提交 Pull Request 到主分支

### 代码规范

- **前端**：使用 VitePlus 进行代码检查和格式化，遵循 Vue 3 最佳实践
- **后端**：使用 ESLint 进行代码检查，遵循 Node.js 最佳实践
- **提交信息**：使用 Conventional Commits 规范

## 许可证

Apache-2.0

## 致谢

- [YAPI](https://github.com/YMFE/yapi)：原始项目
- [Vue 3](https://vuejs.org/)：前端框架
- [VitePlus](https://viteplus.dev/)：现代化前端构建工具
- [Naive UI](https://www.naiveui.com/)：Vue 3 UI 库
- [Pinia](https://pinia.vuejs.org/)：Vue 3 状态管理
- [Koa](https://koajs.com/)：后端框架
- [MongoDB](https://www.mongodb.com/)：数据库
- [OpenAI](https://openai.com/)：AI 模型
- [Anthropic](https://www.anthropic.com/)：Claude 模型
- [Google AI](https://ai.google/)：Gemini 模型

---

**YAPI Plus** - 现代化的 API 管理平台，为 AI 时代而生！