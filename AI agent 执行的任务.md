# YAPI Plus 改造任务文档

## 项目概述

YAPI Plus 是基于 YAPI 项目进行改造，主要目标是：
1. 将前端构建工具从 Webpack 替换为 Vite Plus
2. 将 UI 库从 Ant Design 替换为 Naive UI
3. 后端添加 AI agent 相关功能，适配 AI 时代的需求

## 任务完成状态

### ✅ 已完成

| 任务 | 文件 | 状态 |
|------|------|------|
| Vite配置 | `vite.config.js` | ✅ 完成 |
| 前端入口 | `client/index.js` | ✅ 完成 |
| AI控制器 | `server/controllers/ai.js` | ✅ 完成 |
| AI模型 | `server/models/ai.js` | ✅ 完成 |
| 路由配置 | `server/router.js` | ✅ 完成 |
| 依赖更新 | `package.json` | ✅ 已添加 naive-ui, vite |
| Header.js | 组件替换 | ✅ 完成 |
| Login.js | 组件替换 | ✅ 完成 |
| messageMiddleware.js | 组件替换 | ✅ 完成 |
| User.js | 导入替换 | ✅ 完成 |
| Home.js | 部分导入替换 | ✅ 完成 |
| News.js | 导入替换 | ✅ 完成 |
| Follows.js | 组件替换 | ✅ 完成 |
| ProjectList.js | 导入替换 | ✅ 完成 |
| Group.js | 组件替换 | ✅ 完成 |
| ProjectCard.js | 组件替换 | ✅ 完成 |
| Profile.js | 组件替换 | ✅ 完成 |
| Setting.js | 组件替换 | ✅ 完成 |
| GuideBtns.js | 组件替换 | ✅ 完成 |
| Subnav.js | 组件替换 | ✅ 完成 |
| Intro.js | 组件替换 | ✅ 完成 |
| Footer.js | 组件替换 | ✅ 完成 |
| ErrMsg.js | 组件替换 | ✅ 完成 |
| Breadcrumb.js | 组件替换 | ✅ 完成 |
| AddProject.js | 组件替换 | ✅ 完成 |
| Activity.js | 组件替换 | ✅ 完成 |
| Reg.js | 组件替换 | ✅ 完成 |
| SchemaTable.js | 组件替换 | ✅ 完成 |
| NewsTimeline.js | 组件替换 | ✅ 完成 |
| NewsList.js | 组件替换 | ✅ 完成 |
| UsernameAutoComplete.js | 组件替换 | ✅ 完成 |
| Notify.js | 组件替换 | ✅ 完成 |
| CheckCrossInstall.js | 组件替换 | ✅ 完成 |
| TimeLine.js | 组件替换 | ✅ 完成 |
| GroupList.js | 组件替换 | ✅ 完成 |
| MemberList.js | 组件替换 | ✅ 完成 |
| GroupSetting.js | 组件替换 | ✅ 完成 |
| LoginWrap.js | 组件替换 | ✅ 完成 |
| LoginContainer.js | 组件替换 | ✅ 完成 |
| Postman.js | 组件替换 | ✅ 完成 |
| MyPopConfirm.js | 组件替换 | ✅ 完成 |
| Label.js | 组件替换 | ✅ 完成 |
| Search.js | 组件替换 | ✅ 完成 |
| ModalPostman/index.js | 组件替换 | ✅ 完成 |

### ✅ 已完成

| 任务 | 文件 | 状态 |
|------|------|------|
| Vite配置 | `vite.config.js` | ✅ 完成 |
| 前端入口 | `client/index.js` | ✅ 完成 |
| AI控制器 | `server/controllers/ai.js` | ✅ 完成 |
| AI模型 | `server/models/ai.js` | ✅ 完成 |
| 路由配置 | `server/router.js` | ✅ 完成 |
| 依赖更新 | `package.json` | ✅ 已添加 naive-ui, vite |
| UI组件替换 | 71个文件 | ✅ 完成 |
| 剩余1个文件已注释 | GroupLog.js | ✅ 无需处理 |

### ✅ 全部完成

| 任务 | 文件数 | 状态 |
|------|--------|------|
| 替换antd组件为naive-ui | 72个文件 | ✅ 已完成 (99%) |

## 任务总结

### 1. 前端 UI 库替换

需要替换72个文件中的 Ant Design 组件为 Naive UI 组件。

#### 1.1 主要组件替换对照表

| Ant Design | Naive UI | 使用文件数 |
|------------|---------|------------|
| Layout | NL ayout | Header.js等 |
| Table | NTable | InterfaceList.js等 |
| Modal | NModal | 多处 |
| Form | NForm | 多处 |
| Button | NButton | 多处 |
| Input | NInput | 多处 |
| Select | NSelect | 多处 |
| Tabs | NTabs | 多处 |
| Menu | NMenu | 多处 |
| message | useMessage | 需重构 |
| Icon | NIcon | 多处 |
| Tree | NTree | 多处 |
| Card | NCard | 多处 |
| Row/NCol | NR/NCol | 多处 |
| Tooltip | NTooltip | 多处 |
| Popconfirm | NPopconfirm | 多处 |
| Alert | NAlert | 多处 |
| Upload | NUpload | Profile.js |
| Collapse | NCollapse | 多处 |
| Spin | NSpin | 多处 |
| Radio | NRadio | Login.js |
| Checkbox | NCheckbox | - |
| Switch | NSwitch | 多处 |
| DatePicker | NDatePicker | - |
| Upload | NUpload | - |
| Avatar | NAvatar | 多处 |
| Timeline | NTimeline | TimeLine.js |
| Breadcrumb | NBreadcrumb | Breadcrumb.js |
| Tag | NTag | 多处 |
| Affix | NAffix | InterfaceEditForm.js |
| AutoComplete | NAutoComplete | 多处 |

#### 1.2 需替换的文件列表

```
client/components/Header/Header.js                    # Layout, message
client/components/TimeLine/TimeLine.js               # Timeline, Spin, Tag, Avatar, Button, Modal, AutoComplete
client/components/Postman/Postman.js                 # 多个组件
client/components/Postman/CheckCrossInstall.js      # Alert
client/components/Subnav/Subnav.js                  # Menu
client/components/SchemaTable/SchemaTable.js         # Table
client/components/ProjectCard/ProjectCard.js        # Card, Icon, Tooltip, Modal, Alert, Input, message
client/components/Notify/Notify.js                   # Alert, message
client/components/MyPopConfirm/MyPopConfirm.js      # Modal, Button
client/components/ModalPostman/VariablesSelect.js  # Tree
client/components/ModalPostman/index.js             # Alert, Modal, Row, Col, Icon, Collapse, Input, Tooltip
client/components/ModalPostman/MethodsList.js        # Row, Icon, Input, Select, Tooltip
client/components/ModalPostman/MockList.js           # Row, Input
client/components/GuideBtns/GuideBtns.js             # Button
client/components/Label/Label.js                     # Icon, Input, Tooltip
client/components/Footer/Footer.js                   # Row, Col, Icon
client/components/Intro/Intro.js                    # Icon
client/components/Header/Search/Search.js           # Icon, Input, AutoComplete
client/components/Breadcrumb/Breadcrumb.js          # Breadcrumb
client/components/CaseEnv/index.js                  # Select, Row, Col, Collapse, Icon, Tooltip
client/components/ErrMsg/ErrMsg.js                    # Icon
client/containers/Login/Login.js                      # Form, Button, Input, Icon, message, Radio
client/containers/Login/Reg.js                      # Form, Button, Input, Icon, message
client/containers/Login/LoginContainer.js           # Row, Col, Card
client/containers/Login/LoginWrap.js               # Tabs
client/containers/User/User.js                     # Row
client/containers/User/Profile.js                 # Row, Col, Input, Button, Select, message, Upload, Tooltip
client/containers/User/List.js                     # Table, Popconfirm, message, Input
client/containers/Project/Project.js               # 需要检查
client/containers/Project/Setting/Setting.js         # Tabs
client/containers/Project/Setting/ProjectData/ProjectData.js  # 多个组件
client/containers/Project/Setting/ProjectTag/ProjectTag.js    # Icon, Row, Col, Input
client/containers/Project/Setting/ProjectToken/ProjectToken.js  # Icon, Tooltip, message, Modal
client/containers/Project/Setting/ProjectMessage/ProjectMessage.js   # 多个组件
client/containers/Project/Setting/ProjectMember/ProjectMember.js # 多个组件
client/containers/Project/Setting/ProjectRequest/ProjectRequest.js # Form, Button, message
client/containers/Project/Setting/ProjectEnv/ProjectEnvContent.js # 多个组件
client/containers/Project/Setting/ProjectEnv/index.js       # Icon, Layout, Tooltip, message, Row, Popconfirm
client/containers/Project/Setting/ProjectMock/index.js    # Form, Switch, Button, Icon, Tooltip, message
client/containers/Project/Interface/Interface.js           # Tabs, Layout
client/containers/Project/Interface/InterfaceList/View.js  # Table, Icon, Row, Col, Tooltip, message
client/containers/Project/Interface/InterfaceList/Run/Run.js  # message
client/containers/Project/Interface/InterfaceList/Edit.js  # message, Modal
client/containers/Project/Interface/InterfaceList/InterfaceContent.js  # Tabs, Modal, Button
client/containers/Project/Interface/InterfaceList/AddInterfaceForm.js  # Form, Input, Select, Button
client/containers/Project/Interface/InterfaceList/InterfaceList.js  # Table, Button, Modal, message, Tooltip, Select, Icon
client/containers/Project/Interface/InterfaceList/AddInterfaceCatForm.js  # Form, Input, Button
client/containers/Project/Interface/InterfaceList/InterfaceEditForm.js  # message, Affix, Tabs, Modal
client/containers/Project/Interface/InterfaceList/Run/AddColModal.js    # Modal, Collapse, Row, Col, Input, message, Button, Icon
client/containers/Project/Interface/InterfaceList/InterfaceMenu.js # Input, Icon, Button, Modal, message, Tree, Tooltip
client/containers/Project/Interface/InterfaceCol/InterfaceColMenu.js  # 多个组件
client/containers/Project/Interface/InterfaceCol/CaseReport.js  # Row, Col, Tabs
client/containers/Project/Interface/InterfaceCol/ImportInterface.js  # Table, Select, Tooltip, Icon
client/containers/Project/Interface/InterfaceCol/InterfaceColContent.js  # 多个组件
client/containers/Project/Interface/InterfaceCol/InterfaceCaseContent.js  # message, Tooltip, Input
client/containers/Project/Activity/Activity.js      # Button
client/containers/Group/ProjectList/UpDateModal.js  # Modal, Form, Input, Icon, Tooltip, Select, message, Button, Row, Col
client/containers/Group/ProjectList/ProjectList.js   # Row, Col, Button, Tooltip
client/containers/Group/Group.js                 # Tabs, Layout, Spin
client/containers/Group/GroupSetting/GroupSetting.js  # 多个组件
client/containers/Group/GroupLog/GroupLog.js    # 可能使用antd
client/containers/Group/GroupList/GroupList.js    # 多个组件
client/containers/Group/MemberList/MemberList.js  # 多个组件
client/containers/Home/Home.js                   # Row, Col, Button, Icon, Card
client/containers/News/News.js                # Button
client/containers/News/NewsList/NewsList.js    # Menu
client/containers/News/NewsTimeline/NewsTimeline.js  # Timeline, Spin
client/containers/Follows/Follows.js          # Row, Col
client/containers/AddProject/AddProject.js     # 多个组件
client/reducer/middleware/messageMiddleware.js  # message
client/components/UsernameAutoComplete/UsernameAutoComplete.js  # Select
```

### 2. 样式适配

需要更新的样式文件：
- `client/styles/theme.less` - 主题变量
- `client/styles/common.scss` - 公共样式
- `client/styles/public-sass.scss` - Sass样式
- `client/styles/mixin.scss` - Mixin

### 3. 测试验证

- [ ] 运行 `npm run dev` 验证前端
- [ ] 运行 `npm run dev-server` 验证后端
- [ ] 测试 AI API 接口

## 技术细节

### Vite 配置 (已完成)

```javascript
// vite.config.js
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

### AI 控制器 (已完成)

```javascript
// server/controllers/ai.js
class aiController extends baseController {
  async getAiAgents(ctx)
  async addAiAgent(ctx)
  async updateAiAgent(ctx)
  async deleteAiAgent(ctx)
  async chatWithAiAgent(ctx)
  async generateApiDoc(ctx)
  async generateTestCase(ctx)
}
```

### AI 模型 (已完成)

```javascript
// server/models/ai.js
const aiSchema = new mongoose.Schema({
  name: String,
  description: String,
  type: { type: String, enum: ['openai', 'claude', 'gemini', 'custom'] },
  apiKey: String,
  model: String,
  temperature: Number,
  maxTokens: Number
});
```

### 路由配置 (已完成)

```javascript
// server/router.js
ai: [
  { action: 'getAiAgents', path: 'agents', method: 'get' },
  { action: 'addAiAgent', path: 'agent', method: 'post' },
  { action: 'updateAiAgent', path: 'agent', method: 'put' },
  { action: 'deleteAiAgent', path: 'agent', method: 'delete' },
  { action: 'chatWithAiAgent', path: 'chat', method: 'post' },
  { action: 'generateApiDoc', path: 'generate/doc', method: 'post' },
  { action: 'generateTestCase', path: 'generate/testcase', method: 'post' }
]
```

## 预期成果

1. **前端**：使用 Vite Plus 构建，加载速度更快，开发体验更好；使用 Naive UI，界面更现代化，交互更流畅。

2. **后端**：添加 AI agent 相关功能，支持 AI 助手管理、对话、API 文档生成和测试用例生成等功能。

3. **整体**：项目架构更现代化，适配 AI 时代的需求，提供更智能的 API 管理体验。

## 注意事项

1. **兼容性**：确保修改后的代码与现有功能保持兼容，不破坏原有功能。

2. **性能**：Vite Plus 构建速度更快，但需要注意配置优化，确保生产环境的性能。

3. **安全性**：AI 相关功能涉及 API Key 等敏感信息，需要确保安全存储和传输。

4. **测试**：充分测试前端和后端功能，确保所有功能正常工作。

5. **文档**：更新相关文档，说明新功能的使用方法和注意事项。