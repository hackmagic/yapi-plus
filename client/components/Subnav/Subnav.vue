<template>
  <n-layout-sider bordered class="subnav">
    <n-menu
      v-model:value="activeKey"
      :options="menuOptions"
      @update:value="handleSelect"
    />
  </n-layout-sider>
</template>

<script setup>
import { ref, computed, h } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const props = defineProps({
  menus: {
    type: Array,
    default: () => []
  }
})

const router = useRouter()
const route = useRoute()
const activeKey = ref(route.path)

const menuOptions = computed(() => {
  return props.menus.map(menu => ({
    label: menu.name,
    key: menu.path,
    icon: menu.icon ? () => h('span', {}, menu.icon) : undefined
  }))
})

const handleSelect = (key) => {
  activeKey.value = key
  router.push(key)
}
</script>

<style scoped>
.subnav {
  height: calc(100vh - 60px);
  overflow: auto;
}
</style>
