<template>
  <div class="interface-detail">
    <n-card :title="interfaceData.title">
      <n-tabs type="line">
        <n-tab-pane name="basic" tab="基本信息">
          <n-descriptions label-placement="left" bordered :column="2">
            <n-descriptions-item label="接口路径">
              {{ interfaceData.path }}
            </n-descriptions-item>
            <n-descriptions-item label="请求方法">
              <n-tag :type="methodTypeMap[interfaceData.method]">
                {{ interfaceData.method }}
              </n-tag>
            </n-descriptions-item>
            <n-descriptions-item label="状态">
              <n-tag :type="interfaceData.status === 'done' ? 'success' : 'warning'">
                {{ interfaceData.status === 'done' ? '已完成' : '未完成' }}
              </n-tag>
            </n-descriptions-item>
            <n-descriptions-item label="创建时间">
              {{ formatDate(interfaceData.add_time) }}
            </n-descriptions-item>
          </n-descriptions>
          
          <n-divider />
          
          <n-space vertical>
            <n-text strong>接口描述：</n-text>
            <n-text>{{ interfaceData.desc || '暂无描述' }}</n-text>
          </n-space>
        </n-tab-pane>
        
        <n-tab-pane name="request" tab="请求参数">
          <n-tabs type="line">
            <n-tab-pane name="query" tab="Query">
              <SchemaTable :schema="interfaceData.req_query" />
            </n-tab-pane>
            <n-tab-pane name="body" tab="Body">
              <SchemaTable :schema="interfaceData.req_body" />
            </n-tab-pane>
            <n-tab-pane name="headers" tab="Headers">
              <SchemaTable :schema="interfaceData.req_headers" />
            </n-tab-pane>
          </n-tabs>
        </n-tab-pane>
        
        <n-tab-pane name="response" tab="响应数据">
          <SchemaTable :schema="interfaceData.res_body" />
        </n-tab-pane>
        
        <n-tab-pane name="mock" tab="Mock">
          <MockDoc :interface-id="interfaceData._id" />
        </n-tab-pane>

        <n-tab-pane name="ai" tab="AI 增强">
          <n-space vertical>
            <n-form-item label="选择 AI 助手">
              <n-select
                v-model:value="selectedAgentId"
                :options="agentOptions"
                placeholder="请选择一个 AI 助手"
                style="width: 300px"
              />
            </n-form-item>

            <n-space>
              <n-button type="primary" :disabled="!selectedAgentId" :loading="generatingDoc" @click="handleGenerateDoc">
                生成接口文档
              </n-button>
              <n-button type="info" :disabled="!selectedAgentId" :loading="generatingTest" @click="handleGenerateTest">
                生成测试用例
              </n-button>
            </n-space>

            <n-divider v-if="aiResult" />

            <n-card v-if="aiResult" :title="aiResultTitle" size="small">
              <pre class="ai-result-content">{{ aiResult }}</pre>
            </n-card>
          </n-space>
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useMessage } from 'naive-ui'
import axios from 'axios'
import SchemaTable from '../../../components/SchemaTable/SchemaTable.vue'
import MockDoc from '../../../components/MockDoc/MockDoc.vue'

const route = useRoute()
const message = useMessage()
const interfaceData = ref({})

// AI 增强相关
const selectedAgentId = ref(null)
const agentOptions = ref([])
const generatingDoc = ref(false)
const generatingTest = ref(false)
const aiResult = ref('')
const aiResultTitle = ref('')

const fetchAgents = async () => {
  try {
    const res = await axios.get('/api/ai/agents')
    if (res.data.errcode === 0) {
      agentOptions.value = res.data.data.map(agent => ({
        label: `${agent.name} (${agent.model})`,
        value: agent._id
      }))
      if (agentOptions.value.length > 0) {
        selectedAgentId.value = agentOptions.value[0].value
      }
    }
  } catch (error) {
    console.error('获取 AI 助手列表失败', error)
  }
}

const handleGenerateDoc = async () => {
  generatingDoc.value = true
  aiResult.value = ''
  aiResultTitle.value = '生成的接口文档'
  try {
    const res = await axios.post('/api/ai/generate/doc', {
      projectId: interfaceData.value.project_id,
      interfaceId: interfaceData.value._id,
      agentId: selectedAgentId.value
    })
    if (res.data.errcode === 0) {
      aiResult.value = res.data.data.content
      message.success('生成成功')
    } else {
      message.error(res.data.errmsg)
    }
  } catch (error) {
    message.error('生成失败')
  } finally {
    generatingDoc.value = false
  }
}

const handleGenerateTest = async () => {
  generatingTest.value = true
  aiResult.value = ''
  aiResultTitle.value = '生成的测试用例'
  try {
    const res = await axios.post('/api/ai/generate/testcase', {
      projectId: interfaceData.value.project_id,
      interfaceId: interfaceData.value._id,
      agentId: selectedAgentId.value
    })
    if (res.data.errcode === 0) {
      aiResult.value = res.data.data.content
      message.success('生成成功')
    } else {
      message.error(res.data.errmsg)
    }
  } catch (error) {
    message.error('生成失败')
  } finally {
    generatingTest.value = false
  }
}

const methodTypeMap = {
  GET: 'success',
  POST: 'primary',
  PUT: 'warning',
  DELETE: 'error'
}

const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleString()
}

const fetchInterface = async () => {
  try {
    const res = await axios.get(`/api/interface/get?id=${route.params.id}`)
    if (res.data.errcode === 0) {
      interfaceData.value = res.data.data
    } else {
      message.error(res.data.errmsg || '获取接口信息失败')
    }
  } catch (error) {
    message.error('获取接口信息失败')
  }
}

onMounted(() => {
  fetchInterface()
  fetchAgents()
})
</script>

<style scoped>
.interface-detail {
  padding: 24px;
}

.ai-result-content {
  background: #f5f5f5;
  padding: 16px;
  border-radius: 4px;
  white-space: pre-wrap;
  word-break: break-all;
  font-family: monospace;
}
</style>
