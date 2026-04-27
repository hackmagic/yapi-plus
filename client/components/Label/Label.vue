<template>
  <div class="label-wrapper">
    <n-tag
      v-for="(tag, index) in tags"
      :key="index"
      :type="tag.type || 'default'"
      :bordered="false"
      size="small"
    >
      {{ tag.label }}
    </n-tag>
  </div>
</template>

<script setup>
defineProps({
  tags: {
    type: Array,
    default: () => []
  }
})
</script>

<style scoped>
.label-wrapper {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 4px;
}
</style>
