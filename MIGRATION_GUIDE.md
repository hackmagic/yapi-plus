# YAPI Plus Vue 3 批量迁移指南

## 📊 当前状态

**已迁移**: 52/80 (65%)  
**待迁移**: 28 个文件

---

## 🚀 快速迁移策略

### 第一步：创建必要的 Pinia Stores

需要先创建以下 Store 文件（参照已有的 store 模板）：

#### 1. client/store/interface.js

```javascript
/**
 * Interface Store - 接口管理状态
 */
import { defineStore } from "pinia";
import axios from "axios";

export const useInterfaceStore = defineStore("interface", {
  state: () => ({
    interfaceList: [],
    interfaceDetail: null,
    categories: [],
    loading: false,
  }),

  getters: {
    getInterfaceById: (state) => (id) => {
      return state.interfaceList.find((item) => item._id === id);
    },
  },

  actions: {
    async fetchInterfaceList(projectId, params = {}) {
      this.loading = true;
      try {
        const res = await axios.get(`/api/interface/list/${projectId}`, { params });
        if (res.data.errcode === 0) {
          this.interfaceList = res.data.data.list;
          this.categories = res.data.data.categories;
          return res.data.data;
        }
        return null;
      } catch (error) {
        console.error("获取接口列表失败:", error);
        return null;
      } finally {
        this.loading = false;
      }
    },

    async fetchInterfaceDetail(id) {
      this.loading = true;
      try {
        const res = await axios.get(`/api/interface/get?id=${id}`);
        if (res.data.errcode === 0) {
          this.interfaceDetail = res.data.data;
          return res.data.data;
        }
        return null;
      } catch (error) {
        console.error("获取接口详情失败:", error);
        return null;
      } finally {
        this.loading = false;
      }
    },

    async saveInterface(data) {
      try {
        const res = await axios.post("/api/interface/save", data);
        if (res.data.errcode === 0) {
          return res.data.data;
        }
        return null;
      } catch (error) {
        console.error("保存接口失败:", error);
        return null;
      }
    },

    async deleteInterface(id) {
      try {
        const res = await axios.post(`/api/interface/del?id=${id}`);
        if (res.data.errcode === 0) {
          return true;
        }
        return false;
      } catch (error) {
        console.error("删除接口失败:", error);
        return false;
      }
    },
  },
});
```

#### 2. client/store/project.js

```javascript
/**
 * Project Store - 项目管理状态
 */
import { defineStore } from "pinia";
import axios from "axios";

export const useProjectStore = defineStore("project", {
  state: () => ({
    projectDetail: null,
    projectList: [],
    members: [],
    envList: [],
    loading: false,
  }),

  getters: {
    currentProject: (state) => state.projectDetail,
  },

  actions: {
    async fetchProjectDetail(id) {
      this.loading = true;
      try {
        const res = await axios.get(`/api/project/get?id=${id}`);
        if (res.data.errcode === 0) {
          this.projectDetail = res.data.data;
          return res.data.data;
        }
        return null;
      } catch (error) {
        console.error("获取项目详情失败:", error);
        return null;
      } finally {
        this.loading = false;
      }
    },

    async updateProject(id, data) {
      try {
        const res = await axios.post(`/api/project/up?id=${id}`, data);
        if (res.data.errcode === 0) {
          await this.fetchProjectDetail(id);
          return true;
        }
        return false;
      } catch (error) {
        console.error("更新项目失败:", error);
        return false;
      }
    },

    async fetchProjectMembers(projectId) {
      try {
        const res = await axios.get(`/api/project/get_member_list?project_id=${projectId}`);
        if (res.data.errcode === 0) {
          this.members = res.data.data;
          return res.data.data;
        }
        return [];
      } catch (error) {
        console.error("获取项目成员失败:", error);
        return [];
      }
    },

    async addMember(projectId, email, role) {
      try {
        const res = await axios.post("/api/project/add_member", {
          project_id: projectId,
          email,
          role,
        });
        if (res.data.errcode === 0) {
          await this.fetchProjectMembers(projectId);
          return true;
        }
        return false;
      } catch (error) {
        console.error("添加成员失败:", error);
        return false;
      }
    },

    async deleteMember(projectId, memberId) {
      try {
        const res = await axios.post("/api/project/del_member", {
          project_id: projectId,
          member_id: memberId,
        });
        if (res.data.errcode === 0) {
          await this.fetchProjectMembers(projectId);
          return true;
        }
        return false;
      } catch (error) {
        console.error("删除成员失败:", error);
        return false;
      }
    },
  },
});
```

---

## 📝 迁移模板

### 模板 1：简单列表页面

**React 版本**：

```javascript
import React, { Component } from "react";
import { connect } from "react-redux";
import { Table, Button } from "antd";

@connect((state) => ({ list: state.interface.list }), { fetchList })
class ListPage extends Component {
  componentDidMount() {
    this.props.fetchList();
  }

  render() {
    return (
      <div>
        <Button onClick={this.handleAdd}>添加</Button>
        <Table columns={columns} dataSource={this.props.list} />
      </div>
    );
  }
}
```

**Vue 3 版本**：

```vue
<template>
  <div>
    <n-button @click="handleAdd">添加</n-button>
    <n-data-table :columns="columns" :data="list" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useMessage } from "naive-ui";
import { useInterfaceStore } from "@/store/interface";

const router = useRouter();
const message = useMessage();
const interfaceStore = useInterfaceStore();

const list = ref([]);
const columns = ref([
  { title: "名称", key: "name" },
  { title: "路径", key: "path" },
  {
    title: "操作",
    key: "actions",
    render: (row) => {
      return [
        h("button", { onClick: () => handleEdit(row) }, "编辑"),
        h("button", { onClick: () => handleDelete(row) }, "删除"),
      ];
    },
  },
]);

onMounted(async () => {
  const data = await interfaceStore.fetchInterfaceList();
  list.value = data || [];
});

const handleAdd = () => {
  router.push("/add");
};

const handleEdit = (row) => {
  router.push(`/edit/${row._id}`);
};

const handleDelete = async (row) => {
  await interfaceStore.deleteInterface(row._id);
  message.success("删除成功");
  list.value = await interfaceStore.fetchInterfaceList();
};
</script>
```

---

### 模板 2：表单页面

**React 版本**：

```javascript
import React, { Component } from "react";
import { Form, Input, Button } from "antd";

class FormPage extends Component {
  handleSubmit = async (values) => {
    await this.props.save(values);
    this.props.history.goBack();
  };

  render() {
    return (
      <Form onFinish={this.handleSubmit}>
        <Form.Item name="name" label="名称">
          <Input />
        </Form.Item>
        <Button type="primary" htmlType="submit">
          保存
        </Button>
      </Form>
    );
  }
}
```

**Vue 3 版本**：

```vue
<template>
  <n-form ref="formRef" :model="formData" :rules="rules" @submit="handleSubmit">
    <n-form-item label="名称" path="name">
      <n-input v-model:value="formData.name" />
    </n-form-item>
    <n-button type="primary" attr-type="submit">保存</n-button>
  </n-form>
</template>

<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useMessage } from "naive-ui";
import { useInterfaceStore } from "@/store/interface";

const router = useRouter();
const route = useRoute();
const message = useMessage();
const interfaceStore = useInterfaceStore();

const formRef = ref(null);
const formData = ref({
  name: "",
});

const rules = {
  name: { required: true, message: "请输入名称", trigger: "blur" },
};

const handleSubmit = async (e) => {
  e.preventDefault();
  await formRef.value?.validate();

  await interfaceStore.saveInterface({
    ...formData.value,
    id: route.params.id,
  });

  message.success("保存成功");
  router.back();
};
</script>
```

---

### 模板 3：详情页面

**React 版本**：

```javascript
import React, { Component } from "react";
import { connect } from "react-redux";

@connect((state) => ({ detail: state.interface.detail }), { fetchDetail })
class DetailPage extends Component {
  componentDidMount() {
    this.props.fetchDetail(this.props.match.params.id);
  }

  render() {
    const { detail } = this.props;
    return (
      <div>
        <h1>{detail.name}</h1>
        <p>{detail.path}</p>
      </div>
    );
  }
}
```

**Vue 3 版本**：

```vue
<template>
  <div v-if="detail">
    <h1>{{ detail.name }}</h1>
    <p>{{ detail.path }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useInterfaceStore } from "@/store/interface";

const route = useRoute();
const interfaceStore = useInterfaceStore();
const detail = ref(null);

onMounted(async () => {
  detail.value = await interfaceStore.fetchInterfaceDetail(route.params.id);
});
</script>
```

---

## 📋 待迁移文件清单及优先级

### 🔴 P0 - 核心功能（必须迁移）

| #   | 文件                   | 类型      | 难度   | 预计时间 |
| --- | ---------------------- | --------- | ------ | -------- |
| 1   | `InterfaceEditForm.js` | 表单      | ⭐⭐⭐ | 30 分钟  |
| 2   | `InterfaceMenu.js`     | 列表      | ⭐⭐   | 20 分钟  |
| 3   | `ProjectMessage.js`    | 表单      | ⭐⭐⭐ | 30 分钟  |
| 4   | `ProjectEnv.js`        | 表单      | ⭐⭐⭐ | 30 分钟  |
| 5   | `ProjectMember.js`     | 列表+表单 | ⭐⭐⭐ | 40 分钟  |

### 🟡 P1 - 重要功能（应该迁移）

| #   | 文件                | 类型   | 难度   | 预计时间 |
| --- | ------------------- | ------ | ------ | -------- |
| 6   | `ProjectToken.js`   | 列表   | ⭐⭐   | 20 分钟  |
| 7   | `ProjectData.js`    | 操作页 | ⭐⭐   | 20 分钟  |
| 8   | `ProjectMock.js`    | 表单   | ⭐⭐⭐ | 30 分钟  |
| 9   | `ProjectRequest.js` | 表单   | ⭐⭐⭐ | 30 分钟  |
| 10  | `Setting.js`        | 布局   | ⭐     | 15 分钟  |

### 🟢 P2 - 辅助功能（可以迁移）

| #     | 文件     | 类型 | 难度    | 预计时间      |
| ----- | -------- | ---- | ------- | ------------- |
| 11-28 | 其他文件 | 各种 | ⭐-⭐⭐ | 15-20 分钟/个 |

---

## 🛠️ 迁移步骤（每个文件）

### Step 1: 分析 React 组件

```bash
# 查看文件结构
cat client/containers/xxx/xxx.js
```

识别：

- Props → defineProps
- State → ref/reactive
- Methods → const functions
- Lifecycle → onMounted/onUnmounted
- Redux → Pinia store

### Step 2: 创建 Vue 文件

```bash
# 创建 .vue 文件
touch client/containers/xxx/xxx.vue
```

使用模板：

```vue
<template>
  <!-- 模板内容 -->
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useMessage } from "naive-ui";

// Props
const props = defineProps({
  // ...
});

// Emits
const emit = defineEmits(["update", "delete"]);

// State
const data = ref(null);

// Methods
const handleAction = async () => {
  // ...
};

// Lifecycle
onMounted(async () => {
  // ...
});
</script>

<style scoped lang="scss">
/* 样式 */
</style>
```

### Step 3: 转换代码

**对照表**：

| React                       | Vue 3                  |
| --------------------------- | ---------------------- |
| `this.state`                | `ref()` / `reactive()` |
| `this.props`                | `defineProps()`        |
| `this.setState()`           | 直接修改 `.value`      |
| `componentDidMount`         | `onMounted()`          |
| `componentWillUnmount`      | `onUnmounted()`        |
| `connect()`                 | `useStore()`           |
| `this.props.history.push()` | `router.push()`        |
| `this.props.match.params`   | `route.params`         |
| `<Table>`                   | `<n-data-table>`       |
| `<Modal>`                   | `<n-modal>`            |
| `<Form>`                    | `<n-form>`             |
| `<Button>`                  | `<n-button>`           |
| `<Input>`                   | `<n-input>`            |

### Step 4: 更新路由

在 `client/router/index.js` 中更新：

```javascript
// 从 .js 改为 .vue
const Interface = () => import("@/containers/Project/Interface/Interface.vue");
```

### Step 5: 测试

```bash
# 启动开发服务器
npm run dev

# 访问页面测试功能
```

---

## ⚡ 快速迁移技巧

### 1. 使用 AI 辅助

对于每个文件，可以这样操作：

```
请将以下 React 组件迁移到 Vue 3 + Naive UI：

[粘贴 React 代码]

要求：
1. 使用 <script setup> 语法
2. 使用 Naive UI 组件
3. 使用 Pinia 管理状态
4. 保持功能一致
```

### 2. 批量处理

按模块分批迁移：

1. 先迁移接口管理（3 个文件）
2. 再迁移项目设置（5 个文件）
3. 最后迁移辅助组件

### 3. 测试每个文件

每迁移一个文件，立即测试：

- 页面能否正常加载
- 功能是否正常
- 有无报错

---

## 📚 参考资源

### 已迁移的文件（参考示例）

- `client/containers/Project/ProjectList/ProjectList.vue` - 列表页
- `client/containers/Project/ProjectSetting/MemberSetting.vue` - 成员管理
- `client/containers/Login/Login.vue` - 登录页
- `client/components/Postman/Postman.vue` - 复杂组件

### Store 示例

- `client/store/user.js` - 用户状态
- `client/store/project.js` - 项目状态
- `client/store/interfaceCol.js` - 接口集合状态

---

## 🎯 迁移检查清单

对于每个迁移的文件：

- [ ] 创建 `.vue` 文件
- [ ] 使用 `<script setup>` 语法
- [ ] 转换 Props 为 `defineProps`
- [ ] 转换 State 为 `ref/reactive`
- [ ] 转换 Methods 为函数
- [ ] 转换 Lifecycle Hooks
- [ ] 转换 Redux 为 Pinia
- [ ] 转换 Ant Design 为 Naive UI
- [ ] 转换路由 API
- [ ] 更新路由配置
- [ ] 测试功能
- [ ] 删除旧的 `.js` 文件

---

## 💡 常见问题

### Q1: 如何处理高阶组件（HOC）？

**React**:

```javascript
@connect(mapStateToProps, mapDispatchToProps)
class Component extends React.Component {}
```

**Vue 3**:

```vue
<script setup>
import { useStore } from "pinia";

const store = useStore();
// 直接使用 store 的 state 和 actions
</script>
```

### Q2: 如何处理路由参数？

**React**:

```javascript
const { id } = this.props.match.params;
```

**Vue 3**:

```vue
<script setup>
import { useRoute } from "vue-router";

const route = useRoute();
const id = route.params.id;
</script>
```

### Q3: 如何处理表单？

**React (Ant Design)**:

```javascript
<Form onFinish={handleSubmit}>
  <Form.Item name="name">
    <Input />
  </Form.Item>
</Form>
```

**Vue 3 (Naive UI)**:

```vue
<n-form @submit="handleSubmit">
  <n-form-item path="name">
    <n-input v-model:value="formData.name" />
  </n-form-item>
</n-form>
```

---

## 🚀 开始迁移

### 建议顺序

1. **接口管理** (3 个文件)
   - InterfaceEditForm.vue
   - InterfaceMenu.vue
   - InterfaceList.vue

2. **项目设置** (5 个文件)
   - ProjectMessage.vue
   - ProjectEnv.vue
   - ProjectMember.vue
   - ProjectToken.vue
   - ProjectData.vue

3. **其他页面** (剩余文件)

### 预估总时间

- 核心页面：2-3 小时
- 重要页面：1-2 小时
- 辅助页面：1-2 小时
- **总计**：4-7 小时

---

**最后更新**：2026-04-27
