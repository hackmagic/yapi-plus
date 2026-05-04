<template>
  <div class="interface-edit">
    <n-card :title="isEdit ? '编辑接口' : '添加接口'">
      <n-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-placement="left"
        label-width="120"
      >
        <n-form-item label="接口名称" path="title">
          <n-input v-model:value="formData.title" placeholder="请输入接口名称" />
        </n-form-item>

        <n-form-item label="接口路径" path="path">
          <n-input v-model:value="formData.path" placeholder="/api/example" />
        </n-form-item>

        <n-form-item label="请求方法" path="method">
          <n-select v-model:value="formData.method" :options="methodOptions" />
        </n-form-item>

        <n-form-item label="接口描述" path="desc">
          <n-input v-model:value="formData.desc" type="textarea" :rows="3" placeholder="接口描述" />
        </n-form-item>

        <n-form-item label="请求参数">
          <n-tabs type="line">
            <n-tab-pane name="query" tab="Query参数">
              <ParamTable v-model="formData.query_params" />
            </n-tab-pane>
            <n-tab-pane name="body" tab="Body参数">
              <ParamTable v-model="formData.body_params" />
            </n-tab-pane>
            <n-tab-pane name="header" tab="Headers">
              <ParamTable v-model="formData.headers" />
            </n-tab-pane>
          </n-tabs>
        </n-form-item>

        <n-form-item label="响应数据">
          <n-input
            v-model:value="formData.response"
            type="textarea"
            :rows="10"
            placeholder="JSON格式的响应数据"
          />
        </n-form-item>

        <n-form-item>
          <n-space>
            <n-button type="primary" @click="handleSave" :loading="loading"> 保存 </n-button>
            <n-button @click="$router.back()">取消</n-button>
          </n-space>
        </n-form-item>
      </n-form>
    </n-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useMessage } from "naive-ui";
import http from "@/services/http";
import ParamTable from "../../../components/ParamTable/ParamTable.vue";

const route = useRoute();
const router = useRouter();
const message = useMessage();

const formRef = ref(null);
const loading = ref(false);

const isEdit = computed(() => !!route.params.id);

const formData = reactive({
  title: "",
  path: "",
  method: "GET",
  desc: "",
  query_params: [],
  body_params: [],
  headers: [],
  response: "",
});

const rules = {
  title: { required: true, message: "请输入接口名称", trigger: "blur" },
  path: { required: true, message: "请输入接口路径", trigger: "blur" },
  method: { required: true, message: "请选择请求方法", trigger: "change" },
};

const methodOptions = [
  { label: "GET", value: "GET" },
  { label: "POST", value: "POST" },
  { label: "PUT", value: "PUT" },
  { label: "DELETE", value: "DELETE" },
  { label: "PATCH", value: "PATCH" },
];

const handleSave = async () => {
  const valid = await formRef.value?.validate();
  if (!valid) return;

  loading.value = true;
  try {
    const url = isEdit.value ? `/api/interface/up?id=${route.params.id}` : "/api/interface/add";

    const res = await http.post(url, {
      ...formData,
      project_id: route.params.id,
    });

    if (res.data.errcode === 0) {
      message.success("保存成功");
      router.back();
    } else {
      message.error(res.data.errmsg || "保存失败");
    }
  } catch (error) {
    message.error("保存失败");
  } finally {
    loading.value = false;
  }
};

const fetchInterface = async () => {
  if (!isEdit.value) return;

  try {
    // 使用 actionId 而非 id，因为路由是 /project/:id/interface/api/:actionId
    const interfaceId = route.params.actionId || route.params.id;
    const res = await http.get(`/api/interface/get?id=${interfaceId}`);
    if (res.data.errcode === 0) {
      const data = res.data.data;
      Object.assign(formData, data);
    }
  } catch (error) {
    message.error("获取接口信息失败");
  }
};

onMounted(() => {
  fetchInterface();
});
</script>

<style scoped>
.interface-edit {
  padding: 24px;
}
</style>
