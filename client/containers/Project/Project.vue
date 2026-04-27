<template>
  <div class="project-page">
    <n-layout>
      <n-layout-header bordered class="header">
        <h2>项目详情 - {{ projectId }}</h2>
      </n-layout-header>
      <n-layout-content content-style="padding: 24px;">
        <n-card>
          <p>组件迁移中...</p>
          <p>Project 页面正在从 React 转换为 Vue 3</p>
        </n-card>
      </n-layout-content>
    </n-layout>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const projectId = computed(() => route.params.id)
// TODO: 从 React 组件迁移完整功能
</script>

<style scoped>
.project-page {
  min-height: 100vh;
}
.header {
  padding: 16px 24px;
}
</style>
