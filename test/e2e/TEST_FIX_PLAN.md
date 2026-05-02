# 测试修复计划

## 优先级 P0 - 阻断性问题 (登录/权限)

### 1. 登录状态无法保持 ❌
**现象**: 登录成功后，访问其他需要登录的页面（如 /ai-agent, /system-settings）仍然跳转到登录页

**测试输出**:
```
登录后URL: http://localhost:4000/group
AI Agent页面URL: http://localhost:4000/login
系统设置页面URL: http://localhost:4000/login
```

**可能原因**:
- Session/Cookie 没有正确保存
- 路由守卫检查用户信息时 API 调用失败
- 前端状态管理 (Pinia) 没有正确初始化

**涉及页面**:
- /ai-agent (AI助手管理)
- /system-settings (系统设置)
- /user (用户列表)
- /user/profile (用户设置)

---

## 优先级 P1 - 核心功能问题

### 2. 接口列表页面添加按钮不可见 ❌
**现象**: 访问 `/project/1/interface` 页面，"添加接口"按钮不可见

**测试输出**:
```
接口页面URL: http://localhost:4000/project/1/interface
添加接口按钮不可见
```

**可能原因**:
- 页面布局问题，按钮可能被遮挡
- 权限问题（普通成员没有添加权限）
- 按钮选择器不正确

---

### 3. 用户设置页面表单不完整 ❌
**现象**: 访问 `/user/profile` 页面，用户名输入框不可见

**测试输出**:
```
用户设置页面URL: http://localhost:4000/user/profile
用户名输入框可见: false
```

**可能原因**:
- 页面加载问题
- 选择器不正确
- 需要检查页面实际结构

---

### 4. 登录后跳转异常
**现象**: 登录成功后跳转到 `/group` 而不是首页 `/`

**测试输出**:
```
登录后URL: http://localhost:4000/group
```

**可能原因**:
- 登录后重定向逻辑不正确

---

## 优先级 P2 - UI/交互问题

### 5. 首页Logo显示问题
- 需要检查 logo 是否正确显示

### 6. 搜索功能需要验证
- 搜索页面功能是否正常工作

### 7. 关注页面功能验证
- /follows 页面功能正常

---

## 功能正常项 ✅

1. ✅ 登录API正常工作 (admin@admin.com / 12345678)
2. ✅ 创建项目成功 (项目ID: 32)
3. ✅ 分组页面正常显示
4. ✅ 搜索页面可访问
5. ✅ 动态页面可访问

---

## 后续任务

1. **修复登录状态保持问题** - 检查Session/Cookie/路由守卫
2. **修复admin页面访问问题** - /ai-agent, /system-settings, /user
3. **检查接口列表页面** - 添加按钮可见性
4. **检查用户设置页面** - 表单完整性
5. **检查登录后重定向** - 应该跳转首页还是group

---

## 测试命令

```bash
# 运行深度功能测试
npm run test:e2e

# 运行单个测试文件
npx playwright test test/e2e/tests/deep-functional.test.js
```