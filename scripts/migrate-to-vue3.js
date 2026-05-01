#!/usr/bin/env node

/**
 * Vue 3 迁移辅助脚本
 * 帮助批量迁移 React 组件到 Vue 3
 *
 * 使用方法：
 * node scripts/migrate-to-vue3.js <文件路径>
 */

const fs = require("fs");
const path = require("path");

// 获取要迁移的文件路径
const filePath = process.argv[2];

if (!filePath) {
  console.log("使用方法: node migrate-to-vue3.js <文件路径>");
  console.log(
    "示例: node migrate-to-vue3.js client/containers/Project/Interface/InterfaceEditForm.js",
  );
  process.exit(1);
}

// 读取源文件
const sourceCode = fs.readFileSync(filePath, "utf-8");

// 生成目标文件路径
const targetPath = filePath.replace(/\.jsx?$/, ".vue");

// 基础模板
const template = `<template>
  <div class="${path.basename(filePath, path.extname(filePath)).toLowerCase()}">
    <!-- TODO: 添加模板内容 -->
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useMessage } from 'naive-ui'

// Props
const props = defineProps({
  // TODO: 添加 props
})

// Emits
const emit = defineEmits(['update', 'delete'])

// Router
const router = useRouter()
const route = useRoute()
const message = useMessage()

// State
const loading = ref(false)
const data = ref(null)

// Methods
const fetchData = async () => {
  loading.value = true
  try {
    // TODO: 实现数据获取逻辑
    console.log('Fetching data...')
  } catch (error) {
    message.error('获取数据失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

const handleSubmit = async (formData) => {
  // TODO: 实现表单提交逻辑
  message.success('保存成功')
  router.back()
}

const handleDelete = async (id) => {
  // TODO: 实现删除逻辑
  message.success('删除成功')
}

// Lifecycle
onMounted(() => {
  fetchData()
})
</script>

<style scoped lang="scss">
.${path.basename(filePath, path.extname(filePath)).toLowerCase()} {
  // TODO: 添加样式
}
</style>
`;

// 生成迁移提示
const migrationTips = `
========================================
  Vue 3 迁移辅助工具
========================================

源文件: ${filePath}
目标文件: ${targetPath}

📋 迁移步骤：

1. ✅ 已创建基础 .vue 文件模板
2. ⏳ 请将以下代码从 React 转换为 Vue 3：

   - [ ] 转换 Props (this.props → defineProps)
   - [ ] 转换 State (this.state → ref/reactive)
   - [ ] 转换 Methods (class methods → const functions)
   - [ ] 转换生命周期 (componentDidMount → onMounted)
   - [ ] 转换 Redux (connect → useStore)
   - [ ] 转换 UI 组件 (Ant Design → Naive UI)
   - [ ] 转换路由 (this.props.history → router)

3. ⏳ 参考以下对照表：

   React                  →  Vue 3
   ─────────────────────────────────────
   this.state             →  ref()
   this.props             →  defineProps()
   this.setState()        →  .value = 
   componentDidMount    →  onMounted()
   componentWillUnmount →  onUnmounted()
   connect()            →  useStore()
   this.props.history   →  useRouter()
   this.props.match     →  useRoute()

4. ⏳ 更新路由配置：
   - 编辑 client/router/index.js
   - 将导入从 .js 改为 .vue

5. ⏳ 测试功能：
   - 启动开发服务器: npm run dev
   - 访问页面测试功能

6. ⏳ 删除旧的 .js 文件

========================================
`;

// 写入文件
fs.writeFileSync(targetPath, template, "utf-8");

console.log(migrationTips);
console.log(`✅ 已创建: ${targetPath}`);
console.log(`📝 请按照上述步骤完成迁移`);
console.log(``);
