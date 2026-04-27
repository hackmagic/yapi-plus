<template>
  <div class="login-container">
    <n-card title="YAPI Plus 登录" :bordered="false" style="max-width: 400px; margin: 100px auto;">
      <n-form ref="formRef" :model="formData" :rules="rules" label-placement="left">
        <n-form-item label="邮箱" path="email">
          <n-input v-model:value="formData.email" placeholder="请输入邮箱" />
        </n-form-item>
        
        <n-form-item label="密码" path="password">
          <n-input v-model:value="formData.password" type="password" placeholder="请输入密码" />
        </n-form-item>
        
        <n-form-item>
          <n-button type="primary" attr-type="button" block @click="handleLogin" :loading="loading">
            登录
          </n-button>
        </n-form-item>
        
        <n-form-item>
          <n-button text type="primary" @click="$router.push('/reg')">
            还没有账号？去注册
          </n-button>
        </n-form-item>
      </n-form>
    </n-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import { useUserStore } from '../../store/user'
import axios from 'axios'

const router = useRouter()
const message = useMessage()
const userStore = useUserStore()

const formRef = ref(null)
const loading = ref(false)

const formData = reactive({
  email: '',
  password: '',
})

const rules = {
  email: {
    required: true,
    message: '请输入邮箱',
    trigger: 'blur',
  },
  password: {
    required: true,
    message: '请输入密码',
    trigger: 'blur',
  },
}

const handleLogin = async () => {
  const valid = await formRef.value?.validate()
  if (!valid) return

  loading.value = true
  
  try {
    const res = await axios.post('/api/user/login', formData)
    
    if (res.data.errcode === 0) {
      message.success('登录成功')
      userStore.setUser(res.data.data)
      router.push('/')
    } else {
      message.error(res.data.errmsg || '登录失败')
    }
  } catch (error) {
    message.error('登录失败，请检查网络连接')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}
</style>
