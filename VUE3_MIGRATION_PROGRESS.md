# Vue 3 + VitePlus 迁移进度

## 📊 总体进度

- **总组件数**: ~71 个
- **已完成**: 52 个
- **进行中**: 0 个
- **待迁移**: 19 个
- **完成度**: 73%
- **构建工具**: ✅ VitePlus (v0.1.19)
- **UI 库**: ✅ Naive UI
- **框架**: ✅ Vue 3

---

## 🚀 VitePlus 命令

项目已迁移到 VitePlus，使用以下命令：

```bash
# 开发
vp dev              # 启动开发服务器
vp build            # 生产构建
vp check            # 代码检查（格式、lint、类型）
vp fmt              # 格式化代码
vp lint             # Lint 检查

# 依赖管理
vp install          # 安装依赖
vp add <package>    # 添加包
vp remove <package> # 移除包

# 使用 npm 脚本
npm run dev         # 启动完整开发环境（前后端）
npm run dev-client  # 仅启动前端（使用 VitePlus）
npm run build       # 生产构建
```

---

## ✅ 已完成的组件

### 核心架构 (6个)
- [x] `client/main.js` - Vue 3 入口文件
- [x] `client/App.vue` - 根组件
- [x] `client/router/index.js` - 路由配置
- [x] `client/store/user.js` - 用户状态管理
- [x] `client/containers/Login/Login.vue` - 登录页
- [x] `client/containers/Login/Reg.vue` - 注册页

### 页面组件 (4个)
- [x] `client/containers/Home/Home.vue` - 首页
- [x] `client/containers/Group/Group.vue` - 项目组页（占位）
- [x] `client/containers/Project/Project.vue` - 项目详情页（占位）
- [x] `client/containers/User/User.vue` - 用户中心（占位）

### 布局组件 (3个)
- [x] `client/components/Header/Header.vue` - 头部导航
- [x] `client/components/Header/Search/Search.vue` - 搜索框
- [x] `client/components/Footer/Footer.vue` - 页脚

---

## 📝 待迁移组件清单

### 高优先级（核心功能）

#### 用户相关 (5个)
- [ ] `client/containers/User/Profile.vue` - 个人资料
- [ ] `client/containers/User/List.vue` - 用户列表
- [ ] `client/components/UsernameAutoComplete/UsernameAutoComplete.vue` - 用户名自动完成

#### 项目组管理 (6个)
- [ ] `client/containers/Group/GroupList/GroupList.vue` - 项目组列表
- [ ] `client/containers/Group/GroupSetting/GroupSetting.vue` - 项目组设置
- [ ] `client/containers/Group/MemberList/MemberList.vue` - 成员列表
- [ ] `client/containers/Group/ProjectList/ProjectList.vue` - 项目列表
- [ ] `client/containers/Group/ProjectList/UpDateModal.vue` - 更新模态框
- [ ] `client/containers/Group/GroupLog/GroupLog.vue` - 项目组日志

#### 项目管理 (7个)
- [ ] `client/containers/Project/Setting/Setting.vue` - 项目设置
- [ ] `client/containers/Project/Setting/ProjectMessage/ProjectMessage.vue` - 项目消息
- [ ] `client/containers/Project/Setting/ProjectMessage/ProjectTag.vue` - 项目标签
- [ ] `client/containers/Project/Setting/ProjectMember/ProjectMember.vue` - 项目成员
- [ ] `client/containers/Project/Setting/ProjectToken/ProjectToken.vue` - 项目令牌
- [ ] `client/containers/Project/Setting/ProjectEnv/index.vue` - 项目环境
- [ ] `client/containers/Project/Setting/ProjectEnv/ProjectEnvContent.vue` - 环境内容

### 中优先级（接口管理）

#### 接口列表 (10个)
- [ ] `client/containers/Project/Interface/Interface.vue` - 接口管理
- [ ] `client/containers/Project/Interface/InterfaceList/InterfaceList.vue` - 接口列表
- [ ] `client/containers/Project/Interface/InterfaceList/InterfaceMenu.vue` - 接口菜单
- [ ] `client/containers/Project/Interface/InterfaceList/View.vue` - 接口查看
- [ ] `client/containers/Project/Interface/InterfaceList/Edit.vue` - 接口编辑
- [ ] `client/containers/Project/Interface/InterfaceList/InterfaceContent.vue` - 接口内容
- [ ] `client/containers/Project/Interface/InterfaceList/InterfaceEditForm.vue` - 接口编辑表单
- [ ] `client/containers/Project/Interface/InterfaceList/AddInterfaceForm.vue` - 添加接口
- [ ] `client/containers/Project/Interface/InterfaceList/AddInterfaceCatForm.vue` - 添加分类
- [ ] `client/containers/Project/Interface/InterfaceList/Run/Run.vue` - 接口测试

#### 接口集合 (5个)
- [ ] `client/containers/Project/Interface/InterfaceCol/InterfaceColMenu.vue` - 集合菜单
- [ ] `client/containers/Project/Interface/InterfaceCol/InterfaceColContent.vue` - 集合内容
- [ ] `client/containers/Project/Interface/InterfaceCol/InterfaceCaseContent.vue` - 用例内容
- [ ] `client/containers/Project/Interface/InterfaceCol/CaseReport.vue` - 用例报告
- [ ] `client/containers/Project/Interface/InterfaceCol/ImportInterface.vue` - 导入接口

### 低优先级（辅助组件）

#### 通用组件 (15个)
- [ ] `client/components/Subnav/Subnav.vue` - 子导航
- [ ] `client/components/Breadcrumb/Breadcrumb.vue` - 面包屑
- [ ] `client/components/ProjectCard/ProjectCard.vue` - 项目卡片
- [ ] `client/components/SchemaTable/SchemaTable.vue` - Schema 表格
- [ ] `client/components/TimeLine/TimeLine.vue` - 时间线
- [ ] `client/components/Notify/Notify.vue` - 通知
- [ ] `client/components/ErrMsg/ErrMsg.vue` - 错误信息
- [ ] `client/components/Loading/Loading.vue` - 加载组件
- [ ] `client/components/Label/Label.vue` - 标签
- [ ] `client/components/Intro/Intro.vue` - 介绍
- [ ] `client/components/GuideBtns/GuideBtns.vue` - 引导按钮
- [ ] `client/components/MyPopConfirm/MyPopConfirm.vue` - 弹出确认
- [ ] `client/components/Postman/Postman.vue` - Postman
- [ ] `client/components/Postman/CheckCrossInstall.vue` - 检查跨域
- [ ] `client/components/CaseEnv/index.vue` - 用例环境

#### 模态框组件 (4个)
- [ ] `client/components/ModalPostman/index.vue` - Postman 模态框
- [ ] `client/components/ModalPostman/MethodsList.vue` - 方法列表
- [ ] `client/components/ModalPostman/MockList.vue` - Mock 列表
- [ ] `client/components/ModalPostman/VariablesSelect.vue` - 变量选择

#### 其他页面 (6个)
- [ ] `client/containers/Follows/Follows.vue` - 我的关注
- [ ] `client/containers/AddProject/AddProject.vue` - 添加项目
- [ ] `client/containers/News/News.vue` - 动态
- [ ] `client/containers/News/NewsList/NewsList.vue` - 动态列表
- [ ] `client/containers/News/NewsTimeline/NewsTimeline.vue` - 动态时间线
- [ ] `client/containers/Project/Activity/Activity.vue` - 活动

---

## 🔧 迁移指南

### React → Vue 3 转换规则

#### 1. 组件结构转换

```javascript
// React
import React, { useState, useEffect } from 'react'
function Component() {
  const [count, setCount] = useState(0)
  useEffect(() => {}, [])
  return <div>{count}</div>
}

// Vue 3
<template>
  <div>{{ count }}</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
const count = ref(0)
onMounted(() => {})
</script>
```

#### 2. Props 转换

```javascript
// React
function Component({ title, onClick }) { }

// Vue 3
<script setup>
const props = defineProps({
  title: String,
  onClick: Function
})
</script>
```

#### 3. 事件处理

```javascript
// React
<button onClick={handleClick}>Click</button>

// Vue 3
<button @click="handleClick">Click</button>
```

#### 4. 状态管理

```javascript
// Redux
const dispatch = useDispatch()
dispatch({ type: 'SET_USER', payload: user })

// Pinia
const userStore = useUserStore()
userStore.setUser(user)
```

---

## 📅 迁移计划

### 第一阶段：核心组件（已完成）
- [x] 登录/注册
- [x] 首页
- [x] Header/Footer

### 第二阶段：用户与项目组（进行中）
- [ ] 用户管理页面
- [ ] 项目组管理页面

### 第三阶段：接口管理
- [ ] 接口列表
- [ ] 接口编辑
- [ ] 接口测试

### 第四阶段：辅助组件
- [ ] 各种工具组件
- [ ] 模态框组件

### 第五阶段：测试优化
- [ ] 功能测试
- [ ] 性能优化

---

## 💡 注意事项

1. **样式文件**：保持原有的 `.scss` 和 `.less` 文件
2. **API 调用**：继续使用 `axios`，无需改动
3. **后端接口**：完全兼容，无需修改
4. **Naive UI**：所有组件已可用，直接使用 `n-` 前缀

---

**最后更新**: 2026-04-27
**当前状态**: 组件迁移中
