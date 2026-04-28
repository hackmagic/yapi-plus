# YAPI Plus 轻量化配置系统使用指南

## 概述

YAPI Plus 现已采用轻量化配置系统，核心配置（数据库连接、管理员账号）从配置文件移至 Web 界面，使启动和配置过程更加简单优雅。

## 快速开始

### 1. 首次启动

```bash
npm start
# 或
npm run dev
```

启动后，系统会自动检测配置状态。如果未完成配置，将启动**配置模式**并显示：

```
⚙️  检测到未完成配置，启动配置模式...
请访问: http://localhost:3000/setup

✓ 配置模式服务器已启动
```

### 2. Web 配置引导

访问 `http://localhost:3000/setup`，配置向导将引导你完成 3 个步骤：

#### 步骤 1: 数据库配置
- **连接方式**：选择简单配置或连接字符串
- **简单配置**：
  - 服务器地址（默认: 127.0.0.1）
  - 端口（默认: 27017）
  - 数据库名（默认: yapi）
  - 用户名/密码（可选）
- **测试连接**：点击按钮验证数据库连接

#### 步骤 2: 管理员账号
- 管理员邮箱（用于登录）
- 初始密码（默认: ymfe.org）

#### 步骤 3: 邮件配置（可选）
- 启用/禁用邮件服务
- SMTP 服务器配置
- 可跳过，稍后在系统设置中配置

### 3. 完成配置

点击"完成配置"后，系统将：
1. 保存配置到数据库
2. 创建管理员账号
3. 初始化数据库索引
4. 更新 config.json（作为备份）
5. 创建 init.lock 文件

配置完成后，**重启服务**即可正常使用。

## 配置文件说明

### config.json（简化版）

现在 config.json 仅包含基础配置：

```json
{
  "port": "3000",
  "timeout": 120000
}
```

所有敏感配置（数据库、管理员账号）都通过 Web 界面配置并存储在数据库中。

### 配置加载顺序

系统启动时按以下顺序加载配置：

1. **数据库配置**（优先）
   - 从 `system_configs` 集合读取
   
2. **配置文件**（备选）
   - 从 `config.json` 读取（兼容旧版本）
   
3. **配置模式**（未配置时）
   - 启动轻量化配置服务器
   - 引导用户完成配置

## 系统设置

管理员登录后可在"系统设置"中查看和修改配置：

- 数据库配置
- 管理员账号
- 邮件配置

## 传统安装方式（已弃用）

```bash
npm run install-server
```

此方式仍可使用，但**推荐**使用 Web 配置向导。

## 技术架构

### 新增文件

**后端**：
- `server/models/systemConfig.js` - 系统配置数据模型
- `server/configChecker.js` - 配置检测工具
- `server/controllers/configController.js` - 配置控制器

**前端**：
- `client/containers/Setup/SetupWizard.vue` - 配置引导页面
- `client/containers/SystemSettings/SystemSettings.vue` - 系统设置页面
- `client/router/index.js` - 路由配置

### API 接口

- `GET /api/config/status` - 获取配置状态
- `POST /api/config/test-db` - 测试数据库连接
- `POST /api/config/save` - 保存配置并初始化

## 常见问题

### Q: 如何重新配置？

删除 `init.lock` 文件并重启服务：

```bash
rm init.lock  # Linux/Mac
del init.lock  # Windows
npm start
```

### Q: MongoDB 未启动怎么办？

配置向导会提示连接失败。请先启动 MongoDB：

```bash
mongod
```

### Q: 配置保存在哪里？

配置同时保存在：
1. MongoDB 的 `system_configs` 集合（主要）
2. `config.json` 文件（备份）

### Q: 如何迁移旧配置？

如果已有 config.json 配置，系统会自动读取。建议：
1. 启动服务
2. 进入系统设置
3. 确认配置正确
4. 系统会自动迁移到数据库

## 优势

✅ **轻量化启动** - 无需预先配置即可启动  
✅ **优雅引导** - 分步骤向导，实时验证  
✅ **集中管理** - 所有配置在 Web 界面完成  
✅ **向后兼容** - 支持旧版 config.json  
✅ **安全可靠** - 敏感信息存储在数据库  

## 支持

如有问题，请查看：
- 项目 README
- GitHub Issues
- 官方文档
