<template>
  <div class="timeline-wrapper">
    <n-timeline v-if="items.length > 0">
      <n-timeline-item
        v-for="(item, index) in items"
        :key="index"
        :type="item.type || 'default'"
        :title="item.title"
        :content="item.content"
        :time="item.time"
      />
    </n-timeline>
    <n-empty v-else description="暂无记录" />
  </div>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    default: () => []
  }
})
</script>

<style scoped>
.timeline-wrapper {
  padding: 16px 0;
}
</style>
