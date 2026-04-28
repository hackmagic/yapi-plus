<template>
  <div class="group-home">
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
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import ProjectList from '../../Project/ProjectList/ProjectList.vue'

const route = useRoute()
const groupId = route.params.id
const groupInfo = ref(null)

const loadGroup = async () => {
  try {
    const res = await axios.get(`/api/group/get?id=${groupId}`)
    if (res.data.errcode === 0) groupInfo.value = res.data.data
  } catch (error) {
    console.error('加载失败:', error)
  }
}

onMounted(() => loadGroup())
</script>
