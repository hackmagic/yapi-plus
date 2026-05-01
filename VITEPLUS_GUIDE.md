# YAPI Plus - VitePlus 使用指南

## 🎯 什么是 VitePlus？

VitePlus (Vite+) 是一个统一的 Web 开发工具链，它整合了：

- **Vite** - 快速的前端构建工具
- **Rolldown** - 更快的生产构建（基于 Rust）
- **Vitest** - 测试框架
- **Oxlint** - 超快的 Linter（比 ESLint 快 50-100 倍）
- **Oxfmt** - 格式化器（比 Prettier 快 30 倍）
- **Tsdown** - TypeScript 库打包工具

## 📦 项目配置

### 技术栈

- ✅ **框架**: Vue 3.4+
- ✅ **构建工具**: VitePlus 0.1.19
- ✅ **UI 库**: Naive UI 2.34+
- ✅ **路由**: Vue Router 4.x
- ✅ **状态管理**: Pinia 2.x
- ✅ **后端**: Node.js + Koa
- ✅ **数据库**: MongoDB

### 配置文件

- `vite.config.js` - Vite 配置（VitePlus 会自动使用）
- `vite-plus.config.js` - VitePlus 额外配置
- `package.json` - 脚本和依赖

## 🚀 常用命令

### 开发命令

```bash
# 启动开发服务器（推荐）
vp dev

# 指定端口
vp dev --port 3000

# 启动完整开发环境（前后端）
npm run dev

# 仅启动前端
npm run dev-client
```

### 构建命令

```bash
# 生产构建
vp build

# 使用 npm 脚本
npm run build
```

### 代码质量

```bash
# 检查代码（格式化 + Lint + 类型检查）
vp check

# 仅格式化
vp fmt

# 仅 Lint
vp lint
```

### 依赖管理

```bash
# 安装所有依赖
vp install

# 添加新包
vp add axios
vp add lodash --save-dev

# 移除包
vp remove lodash

# 更新包
vp update

# 查看过时的包
vp outdated
```

## 📁 项目结构

```
yapi-plus/
├── client/                    # Vue 3 前端
│   ├── main.js               # 入口文件
│   ├── App.vue               # 根组件
│   ├── router/               # 路由配置
│   ├── store/                # Pinia 状态管理
│   ├── components/           # 组件
│   ├── containers/           # 页面组件
│   └── styles/               # 样式文件
├── server/                    # Node.js 后端
│   ├── app.js                # 后端入口
│   ├── controllers/          # 控制器
│   ├── models/               # 数据模型
│   └── router.js             # 路由
├── vite.config.js            # Vite 配置
├── vite-plus.config.js       # VitePlus 配置
└── package.json              # 项目配置
```

## 🔧 VitePlus 优势

### 1. **更快的构建速度**

- 开发服务器启动：瞬间启动
- HMR（热模块替换）：即时更新
- 生产构建：比 Webpack 快 40 倍

### 2. **统一的工具链**

- 一个工具管理所有开发流程
- 一致的命令和配置
- 减少工具切换成本

### 3. **更好的开发体验**

- 内置代码检查和格式化
- 自动优化依赖
- 智能缓存机制

### 4. **现代化技术栈**

- 基于 Rust 的底层工具
- 支持最新的 Web 标准
- 活跃的开发社区

## 🎨 Naive UI 主题配置

在 Vue 3 中，Naive UI 的主题通过组件配置：

```vue
<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <router-view />
  </n-config-provider>
</template>

<script setup>
const themeOverrides = {
  common: {
    primaryColor: "#2080f0",
    primaryColorHover: "#4098fc",
  },
};
</script>
```

## 📝 开发工作流

### 1. 启动开发环境

```bash
# 确保 MongoDB 已启动
# 然后运行：
npm run dev
```

这会启动：

- 后端服务：http://localhost:3000
- 前端服务：http://localhost:4000

### 2. 开发新功能

```bash
# 1. 创建新的 Vue 组件
# client/components/MyComponent.vue

# 2. 在页面中使用
# client/containers/MyPage.vue

# 3. 添加路由
# client/router/index.js
```

### 3. 代码检查

```bash
# 提交前检查代码质量
vp check

# 自动修复格式问题
vp fmt
```

### 4. 生产构建

```bash
# 构建生产版本
vp build

# 输出目录：static/prd/
```

## 🔍 故障排除

### 端口被占用

```bash
# 使用不同端口
vp dev --port 4001

# 或者杀掉占用端口的进程
# Windows:
netstat -ano | findstr :4000
taskkill /PID <PID> /F
```

### 依赖问题

```bash
# 清理缓存并重新安装
rm -rf node_modules package-lock.json
vp install
```

### 构建错误

```bash
# 查看详细错误信息
vp build --debug

# 检查代码问题
vp check
```

## 📚 学习资源

- [VitePlus 官方文档](https://viteplus.dev/)
- [Vue 3 官方文档](https://vuejs.org/)
- [Naive UI 文档](https://www.naiveui.com/)
- [Vue Router 文档](https://router.vuejs.org/)
- [Pinia 文档](https://pinia.vuejs.org/)

## 🎯 最佳实践

1. **使用 `.vue` 文件** - 所有组件使用 Vue SFC 格式
2. **使用 Composition API** - `<script setup>` 语法
3. **使用 Pinia** - 替代 Redux 进行状态管理
4. **使用 Naive UI** - 所有 UI 组件使用 `n-` 前缀
5. **定期运行 `vp check`** - 保持代码质量
6. **使用 TypeScript** - 可选，但推荐

## 🚀 性能优化

VitePlus 已自动优化：

- ✅ 依赖预构建
- ✅ 代码分割
- ✅ 懒加载路由
- ✅ 资源压缩

手动优化建议：

- 使用动态导入：`import('./MyComponent.vue')`
- 合理使用 `computed` 和 `watch`
- 避免在模板中使用复杂表达式

---

**最后更新**: 2026-04-27
**VitePlus 版本**: v0.1.19
