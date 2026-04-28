<template>
  <div class="interface-col-content">
    <div class="content-header">
      <n-space>
        <n-button type="primary" @click="handleRunCol">
          <template #icon>
            <n-icon><PlayOutline /></n-icon>
          </template>
          运行集合
        </n-button>
        <n-button @click="handleImportInterface">
          <template #icon>
            <n-icon><DownloadOutline /></n-icon>
          </template>
          导入接口
        </n-button>
      </n-space>
    </div>

    <div class="col-info" v-if="currentCol">
      <h3>{{ currentCol.name }}</h3>
      <p v-if="currentCol.desc">{{ currentCol.desc }}</p>
    </div>

    <n-spin :show="loading">
      <div class="case-list" v-if="caseList.length > 0">
        <n-data-table
          :columns="columns"
          :data="caseList"
          :row-key="row => row._id"
          :pagination="false"
        />
      </div>
      <n-empty v-else description="暂无测试用例">
        <template #extra>
          <n-button type="primary" @click="handleAddCase">添加用例</n-button>
        </template>
      </n-empty>
    </n-spin>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, h } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMessage, NTag, NButton, NEllipsis } from 'naive-ui'
import { useInterfaceColStore } from '@/store/interfaceCol'
import { PlayOutline, DownloadOutline } from '@vicons/ionicons5'

const props = defineProps({
  colId: {
    type: [Number, String],
    required: true
  }
})

const route = useRoute()
const router = useRouter()
const message = useMessage()
const interfaceColStore = useInterfaceColStore()

const loading = ref(false)
const currentCol = computed(() => interfaceColStore.currentCol)
const caseList = computed(() => interfaceColStore.caseList)

const columns = [
  {
    title: '用例名称',
    key: 'casename',
    render(row) {
      return h(NEllipsis, { style: { maxWidth: '200px' } }, () => row.casename)
    }
  },
  {
    title: '接口路径',
    key: 'path',
    render(row) {
      return h('span', { style: 'color: #666;' }, row.path || '-')
    }
  },
  {
    title: '操作',
    key: 'actions',
    width: 180,
    render(row) {
      return h('div', { class: 'action-btns' }, [
        h(NButton, {
          size: 'small',
          onClick: () => handleEditCase(row)
        }, () => '编辑'),
        h(NButton, {
          size: 'small',
          type: 'primary',
          onClick: () => handleRunCase(row)
        }, () => '运行'),
        h(NButton, {
          size: 'small',
          type: 'error',
          onClick: () => handleDeleteCase(row)
        }, () => '删除')
      ])
    }
  }
]

const loadCaseList = async () => {
  loading.value = true
  try {
    await interfaceColStore.fetchCaseList(props.colId)
  } finally {
    loading.value = false
  }
}

const handleRunCol = () => {
  const projectId = route.params.id
  router.push(`/project/${projectId}/interface/col/${props.colId}/run`)
}

const handleImportInterface = () => {
  const projectId = route.params.id
  router.push(`/project/${projectId}/interface/col/${props.colId}/import`)
}

const handleAddCase = () => {
  const projectId = route.params.id
  router.push(`/project/${projectId}/interface/col/${props.colId}/addCase`)
}

const handleEditCase = (row) => {
  const projectId = route.params.id
  router.push(`/project/${projectId}/interface/case/${row._id}`)
}

const handleRunCase = (row) => {
  const projectId = route.params.id
  router.push(`/project/${projectId}/interface/case/${row._id}/run`)
}

const handleDeleteCase = async (row) => {
  try {
    await interfaceColStore.deleteCase(row._id, props.colId)
    message.success('删除成功')
    await loadCaseList()
  } catch (e) {
    message.error(e.message)
  }
}

onMounted(() => {
  const col = interfaceColStore.colList.find(c => c._id === props.colId)
  if (col) {
    interfaceColStore.setCurrentCol(col)
  }
  loadCaseList()
})
</script>

<style scoped lang="scss">
.interface-col-content {
  padding: 16px;

  .content-header {
    margin-bottom: 16px;
  }

  .col-info {
    margin-bottom: 16px;
    padding: 12px;
    background: #f9f9f9;
    border-radius: 4px;

    h3 {
      margin: 0 0 8px;
    }

    p {
      margin: 0;
      color: #666;
    }
  }

  .case-list {
    :deep(.action-btns) {
      display: flex;
      gap: 8px;
    }
  }
}
</style>