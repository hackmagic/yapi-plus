<template>
  <div class="interface-run">
    <div class="run-header">
      <n-space>
        <n-button type="primary" @click="handleSend" :loading="sending">
          <template #icon>
            <n-icon><PaperPlaneOutline /></n-icon>
          </template>
          发送
        </n-button>
        <n-button @click="handleSaveAsCase" :disabled="!interfaceData">
          <template #icon>
            <n-icon><SaveOutline /></n-icon>
          </template>
          保存为用例
        </n-button>
      </n-space>
    </div>

    <n-spin :show="loading">
      <n-grid :cols="2" :x-gap="16" :y-gap="16">
        <n-gi>
          <n-card title="请求信息">
            <n-form ref="requestFormRef" :model="requestData" label-placement="top">
              <n-form-item label="请求方法">
                <n-select
                  v-model:value="requestData.method"
                  :options="methodOptions"
                  @update:value="handleMethodChange"
                />
              </n-form-item>
              <n-form-item label="请求地址">
                <n-input v-model:value="requestData.url" placeholder="请输入请求地址" />
              </n-form-item>

              <n-tabs type="line" animated v-model:value="activeTab">
                <n-tab-pane name="params" tab="Query Params">
                  <n-data-table
                    :data="requestData.params"
                    :columns="paramColumns"
                    :pagination="{ pageSize: 5 }"
                    size="small"
                  />
                </n-tab-pane>
                <n-tab-pane name="headers" tab="Headers">
                  <n-data-table
                    :data="requestData.headers"
                    :columns="paramColumns"
                    :pagination="{ pageSize: 5 }"
                    size="small"
                  />
                </n-tab-pane>
                <n-tab-pane name="body" tab="Body">
                  <n-form-item label="Body Type">
                    <n-radio-group v-model:value="requestData.bodyType">
                      <n-radio value="none">none</n-radio>
                      <n-radio value="form">form</n-radio>
                      <n-radio value="json">json</n-radio>
                      <n-radio value="raw">raw</n-radio>
                    </n-radio-group>
                  </n-form-item>
                  <n-form-item v-if="requestData.bodyType === 'json'" label="JSON">
                    <n-input
                      v-model:value="requestData.body"
                      type="textarea"
                      :rows="6"
                      placeholder='{"key": "value"}'
                    />
                  </n-form-item>
                  <n-form-item v-else-if="requestData.bodyType === 'form'" label="Form Data">
                    <n-data-table
                      :data="requestData.bodyForm"
                      :columns="paramColumns"
                      :pagination="{ pageSize: 5 }"
                      size="small"
                    />
                  </n-form-item>
                  <n-form-item v-else-if="requestData.bodyType === 'raw'" label="Raw">
                    <n-input v-model:value="requestData.body" type="textarea" :rows="6" />
                  </n-form-item>
                </n-tab-pane>
              </n-tabs>
            </n-form>
          </n-card>
        </n-gi>

        <n-gi>
          <n-card title="响应信息">
            <template #header-extra>
              <n-space v-if="responseData">
                <n-tag :type="statusTagType"
                  >{{ responseData.status }} {{ responseData.statusText }}</n-tag
                >
                <n-tag>{{ responseData.time }} ms</n-tag>
              </n-space>
            </template>

            <n-tabs type="line" animated v-model:value="responseTab">
              <n-tab-pane name="body" tab="Response Body">
                <n-input
                  :value="formattedResponseBody"
                  type="textarea"
                  :rows="12"
                  readonly
                  style="font-family: monospace"
                />
              </n-tab-pane>
              <n-tab-pane name="headers" tab="Response Headers">
                <n-descriptions :column="1" label-placement="left" v-if="responseData">
                  <n-descriptions-item
                    v-for="(value, key) in responseData.headers"
                    :key="key"
                    :label="key"
                  >
                    {{ value }}
                  </n-descriptions-item>
                </n-descriptions>
                <n-empty v-else description="暂无响应" />
              </n-tab-pane>
            </n-tabs>
          </n-card>
        </n-gi>
      </n-grid>
    </n-spin>

    <!-- 保存为用例弹窗 -->
    <n-modal v-model:show="showSaveModal" preset="dialog" title="保存为测试用例">
      <n-form ref="saveFormRef" :model="saveFormData" :rules="saveFormRules" label-placement="top">
        <n-form-item label="用例名称" path="casename">
          <n-input v-model:value="saveFormData.casename" placeholder="请输入用例名称" />
        </n-form-item>
        <n-form-item label="选择集合" path="colId">
          <n-select
            v-model:value="saveFormData.colId"
            :options="colOptions"
            placeholder="请选择集合"
          />
        </n-form-item>
      </n-form>
      <template #action>
        <n-button @click="showSaveModal = false">取消</n-button>
        <n-button type="primary" @click="handleConfirmSave" :loading="saving">保存</n-button>
      </template>
    </n-modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useMessage, NTag, NButton, NIcon, NEmpty } from "naive-ui";
import axios from "axios";
import { PaperPlaneOutline, SaveOutline } from "@vicons/ionicons5";
import { useInterfaceColStore } from "@/store/interfaceCol";

const route = useRoute();
const router = useRouter();
const message = useMessage();
const interfaceColStore = useInterfaceColStore();

const loading = ref(false);
const sending = ref(false);
const saving = ref(false);
const showSaveModal = ref(false);
const activeTab = ref("params");
const responseTab = ref("body");
const interfaceData = ref(null);
const responseData = ref(null);

const methodOptions = [
  { label: "GET", value: "GET" },
  { label: "POST", value: "POST" },
  { label: "PUT", value: "PUT" },
  { label: "DELETE", value: "DELETE" },
  { label: "PATCH", value: "PATCH" },
];

const requestData = ref({
  method: "GET",
  url: "",
  params: [],
  headers: [],
  bodyType: "none",
  body: "",
  bodyForm: [],
});

const saveFormData = ref({
  casename: "",
  colId: null,
});

const saveFormRules = {
  casename: { required: true, message: "请输入用例名称", trigger: "blur" },
  colId: { required: true, message: "请选择集合", trigger: "change", type: "number" },
};

const colOptions = computed(() => {
  return interfaceColStore.colList.map((col) => ({
    label: col.name,
    value: col._id,
  }));
});

const paramColumns = [
  { title: "名称", key: "name", editable: true },
  { title: "值", key: "value", editable: true },
  { title: "备注", key: "desc", editable: true },
];

const statusTagType = computed(() => {
  if (!responseData.value) return "info";
  const status = responseData.value.status;
  if (status >= 200 && status < 300) return "success";
  if (status >= 400 && status < 500) return "warning";
  if (status >= 500) return "error";
  return "info";
});

const formattedResponseBody = computed(() => {
  if (!responseData.value) return "";
  const body = responseData.value.body;
  if (typeof body === "object") {
    return JSON.stringify(body, null, 2);
  }
  try {
    const parsed = JSON.parse(body);
    return JSON.stringify(parsed, null, 2);
  } catch {
    return body;
  }
});

const handleMethodChange = () => {
  // 方法变更处理
};

const loadInterfaceData = async () => {
  const interfaceId = route.params.actionId;
  if (!interfaceId) return;

  loading.value = true;
  try {
    const res = await axios.get(`/api/interface/get?id=${interfaceId}`);
    if (res.data.errcode === 0) {
      interfaceData.value = res.data.data;
      initRequestData(res.data.data);
    }
  } catch (e) {
    message.error("加载接口数据失败");
  } finally {
    loading.value = false;
  }
};

const initRequestData = (data) => {
  const basePath = data.path.startsWith("/") ? data.path : `/${data.path}`;
  requestData.value = {
    method: data.method || "GET",
    url: basePath,
    params: data.req_query || [],
    headers: data.req_headers || [],
    bodyType: data.req_body_type || "none",
    body: data.req_body_other || "",
    bodyForm: data.req_body_form || [],
  };
};

const handleSend = async () => {
  sending.value = true;
  responseData.value = null;

  try {
    const params = buildRequestParams();
    const startTime = Date.now();

    const res = await axios({
      method: requestData.value.method.toLowerCase(),
      url: requestData.value.url,
      params: params.query,
      headers: params.headers,
      data: params.body,
      validateStatus: () => true,
    });

    const endTime = Date.now();
    responseData.value = {
      status: res.status,
      statusText: res.statusText,
      headers: res.headers,
      body: res.data,
      time: endTime - startTime,
    };

    activeTab.value = "params";
    responseTab.value = "body";
  } catch (e) {
    message.error("请求失败: " + e.message);
  } finally {
    sending.value = false;
  }
};

const buildRequestParams = () => {
  const query = {};
  const headers = {};
  let body = null;

  requestData.value.params.forEach((item) => {
    if (item.name && item.value) {
      query[item.name] = item.value;
    }
  });

  requestData.value.headers.forEach((item) => {
    if (item.name && item.value) {
      headers[item.name] = item.value;
    }
  });

  if (requestData.value.bodyType === "json" && requestData.value.body) {
    try {
      body = JSON.parse(requestData.value.body);
    } catch {
      body = requestData.value.body;
    }
  } else if (requestData.value.bodyType === "raw") {
    body = requestData.value.body;
  } else if (requestData.value.bodyType === "form") {
    const formData = new FormData();
    requestData.value.bodyForm.forEach((item) => {
      if (item.name && item.value) {
        formData.append(item.name, item.value);
      }
    });
    body = formData;
  }

  return { query, headers, body };
};

const handleSaveAsCase = () => {
  if (!interfaceData.value) return;
  saveFormData.value.casename = interfaceData.value.title;
  showSaveModal.value = true;
};

const handleConfirmSave = async () => {
  if (!saveFormData.value.colId) {
    message.warning("请选择集合");
    return;
  }

  saving.value = true;
  try {
    await interfaceColStore.addCase(saveFormData.value.colId, {
      casename: saveFormData.value.casename,
      interface_id: interfaceData.value._id,
    });
    message.success("保存成功");
    showSaveModal.value = false;
  } catch (e) {
    message.error(e.message || "保存失败");
  } finally {
    saving.value = false;
  }
};

onMounted(() => {
  loadInterfaceData();
  interfaceColStore.fetchColList(route.params.id);
});
</script>

<style scoped lang="scss">
.interface-run {
  padding: 16px;

  .run-header {
    margin-bottom: 16px;
  }
}
</style>
