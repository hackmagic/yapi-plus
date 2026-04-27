<template>
  <div class="user-settings">
    <n-card title="个人设置">
      <n-tabs type="line">
        <n-tab-pane name="profile" tab="基本信息">
          <n-form
            ref="formRef"
            :model="formData"
            :rules="rules"
            label-placement="left"
            label-width="100"
          >
            <n-form-item label="用户名" path="username">
              <n-input v-model:value="formData.username" />
            </n-form-item>
            
            <n-form-item label="邮箱" path="email">
              <n-input v-model:value="formData.email" />
            </n-form-item>
            
            <n-form-item>
              <n-button type="primary" @click="handleUpdate" :loading="loading">
                保存
              </n-button>
            </n-form-item>
          </n-form>
        </n-tab-pane>
        
        <n-tab-pane name="password" tab="修改密码">
          <n-form
            ref="passwordFormRef"
            :model="passwordData"
            :rules="passwordRules"
            label-placement="left"
            label-width="100"
          >
            <n-form-item label="旧密码" path="old_password">
              <n-input v-model:value="passwordData.old_password" type="password" />
            </n-form-item>
            
            <n-form-item label="新密码" path="password">
              <n-input v-model:value="passwordData.password" type="password" />
            </n-form-item>
            
            <n-form-item label="确认密码" path="confirm_password">
              <n-input v-model:value="passwordData.confirm_password" type="password" />
            </n-form-item>
            
            <n-form-item>
              <n-button type="primary" @click="handleChangePassword" :loading="loading">
                修改密码
              </n-button>
            </n-form-item>
          </n-form>
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useMessage } from 'naive-ui'
import { useUserStore } from '../../../store/user'
import axios from 'axios'

const message = useMessage()
const userStore = useUserStore()
const loading = ref(false)
const formRef = ref(null)
const passwordFormRef = ref(null)

const formData = reactive({
  username: '',
  email: ''
})

const rules = {
  username: { required: true, message: '请输入用户名', trigger: 'blur' },
  email: { required: true, message: '请输入邮箱', trigger: 'blur' }
}

const passwordData = reactive({
  old_password: '',
  password: '',
  confirm_password: ''
})

const passwordRules = {
  old_password: { required: true, message: '请输入旧密码', trigger: 'blur' },
  password: { required: true, message: '请输入新密码', trigger: 'blur' },
  confirm_password: {
    required: true,
    message: '请再次输入新密码',
    trigger: 'blur',
    validator: (rule, value) => {
      return value === passwordData.password
    }
  }
}

const handleUpdate = async () => {
  const valid = await formRef.value?.validate()
  if (!valid) return

  loading.value = true
  try {
    const res = await axios.put('/api/user/update', formData)
    if (res.data.errcode === 0) {
      message.success('更新成功')
    } else {
      message.error(res.data.errmsg || '更新失败')
    }
  } catch (error) {
    message.error('更新失败')
  } finally {
    loading.value = false
  }
}

const handleChangePassword = async () => {
  const valid = await passwordFormRef.value?.validate()
  if (!valid) return

  loading.value = true
  try {
    const res = await axios.put('/api/user/change_password', passwordData)
    if (res.data.errcode === 0) {
      message.success('密码修改成功')
      passwordData.old_password = ''
      passwordData.password = ''
      passwordData.confirm_password = ''
    } else {
      message.error(res.data.errmsg || '修改失败')
    }
  } catch (error) {
    message.error('修改失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  formData.username = userStore.username
  formData.email = userStore.email
})
</script>

<style scoped>
.user-settings {
  padding: 24px;
}
</style>
