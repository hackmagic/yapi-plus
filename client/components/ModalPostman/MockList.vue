<template>
  <n-list>
    <n-list-item v-for="item in mockList" :key="item._id">
      <n-space>
        <n-tag type="info">{{ item.name }}</n-tag>
        <span>{{ item.value }}</span>
      </n-space>
    </n-list-item>
  </n-list>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  mockList: { type: Array, default: () => [] }
})
</script>
