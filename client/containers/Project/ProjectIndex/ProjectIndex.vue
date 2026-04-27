<template>
  <div class="project-detail">
    <n-tabs type="line">
      <n-tab-pane name="interface" tab="接口列表">
        <InterfaceList :project-id="projectId" />
      </n-tab-pane>
      <n-tab-pane name="setting" tab="项目设置">
        <ProjectSetting :project-id="projectId" />
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import InterfaceList from './InterfaceList.vue'
import ProjectSetting from './ProjectSetting.vue'

const route = useRoute()
const projectId = computed(() => route.params.id)
</script>

<style scoped>
.project-detail {
  padding: 24px;
}
</style>
