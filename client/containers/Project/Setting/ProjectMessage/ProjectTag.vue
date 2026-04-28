<template>
  <div class="project-tag">
    <n-card title="标签管理">
      <n-space vertical>
        <n-space justify="space-between">
          <n-button type="primary" @click="showAddModal = true">
            <template #icon>
              <n-icon><AddOutline /></n-icon>
            </template>
            添加标签
          </n-button>
          <n-button @click="handleSyncTag">同步 Tags</n-button>
        </n-space>

        <n-data-table
          :columns="columns"
          :data="tagList"
          :row-key="row => row._id"
          :pagination="false"
        />
      </n-space>
    </n-card>

    <n-card title="消息通知设置" style="margin-top: 16px;">
      <n-form :model="notifySettings" label-placement="left" label-width="120px">
        <n-form-item label="邮件通知">
          <n-switch v-model:value="notifySettings.email">
            <template #checked>启用</template>
            <template #unchecked>禁用</template>
          </n-switch>
        </n-form-item>
        <n-form-item label="站内消息">
          <n-switch v-model:value="notifySettings.siteMessage">
            <template #checked>启用</template>
            <template #unchecked>禁用</template>
          </n-switch>
        </n-form-item>
        <n-form-item label="Webhook 通知">
          <n-switch v-model:value="notifySettings.webhook">
            <template #checked>启用</template>
            <template #unchecked>禁用</template>
          </n-switch>
        </n-form-item>
        <n-form-item v-if="notifySettings.webhook" label="Webhook URL">
          <n-input v-model:value="notifySettings.webhookUrl" placeholder="https://example.com/webhook" />
        </n-form-item>
        <n-form-item>
          <n-button type="primary" @click="handleSaveNotify" :loading="savingNotify">保存设置</n-button>
        </n-form-item>
      </n-form>
    </n-card>

    <n-modal v-model:show="showAddModal" preset="dialog" title="添加标签">
      <n-form ref="tagFormRef" :model="tagFormData" :rules="tagFormRules">
        <n-form-item label="标签名称" path="name">
          <n-input v-model:value="tagFormData.name" placeholder="请输入标签名称" />
        </n-form-item>
        <n-form-item label="标签描述" path="desc">
          <n-input v-model:value="tagFormData.desc" type="textarea" placeholder="请输入描述" />
        </n-form-item>
      </n-form>
      <template #action>
        <n-button @click="showAddModal = false">取消</n-button>
        <n-button type="primary" @click="handleAddTag">确定</n-button>
      </template>
    </n-modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, h } from 'vue'
import { useMessage, NButton, NIcon, NPopconfirm } from 'naive-ui'
import axios from 'axios'
import { AddOutline } from '@vicons/ionicons5'

const props = defineProps({
  projectId: {
    type: Number,
    required: true
  }
})

const message = useMessage()

const loading = ref(false)
const savingNotify = ref(false)
const showAddModal = ref(false)
const tagList = ref([])

const tagFormData = ref({
  name: '',
  desc: ''
})

const tagFormRules = {
  name: { required: true, message: '请输入标签名称', trigger: 'blur' }
}

const notifySettings = ref({
  email: true,
  siteMessage: true,
  webhook: false,
  webhookUrl: ''
})

const columns = [
  {
    title: '标签名称',
    key: 'name',
    render(row) {
      return h('span', { class: 'item-name' }, row.name)
    }
  },
  {
    title: '描述',
    key: 'desc'
  },
  {
    title: '操作',
    key: 'actions',
    width: 120,
    render(row) {
      return h('div', {}, [
        h(NButton, {
          size: 'small',
          onClick: () => handleEditTag(row)
        }, () => '编辑'),
        h(NPopconfirm, {
          onPositiveClick: () => handleDeleteTag(row)
        }, {
          trigger: () => h(NButton, { size: 'small', type: 'error' }, () => '删除'),
          default: () => '确定删除此标签吗？'
        })
      ])
    }
  }
]

const loadTags = async () => {
  loading.value = true
  try {
    const res = await axios.get(`/api/interface/list_menu?project_id=${props.projectId}`)
    if (res.data.errcode === 0) {
      const tags = new Set()
      res.data.data.forEach(cat => {
        cat.list.forEach(item => {
          if (item.tag) {
            item.tag.forEach(t => {
              tags.add(JSON.stringify({ name: t, desc: '' }))
            })
          }
        })
      })
      tagList.value = Array.from(tags).map(t => JSON.parse(t)).filter(t => t.name)
    }
  } catch (e) {
    message.error('加载标签失败')
  } finally {
    loading.value = false
  }
}

const loadNotifySettings = async () => {
  try {
    const res = await axios.get(`/api/project/get?id=${props.projectId}`)
    if (res.data.errcode === 0) {
      const data = res.data.data
      if (data.notify_settings) {
        notifySettings.value = { ...notifySettings.value, ...data.notify_settings }
      }
    }
  } catch (e) {
    console.error('加载通知设置失败')
  }
}

const handleSyncTag = async () => {
  await loadTags()
  message.success('同步完成')
}

const handleAddTag = async () => {
  if (!tagFormData.value.name) {
    message.warning('请输入标签名称')
    return
  }
  tagList.value.push({ ...tagFormData.value, _id: Date.now() })
  showAddModal.value = false
  tagFormData.value = { name: '', desc: '' }
  await saveTags()
}

const handleEditTag = (row) => {
  tagFormData.value = { name: row.name, desc: row.desc }
  showAddModal.value = true
}

const handleDeleteTag = async (row) => {
  tagList.value = tagList.value.filter(t => t.name !== row.name)
  await saveTags()
  message.success('删除成功')
}

const saveTags = async () => {
  try {
    await axios.post('/api/project/up', {
      id: props.projectId,
      tag: tagList.value.map(t => t.name)
    })
  } catch (e) {
    message.error('保存失败')
  }
}

const handleSaveNotify = async () => {
  savingNotify.value = true
  try {
    const res = await axios.post('/api/project/up', {
      id: props.projectId,
      notify_settings: notifySettings.value
    })
    if (res.data.errcode === 0) {
      message.success('保存成功')
    }
  } catch (e) {
    message.error('保存失败')
  } finally {
    savingNotify.value = false
  }
}

onMounted(() => {
  loadTags()
  loadNotifySettings()
})
</script>

<style scoped lang="scss">
.project-tag {
  padding: 16px;

  .tag-item {
    margin-bottom: 8px;
  }
}
</style>