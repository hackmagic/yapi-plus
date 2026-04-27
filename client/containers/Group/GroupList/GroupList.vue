<template>
  <div class="group-list">
    <n-space vertical :size="16">
      <n-card>
        <template #header>
          <n-space justify="space-between" align="center">
            <span>我的项目组</span>
            <n-button type="primary" @click="showCreateModal = true">
              创建项目组
            </n-button>
          </n-space>
        </template>
        
        <n-data-table
          :columns="columns"
          :data="groupList"
          :loading="loading"
          :pagination="pagination"
        />
      </n-card>
    </n-space>
  </div>
</template>

<script setup>
import { ref, h, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import axios from 'axios'

const router = useRouter()
const message = useMessage()

const loading = ref(false)
const groupList = ref([])
const showCreateModal = ref(false)

const pagination = {
  pageSize: 10
}

const columns = [
  {
    title: '名称',
    key: 'group_name',
    render: (row) => h('a', {
      onClick: () => router.push(`/group/${row._id}`)
    }, row.group_name)
  },
  {
    title: '项目数',
    key: 'project_count',
    width: 120
  },
  {
    title: '成员数',
    key: 'member_count',
    width: 120
  },
  {
    title: '更新时间',
    key: 'up_time',
    width: 180,
    render: (row) => new Date(row.up_time).toLocaleString()
  }
]

const fetchGroupList = async () => {
  loading.value = true
  try {
    const res = await axios.get('/api/group/list')
    if (res.data.errcode === 0) {
      groupList.value = res.data.data.list
    }
  } catch (error) {
    message.error('获取项目组列表失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchGroupList()
})
</script>

<style scoped>
.group-list {
  padding: 24px;
}
</style>
