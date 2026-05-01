<template>
  <div class="postman-component">
    <n-space vertical :size="16">
      <n-form ref="formRef" :model="request" label-placement="left" label-width="100">
        <n-form-item label="请求方法">
          <n-select v-model:value="request.method" :options="methodOptions" />
        </n-form-item>

        <n-form-item label="请求地址">
          <n-input v-model:value="request.url" placeholder="https://api.example.com/endpoint" />
        </n-form-item>

        <n-form-item label="Headers">
          <KeyValueEditor v-model="request.headers" />
        </n-form-item>

        <n-form-item label="Query参数">
          <KeyValueEditor v-model="request.params" />
        </n-form-item>

        <n-form-item label="请求体">
          <n-tabs type="line">
            <n-tab-pane name="none" tab="none">
              <n-text depth="3">此请求没有请求体</n-text>
            </n-tab-pane>
            <n-tab-pane name="raw" tab="raw">
              <n-input
                v-model:value="request.body"
                type="textarea"
                :rows="8"
                placeholder="JSON格式的请求体"
              />
            </n-tab-pane>
          </n-tabs>
        </n-form-item>

        <n-form-item>
          <n-button type="primary" @click="sendRequest" :loading="loading"> 发送请求 </n-button>
        </n-form-item>
      </n-form>

      <n-card v-if="response" title="响应结果">
        <n-descriptions label-placement="left" bordered :column="2">
          <n-descriptions-item label="状态码">
            <n-tag :type="getStatusType(response.status)">
              {{ response.status }}
            </n-tag>
          </n-descriptions-item>
          <n-descriptions-item label="耗时"> {{ response.time }}ms </n-descriptions-item>
        </n-descriptions>

        <n-divider />

        <n-tabs type="line">
          <n-tab-pane name="body" tab="Body">
            <pre class="response-body">{{ formatResponse(response.data) }}</pre>
          </n-tab-pane>
          <n-tab-pane name="headers" tab="Headers">
            <pre class="response-body">{{ formatResponse(response.headers) }}</pre>
          </n-tab-pane>
        </n-tabs>
      </n-card>
    </n-space>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useMessage } from "naive-ui";
import axios from "axios";
import KeyValueEditor from "./KeyValueEditor.vue";

const message = useMessage();
const loading = ref(false);
const response = ref(null);

const request = reactive({
  method: "GET",
  url: "",
  headers: [],
  params: [],
  body: "",
});

const methodOptions = [
  { label: "GET", value: "GET" },
  { label: "POST", value: "POST" },
  { label: "PUT", value: "PUT" },
  { label: "DELETE", value: "DELETE" },
  { label: "PATCH", value: "PATCH" },
];

const getStatusType = (status) => {
  if (status >= 200 && status < 300) return "success";
  if (status >= 400 && status < 500) return "warning";
  if (status >= 500) return "error";
  return "info";
};

const formatResponse = (data) => {
  if (typeof data === "string") return data;
  return JSON.stringify(data, null, 2);
};

const sendRequest = async () => {
  if (!request.url) {
    message.error("请输入请求地址");
    return;
  }

  loading.value = true;
  const startTime = Date.now();

  try {
    const config = {
      method: request.method.toLowerCase(),
      url: request.url,
      params: Object.fromEntries(request.params.filter((p) => p.key).map((p) => [p.key, p.value])),
    };

    if (request.body && request.method !== "GET") {
      config.data = JSON.parse(request.body);
    }

    const res = await axios(config);
    const endTime = Date.now();

    response.value = {
      status: res.status,
      data: res.data,
      headers: res.headers,
      time: endTime - startTime,
    };

    message.success("请求成功");
  } catch (error) {
    const endTime = Date.now();

    response.value = {
      status: error.response?.status || 0,
      data: error.response?.data || error.message,
      headers: error.response?.headers || {},
      time: endTime - startTime,
    };

    message.error("请求失败");
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.postman-component {
  padding: 24px;
}

.response-body {
  background: #f5f5f5;
  padding: 16px;
  border-radius: 4px;
  overflow-x: auto;
  font-family: "Courier New", monospace;
  font-size: 13px;
  max-height: 400px;
}
</style>
