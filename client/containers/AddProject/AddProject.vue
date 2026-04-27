<template>
  <div class="add-project">
    <n-card title="创建项目">
      <n-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-placement="left"
        label-width="120"
      >
        <n-form-item label="项目名称" path="name">
          <n-input v-model:value="formData.name" placeholder="请输入项目名称" />
        </n-form-item>
        
        <n-form-item label="项目描述" path="desc">
          <n-input
            v-model:value="formData.desc"
            type="textarea"
            :rows="4"
            placeholder="请输入项目描述"
          />
        </n-form-item>
        
        <n-form-item label="所属项目组" path="group_id">
          <n-select
            v-model:value="formData.group_id"
            :options="groupOptions"
            placeholder="请选择项目组"
          />
        </n-form-item>
        
        <n-form-item label="项目权限">
          <n-radio-group v-model:value="formData.permission">
            <n-space>
              <n-radio value="private">私有</n-radio>
              <n-radio value="public">公开</n-radio>
            </n-space>
          </n-radio-group>
        </n-form-item>
        
        <n-form-item label="Mock 地址">
          <n-input v-model:value="formData.mock_url" placeholder="/mock" />
        </n-form-item>
        
        <n-form-item>
          <n-space>
            <n-button type="primary" @click="handleSubmit" :loading="loading">
              创建项目
            </n-button>
            <n-button @click="$router.back()">取消</n-button>
          </n-space>
        </n-form-item>
      </n-form>
    </n-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import axios from 'axios'

const router = useRouter()
const message = useMessage()

const formRef = ref(null)
const loading = ref(false)
const groupOptions = ref([])

const formData = reactive({
  name: '',
  desc: '',
  group_id: null,
  permission: 'private',
  mock_url: '/mock'
})

const rules = {
  name: { required: true, message: '请输入项目名称', trigger: 'blur' },
  group_id: { required: true, message: '请选择项目组', trigger: 'change' }
}

const fetchGroups = async () => {
  try {
    const res = await axios.get('/api/group/list')
    if (res.data.errcode === 0) {
      groupOptions.value = res.data.data.list.map(group => ({
        label: group.group_name,
        value: group._id
      }))
    }
  } catch (error) {
    message.error('获取项目组列表失败')
  }
}

const handleSubmit = async () => {
  const valid = await formRef.value?.validate()
  if (!valid) return

  loading.value = true
  try {
    const res = await axios.post('/api/project/add', formData)
    if (res.data.errcode === 0) {
      message.success('创建成功')
      router.push(`/project/${res.data.data._id}`)
    } else {
      message.error(res.data.errmsg || '创建失败')
    }
  } catch (error) {
    message.error('创建失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchGroups()
})
</script>

<style scoped>
.add-project {
  padding: 24px;
  max-width: 800px;
  margin: 0 auto;
}
</style>
