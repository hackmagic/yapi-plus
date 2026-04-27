<template>
  <div class="notify-page">
    <n-card title="消息通知">
      <n-tabs type="line">
        <n-tab-pane name="system" tab="系统通知">
          <n-list v-if="systemNotices.length > 0">
            <n-list-item v-for="notice in systemNotices" :key="notice._id">
              <n-space vertical>
                <n-text strong>{{ notice.title }}</n-text>
                <n-text depth="3">{{ notice.content }}</n-text>
                <n-text depth="3" style="font-size: 12px;">
                  {{ formatDate(notice.add_time) }}
                </n-text>
              </n-space>
            </n-list-item>
          </n-list>
          <n-empty v-else description="暂无系统通知" />
        </n-tab-pane>
        
        <n-tab-pane name="project" tab="项目动态">
          <n-timeline v-if="projectActivities.length > 0">
            <n-timeline-item
              v-for="activity in projectActivities"
              :key="activity._id"
              :type="activity.type"
              :title="activity.title"
              :content="activity.content"
              :time="formatDate(activity.add_time)"
            />
          </n-timeline>
          <n-empty v-else description="暂无项目动态" />
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useMessage } from 'naive-ui'
import axios from 'axios'

const message = useMessage()

const systemNotices = ref([])
const projectActivities = ref([])

const formatDate = (timestamp) => {
  if (!timestamp) return '-'
  return new Date(timestamp).toLocaleString()
}

const fetchNotices = async () => {
  try {
    const res = await axios.get('/api/notice/list')
    if (res.data.errcode === 0) {
      systemNotices.value = res.data.data.list
    }
  } catch (error) {
    message.error('获取系统通知失败')
  }
}

const fetchActivities = async () => {
  try {
    const res = await axios.get('/api/log/list')
    if (res.data.errcode === 0) {
      projectActivities.value = res.data.data.list
    }
  } catch (error) {
    message.error('获取项目动态失败')
  }
}

onMounted(() => {
  fetchNotices()
  fetchActivities()
})
</script>

<style scoped>
.notify-page {
  padding: 24px;
}
</style>
