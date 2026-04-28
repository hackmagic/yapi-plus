<template>
  <div class="project-message">
    <n-form ref="formRef" :model="formData" label-placement="left" label-width="150px">
      <n-card title="项目信息" :bordered="false">
        <n-form-item label="项目名称" path="name">
          <n-input v-model:value="formData.name" placeholder="请输入项目名称" />
        </n-form-item>
        <n-form-item label="项目描述" path="desc">
          <n-input v-model:value="formData.desc" type="textarea" placeholder="项目描述" :rows="4" />
        </n-form-item>
        <n-form-item label="所属分组" path="group_id">
          <n-select
            v-model:value="formData.group_id"
            :options="groupOptions"
            placeholder="选择分组"
          />
        </n-form-item>
        <n-form-item label="项目图标">
          <n-input v-model:value="formData.icon" placeholder="图标 class" />
        </n-form-item>
        <n-form-item label="项目颜色">
          <n-color-picker v-model:value="formData.color" />
        </n-form-item>
      </n-card>

      <n-card title="接口配置" :bordered="false" style="margin-top: 16px;">
        <n-form-item label="基础路径" path="basepath">
          <n-input v-model:value="formData.basepath" placeholder="/api" />
        </n-form-item>
        <n-form-item label="Tag 键">
          <n-input v-model:value="formData.tag" placeholder="tag-key" />
        </n-form-item>
        <n-form-item label="是否开启Mock">
          <n-switch v-model:value="formData.is_mock_open" />
        </n-form-item>
      </n-card>

      <n-card title="权限设置" :bordered="false" style="margin-top: 16px;">
        <n-form-item label="项目类型">
          <n-radio-group v-model:value="formData.project_type">
            <n-radio value="private">私有项目</n-radio>
            <n-radio value="public">公开项目</n-radio>
          </n-radio-group>
        </n-form-item>
        <n-alert type="warning" style="margin-top: 12px;">
          私有项目只有成员可以查看和编辑，公开项目所有人可以查看
        </n-alert>
      </n-card>

      <div style="margin-top: 24px;">
        <n-button type="primary" @click="handleSubmit" :loading="submitting">
          保存修改
        </n-button>
      </div>

      <n-card title="危险操作" :bordered="false" style="margin-top: 16px;" v-if="showDanger">
        <n-alert type="error" style="margin-bottom: 12px;">
          删除项目后不可恢复，请谨慎操作！
        </n-alert>
        <n-popconfirm @positive-click="handleDelete">
          <template #trigger>
            <n-button type="error">删除项目</n-button>
          </template>
          确定要删除此项目吗？
        </n-popconfirm>
      </n-card>
    </n-form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useMessage } from 'naive-ui'
import axios from 'axios'

const props = defineProps({
  projectId: {
    type: Number,
    required: true
  }
})

const router = useRouter()
const route = useRoute()
const message = useMessage()

const formRef = ref(null)
const submitting = ref(false)
const showDanger = ref(false)
const groupOptions = ref([])

const formData = reactive({
  name: '',
  desc: '',
  group_id: null,
  icon: '',
  color: '',
  basepath: '',
  tag: '',
  is_mock_open: false,
  project_type: 'private'
})

const loadProject = async () => {
  try {
    const res = await axios.get(`/api/project/get?id=${props.projectId}`)
    if (res.data.errcode === 0) {
      Object.assign(formData, res.data.data)
    }
  } catch (error) {
    message.error('加载项目失败')
  }
}

const loadGroups = async () => {
  try {
    const res = await axios.get('/api/group/list')
    if (res.data.errcode === 0) {
      groupOptions.value = res.data.data.map(g => ({
        label: g.group_name,
        value: g._id
      }))
    }
  } catch (error) {
    console.error('加载分组列表失败:', error)
  }
}

const handleSubmit = async () => {
  try {
    submitting.value = true
    const res = await axios.post(`/api/project/up?id=${props.projectId}`, formData)
    if (res.data.errcode === 0) {
      message.success('保存成功')
    } else {
      message.error(res.data.errmsg || '保存失败')
    }
  } catch (error) {
    message.error('保存失败')
  } finally {
    submitting.value = false
  }
}

const handleDelete = async () => {
  try {
    const res = await axios.post(`/api/project/del?id=${props.projectId}`)
    if (res.data.errcode === 0) {
      message.success('删除成功')
      router.push('/group')
    }
  } catch (error) {
    message.error('删除失败')
  }
}

onMounted(() => {
  loadProject()
  loadGroups()
})
</script>

<style scoped lang="scss">
.project-message {
  padding: 24px;
  max-width: 900px;
}
</style>
