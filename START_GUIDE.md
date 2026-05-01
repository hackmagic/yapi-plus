# YAPI Plus 启动指南

## 🚀 快速启动（推荐）

### 开发环境

**一键启动前后端**：

```bash
# 方式1：使用 npm（推荐）
npm run dev

# 方式2：快速启动（跳过图标复制）
npm run dev:fast

# 方式3：Windows 双击运行
start-dev.bat
```

### 生产环境

**一键启动前后端**：

```bash
# 方式1：使用 npm
npm run start:all

# 方式2：Windows 双击运行
start.bat
```

---

## 📋 启动命令详解

### 开发环境命令

| 命令                 | 说明           | 用途               |
| -------------------- | -------------- | ------------------ |
| `npm run dev`        | 启动前后端     | **日常开发推荐**   |
| `npm run dev:fast`   | 快速启动前后端 | 跳过图标复制，更快 |
| `npm run dev-server` | 仅启动后端     | 后端开发调试       |
| `npm run dev-client` | 仅启动前端     | 前端开发调试       |

### 生产环境命令

| 命令                | 说明         | 用途             |
| ------------------- | ------------ | ---------------- |
| `npm run start:all` | 启动前后端   | 生产环境运行     |
| `npm start`         | 仅启动后端   | 单独运行后端     |
| `vp preview`        | 预览构建结果 | 查看生产构建效果 |

### 构建命令

| 命令            | 说明          |
| --------------- | ------------- |
| `npm run build` | 生产构建前端  |
| `vp build`      | VitePlus 构建 |
| `vp check`      | 代码检查      |
| `vp fmt`        | 代码格式化    |

---

## 🔧 启动脚本说明

### start-dev.bat（开发环境）

Windows 批处理脚本，自动完成：

1. ✅ 检查并启动 MongoDB
2. ✅ 检查并安装依赖
3. ✅ 启动前后端开发服务器

**使用方法**：

```bash
# 双击运行
start-dev.bat

# 或命令行运行
.\start-dev.bat
```

### start.bat（生产环境）

Windows 批处理脚本，自动完成：

1. ✅ 检查并启动 MongoDB
2. ✅ 检查并构建前端（如未构建）
3. ✅ 启动生产服务器

**使用方法**：

```bash
# 双击运行
start.bat

# 或命令行运行
.\start.bat
```

---

## 🌐 服务地址

### 开发环境

| 服务        | 地址                  | 说明                |
| ----------- | --------------------- | ------------------- |
| **前端**    | http://localhost:4000 | VitePlus 开发服务器 |
| **后端**    | http://127.0.0.1:3000 | Koa API 服务器      |
| **MongoDB** | 127.0.0.1:27017       | 数据库              |

### 生产环境

| 服务          | 地址                  | 说明     |
| ------------- | --------------------- | -------- |
| **前端+后端** | http://127.0.0.1:3000 | 统一服务 |

---

## ⚙️ 启动流程

### 开发环境启动流程

```
1. 启动 MongoDB
   ↓
2. 启动后端服务 (端口 3000)
   ↓
3. 启动前端服务 (端口 4000)
   ↓
4. 前端代理 API 请求到后端
```

### 生产环境启动流程

```
1. 启动 MongoDB
   ↓
2. 构建前端 (static/prd/)
   ↓
3. 启动后端服务
   ↓
4. 后端提供静态文件服务
```

---

## 🔍 故障排除

### 问题1：端口被占用

**症状**：启动时报错 `EADDRINUSE`

**解决方法**：

```bash
# Windows 查看占用端口的进程
netstat -ano | findstr :3000  # 后端端口
netstat -ano | findstr :4000  # 前端端口

# 结束进程
taskkill /PID <PID> /F

# 或使用其他端口
vp dev --port 4001  # 前端改用 4001 端口
```

### 问题2：MongoDB 未启动

**症状**：后端启动失败，报 `ECONNREFUSED`

**解决方法**：

```bash
# 手动启动 MongoDB
"D:\SystemSoftware\mongodb-win32-x86_64-windows-8.2.7\bin\mongod.exe" --dbpath "D:\SystemSoftware\mongodb-win32-x86_64-windows-8.2.7\data" --port 27017

# 或使用启动脚本（自动启动 MongoDB）
start-dev.bat
```

### 问题3：依赖未安装

**症状**：报 `Cannot find module` 错误

**解决方法**：

```bash
# 重新安装依赖
rm -rf node_modules
npm install
```

### 问题4：前端无法访问后端

**症状**：前端请求 API 失败

**检查项**：

1. 后端是否正常启动（http://127.0.0.1:3000）
2. MongoDB 是否正常运行
3. 代理配置是否正确（vite.config.js）

---

## 🎯 使用场景

### 场景1：日常开发

**推荐命令**：

```bash
npm run dev
```

**特点**：

- ✅ 前后端同时启动
- ✅ 热更新支持
- ✅ 自动代理 API 请求
- ✅ 完整的开发体验

### 场景2：仅调试前端

**推荐命令**：

```bash
npm run dev-client
```

**特点**：

- ✅ 快速启动前端
- ✅ 后端可以独立部署
- ✅ 适合前后端分离开发

### 场景3：仅调试后端

**推荐命令**：

```bash
npm run dev-server
```

**特点**：

- ✅ 快速启动后端
- ✅ 可以使用 Postman 等工具测试 API
- ✅ 适合 API 开发

### 场景4：生产部署

**推荐命令**：

```bash
# 1. 构建前端
npm run build

# 2. 启动服务
npm run start:all
```

**特点**：

- ✅ 优化的生产构建
- ✅ 静态文件由后端提供
- ✅ 单一端口访问

---

## 📝 环境变量

### 开发环境变量

创建 `.env.development` 文件：

```env
# 前端端口
VITE_PORT=4000

# 后端 API 地址
VITE_API_URL=http://127.0.0.1:3000
```

### 生产环境变量

创建 `.env.production` 文件：

```env
# 后端 API 地址
VITE_API_URL=/api
```

---

## 🚀 高级配置

### 使用 PM2 管理进程（生产环境）

```bash
# 安装 PM2
npm install -g pm2

# 创建 PM2 配置文件
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'yapi-plus',
    script: 'server/app.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production'
    }
  }]
}
EOF

# 启动服务
pm2 start ecosystem.config.js

# 查看状态
pm2 status

# 查看日志
pm2 logs yapi-plus

# 停止服务
pm2 stop yapi-plus
```

### Docker 部署

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

---

## 💡 最佳实践

1. **开发时**：使用 `npm run dev` 一键启动
2. **提交前**：使用 `vp check` 检查代码
3. **部署前**：使用 `npm run build` 构建生产版本
4. **生产环境**：使用 PM2 管理进程
5. **监控日志**：定期检查 `log` 目录

---

## 📚 相关文档

- [VitePlus 使用指南](./VITEPLUS_GUIDE.md)
- [Vue 3 迁移文档](./docs/documents/vue3-migration.md)
- [项目 README](./README.md)

---

**最后更新**：2026-04-27
