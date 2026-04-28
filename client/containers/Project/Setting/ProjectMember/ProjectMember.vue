<template>
  <div class="project-member">
    <n-card title="成员管理" :bordered="false">
      <template #header-extra>
        <n-button type="primary" @click="showAddMember = true">
          <template #icon>
            <n-icon><PersonAddOutline /></n-icon>
          </template>
          添加成员
        </n-button>
      </template>

      <n-data-table
        :columns="columns"
        :data="memberList"
        :loading="loading"
      />
    </n-card>

    <!-- 添加成员弹窗 -->
    <n-modal v-model:show="showAddMember" preset="dialog" title="添加成员">
      <n-form>
        <n-form-item label="用户邮箱">
          <n-input v-model:value="memberEmail" placeholder="user@example.com" />
        </n-form-item>
        <n-form-item label="角色">
          <n-select
            v-model:value="memberRole"
            :options="roleOptions"
          />
        </n-form-item>
      </n-form>
      <template #action>
        <n-button @click="showAddMember = false">取消</n-button>
        <n-button type="primary" @click="handleAddMember" :loading="adding">添加</n-button>
      </template>
    </n-modal>
  </div>
</template>

<script setup>
import { ref, h, onMounted } from 'vue'
import { useMessage, NButton, NPopconfirm } from 'naive-ui'
import { PersonAddOutline, TrashOutline } from '@vicons/ionicons5'
import axios from 'axios'

const props = defineProps({
  projectId: {
    type: Number,
    required: true
  }
})

const message = useMessage()
const loading = ref(false)
const adding = ref(false)
const showAddMember = ref(false)
const memberEmail = ref('')
const memberRole = ref('dev')

const memberList = ref([])

const roleOptions = [
  { label: '管理员', value: 'admin' },
  { label: '开发者', value: 'dev' },
  { label: '访客', value: 'guest' }
]

const columns = [
  {
    title: '用户名',
    key: 'username',
    render: (row) => row.username || row.email
  },
  {
    title: '邮箱',
    key: 'email'
  },
  {
    title: '角色',
    key: 'role',
    render: (row) => {
      const roleMap = {
        admin: '管理员',
        dev: '开发者',
        guest: '访客'
      }
      return roleMap[row.role] || row.role
    }
  },
  {
    title: '操作',
    key: 'actions',
    render: (row) => {
      return h(NPopconfirm, {
        onPositiveClick: () => handleDeleteMember(row._id)
      }, {
        trigger: () => h(NButton, {
          text: true,
          type: 'error',
          size: 'small'
        }, {
          default: () => '移除',
          icon: () => h('i', { class: 'n-icon' }, h(TrashOutline))
        }),
        default: () => '确定要移除此成员吗？'
      })
    }
  }
]

const fetchMembers = async () => {
  loading.value = true
  try {
    const res = await axios.get(`/api/project/get_member_list?project_id=${props.projectId}`)
    if (res.data.errcode === 0) {
      memberList.value = res.data.data
    }
  } catch (error) {
    message.error('获取成员列表失败')
  } finally {
    loading.value = false
  }
}

const handleAddMember = async () => {
  if (!memberEmail.value) {
    message.error('请输入用户邮箱')
    return
  }

  adding.value = true
  try {
    const res = await axios.post('/api/project/add_member', {
      project_id: props.projectId,
      email: memberEmail.value,
      role: memberRole.value
    })
    
    if (res.data.errcode === 0) {
      message.success('添加成功')
      showAddMember.value = false
      memberEmail.value = ''
      fetchMembers()
    } else {
      message.error(res.data.errmsg || '添加失败')
    }
  } catch (error) {
    message.error('添加失败')
  } finally {
    adding.value = false
  }
}

const handleDeleteMember = async (memberId) => {
  try {
    const res = await axios.post('/api/project/del_member', {
      project_id: props.projectId,
      member_id: memberId
    })
    if (res.data.errcode === 0) {
      message.success('移除成功')
      fetchMembers()
    }
  } catch (error) {
    message.error('移除失败')
  }
}

onMounted(() => {
  fetchMembers()
})
</script>

<style scoped lang="scss">
.project-member {
  padding: 24px;
}
</style>
