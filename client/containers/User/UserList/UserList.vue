<template>
  <div class="user-list">
    <n-card>
      <template #header>
        <n-space justify="space-between" align="center">
          <span>用户管理</span>
          <n-input
            v-model:value="searchKeyword"
            placeholder="搜索用户"
            style="width: 300px"
            @update:value="handleSearch"
          />
        </n-space>
      </template>
      
      <n-data-table
        :columns="columns"
        :data="userList"
        :loading="loading"
        :pagination="pagination"
        :remote="true"
      />
    </n-card>
  </div>
</template>

<script setup>
import { ref, h, onMounted } from 'vue'
import { useMessage, NTag, NButton, NSpace, NAvatar } from 'naive-ui'
import axios from 'axios'

const message = useMessage()
const loading = ref(false)
const userList = ref([])
const searchKeyword = ref('')

const pagination = {
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [10, 20, 50],
  onChange: (page) => {
    pagination.page = page
    fetchUserList()
  },
  onUpdatePageSize: (pageSize) => {
    pagination.pageSize = pageSize
    fetchUserList()
  }
}

const columns = [
  {
    title: '用户',
    key: 'username',
    render: (row) => h(NSpace, { align: 'center' }, {
      default: () => [
        h(NAvatar, { size: 'small', style: { backgroundColor: '#2080f0' } }, {
          default: () => row.username?.charAt(0)?.toUpperCase()
        }),
        h('div', {}, [
          h('div', {}, row.username),
          h('div', { style: { color: '#999', fontSize: '12px' } }, row.email)
        ])
      ]
    })
  },
  {
    title: '角色',
    key: 'role',
    width: 120,
    render: (row) => {
      const typeMap = {
        admin: 'error',
        member: 'info'
      }
      return h(NTag, { type: typeMap[row.role] || 'default' }, {
        default: () => row.role === 'admin' ? '管理员' : '成员'
      })
    }
  },
  {
    title: '注册时间',
    key: 'add_time',
    width: 180,
    render: (row) => new Date(row.add_time).toLocaleString()
  },
  {
    title: '操作',
    key: 'actions',
    width: 200,
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

const handleSearch = () => {
  pagination.page = 1
  fetchUserList()
}

const handleEdit = (user) => {
  message.info(`编辑用户: ${user.username}`)
}

const handleDelete = async (user) => {
  try {
    const res = await axios.delete(`/api/user/del?id=${user._id}`)
    if (res.data.errcode === 0) {
      message.success('删除成功')
      fetchUserList()
    } else {
      message.error(res.data.errmsg || '删除失败')
    }
  } catch (error) {
    message.error('删除失败')
  }
}

const fetchUserList = async () => {
  loading.value = true
  try {
    const res = await axios.get('/api/user/list', {
      params: {
        page: pagination.page,
        limit: pagination.pageSize,
        keyword: searchKeyword.value
      }
    })
    if (res.data.errcode === 0) {
      userList.value = res.data.data.list
    }
  } catch (error) {
    message.error('获取用户列表失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchUserList()
})
</script>

<style scoped>
.user-list {
  padding: 24px;
}
</style>
