<template>
  <div class="group-log-page">
    <n-card title="操作日志" :bordered="false">
      <n-spin :show="loading">
        <n-empty v-if="logList.length ===  && !loading" description="暂无日志" />
        <n-timeline v-else>
          <n-timeline-item
            v-for="log in logList"
            :key="log._id"
            :title="log.type"
            :time="formatTime(log.add_time)"
          >
            <p>{{ log.content }}</p>
            <p class="log-user">操作人: {{ log.username }}</p>
          </n-timeline-item>
        </n-timeline>
      </n-spin>
    </n-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()

const groupId = computed(() => route.params.id)
const loading = ref(false)
const logList = ref([])

const formatTime = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleString()
}

const loadLogs = async () => {
  loading.value = true
  try {
    const res = await axios.get('/api/log/list', {
      params: { group_id: groupId.value, type: 'group' }
    })
    if (res.data.errcode === 0) {
      logList.value = res.data.data || []
    }
  } catch (e) {
    console.error('加载日志失败', e)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadLogs()
})
</script>

<style scoped lang="scss">
.group-log-page {
  min-height: 400px;

  .log-user {
    font-size: 12px;
    color: #999;
    margin-top: 4px;
  }
}
</style>