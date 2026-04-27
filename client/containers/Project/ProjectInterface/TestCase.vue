<template>
  <div class="test-case">
    <n-card>
      <template #header>
        <n-space justify="space-between" align="center">
          <span>测试用例</span>
          <n-button type="primary" @click="handleAdd">添加用例</n-button>
        </n-space>
      </template>
      
      <n-data-table
        :columns="columns"
        :data="testCases"
        :loading="loading"
        :pagination="pagination"
      />
    </n-card>
  </div>
</template>

<script setup>
import { ref, h, onMounted } from 'vue'
import { useMessage, NTag, NButton, NSpace } from 'naive-ui'
import axios from 'axios'

const props = defineProps({
  interfaceId: {
    type: String,
    required: true
  }
})

const message = useMessage()
const loading = ref(false)
const testCases = ref([])

const pagination = {
  pageSize: 10
}

const columns = [
  {
    title: '用例名称',
    key: 'name'
  },
  {
    title: '状态',
    key: 'status',
    width: 100,
    render: (row) => {
      const typeMap = {
        pass: 'success',
        fail: 'error',
        pending: 'warning'
      }
      return h(NTag, { type: typeMap[row.status] || 'default' }, {
        default: () => row.status
      })
    }
  },
  {
    title: '更新时间',
    key: 'up_time',
    width: 180,
    render: (row) => new Date(row.up_time).toLocaleString()
  },
  {
    title: '操作',
    key: 'actions',
    width: 150,
    render: (row) => h(NSpace, {}, {
      default: () => [
        h(NButton, { size: 'small', type: 'primary', text: true, onClick: () => handleEdit(row) }, {
          default: () => '编辑'
        }),
        h(NButton, { size: 'small', type: 'error', text: true, onClick: () => handleDelete(row) }, {
          default: () => '删除'
        })
      ]
    })
  }
]

const handleAdd = () => {
  message.info('添加测试用例')
}

const handleEdit = (testCase) => {
  message.info(`编辑测试用例: ${testCase.name}`)
}

const handleDelete = async (testCase) => {
  try {
    const res = await axios.delete(`/api/testcase/del?id=${testCase._id}`)
    if (res.data.errcode === 0) {
      message.success('删除成功')
      fetchTestCases()
    } else {
      message.error(res.data.errmsg || '删除失败')
    }
  } catch (error) {
    message.error('删除失败')
  }
}

const fetchTestCases = async () => {
  loading.value = true
  try {
    const res = await axios.get(`/api/testcase/list`, {
      params: {
        interface_id: props.interfaceId
      }
    })
    if (res.data.errcode === 0) {
      testCases.value = res.data.data.list
    }
  } catch (error) {
    message.error('获取测试用例失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchTestCases()
})
</script>

<style scoped>
.test-case {
  padding: 24px;
}
</style>
