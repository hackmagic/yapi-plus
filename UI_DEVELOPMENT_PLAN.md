# YAPI Plus UI 缺失页面补充开发计划

> 基于旧版 YAPI（React + AntD）与 YAPI Plus（Vue 3 + Naive UI）的 UI 对比分析
> 目标：恢复所有缺失的功能页面，确保功能覆盖率不低于 95%

---

## 📋 问题概览

对比发现 YAPI Plus 存在 **5 个严重缺失页面**（组件存在但路由未配置）和 **1 个需验证功能**：

| 序号 | 页面名称                     | 组件路径                                                                                                        | 旧版路由                            | 优先级    | 状态                     |
| ---- | ---------------------------- | --------------------------------------------------------------------------------------------------------------- | ----------------------------------- | --------- | ------------------------ |
| 1    | 项目动态（Activity）         | `client/containers/Project/Activity/Activity.vue`                                                               | `/project/:id/activity`             | 🔴 High   | 组件存在，路由缺失       |
| 2    | 新闻公告（News）             | `client/containers/News/NewsTimeline/NewsTimeline.vue`<br>`client/containers/News/NewsList/NewsList.vue`        | `/news` 或 `/news/timeline`         | 🟡 Medium | 组件存在，路由缺失       |
| 3    | 数据管理（ProjectData）      | `client/containers/Project/ProjectData/DataPage.vue`<br>`client/containers/Project/ProjectData/ProjectData.vue` | `/project/:id/data`                 | 🔴 High   | 组件存在，路由缺失       |
| 4    | 项目成员（ProjectMember）    | `client/containers/Project/Setting/ProjectMember/ProjectMember.vue`                                             | `/project/:id/members`              | 🔴 High   | 组件存在，未作为独立路由 |
| 5    | 用户个人中心（UserSettings） | `client/containers/User/UserList/UserSettings.vue`                                                              | `/user/profile` 或 `/user/settings` | 🔴 High   | 组件存在，路由缺失       |
| 6    | 注册页面（Reg）              | `client/containers/Login/Reg.vue`                                                                               | `/reg`                              | 🟡 Medium | 需验证功能完整性         |

---

## 🎯 开发任务清单

### 任务 1：添加项目动态页面路由

**文件：** `client/router/index.js`

**操作：**

1. 在路由配置数组 `routes` 中添加新路由对象
2. 建议位置：在 `/project/:id/setting` 路由之后添加
3. 路径：`/project/:id/activity`
4. 组件：`Project/Activity/Activity.vue`
5. 名称：`Activity`
6. 权限：公开（与旧版一致）

**代码示例：**

```javascript
{
  path: '/project/:id/activity',
  name: 'Activity',
  component: () => import('../containers/Project/Activity/Activity.vue')
}
```

**验证要点：**

- 访问 `/project/123/activity` 应正确渲染 Activity.vue
- 面包屑导航应显示 "项目名 > 动态"
- 页面应能获取并展示项目动态数据

---

### 任务 2：添加新闻公告页面路由

**文件：** `client/router/index.js`

**操作：**

1. 添加主路由：`/news`（或 `/announcement`）
2. 建议显示新闻时间线（NewsTimeline.vue）作为主页面
3. 可考虑添加子路由 `/news/list` 显示新闻列表（NewsList.vue）
4. 名称：`News` 或 `Announcement`
5. 权限：公开

**代码示例：**

```javascript
{
  path: '/news',
  name: 'News',
  component: () => import('../containers/News/NewsTimeline/NewsTimeline.vue')
}
// 可选：子路由
{
  path: '/news/list',
  name: 'NewsList',
  component: () => import('../containers/News/NewsList/NewsList.vue')
}
```

**验证要点：**

- 顶部导航栏 Header 是否需添加新闻入口（参考旧版）
- 新闻数据能否正常加载和展示

---

### 任务 3：添加数据管理页面路由

**文件：** `client/router/index.js`

**操作：**

1. 在 Project 子路由中添加 `/project/:id/data`
2. 组件：`Project/ProjectData/DataPage.vue` 或 `ProjectData.vue`
3. 名称：`ProjectData`
4. 权限：公开（需项目访问权限）

**代码示例：**

```javascript
// 在 Project 的 children 数组中添加：
{
  path: 'data',
  name: 'ProjectData',
  component: () => import('../containers/Project/ProjectData/DataPage.vue')
}
```

**注意：**

- 旧版路径为 `/project/:id/data`
- 需确认 DataPage.vue 是否为正确入口文件（存在两个可能：`DataPage.vue` 和 `ProjectData.vue`）

**验证要点：**

- 检查 ProjectData 目录结构，确定主组件
- 验证数据管理功能（数据导入/导出、数据浏览等）

---

### 任务 4：添加项目成员管理独立路由

**文件：** `client/router/index.js`

**操作：**

1. 在 Project 子路由中添加 `/project/:id/members`
2. 组件：`Project/Setting/ProjectMember/ProjectMember.vue`
3. 名称：`ProjectMember`
4. 权限：公开（但需项目成员权限，组件内部应有权限控制）

**代码示例：**

```javascript
{
  path: 'members',
  name: 'ProjectMember',
  component: () => import('../containers/Project/Setting/ProjectMember/ProjectMember.vue')
}
```

**注意：**

- 旧版此页面独立于设置页面
- 新版中 ProjectMember 组件已在 Setting 页面作为 Tab 使用
- 添加独立路由后，用户可通过 `/project/:id/members` 直接访问

**验证要点：**

- 验证成员列表加载
- 验证添加/移除成员功能
- 验证权限控制（仅项目管理员可操作）

---

### 任务 5：添加用户个人中心路由

**文件：** `client/router/index.js`

**操作：**

1. 在 User 路由下添加子路由 `/user/profile` 或 `/user/settings`
2. 组件：`User/UserList/UserSettings.vue`
3. 名称：`UserSettings` 或 `UserProfile`
4. 权限：登录用户（无需管理员）

**代码示例：**

```javascript
{
  path: '/user/profile',
  name: 'UserProfile',
  component: () => import('../containers/User/UserList/UserSettings.vue')
}
```

**注意：**

- 旧版用户个人中心路径为 `/user/profile/:uid`
- 新版 UserSettings.vue 可能已适配当前用户，需检查是否支持查看他人资料
- 建议保留 `/user/:id` 作为管理员查看他人详情，`/user/profile` 作为个人中心

**验证要点：**

- 用户可查看和编辑自己的个人信息
- 可修改密码、头像等设置
- 权限控制：仅本人或管理员可访问

---

### 任务 6：验证注册页面功能

**文件：** `client/containers/Login/Reg.vue`

**操作：**

1. 手动访问 `/reg` 路由
2. 测试注册流程：
   - 填写用户名、邮箱、密码
   - 提交注册
   - 验证是否成功创建用户
   - 验证是否自动登录并跳转
3. 检查表单验证逻辑（必填项、邮箱格式、密码强度等）
4. 检查错误提示是否友好

**验证要点：**

- 注册 API 接口是否正常 (`/api/register` 或类似)
- 注册成功后是否自动登录
- 是否发送验证邮件（如有）
- 重复用户名/邮箱是否有提示

**如发现问题：**

- 修复表单验证规则
- 完善错误提示
- 确保与后端 API 兼容

---

### 任务 7：整体测试与验证

**测试场景：**

1. **路由访问测试**
   - 所有新增路由是否 404
   - 路由参数（如 `:id`）是否正确解析
   - 权限控制是否生效（管理员页面、登录保护）

2. **页面渲染测试**
   - 页面是否正常加载，无白屏
   - 数据是否成功获取和展示
   - 面包屑导航是否准确

3. **功能完整性测试**
   - Activity: 动态列表加载、分页、筛选
   - News: 新闻列表/时间线展示
   - ProjectData: 数据操作（导入/导出/浏览）
   - ProjectMember: 成员列表、添加/移除、角色变更
   - UserSettings: 个人信息编辑、密码修改

4. **响应式布局测试**
   - 在不同屏幕尺寸下是否正常显示
   - 移动端体验（如有响应式设计）

5. **兼容性测试**
   - 与旧版 YAPI 功能对比，确保无遗漏

---

### 任务 8：代码质量检查

**命令：**

```bash
# 运行 ESLint 检查
npm run lint
# 或
vp check

# 格式化代码
npm run fmt
# 或
vp fmt
```

**检查项：**

- 无 ESLint 错误或警告
- 代码格式符合项目规范（Prettier）
- 导入语句正确，无未使用变量
- Vue 组件符合 Composition API 规范

---

## 📊 预期交付

### 功能恢复清单

| 功能模块     | 旧版路由                | 新版路由（目标） | 状态      |
| ------------ | ----------------------- | ---------------- | --------- |
| 项目动态     | `/project/:id/activity` | ✅ 待添加        | ❌ 缺失   |
| 新闻公告     | `/news`                 | ✅ 待添加        | ❌ 缺失   |
| 数据管理     | `/project/:id/data`     | ✅ 待添加        | ❌ 缺失   |
| 项目成员     | `/project/:id/members`  | ✅ 待添加        | ❌ 缺失   |
| 用户个人中心 | `/user/profile`         | ✅ 待添加        | ❌ 缺失   |
| 注册         | `/reg`                  | ✅ 已存在        | ⚠️ 需验证 |

### 路由配置完成度

- **当前路由数：** 25 条
- **新增路由数：** 5 条
- **目标路由数：** 30 条
- **功能覆盖率：** 从 ~85% 提升至 ≥95%

---

## 🔧 执行顺序建议

1. **第一阶段（核心功能）**
   - 任务 1：Activity（项目动态）
   - 任务 3：ProjectData（数据管理）
   - 任务 4：ProjectMember（项目成员）

2. **第二阶段（用户体验）**
   - 任务 2：News（新闻公告）
   - 任务 5：UserSettings（个人中心）

3. **第三阶段（验证与优化）**
   - 任务 6：验证注册功能
   - 任务 7：整体测试
   - 任务 8：代码质量检查

---

## 📝 注意事项

1. **路由顺序**：新增路由应插入到 `client/router/index.js` 的 `routes` 数组适当位置，建议按功能分组排列
2. **权限控制**：如需管理员权限，添加 `meta: { requiresAdmin: true }`
3. **组件导入**：使用动态导入 `() => import('../path/to/Component.vue')` 以支持懒加载
4. **命名规范**：路由 `name` 字段使用 PascalCase，与组件名一致
5. **路径参数**：使用 `:id`、`:projectId` 等占位符，与后端 API 保持一致
6. **向后兼容**：确保新增路由不会影响现有功能，避免破坏性更改

---

## ✅ 验收标准

- [ ] 所有 5 个缺失页面可通过指定路由正常访问
- [ ] 页面数据加载正常，无 404 或 500 错误
- [ ] 注册页面功能完整，可正常注册新用户
- [ ] 权限控制正确（管理员页面、登录保护）
- [ ] 无 ESLint 错误，代码格式规范
- [ ] 功能覆盖率 ≥ 95%（对比旧版 YAPI）

---

## 📚 参考资料

- **旧版 YAPI 路由逻辑：** `client/Application.js`、`client/containers/Project/Project.js`
- **新版 YAPI Plus 路由配置：** `client/router/index.js`
- **组件文件位置：** `client/containers/`
- **插件钩子系统：** `client/plugin.js`（旧版用于扩展路由和导航）

---

## 🚀 快速开始

执行顺序：

```bash
# 1. 编辑路由文件
vim client/router/index.js

# 2. 添加 5 个缺失路由（参考上方代码示例）

# 3. 启动开发服务器测试
npm run dev

# 4. 访问测试
# - http://localhost:4000/project/1/activity
# - http://localhost:4000/news
# - http://localhost:4000/project/1/data
# - http://localhost:4000/project/1/members
# - http://localhost:4000/user/profile
```

---

**文档版本：** v1.0  
**创建日期：** 2026-05-01  
**最后更新：** 2026-05-01  
**负责Agent：** opencode
