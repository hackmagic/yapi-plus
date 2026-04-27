<template>
  <div class="project-setting-page">
    <n-card title="项目设置">
      <n-tabs type="line">
        <n-tab-pane name="base" tab="基本设置">
          <BaseSetting :project-id="projectId" />
        </n-tab-pane>
        <n-tab-pane name="member" tab="成员管理">
          <MemberSetting :project-id="projectId" />
        </n-tab-pane>
        <n-tab-pane name="token" tab="Token管理">
          <TokenSetting :project-id="projectId" />
        </n-tab-pane>
        <n-tab-pane name="data" tab="数据管理">
          <DataSetting :project-id="projectId" />
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import BaseSetting from './BaseSetting.vue'
import MemberSetting from './MemberSetting.vue'
import TokenSetting from './TokenSetting.vue'
import DataSetting from './DataSetting.vue'

const route = useRoute()
const projectId = computed(() => route.params.id)
</script>

<style scoped>
.project-setting-page {
  padding: 24px;
}
</style>
