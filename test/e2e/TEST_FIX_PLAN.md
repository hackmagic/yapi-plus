# 测试修复计划

## ✅ 已修复问题

### 1. 登录状态无法保持 ✅ FIXED
**现象**: 登录成功后，访问其他需要登录的页面（如 /ai-agent, /system-settings）仍然跳转到登录页

**根本原因**:
- 前端调用 `/api/user/current` 接口，但后端只有 `/api/user/status` 接口
- 路由守卫不完善，只对 `requiresAdmin` 的路由进行检查
- 应用启动时没有自动获取用户信息

**修复方案**:
1. ✅ 修改 [`user.js`](k:\workspaces\github\yapi-plus\client\store\user.js) store，将 API 路径从 `/api/user/current` 改为 `/api/user/status`
2. ✅ 完善 [`router/index.js`](k:\workspaces\github\yapi-plus\client\router\index.js) 路由守卫：
   - 为所有需要登录的页面添加 `meta: { requiresAuth: true }`
   - 统一认证检查逻辑，先检查登录再检查权限
3. ✅ 在 [`App.vue`](k:\workspaces\github\yapi-plus\client\App.vue) 中添加 `onMounted` 钩子，应用启动时自动获取用户信息

**测试结果**: 待验证

---

### 2. 登录后重定向异常 ✅ FIXED
**现象**: 登录成功后跳转到 `/group` 而不是首页 `/`

**根本原因**:
- [`Login.vue`](k:\workspaces\github\yapi-plus\client\containers\Login\Login.vue) 中硬编码了跳转路径为 `/group`

**修复方案**:
1. ✅ 修改登录成功后的跳转路径为 `/`

**测试结果**: 待验证

---

## ⏳ 待修复问题

### 3. 接口列表页面添加按钮不可见 ❌
**现象**: 访问 `/project/1/interface` 页面，"添加接口"按钮不可见

**可能原因**:
- 页面布局问题，按钮可能被遮挡
- 权限问题（普通成员没有添加权限）
- 按钮选择器不正确

**下一步**:
- 检查页面实际 DOM 结构
- 验证用户权限
- 调整测试选择器

---

### 4. 用户设置页面表单不完整 ❌
**现象**: 访问 `/user/profile` 页面，用户名输入框不可见

**可能原因**:
- 页面加载问题
- 选择器不正确
- 需要检查页面实际结构

**下一步**:
- 检查 UserSettings.vue 组件实现
- 验证表单字段名称和选择器

---

## 功能正常项 ✅

1. ✅ 登录API正常工作 (admin@admin.com / 12345678)
2. ✅ 创建项目成功 (项目ID: 32)
3. ✅ 分组页面正常显示
4. ✅ 搜索页面可访问
5. ✅ 动态页面可访问

---

## 修复总结

### 已完成修复 (P0 优先级)
1. ✅ **登录状态保持问题** - 修复 API 路径、完善路由守卫、添加应用初始化
2. ✅ **登录后重定向** - 修改为跳转到首页

### 待修复问题 (P1-P2 优先级)
1. ❌ 接口列表页面按钮可见性
2. ❌ 用户设置页面表单完整性
3. ⏸️ UI/交互问题（Logo、搜索、关注页面）

---

## 测试命令

```bash
# 运行快速登录状态测试
npx playwright test test-login-state.js

# 运行深度功能测试
npm run test:e2e

# 运行单个测试文件
npx playwright test test/e2e/tests/deep-functional.test.js
```

---

## 技术细节

### 修改的文件清单

1. **client/router/index.js**
   - 为所有需要认证的页面添加 `meta: { requiresAuth: true }`
   - 完善路由守卫逻辑，统一处理认证和权限检查

2. **client/store/user.js**
   - 修改 `fetchUserInfo` 方法使用正确的 API 路径 `/api/user/status`

3. **client/App.vue**
   - 添加 `onMounted` 钩子，应用启动时自动获取用户信息

4. **client/containers/Login/Login.vue**
   - 修改登录成功后的跳转路径为 `/`

### 认证流程

```
用户访问页面
    ↓
路由守卫检查
    ↓
是否需要认证？(requiresAuth)
    ↓ 是
检查缓存的用户信息
    ↓ 无缓存或过期
调用 /api/user/status 获取用户信息
    ↓ 成功
存储到 Pinia Store
    ↓
允许访问
    ↓ 失败或未登录
重定向到 /login
```

### Cookie 机制

后端使用 JWT token 存储在 HttpOnly Cookie 中：
- `_yapi_token`: JWT token，7天有效期
- `_yapi_uid`: 用户 ID，7天有效期

前端通过 API 获取用户信息并存储在 Pinia Store 中，支持 5 分钟缓存。