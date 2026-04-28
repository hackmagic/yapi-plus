<template>
  <div class="env-setting">
    <n-layout has-sider style="min-height: 500px;">
      <n-layout-sider bordered :width="200">
        <div style="padding: 12px;">
          <n-button type="primary" @click="addEnv" style="width: 100%; margin-bottom: 12px;">
            <template #icon>
              <n-icon><AddOutline /></n-icon>
            </template>
            添加环境
          </n-button>
          <n-list hoverable clickable>
            <n-list-item
              v-for="(env, index) in envList"
              :key="index"
              :class="{ 'is-active': currentIndex === index }"
              @click="selectEnv(index)"
              style="cursor: pointer;"
            >
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <n-ellipsis style="max-width: 120px;">
                  {{ env.name || `环境${index + 1}` }}
                </n-ellipsis>
                <n-popconfirm @positive-click.stop="deleteEnv(index)">
                  <template #trigger>
                    <n-button text size="small" type="error" @click.stop>
                      <template #icon>
                        <n-icon><TrashOutline /></n-icon>
                      </template>
                    </n-button>
                  </template>
                  确定删除此环境吗？
                </n-popconfirm>
              </div>
            </n-list-item>
          </n-list>
        </div>
      </n-layout-sider>

      <n-layout-content style="padding: 24px;">
        <div v-if="currentEnv">
          <n-form :model="currentEnv" label-placement="left" label-width="100px">
            <n-form-item label="环境名称">
              <n-input v-model:value="currentEnv.name" placeholder="开发环境、生产环境" />
            </n-form-item>
            <n-form-item label="域名">
              <n-input v-model:value="currentEnv.domain" placeholder="http://api.example.com" />
            </n-form-item>
            <n-form-item label="全局Header">
              <KeyValueEditor v-model="currentEnv.header" />
            </n-form-item>
            <n-form-item>
              <n-button type="primary" @click="saveEnv" :loading="saving">保存配置</n-button>
            </n-form-item>
          </n-form>
        </div>
        <n-empty v-else description="请选择或添加环境" />
      </n-layout-content>
    </n-layout>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useMessage } from 'naive-ui'
import { AddOutline, TrashOutline } from '@vicons/ionicons5'
import axios from 'axios'
import KeyValueEditor from '../../../components/Postman/KeyValueEditor.vue'

const props = defineProps({
  projectId: {
    type: String,
    required: true
  }
})

const message = useMessage()
const envList = ref([])
const currentIndex = ref(0)
const saving = ref(false)

const currentEnv = computed(() => {
  return envList.value[currentIndex.value] || null
})

const fetchEnv = async () => {
  try {
    const res = await axios.get(`/api/project/get?id=${props.projectId}`)
    if (res.data.errcode === 0) {
      envList.value = res.data.data.env || []
      if (envList.value.length > 0 && currentIndex.value >= envList.value.length) {
        currentIndex.value = 0
      }
    }
  } catch (error) {
    message.error('加载环境配置失败')
  }
}

const addEnv = () => {
  envList.value.push({
    name: '新环境',
    domain: '',
    header: []
  })
  currentIndex.value = envList.value.length - 1
}

const selectEnv = (index) => {
  currentIndex.value = index
}

const deleteEnv = (index) => {
  envList.value.splice(index, 1)
  if (currentIndex.value >= envList.value.length) {
    currentIndex.value = Math.max(0, envList.value.length - 1)
  }
}

const saveEnv = async () => {
  saving.value = true
  try {
    const res = await axios.post('/api/project/up_env', {
      id: props.projectId,
      env: envList.value
    })
    if (res.data.errcode === 0) {
      message.success('保存成功')
      fetchEnv()
    } else {
      message.error(res.data.errmsg || '保存失败')
    }
  } catch (error) {
    message.error('保存失败')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  fetchEnv()
})
</script>

<style scoped>
.is-active {
  background-color: var(--n-item-color-hover);
}
</style>
