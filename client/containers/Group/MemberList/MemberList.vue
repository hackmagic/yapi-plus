<template>
  <div class="member-list-page">
    <n-card title="组成员管理" :bordered="false">
      <template #header-extra>
        <n-button type="primary" @click="showAddModal = true">
          添加成员
        </n-button>
      </template>

      <n-data-table
        :columns="columns"
        :data="memberList"
        :loading="loading"
        :pagination="false"
      />

      <n-modal
        v-model:show="showAddModal"
        preset="dialog"
        title="添加成员"
        @positive-click="handleAddMember"
      >
        <n-form ref="formRef" :model="formData" :rules="rules">
          <n-form-item label="用户邮箱" path="email">
            <n-input v-model:value="formData.email" placeholder="请输入用户邮箱" />
          </n-form-item>
          <n-form-item label="角色" path="role">
            <n-radio-group v-model:value="formData.role">
              <n-radio value="member">成员</n-radio>
              <n-radio value="admin">管理员</n-radio>
            </n-radio-group>
          </n-form-item>
        </n-form>
      </n-modal>
    </n-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, h } from 'vue'
import { useRoute } from 'vue-router'
import { useMessage } from 'naive-ui'
import { NButton, NTag, NIcon } from 'naive-ui'
import { TrashOutline } from '@vicons/ionicons5'
import { useGroupStore } from '@/store/group'
import axios from 'axios'

const route = useRoute()
const message = useMessage()
const groupStore = useGroupStore()

const groupId = computed(() => route.params.id)
const loading = ref(false)
const memberList = ref([])
const showAddModal = ref(false)

const formData = ref({
  email: '',
  role: 'member'
})

const rules = {
  email: { required: true, message: '请输入用户邮箱', trigger: 'blur' }
}

const columns = [
  { title: '用户名', key: 'username' },
  { title: '邮箱', key: 'email' },
  {
    title: '角色',
    key: 'role',
    render: (row) => h(NTag, { type: row.role === 'admin' ? 'error' : 'default' }, {
      default: () => row.role === 'admin' ? '管理员' : '成员'
    })
  },
  { title: '加入时间', key: 'add_time', render: (row) => new Date(row.add_time * 1000).toLocaleDateString() },
  {
    title: '操作',
    key: 'actions',
    render: (row) => h(NButton, {
      size: 'small',
      type: 'error',
      text: true,
      onClick: () => handleRemoveMember(row)
    }, {
      default: () => '移除'
    })
  }
]

const loadMembers = async () => {
  loading.value = true
  try {
    const res = await axios.get('/api/group/getMemberList', { params: { id: groupId.value } })
    if (res.data.errcode === 0) {
      memberList.value = res.data.data
    }
  } catch (e) {
    console.error('加载成员失败', e)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadMembers()
})

const handleAddMember = async () => {
  try {
    await axios.post('/api/group/addMember', {
      id: groupId.value,
      ...formData.value
    })
    message.success('添加成功')
    showAddModal.value = false
    await loadMembers()
  } catch (e) {
    message.error(e.response?.data?.errmsg || '添加失败')
  }
}

const handleRemoveMember = async (row) => {
  try {
    await axios.post('/api/group/delMember', {
      id: groupId.value,
      uid: row.uid
    })
    message.success('移除成功')
    await loadMembers()
  } catch (e) {
    message.error(e.response?.data?.errmsg || '移除失败')
  }
}
</script>

<style scoped>
.member-list-page {
  min-height: 400px;
}
</style>