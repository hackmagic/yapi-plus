<template>
  <n-alert :type="installed ? 'success' : 'warning'">
    {{ installed ? 'Cross 已安装' : '请先安装 Cross 浏览器扩展' }}
  </n-alert>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const installed = ref(false)

const checkCross = async () => {
  // 检查 Cross 扩展是否安装
  installed.value = false
}

onMounted(() => checkCross())
</script>
