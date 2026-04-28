<template>
  <n-layout has-sider style="min-height: calc(100vh - 156px); margin-left: 24px; margin-top: 24px;">
    <n-layout-sider bordered :width="300" style="height: 100%;">
      <n-tabs
        :value="activeKey"
        type="line"
        @update:value="handleTabChange"
        style="height: 100%; display: flex; flex-direction: column;"
      >
        <n-tab-pane name="api" tab="接口" style="flex: 1; overflow: auto;">
          <InterfaceMenu
            :project-id="projectId"
            :selected-id="selectedId"
            @select="handleSelect"
          />
        </n-tab-pane>
        <n-tab-pane v-if="isShowCol" name="colOrCase" tab="集合/用例" style="flex: 1; overflow: auto;">
          <InterfaceColMenu
            :project-id="projectId"
            @select="handleColSelect"
          />
        </n-tab-pane>
      </n-tabs>
    </n-layout-sider>

    <n-layout-content style="padding: 0 24px;">
      <router-view />
    </n-layout-content>
  </n-layout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProjectStore } from '@/store/project'
import { useInterfaceColStore } from '@/store/interfaceCol'
import InterfaceMenu from './InterfaceList/InterfaceMenu.vue'
import InterfaceColMenu from './InterfaceCol/InterfaceColMenu.vue'

const route = useRoute()
const router = useRouter()
const projectStore = useProjectStore()
const interfaceColStore = useInterfaceColStore()

const projectId = computed(() => parseInt(route.params.id))
const activeKey = ref('api')
const selectedId = ref(route.params.actionId || null)
const isShowCol = computed(() => interfaceColStore.isShowCol)

// 监听路由变化
watch(() => route.params.action, (newAction) => {
  if (newAction === 'api') {
    activeKey.value = 'api'
  } else if (newAction === 'col' || newAction === 'case') {
    activeKey.value = 'colOrCase'
    interfaceColStore.setColData({ isShowCol: newAction === 'col' })
  }
}, { immediate: true })

// 初始化
onMounted(async () => {
  await interfaceColStore.setColData({ isShowCol: true })
})

// Tab 切换
const handleTabChange = (key) => {
  activeKey.value = key
  if (key === 'api') {
    router.push(`/project/${projectId.value}/interface/api`)
  } else {
    const action = isShowCol.value ? 'col' : 'case'
    router.push(`/project/${projectId.value}/interface/${action}`)
  }
}

// 选择接口
const handleSelect = (id) => {
  selectedId.value = id
  router.push(`/project/${projectId.value}/interface/api/${id}`)
}

// 选择集合
const handleColSelect = (data) => {
  router.push(data.path)
}
</script>

<style scoped lang="scss">
:deep(.n-tabs) {
  height: 100%;
  display: flex;
  flex-direction: column;
}

:deep(.n-tab-pane) {
  flex: 1;
  overflow: auto;
}
</style>
