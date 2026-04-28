<template>
  <div class="interface-case-content">
    <div class="case-header">
      <n-space>
        <n-button type="primary" @click="handleSave" :loading="saving">
          保存
        </n-button>
        <n-button @click="handleRun" type="success">
          <template #icon>
            <n-icon><PlayOutline /></n-icon>
          </template>
          运行
        </n-button>
      </n-space>
    </div>

    <n-spin :show="loading">
      <n-form ref="formRef" :model="formData" :rules="formRules" label-placement="top">
        <n-card title="基本信息">
          <n-grid :cols="2" :x-gap="16">
            <n-gi>
              <n-form-item label="用例名称" path="casename">
                <n-input v-model:value="formData.casename" placeholder="请输入用例名称" />
              </n-form-item>
            </n-gi>
            <n-gi>
              <n-form-item label="运行环境" path="case_env">
                <n-select v-model:value="formData.case_env" :options="envOptions" placeholder="请选择环境" />
              </n-form-item>
            </n-gi>
          </n-grid>
        </n-card>

        <n-card title="请求信息" style="margin-top: 16px;">
          <n-grid :cols="2" :x-gap="16">
            <n-gi>
              <n-form-item label="请求方法">
                <n-tag :type="methodTagType">{{ formData.method }}</n-tag>
              </n-form-item>
            </n-gi>
            <n-gi>
              <n-form-item label="接口路径">
                <n-input v-model:value="formData.path" readonly />
              </n-form-item>
            </n-gi>
          </n-grid>

          <n-tabs type="line" animated>
            <n-tab-pane name="params" tab="Query 参数">
              <n-editable-table
                v-model:data="formData.req_query"
                :columns="paramColumns"
                :max-height="200"
              />
            </n-tab-pane>
            <n-tab-pane name="headers" tab="Headers">
              <n-editable-table
                v-model:data="formData.req_headers"
                :columns="paramColumns"
                :max-height="200"
              />
            </n-tab-pane>
            <n-tab-pane name="body" tab="Body">
              <n-form-item label="Body 类型">
                <n-radio-group v-model:value="formData.req_body_type">
                  <n-radio value="none">none</n-radio>
                  <n-radio value="form">form</n-radio>
                  <n-radio value="json">json</n-radio>
                  <n-radio value="raw">raw</n-radio>
                </n-radio-group>
              </n-form-item>
              <n-form-item v-if="formData.req_body_type === 'json'" label="JSON">
                <n-input
                  v-model:value="formData.req_body_other"
                  type="textarea"
                  :rows="6"
                  placeholder='{"key": "value"}'
                />
              </n-form-item>
              <n-form-item v-else-if="formData.req_body_type === 'form'" label="Form Data">
                <n-editable-table
                  v-model:data="formData.req_body_form"
                  :columns="paramColumns"
                  :max-height="200"
                />
              </n-form-item>
              <n-form-item v-else label="Raw">
                <n-input
                  v-model:value="formData.req_body_other"
                  type="textarea"
                  :rows="6"
                />
              </n-form-item>
            </n-tab-pane>
          </n-tabs>
        </n-card>

        <n-card title="响应信息" style="margin-top: 16px;" v-if="responseData">
          <n-descriptions :column="2" label-placement="left">
            <n-descriptions-item label="状态码">
              <n-tag :type="responseStatusType">{{ responseData.status }}</n-tag>
            </n-descriptions-item>
            <n-descriptions-item label="响应时间">{{ responseData.time }} ms</n-descriptions-item>
          </n-descriptions>
          <n-divider />
          <n-form-item label="响应 Body">
            <n-input
              :value="formatResponseBody"
              type="textarea"
              :rows="10"
              readonly
              style="font-family: monospace;"
            />
          </n-form-item>
        </n-card>
      </n-form>
    </n-spin>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, h } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMessage, NTag, NButton, NIcon } from 'naive-ui'
import axios from 'axios'
import { PlayOutline } from '@vicons/ionicons5'

const props = defineProps({
  caseId: {
    type: [Number, String],
    required: true
  }
})

const route = useRoute()
const router = useRouter()
const message = useMessage()

const loading = ref(false)
const saving = ref(false)
const responseData = ref(null)

const formData = ref({
  casename: '',
  case_env: '',
  method: 'GET',
  path: '',
  req_query: [],
  req_headers: [],
  req_body_type: 'none',
  req_body_other: '',
  req_body_form: [],
  req_params: []
})

const formRules = {
  casename: { required: true, message: '请输入用例名称', trigger: 'blur' }
}

const envOptions = [
  { label: '开发环境', value: 'dev' },
  { label: '测试环境', value: 'test' },
  { label: '生产环境', value: 'prod' }
]

const methodTagType = computed(() => {
  const typeMap = {
    GET: 'info',
    POST: 'success',
    PUT: 'warning',
    DELETE: 'error',
    PATCH: 'warning'
  }
  return typeMap[formData.value.method] || 'info'
})

const responseStatusType = computed(() => {
  if (!responseData.value) return 'info'
  const status = responseData.value.status
  if (status >= 200 && status < 300) return 'success'
  if (status >= 400 && status < 500) return 'warning'
  if (status >= 500) return 'error'
  return 'info'
})

const formatResponseBody = computed(() => {
  if (!responseData.value) return ''
  if (typeof responseData.value.body === 'object') {
    return JSON.stringify(responseData.value.body, null, 2)
  }
  return responseData.value.body
})

const paramColumns = [
  { title: '名称', key: 'name', editable: true },
  { title: '值', key: 'value', editable: true },
  { title: '类型', key: 'type', editable: true },
  { title: '必填', key: 'required', editable: true },
  { title: '备注', key: 'desc', editable: true }
]

const loadCaseData = async () => {
  loading.value = true
  try {
    const res = await axios.get('/api/interfaceCol/case', { params: { caseid: props.caseId } })
    if (res.data.errcode === 0) {
      const data = res.data.data
      formData.value = {
        casename: data.casename || '',
        case_env: data.case_env || '',
        method: data.method || 'GET',
        path: data.path || '',
        req_query: data.req_query || [],
        req_headers: data.req_headers || [],
        req_body_type: data.req_body_type || 'none',
        req_body_other: data.req_body_other || '',
        req_body_form: data.req_body_form || [],
        req_params: data.req_params || []
      }
    }
  } catch (e) {
    message.error('加载用例数据失败')
  } finally {
    loading.value = false
  }
}

const handleSave = async () => {
  saving.value = true
  try {
    await axios.put('/api/interfaceCase/up', {
      id: props.caseId,
      casename: formData.value.casename,
      case_env: formData.value.case_env
    })
    message.success('保存成功')
  } catch (e) {
    message.error(e.message || '保存失败')
  } finally {
    saving.value = false
  }
}

const handleRun = async () => {
  const projectId = route.params.id
  router.push(`/project/${projectId}/interface/case/${props.caseId}/run`)
}

onMounted(() => {
  loadCaseData()
})
</script>

<style scoped lang="scss">
.interface-case-content {
  padding: 16px;

  .case-header {
    margin-bottom: 16px;
  }
}
</style>