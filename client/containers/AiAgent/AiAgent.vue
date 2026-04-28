<template>
  <div class="ai-agent-container">
    <n-card title="AI 助手管理" :bordered="false">
      <template #header-extra>
        <n-button type="primary" @click="showAddModal = true">
          添加助手
        </n-button>
      </template>

      <n-data-table
        :columns="columns"
        :data="agents"
        :loading="loading"
        :pagination="pagination"
      />
    </n-card>

    <!-- 添加/编辑弹窗 -->
    <n-modal
      v-model:show="showAddModal"
      :title="editingAgent ? '编辑 AI 助手' : '添加 AI 助手'"
      preset="card"
      style="width: 600px"
    >
      <n-form
        ref="formRef"
        :model="formModel"
        :rules="rules"
        label-placement="left"
        label-width="120"
      >
        <n-form-item label="助手名称" path="name">
          <n-input v-model:value="formModel.name" placeholder="请输入助手名称" />
        </n-form-item>
        <n-form-item label="描述" path="description">
          <n-input v-model:value="formModel.description" type="textarea" placeholder="请输入描述" />
        </n-form-item>
        <n-form-item label="模型类型" path="type">
          <n-select
            v-model:value="formModel.type"
            :options="typeOptions"
            @update:value="handleTypeChange"
          />
        </n-form-item>
        <n-form-item label="API Key" path="apiKey">
          <n-input
            v-model:value="formModel.apiKey"
            type="password"
            show-password-on="click"
            placeholder="请输入 API Key"
          />
        </n-form-item>
        <n-form-item label="模型名称" path="model">
          <n-input v-model:value="formModel.model" placeholder="请输入模型名称，如 gpt-4" />
        </n-form-item>
        <n-form-item label="Base URL" path="baseURL">
          <n-input v-model:value="formModel.baseURL" placeholder="请输入 API 地址" />
        </n-form-item>
        <n-form-item label="温度 (0-1)" path="temperature">
          <n-input-number
            v-model:value="formModel.temperature"
            :min="0"
            :max="1"
            :step="0.1"
            style="width: 100%"
          />
        </n-form-item>
        <n-form-item label="最大 Token" path="maxTokens">
          <n-input-number
            v-model:value="formModel.maxTokens"
            :min="1"
            :max="10000"
            style="width: 100%"
          />
        </n-form-item>
      </n-form>
      <template #footer>
        <n-space justify="end">
          <n-button @click="showAddModal = false">取消</n-button>
          <n-button type="primary" :loading="saving" @click="handleSave">
            确定
          </n-button>
        </n-space>
      </template>
    </n-modal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, h } from 'vue'
import { useMessage, NButton, NSpace, NPopconfirm, NTag } from 'naive-ui'
import axios from 'axios'

const message = useMessage()
const loading = ref(false)
const saving = ref(false)
const showAddModal = ref(false)
const editingAgent = ref(null)
const agents = ref([])

const typeOptions = [
  { label: 'DeepSeek', value: 'deepseek' },
  { label: 'OpenAI', value: 'openai' },
  { label: 'Claude', value: 'claude' },
  { label: 'Gemini', value: 'gemini' },
  { label: 'Custom', value: 'custom' }
]

const defaultBaseURLs = {
  deepseek: 'https://api.deepseek.com',
  openai: 'https://api.openai.com',
  claude: 'https://api.anthropic.com',
  gemini: 'https://generativelanguage.googleapis.com',
  custom: ''
}

const formModel = reactive({
  name: '',
  description: '',
  type: 'deepseek',
  apiKey: '',
  model: 'deepseek-chat',
  baseURL: 'https://api.deepseek.com',
  temperature: 0.7,
  maxTokens: 1000
})

const rules = {
  name: { required: true, message: '请输入名称', trigger: 'blur' },
  type: { required: true, message: '请选择类型', trigger: 'change' },
  apiKey: { required: true, message: '请输入 API Key', trigger: 'blur' }
}

const pagination = {
  pageSize: 10
}

const columns = [
  { title: '名称', key: 'name' },
  {
    title: '类型',
    key: 'type',
    render(row) {
      return h(NTag, { type: 'info' }, { default: () => row.type })
    }
  },
  { title: '模型', key: 'model' },
  {
    title: '创建时间',
    key: 'createdAt',
    render(row) {
      return new Date(row.createdAt).toLocaleString()
    }
  },
  {
    title: '操作',
    key: 'actions',
    render(row) {
      return h(NSpace, null, {
        default: () => [
          h(
            NButton,
            {
              size: 'small',
              onClick: () => handleEdit(row)
            },
            { default: () => '编辑' }
          ),
          h(
            NPopconfirm,
            {
              onPositiveClick: () => handleDelete(row)
            },
            {
              trigger: () => h(NButton, { size: 'small', type: 'error' }, { default: () => '删除' }),
              default: () => '确定删除该助手吗？'
            }
          )
        ]
      })
    }
  }
]

const handleTypeChange = (value) => {
  formModel.baseURL = defaultBaseURLs[value] || ''
  if (value === 'deepseek') formModel.model = 'deepseek-chat'
  else if (value === 'openai') formModel.model = 'gpt-3.5-turbo'
  else if (value === 'claude') formModel.model = 'claude-3-opus-20240229'
  else if (value === 'gemini') formModel.model = 'gemini-pro'
}

const fetchAgents = async () => {
  loading.value = true
  try {
    const res = await axios.get('/api/ai/agents')
    if (res.data.errcode === 0) {
      agents.value = res.data.data
    } else {
      message.error(res.data.errmsg)
    }
  } catch (error) {
    message.error('获取列表失败')
  } finally {
    loading.value = false
  }
}

const handleEdit = (row) => {
  editingAgent.value = row
  Object.assign(formModel, {
    name: row.name,
    description: row.description,
    type: row.type,
    apiKey: row.apiKey,
    model: row.model,
    baseURL: row.baseURL,
    temperature: row.temperature,
    maxTokens: row.maxTokens
  })
  showAddModal.value = true
}

const handleDelete = async (row) => {
  try {
    const res = await axios.delete('/api/ai/agent', { data: { id: row._id } })
    if (res.data.errcode === 0) {
      message.success('删除成功')
      fetchAgents()
    } else {
      message.error(res.data.errmsg)
    }
  } catch (error) {
    message.error('删除失败')
  }
}

const handleSave = async () => {
  saving.value = true
  try {
    const url = '/api/ai/agent'
    const method = editingAgent.value ? 'put' : 'post'
    const data = { ...formModel }
    if (editingAgent.value) {
      data.id = editingAgent.value._id
    }

    const res = await axios({ method, url, data })
    if (res.data.errcode === 0) {
      message.success('保存成功')
      showAddModal.value = false
      fetchAgents()
      resetForm()
    } else {
      message.error(res.data.errmsg)
    }
  } catch (error) {
    message.error('保存失败')
  } finally {
    saving.value = false
  }
}

const resetForm = () => {
  editingAgent.value = null
  Object.assign(formModel, {
    name: '',
    description: '',
    type: 'deepseek',
    apiKey: '',
    model: 'deepseek-chat',
    baseURL: 'https://api.deepseek.com',
    temperature: 0.7,
    maxTokens: 1000
  })
}

onMounted(() => {
  fetchAgents()
})
</script>

<style scoped>
.ai-agent-container {
  padding: 24px;
}
</style>
