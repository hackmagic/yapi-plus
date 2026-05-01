# YAPI Plus

在开始使用 YAPI Plus 之前，我们先来熟悉一下 YAPI Plus 的网站结构，这将让你快速了解YAPI Plus。

## 新特性

### Vue 3 + VitePlus

使用 **Vue 3** 作为前端框架，**VitePlus** 作为构建工具，开发和构建速度更快，开发体验更好。

### Naive UI

使用 **Naive UI** 作为 UI 库，界面更现代化，完全适配 Vue 3。

### AI 助手

YAPI Plus 支持 AI 助手功能，可以帮助你：

- 与 AI 助手对话，获取 API 相关帮助
- 使用 AI 自动生成 API 文档
- 使用 AI 自动生成测试用例

## 登录与注册

想要使用 YAPI Plus ，首先要注册账号或者使用管理员分配的账号登录。

### 初始管理员账号

首次安装后，系统会自动创建管理员账号：

- **邮箱**：`admin@admin.com`（或在 config.json 中配置的 adminAccount）
- **密码**：`ymfe.org`

> ⚠️ **重要提示**：首次登录后请立即修改密码！

<img src="./images/usage/login.png" />

## 首页

登录后进入首页，首页展示了分组与项目。

此时你作为新用户，没有任何分组与项目的权限，因此只能搜索、浏览 “公开项目” 的接口，如果在首页找不到任何项目，请联系管理员将你加入对应项目。

1. 首页头部展示了当前所在的位置、搜索框、新建项目、查看文档和用户信息。
2. 首页左侧展示分组信息，“分组”是“项目”的集合，只有超级管理员可以管理分组。
3. 首页右侧是分组下的项目和成员列表，点击左侧的某个分组，右侧会出现该分组下的项目和成员信息。
4. 点击项目右上角的星星即可关注项目，关注的项目可以在“我的关注”页面查看。

<img src="./images/usage/index.png" />

## 项目页

点击一个项目，进入项目页，项目页展示了属于该项目的全部接口，并提供项目、接口的全部操作。

此时你作为新用户，只能浏览接口信息，不可以编辑项目或接口，如果需要编辑，请联系管理员将你加入该项目。

1. 项目页左侧的 “接口列表” 展示了该项目下的所有接口，右侧默认显示该项目下所有接口的列表。
2. 点击左侧的某个接口，右侧会出现“预览”、“编辑”和“运行”。
3. 点击左侧的 “测试集合” 使用[测试集](./case.md)功能。
4. 点击二级导航的“设置”，项目组长即可编辑项目信息和管理成员列表。
5. 点击二级导航的“动态”，即可查看项目的操作日志。

<img src="./images/usage/project.png" />

## 个人中心

鼠标移动到右上角的用户头像或用户名上，即可点击“个人中心”查看个人信息。

<img src="./images/usage/hover.png" />

在个人信息页面可以查看并修改自己的用户名、密码等信息。

<img src="./images/usage/user.png" />

## AI 助手

YAPI Plus 提供了强大的 AI 助手功能，帮助开发者更高效地管理 API。

### 支持的 AI 模型

YAPI Plus 支持多种 AI 模型：

- **DeepSeek** - DeepSeek API (推荐, https://api-docs.deepseek.com/zh-cn/)
- **OpenAI** - GPT 系列模型
- **Claude** - Anthropic 的 Claude 模型
- **Gemini** - Google 的 Gemini 模型
- **Custom** - 自定义模型

### 创建 AI 助手

1. 进入系统管理页面，找到 AI 助手管理
2. 点击创建 AI 助手，填写以下信息：
   - 名称：AI 助手的名称
   - 类型：选择 AI 模型（DeepSeek/OpenAI/Claude/Gemini/Custom）
   - API Key：输入对应 AI 服务的 API Key
   - 模型：选择具体模型
     - DeepSeek: `deepseek-v4-flash`, `deepseek-v4-pro`, `deepseek-chat`, `deepseek-reasoner`
     - OpenAI: `gpt-4`, `gpt-3.5-turbo`
     - Claude: `claude-3-opus`, `claude-3-sonnet`
     - Gemini: `gemini-pro`, `gemini-pro-vision`
   - 温度：设置生成文本的随机性（0-1）
   - 最大令牌数：设置最大生成长度

### 使用 AI 对话

1. 选择已创建的 AI 助手
2. 输入问题并发送
3. AI 助手会生成相关回复

### AI 生成功能

- **生成 API 文档**：选择接口，点击生成文档，AI 自动生成接口说明
- **生成测试用例**：选择接口，点击生成测试用例，AI 自动生成测试代码
