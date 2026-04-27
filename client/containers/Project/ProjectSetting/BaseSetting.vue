<template>
  <n-form
    ref="formRef"
    :model="formData"
    :rules="rules"
    label-placement="left"
    label-width="120"
  >
    <n-form-item label="项目名称" path="name">
      <n-input v-model:value="formData.name" />
    </n-form-item>
    
    <n-form-item label="项目描述" path="desc">
      <n-input v-model:value="formData.desc" type="textarea" :rows="3" />
    </n-form-item>
    
    <n-form-item label="项目图标" path="icon">
      <n-upload :max="1" list-type="image-card">
        <n-button>上传图标</n-button>
      </n-upload>
    </n-form-item>
    
    <n-form-item>
      <n-button type="primary" @click="handleSave" :loading="loading">
        保存
      </n-button>
    </n-form-item>
  </n-form>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useMessage } from 'naive-ui'
import axios from 'axios'

const props = defineProps({
  projectId: {
    type: String,
    required: true
  }
})

const message = useMessage()
const loading = ref(false)
const formRef = ref(null)

const formData = reactive({
  name: '',
  desc: '',
  icon: ''
})

const rules = {
  name: { required: true, message: '请输入项目名称', trigger: 'blur' }
}

const handleSave = async () => {
  const valid = await formRef.value?.validate()
  if (!valid) return

  loading.value = true
  try {
    const res = await axios.put(`/api/project/up?id=${props.projectId}`, formData)
    if (res.data.errcode === 0) {
      message.success('保存成功')
    } else {
      message.error(res.data.errmsg || '保存失败')
    }
  } catch (error) {
    message.error('保存失败')
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  try {
    const res = await axios.get(`/api/project/get?id=${props.projectId}`)
    if (res.data.errcode === 0) {
      formData.name = res.data.data.name
      formData.desc = res.data.data.desc
    }
  } catch (error) {
    message.error('获取项目信息失败')
  }
})
</script>
