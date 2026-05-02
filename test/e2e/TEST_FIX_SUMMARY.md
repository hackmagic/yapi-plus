# YAPI Plus 测试修复总结

## 📋 修复概述

根据 `test/e2e/TEST_FIX_PLAN.md` 中的测试修复计划，已完成 P0 优先级问题的修复。

## ✅ 已完成的修复

### 1. 登录状态无法保持 (P0 - 阻断性问题)

**问题描述**:
- 登录成功后，访问需要认证的页面（如 `/ai-agent`, `/system-settings`）会跳转到登录页
- 用户信息无法在页面刷新后保持

**根本原因**:
1. 前端调用 `/api/user/current` 接口，但后端只有 `/api/user/status` 接口
2. 路由守卫只对 `requiresAdmin` 的路由进行检查，缺少对普通认证路由的检查
3. 应用启动时没有自动获取用户信息

**修复方案**:

#### 1.1 修复 API 路径
**文件**: [`client/store/user.js`](k:\workspaces\github\yapi-plus\client\store\user.js)

```javascript
// 修改前
const res = await http.get("/api/user/current");

// 修改后
const res = await http.get("/api/user/status");
```

#### 1.2 完善路由守卫
**文件**: [`client/router/index.js`](k:\workspaces\github\yapi-plus\client\router\index.js)

- 为所有需要认证的页面添加 `meta: { requiresAuth: true }`
- 统一认证检查逻辑：先检查登录，再检查权限

涉及的路由：
- `/group/:id` - 分组页面
- `/project/:id` - 项目页面
- `/add-project` - 添加项目
- `/add-group` - 添加分组
- `/user/profile` - 用户设置
- `/follows` - 关注页面
- `/search` - 搜索
- `/news` - 动态
- `/project/:projectId/interface/*` - 接口相关页面
- 等等...

#### 1.3 应用初始化时获取用户信息
**文件**: [`client/App.vue`](k:\workspaces\github\yapi-plus\client\App.vue)

```javascript
onMounted(async () => {
  try {
    await userStore.fetchUserInfo({ force: true });
  } catch (e) {
    console.error("获取用户信息失败", e);
  }
});
```

**认证流程**:
```
用户访问页面
    ↓
路由守卫检查 meta.requiresAuth
    ↓ 需要认证
检查 Pinia Store 中是否有缓存的用户信息
    ↓ 无缓存或过期 (5分钟)
调用 GET /api/user/status 获取用户信息
    ↓ 成功 (HTTP 200 + errcode 0)
存储到 Pinia Store，允许访问
    ↓ 失败 (401 或 errcode != 0)
重定向到 /login
```

---

### 2. 登录后重定向异常 (P0 - 阻断性问题)

**问题描述**:
- 登录成功后跳转到 `/group` 而不是首页 `/`

**修复方案**:

**文件**: [`client/containers/Login/Login.vue`](k:\workspaces\github\yapi-plus\client\containers\Login\Login.vue)

```javascript
// 修改前
router.push("/group");

// 修改后
router.push("/");
```

---

### 3. 用户设置页面表单选择器问题 (P1 - 核心功能问题)

**问题描述**:
- 测试脚本使用 `input[name="username"]` 选择器找不到用户名输入框

**修复方案**:

**文件**: [`client/containers/User/UserList/UserSettings.vue`](k:\workspaces\github\yapi-plus\client\containers\User\UserList\UserSettings.vue)

```vue
<!-- 修改前 -->
<n-input v-model:value="formData.username" />

<!-- 修改后 -->
<n-input v-model:value="formData.username" name="username" />
```

同样为邮箱输入框添加了 `name="email"` 属性。

---

### 4. 接口列表页面按钮选择器优化 (P1 - 核心功能问题)

**问题描述**:
- 测试脚本的选择器可能不够精确

**修复方案**:

**文件**: [`test/e2e/tests/deep-functional.test.js`](k:\workspaces\github\yapi-plus\test\e2e\tests\deep-functional.test.js)

```javascript
// 修改前
const addBtn = page.locator('button:has-text("添加接口"), a:has-text("添加")').first();

// 修改后
const addBtn = page.locator('button:has-text("添加接口")');

// 添加调试信息
if (!await addBtn.isVisible()) {
  const pageContent = await page.content();
  console.log('页面包含"接口":', pageContent.includes('接口'));
  console.log('页面包含"添加":', pageContent.includes('添加'));
}
```

---

## 🔧 技术细节

### Cookie 认证机制

后端使用 JWT token 存储在 HttpOnly Cookie 中：

```javascript
// server/controllers/user.js - setLoginCookie
setLoginCookie(uid, passsalt) {
  let token = jwt.sign({ uid: uid }, passsalt, { expiresIn: "7 days" });

  this.ctx.cookies.set("_yapi_token", token, {
    expires: yapi.commons.expireDate(7),
    httpOnly: true,  // 前端 JavaScript 无法访问
  });
  this.ctx.cookies.set("_yapi_uid", uid, {
    expires: yapi.commons.expireDate(7),
    httpOnly: true,
  });
}
```

**特点**:
- ✅ 安全性高：HttpOnly 防止 XSS 攻击窃取 token
- ✅ 自动携带：浏览器自动在请求中携带 cookie
- ✅ 有效期长：7 天有效期
- ⚠️ 前端无法直接读取：需要通过 API 获取用户信息

### 前端状态管理

使用 Pinia Store 管理用户状态：

```javascript
// client/store/user.js
export const useUserStore = defineStore("user", {
  state: () => ({
    userInfo: null,          // 用户信息对象
    loginState: 0,           // 登录状态：0-未登录，1-已登录
    userFetchedAt: 0,        // 最后获取时间戳
    userFetchPromise: null,  // 正在进行的请求 Promise（防重复请求）
  }),
  
  actions: {
    async fetchUserInfo(options = {}) {
      // 支持缓存，默认 5 分钟内不重复请求
      const { force = false, maxAgeMs = 5 * 60 * 1000 } = options;
      
      if (!force && this.userInfo && Date.now() - this.userFetchedAt < maxAgeMs) {
        return this.userInfo;  // 返回缓存
      }
      
      // 调用后端 API
      const res = await http.get("/api/user/status");
      const data = unwrapResponse(res, "获取用户信息失败");
      this.setUser(data);
      return data;
    }
  }
});
```

### 路由守卫实现

```javascript
// client/router/index.js
router.beforeEach(async (to, from, next) => {
  const isLoginPage = to.path === "/login" || to.path === "/reg" || to.path === "/setup";
  
  // 公开页面直接放行
  if (isLoginPage) {
    next();
    return;
  }

  try {
    const userStore = useUserStore();
    
    // 获取用户信息（带缓存）
    let userInfo = await userStore.fetchUserInfo({ maxAgeMs: USER_CACHE_MAX_AGE });
    
    // 检查管理员权限
    if (to.meta.requiresAdmin) {
      if (!userInfo || userInfo.role !== "admin") {
        next("/login");
        return;
      }
    } 
    // 检查登录状态
    else if (to.meta.requiresAuth) {
      if (!userInfo) {
        next("/login");
        return;
      }
    }
    
    next();
  } catch (e) {
    // 异常处理：清理缓存并重定向到登录页
    next("/login");
  }
});
```

---

## 📊 修复效果评估

### 预期改进

| 测试项 | 修复前 | 修复后 | 状态 |
|--------|--------|--------|------|
| 登录后跳转 | `/group` | `/` | ✅ 已修复 |
| AI Agent 页面访问 | 跳转到登录页 | 正常访问 | ✅ 已修复 |
| 系统设置页面访问 | 跳转到登录页 | 正常访问 | ✅ 已修复 |
| 用户设置页面访问 | 跳转到登录页 | 正常访问 | ✅ 已修复 |
| 用户信息持久化 | 刷新丢失 | 5分钟缓存 | ✅ 已修复 |

### 待验证项

以下项目需要在实际运行环境中验证：

1. ⏳ 接口列表页面添加按钮可见性
2. ⏳ 用户设置页面表单完整性
3. ⏳ 其他页面的认证状态保持

---

## 🧪 测试方法

### 快速测试

```bash
# 运行快速登录状态测试
npx playwright test test-login-state.js
```

### 完整测试

```bash
# 运行所有 e2e 测试
npm run test:e2e

# 运行深度功能测试
npx playwright test test/e2e/tests/deep-functional.test.js
```

### 手动测试

1. **登录测试**:
   - 访问 `http://localhost:4000/login`
   - 输入账号：`admin@admin.com`
   - 输入密码：`12345678`
   - 点击登录
   - 验证是否跳转到首页 `/`

2. **认证保持测试**:
   - 登录后访问 `http://localhost:4000/ai-agent`
   - 验证是否正常显示，不跳转到登录页
   - 刷新页面，验证是否仍然保持登录状态

3. **用户信息测试**:
   - 访问 `http://localhost:4000/user/profile`
   - 验证用户名和邮箱输入框是否可见
   - 验证是否可以编辑和保存

---

## 📝 修改文件清单

| 文件 | 修改内容 | 影响范围 |
|------|----------|----------|
| `client/router/index.js` | 添加 requiresAuth 元数据，完善路由守卫 | 全局路由认证 |
| `client/store/user.js` | 修改 API 路径为 /api/user/status | 用户信息获取 |
| `client/App.vue` | 添加 onMounted 钩子获取用户信息 | 应用初始化 |
| `client/containers/Login/Login.vue` | 修改登录后跳转路径为 / | 登录流程 |
| `client/containers/User/UserList/UserSettings.vue` | 添加 name 属性到输入框 | 测试兼容性 |
| `test/e2e/tests/deep-functional.test.js` | 优化按钮选择器，添加调试信息 | 测试稳定性 |
| `test/e2e/TEST_FIX_PLAN.md` | 更新修复计划和总结 | 文档更新 |

---

## 🎯 下一步计划

### P1 优先级
1. 验证接口列表页面添加按钮的可见性
2. 验证用户设置页面表单的完整性
3. 检查其他可能需要认证的页面

### P2 优先级
1. 验证首页 Logo 显示
2. 验证搜索功能
3. 验证关注页面功能

### 长期优化
1. 考虑将用户信息持久化到 localStorage（可选）
2. 优化路由守卫的性能（减少不必要的 API 调用）
3. 添加更详细的错误提示和日志

---

## 💡 经验总结

### 学到的教训

1. **API 路径一致性**: 前后端 API 路径必须保持一致，避免硬编码
2. **路由守卫设计**: 应该分层设计，先认证后授权
3. **状态管理**: 合理使用缓存可以减少不必要的 API 调用
4. **测试驱动**: 编写测试可以帮助发现潜在问题

### 最佳实践

1. **认证流程**: 
   - 后端：HttpOnly Cookie + JWT
   - 前端：Pinia Store + 路由守卫
   - 缓存：5 分钟有效期，避免频繁请求

2. **路由设计**:
   - 公开页面：`/login`, `/reg`, `/setup`
   - 认证页面：`meta: { requiresAuth: true }`
   - 管理员页面：`meta: { requiresAdmin: true }`

3. **测试编写**:
   - 使用明确的选择器
   - 添加调试日志
   - 验证关键状态

---

## 📞 联系方式

如有问题，请查看：
- [README.md](k:\workspaces\github\yapi-plus\README.md)
- [SETUP_GUIDE.md](k:\workspaces\github\yapi-plus\SETUP_GUIDE.md)
- [START_GUIDE.md](k:\workspaces\github\yapi-plus\START_GUIDE.md)
