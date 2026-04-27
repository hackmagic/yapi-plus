<template>
  <div class="interface-detail">
    <n-card :title="interfaceData.title">
      <n-tabs type="line">
        <n-tab-pane name="basic" tab="基本信息">
          <n-descriptions label-placement="left" bordered :column="2">
            <n-descriptions-item label="接口路径">
              {{ interfaceData.path }}
            </n-descriptions-item>
            <n-descriptions-item label="请求方法">
              <n-tag :type="methodTypeMap[interfaceData.method]">
                {{ interfaceData.method }}
              </n-tag>
            </n-descriptions-item>
            <n-descriptions-item label="状态">
              <n-tag :type="interfaceData.status === 'done' ? 'success' : 'warning'">
                {{ interfaceData.status === 'done' ? '已完成' : '未完成' }}
              </n-tag>
            </n-descriptions-item>
            <n-descriptions-item label="创建时间">
              {{ formatDate(interfaceData.add_time) }}
            </n-descriptions-item>
          </n-descriptions>
          
          <n-divider />
          
          <n-space vertical>
            <n-text strong>接口描述：</n-text>
            <n-text>{{ interfaceData.desc || '暂无描述' }}</n-text>
          </n-space>
        </n-tab-pane>
        
        <n-tab-pane name="request" tab="请求参数">
          <n-tabs type="line">
            <n-tab-pane name="query" tab="Query">
              <SchemaTable :schema="interfaceData.req_query" />
            </n-tab-pane>
            <n-tab-pane name="body" tab="Body">
              <SchemaTable :schema="interfaceData.req_body" />
            </n-tab-pane>
            <n-tab-pane name="headers" tab="Headers">
              <SchemaTable :schema="interfaceData.req_headers" />
            </n-tab-pane>
          </n-tabs>
        </n-tab-pane>
        
        <n-tab-pane name="response" tab="响应数据">
          <SchemaTable :schema="interfaceData.res_body" />
        </n-tab-pane>
        
        <n-tab-pane name="mock" tab="Mock">
          <MockDoc :interface-id="interfaceData._id" />
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useMessage } from 'naive-ui'
import axios from 'axios'
import SchemaTable from '../../../components/SchemaTable/SchemaTable.vue'
import MockDoc from '../../../components/MockDoc/MockDoc.vue'

const route = useRoute()
const message = useMessage()
const interfaceData = ref({})

const methodTypeMap = {
  GET: 'success',
  POST: 'primary',
  PUT: 'warning',
  DELETE: 'error'
}

const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleString()
}

const fetchInterface = async () => {
  try {
    const res = await axios.get(`/api/interface/get?id=${route.params.id}`)
    if (res.data.errcode === 0) {
      interfaceData.value = res.data.data
    } else {
      message.error(res.data.errmsg || '获取接口信息失败')
    }
  } catch (error) {
    message.error('获取接口信息失败')
  }
}

onMounted(() => {
  fetchInterface()
})
</script>

<style scoped>
.interface-detail {
  padding: 24px;
}
</style>
