<template>
  <div class="loading-wrapper">
    <n-spin :show="true" size="large">
      <template #description>
        <slot>加载中...</slot>
      </template>
    </n-spin>
  </div>
</template>

<script setup>
defineProps({
  size: {
    type: String,
    default: 'medium'
  }
})
</script>

<style scoped>
.loading-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  width: 100%;
}
</style>
