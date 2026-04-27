<template>
  <div class="mock-page">
    <n-card title="Mock 测试">
      <n-space vertical :size="16">
        <n-form
          ref="formRef"
          :model="formData"
          label-placement="left"
          label-width="100"
        >
          <n-form-item label="接口地址">
            <n-input v-model:value="formData.url" placeholder="/api/mock" />
          </n-form-item>
          
          <n-form-item label="请求方法">
            <n-select
              v-model:value="formData.method"
              :options="methodOptions"
            />
          </n-form-item>
          
          <n-form-item label="请求体">
            <n-input
              v-model:value="formData.body"
              type="textarea"
              :rows="8"
              placeholder="JSON格式的请求体"
            />
          </n-form-item>
          
          <n-form-item>
            <n-button type="primary" @click="sendMock" :loading="loading">
              发送请求
            </n-button>
          </n-form-item>
        </n-form>
        
        <n-card v-if="response" title="响应结果">
          <pre class="response-body">{{ response }}</pre>
        </n-card>
      </n-space>
    </n-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useMessage } from 'naive-ui'
import axios from 'axios'

const message = useMessage()
const loading = ref(false)
const response = ref(null)
const formRef = ref(null)

const formData = reactive({
  url: '/api/mock',
  method: 'GET',
  body: ''
})

const methodOptions = [
  { label: 'GET', value: 'GET' },
  { label: 'POST', value: 'POST' },
  { label: 'PUT', value: 'PUT' },
  { label: 'DELETE', value: 'DELETE' }
]

const sendMock = async () => {
  loading.value = true
  try {
    const config = {
      method: formData.method.toLowerCase(),
      url: formData.url
    }
    
    if (formData.body && formData.method !== 'GET') {
      config.data = JSON.parse(formData.body)
    }
    
    const res = await axios(config)
    response.value = JSON.stringify(res.data, null, 2)
    message.success('请求成功')
  } catch (error) {
    response.value = JSON.stringify(error.response?.data || error.message, null, 2)
    message.error('请求失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.mock-page {
  padding: 24px;
}

.response-body {
  background: #f5f5f5;
  padding: 16px;
  border-radius: 4px;
  overflow-x: auto;
  font-family: 'Courier New', monospace;
  font-size: 13px;
}
</style>
