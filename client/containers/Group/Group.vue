<template>
  <div class="group-page">
    <n-layout>
      <n-layout-header bordered class="header">
        <h2>项目组管理</h2>
      </n-layout-header>
      <n-layout-content content-style="padding: 24px;">
        <n-tabs type="line" :value="activeTab" @update:value="handleTabChange">
          <n-tab-pane name="home" tab="首页" />
          <n-tab-pane name="project" tab="项目" />
          <n-tab-pane name="member" tab="成员" />
          <n-tab-pane name="setting" tab="设置" />
          <n-tab-pane name="log" tab="日志" />
        </n-tabs>

        <div class="tab-content">
          <router-view v-if="!showContent" />
          <div v-else class="content-home">
            <n-card :title="groupInfo?.group_name" :bordered="false">
              <n-space vertical>
                <n-descriptions :column="2">
                  <n-descriptions-item label="组名称">{{ groupInfo?.group_name }}</n-descriptions-item>
                  <n-descriptions-item label="组类型">{{ groupInfo?.type === 'public' ? '公开' : '私有' }}</n-descriptions-item>
                  <n-descriptions-item label="描述" :span="2">{{ groupInfo?.group_desc || '暂无描述' }}</n-descriptions-item>
                </n-descriptions>
              </n-space>
            </n-card>

            <n-card title="项目列表" :bordered="false" style="margin-top: 16px;">
              <project-list :group-id="groupId" />
            </n-card>
          </div>
        </div>
      </n-layout-content>
    </n-layout>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGroupStore } from '@/store/group'
import ProjectList from '../Project/ProjectList/ProjectList.vue'

const route = useRoute()
const router = useRouter()
const groupStore = useGroupStore()

const groupId = computed(() => route.params.id)
const groupInfo = ref(null)
const activeTab = ref('home')

const showContent = computed(() => activeTab.value === 'home')

const loadGroup = async () => {
  try {
    const data = await groupStore.fetchGroup(groupId.value)
    if (data) {
      groupInfo.value = data
    }
  } catch (error) {
    console.error('加载失败:', error)
  }
}

onMounted(() => {
  loadGroup()
})

watch(() => route.params.id, () => {
  loadGroup()
})

const handleTabChange = (tab) => {
  activeTab.value = tab
  router.push(`/group/${groupId.value}/${tab}`)
}
</script>

<style scoped lang="scss">
.group-page {
  min-height: 100vh;
}

.header {
  padding: 16px 24px;
}

.tab-content {
  margin-top: 16px;
}

.content-home {
  min-height: 400px;
}
</style>