<template>
  <div class="project-data">
    <n-card title="数据管理" :bordered="false">
      <n-space vertical>
        <n-alert type="info">
          可以导入导出数据，方便项目迁移和备份
        </n-alert>
        <n-space>
          <n-button type="primary" @click="handleExport">导出数据</n-button>
          <n-button @click="showImportModal = true">导入数据</n-button>
        </n-space>
      </n-space>
    </n-card>

    <n-modal v-model:show="showImportModal" preset="dialog" title="导入数据">
      <n-form>
        <n-form-item label="导入文件">
          <n-upload :max="1" accept=".json" @change="handleFileSelect">
            <n-button>选择文件</n-button>
          </n-upload>
        </n-form-item>
      </n-form>
      <template #action>
        <n-button @click="showImportModal = false">取消</n-button>
        <n-button type="primary" @click="handleImport" :loading="importing">导入</n-button>
      </template>
    </n-modal>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useMessage } from 'naive-ui'
import axios from 'axios'

const props = defineProps({
  projectId: { type: Number, required: true }
})

const message = useMessage()
const showImportModal = ref(false)
const importing = ref(false)
const importFile = ref(null)

const handleExport = async () => {
  try {
    const res = await axios.get(`/api/project/export_data?project_id=${props.projectId}`, {
      responseType: 'blob'
    })
    const url = window.URL.createObjectURL(new Blob([res.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `yapi-project-${props.projectId}.json`)
    document.body.appendChild(link)
    link.click()
    message.success('导出成功')
  } catch (error) {
    message.error('导出失败')
  }
}

const handleFileSelect = ({ file }) => {
  importFile.value = file.file
}

const handleImport = async () => {
  if (!importFile.value) {
    message.error('请选择文件')
    return
  }

  importing.value = true
  try {
    const formData = new FormData()
    formData.append('file', importFile.value)
    formData.append('project_id', props.projectId)

    const res = await axios.post('/api/project/import_data', formData)
    if (res.data.errcode === 0) {
      message.success('导入成功')
      showImportModal.value = false
    }
  } catch (error) {
    message.error('导入失败')
  } finally {
    importing.value = false
  }
}
</script>
