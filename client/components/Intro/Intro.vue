<template>
  <div class="intro-container">
    <n-card title="欢迎使用 YAPI Plus">
      <n-space vertical :size="24">
        <n-text style="font-size: 16px;">
          YAPI Plus 是一个强大的 API 管理平台，基于 Vue 3 + VitePlus + Naive UI 构建。
        </n-text>
        
        <n-divider />
        
        <n-space vertical>
          <n-text strong>主要功能：</n-text>
          <n-ul>
            <li>接口管理 - 创建、编辑、查看 API 接口文档</li>
            <li>Mock 服务 - 自动生成 Mock 数据</li>
            <li>测试用例 - 管理和执行接口测试</li>
            <li>团队协作 - 项目组管理和权限控制</li>
            <li>数据导入导出 - 支持多种格式</li>
          </n-ul>
        </n-space>
        
        <n-divider />
        
        <n-space justify="center">
          <n-button type="primary" @click="$router.push('/login')">
            开始使用
          </n-button>
          <n-button @click="$router.push('/reg')">
            注册账号
          </n-button>
        </n-space>
      </n-space>
    </n-card>
  </div>
</template>

<script setup>
// 引导介绍页面
</script>

<style scoped>
.intro-container {
  max-width: 800px;
  margin: 40px auto;
}
</style>
