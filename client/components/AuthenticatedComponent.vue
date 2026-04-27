<template>
  <div class="auth-wrapper">
    <slot v-if="isLoggedIn" />
    <n-result
      v-else
      status="403"
      title="需要登录"
      description="请先登录后再访问"
    >
      <template #footer>
        <n-button type="primary" @click="$router.push('/login')">
          去登录
        </n-button>
      </template>
    </n-result>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useUserStore } from '../store/user'

const userStore = useUserStore()

const isLoggedIn = computed(() => {
  return userStore.loginState === 1
})
</script>
