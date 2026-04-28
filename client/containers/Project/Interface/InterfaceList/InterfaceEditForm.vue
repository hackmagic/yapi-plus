<template>
  <div class="interface-edit-form">
    <n-form ref="formRef" :model="formData" label-placement="left" label-width="120px">
      <!-- 基本信息 -->
      <n-card title="基本信息" :bordered="false">
        <n-form-item label="接口名称" path="title">
          <n-input v-model:value="formData.title" placeholder="请输入接口名称" />
        </n-form-item>
        <n-form-item label="接口路径" path="path">
          <n-input-group>
            <n-select
              v-model:value="formData.method"
              :options="methodOptions"
              style="width: 120px"
            />
            <n-input
              v-model:value="formData.path"
              placeholder="/api/path"
              @input="handlePathChange"
            />
          </n-input-group>
        </n-form-item>
        <n-form-item label="所属分类" path="catid">
          <n-select
            v-model:value="formData.catid"
            :options="categoryOptions"
            placeholder="选择分类"
          />
        </n-form-item>
        <n-form-item label="接口描述" path="desc">
          <n-input
            v-model:value="formData.desc"
            type="textarea"
            placeholder="接口描述"
            :rows="3"
          />
        </n-form-item>
      </n-card>

      <!-- 请求参数 -->
      <n-card title="请求参数" :bordered="false" style="margin-top: 16px;">
        <n-tabs type="line">
          <n-tab-pane name="query" tab="Query">
            <param-table
              v-model="formData.req_query"
              type="query"
              @change="handleParamChange"
            />
          </n-tab-pane>
          <n-tab-pane name="headers" tab="Headers">
            <param-table
              v-model="formData.req_headers"
              type="headers"
              @change="handleParamChange"
            />
          </n-tab-pane>
          <n-tab-pane name="body" tab="Body">
            <n-radio-group v-model:value="formData.req_body_type">
              <n-radio value="json">JSON</n-radio>
              <n-radio value="form">Form</n-radio>
              <n-radio value="file">File</n-radio>
            </n-radio-group>
            <div v-if="formData.req_body_type === 'json'" style="margin-top: 12px;">
              <ace-editor
                v-model="formData.req_body_other"
                mode="json"
                height="300px"
              />
            </div>
            <param-table
              v-else-if="formData.req_body_type === 'form'"
              v-model="formData.req_body_form"
              type="form"
              @change="handleParamChange"
            />
          </n-tab-pane>
        </n-tabs>
      </n-card>

      <!-- 返回数据 -->
      <n-card title="返回数据" :bordered="false" style="margin-top: 16px;">
        <ace-editor
          v-model="formData.res_body"
          mode="json"
          height="400px"
        />
      </n-card>

      <!-- 操作按钮 -->
      <div style="margin-top: 24px;">
        <n-button type="primary" @click="handleSubmit" :loading="submitting">
          保存
        </n-button>
        <n-button @click="handleCancel" style="margin-left: 12px;">
          取消
        </n-button>
      </div>
    </n-form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useMessage } from 'naive-ui'
import axios from 'axios'
import AceEditor from '@/components/AceEditor/AceEditor.vue'
import ParamTable from '@/components/ParamTable/ParamTable.vue'

const router = useRouter()
const route = useRoute()
const message = useMessage()

const formRef = ref(null)
const submitting = ref(false)

const formData = reactive({
  title: '',
  path: '',
  method: 'GET',
  catid: null,
  desc: '',
  req_query: [],
  req_headers: [],
  req_body_type: 'json',
  req_body_form: [],
  req_body_other: '',
  res_body: ''
})

const methodOptions = [
  { label: 'GET', value: 'GET' },
  { label: 'POST', value: 'POST' },
  { label: 'PUT', value: 'PUT' },
  { label: 'DELETE', value: 'DELETE' },
  { label: 'PATCH', value: 'PATCH' }
]

const categoryOptions = ref([])

// 加载接口数据
const loadInterface = async () => {
  const id = route.params.actionId
  if (!id || isNaN(id)) return

  try {
    const res = await axios.get(`/api/interface/get?id=${id}`)
    if (res.data.errcode === 0) {
      Object.assign(formData, res.data.data)
    }
  } catch (error) {
    message.error('加载接口数据失败')
  }
}

// 加载分类列表
const loadCategories = async () => {
  const projectId = route.params.id
  try {
    const res = await axios.get(`/api/interface/list_menu?project_id=${projectId}`)
    if (res.data.errcode === 0) {
      categoryOptions.value = res.data.data
        .filter(item => item.isMenu)
        .map(cat => ({
          label: cat.name,
          value: cat._id
        }))
    }
  } catch (error) {
    console.error('加载分类失败:', error)
  }
}

const handlePathChange = (value) => {
  formData.path = value
}

const handleParamChange = (params) => {
  // 参数变化处理
}

const handleSubmit = async () => {
  try {
    submitting.value = true
    const data = {
      ...formData,
      project_id: route.params.id
    }

    const res = await axios.post('/api/interface/save', data)
    if (res.data.errcode === 0) {
      message.success('保存成功')
      router.push(`/project/${route.params.id}/interface/api/${res.data.data._id}`)
    } else {
      message.error(res.data.errmsg || '保存失败')
    }
  } catch (error) {
    message.error('保存失败')
  } finally {
    submitting.value = false
  }
}

const handleCancel = () => {
  router.back()
}

onMounted(() => {
  loadInterface()
  loadCategories()
})
</script>

<style scoped lang="scss">
.interface-edit-form {
  padding: 24px;
  max-width: 1200px;
}
</style>
