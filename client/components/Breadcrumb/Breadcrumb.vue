<template>
  <n-breadcrumb>
    <n-breadcrumb-item
      v-for="(item, index) in breadcrumbList"
      :key="index"
    >
      <router-link v-if="item.path" :to="item.path">
        {{ item.name }}
      </router-link>
      <span v-else>{{ item.name }}</span>
    </n-breadcrumb-item>
  </n-breadcrumb>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const breadcrumbList = ref([
  { name: '首页', path: '/' }
])
</script>

<style scoped>
.breadcrumb {
  margin-bottom: 16px;
}
</style>
