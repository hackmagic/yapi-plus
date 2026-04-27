<template>
  <div class="notify-wrapper">
    <n-badge :value="unreadCount" :max="99">
      <n-button text @click="showNotify">
        <template #icon>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
          </svg>
        </template>
      </n-button>
    </n-badge>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const unreadCount = ref(0)

const showNotify = () => {
  // TODO: 打开通知面板
}

const fetchUnreadCount = async () => {
  try {
    const res = await axios.get('/api/notice/unread_count')
    if (res.data.errcode === 0) {
      unreadCount.value = res.data.data.count
    }
  } catch (error) {
    console.error('获取未读通知数量失败', error)
  }
}

onMounted(() => {
  fetchUnreadCount()
})
</script>

<style scoped>
.notify-wrapper {
  display: inline-flex;
}
</style>
