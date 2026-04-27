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
import { computed } from 'vue'
import { useUserStore } from '../../store/user'

const userStore = useUserStore()

const breadcrumbList = computed(() => {
  return userStore.breadcrumb
})
</script>

<style scoped>
.breadcrumb {
  margin-bottom: 16px;
}
</style>
