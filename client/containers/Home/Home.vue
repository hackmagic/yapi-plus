<template>
  <div class="home-container">
    <n-layout>
      <n-layout-header bordered>
        <n-page-header>
          <template #title>
            YAPI Plus
          </template>
          <template #extra>
            <n-space>
              <n-button v-if="!userStore.loginState" @click="$router.push('/login')">
                登录
              </n-button>
              <n-button v-if="userStore.loginState" @click="handleLogout">
                退出
              </n-button>
            </n-space>
          </template>
        </n-page-header>
      </n-layout-header>
      
      <n-layout-content content-style="padding: 24px;">
        <n-space vertical :size="24">
          <n-card title="欢迎使用 YAPI Plus">
            <p>基于 Vue 3 + VitePlus + Naive UI 构建的现代化 API 管理平台</p>
          </n-card>
          
          <n-row :gutter="[16, 16]">
            <n-col :span="8">
              <n-card title="API 管理" hoverable>
                <p>完整的 API 接口管理，支持 RESTful API 设计</p>
              </n-card>
            </n-col>
            <n-col :span="8">
              <n-card title="Mock 服务" hoverable>
                <p>强大的 Mock 功能，支持自定义 Mock 规则</p>
              </n-card>
            </n-col>
            <n-col :span="8">
              <n-card title="AI 助手" hoverable>
                <p>AI 驱动的 API 文档生成和测试用例生成</p>
              </n-card>
            </n-col>
          </n-row>
        </n-space>
      </n-layout-content>
    </n-layout>
  </div>
</template>

<script setup>
import { useUserStore } from '../../store/user'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.home-container {
  min-height: 100vh;
}
</style>
