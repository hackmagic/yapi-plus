<template>
  <div class="project-request">
    <n-spin :show="loading">
      <n-form ref="formRef" :model="formData" label-placement="left" label-width="120px">
        <n-card title="请求设置">
          <n-form-item label="代理">
            <n-switch v-model:value="formData.proxy.enable">
              <template #checked>启用</template>
              <template #unchecked>禁用</template>
            </n-switch>
          </n-form-item>
          
          <template v-if="formData.proxy.enable">
            <n-form-item label="代理地址">
              <n-input v-model:value="formData.proxy.host" placeholder="127.0.0.1" />
            </n-form-item>
            <n-form-item label="代理端口">
              <n-input-number v-model:value="formData.proxy.port" :min="1" :max="65535" />
            </n-form-item>
            <n-form-item label="代理用户名">
              <n-input v-model:value="formData.proxy.username" placeholder="可选" />
            </n-form-item>
            <n-form-item label="代理密码">
              <n-input v-model:value="formData.proxy.password" type="password" placeholder="可选" />
            </n-form-item>
          </template>

          <n-divider />

          <n-form-item label="跨域设置">
            <n-switch v-model:value="formData.cors.enable">
              <template #checked>允许</template>
              <template #unchecked>不允许</template>
            </n-switch>
          </n-form-item>

          <template v-if="formData.cors.enable">
            <n-form-item label="允许的 origin">
              <n-input v-model:value="formData.cors.allowedOrigin" placeholder="* 或具体域名" />
            </n-form-item>
            <n-form-item label="允许的方法">
              <n-checkbox-group v-model:value="formData.cors.allowedMethods">
                <n-space>
                  <n-checkbox value="GET">GET</n-checkbox>
                  <n-checkbox value="POST">POST</n-checkbox>
                  <n-checkbox value="PUT">PUT</n-checkbox>
                  <n-checkbox value="DELETE">DELETE</n-checkbox>
                  <n-checkbox value="PATCH">PATCH</n-checkbox>
                </n-space>
              </n-checkbox-group>
            </n-form-item>
            <n-form-item label="允许的 Headers">
              <n-input v-model:value="formData.cors.allowedHeaders" placeholder="Content-Type, Authorization" />
            </n-form-item>
          </template>

          <n-divider />

          <n-form-item label="请求超时">
            <n-input-number v-model:value="formData.timeout" :min="0" :max="300000" :step="1000">
              <template #suffix>ms</template>
            </n-input-number>
          </n-form-item>

          <n-form-item label="SSL 验证">
            <n-switch v-model:value="formData.sslVerify">
              <template #checked>启用</template>
              <template #unchecked>禁用</template>
            </n-switch>
          </n-form-item>

          <n-form-item>
            <n-button type="primary" @click="handleSave" :loading="saving">保存设置</n-button>
          </n-form-item>
        </n-card>
      </n-form>
    </n-spin>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useMessage } from 'naive-ui'
import axios from 'axios'

const props = defineProps({
  projectId: {
    type: Number,
    required: true
  }
})

const message = useMessage()

const loading = ref(false)
const saving = ref(false)

const formData = ref({
  proxy: {
    enable: false,
    host: '',
    port: 8080,
    username: '',
    password: ''
  },
  cors: {
    enable: false,
    allowedOrigin: '*',
    allowedMethods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: 'Content-Type'
  },
  timeout: 30000,
  sslVerify: true
})

const loadSettings = async () => {
  loading.value = true
  try {
    const res = await axios.get(`/api/project/get?id=${props.projectId}`)
    if (res.data.errcode === 0) {
      const data = res.data.data
      if (data.request_settings) {
        formData.value = { ...formData.value, ...data.request_settings }
      }
    }
  } catch (e) {
    message.error('加载设置失败')
  } finally {
    loading.value = false
  }
}

const handleSave = async () => {
  saving.value = true
  try {
    const res = await axios.post('/api/project/up', {
      id: props.projectId,
      request_settings: formData.value
    })
    if (res.data.errcode === 0) {
      message.success('保存成功')
    }
  } catch (e) {
    message.error('保存失败')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadSettings()
})
</script>

<style scoped lang="scss">
.project-request {
  padding: 16px;
}
</style>