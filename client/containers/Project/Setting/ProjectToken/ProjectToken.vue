<template>
  <div class="project-token">
    <n-card title="Token 管理" :bordered="false">
      <n-alert type="info" style="margin-bottom: 16px">
        Token 用于 API 访问权限控制，请妥善保管
      </n-alert>
      <n-data-table :columns="columns" :data="tokenList" :loading="loading" />
    </n-card>
  </div>
</template>

<script setup>
import { ref, h, onMounted } from "vue";
import { useMessage, NButton, NPopconfirm, NInput } from "naive-ui";
import axios from "axios";

const props = defineProps({
  projectId: { type: Number, required: true },
});

const message = useMessage();
const loading = ref(false);
const tokenList = ref([]);

const columns = [
  { title: "Token", key: "token" },
  { title: "备注", key: "remark" },
  {
    title: "操作",
    key: "actions",
    render: () =>
      h(NButton, { text: true, type: "warning", onClick: () => deleteToken() }, "重新生成"),
  },
];

const loadTokens = async () => {
  loading.value = true;
  try {
    const res = await axios.get(`/api/project/token?project_id=${props.projectId}`);
    if (res.data.errcode === 0) tokenList.value = res.data.data;
  } catch (error) {
    message.error("加载失败");
  } finally {
    loading.value = false;
  }
};

const deleteToken = async (id) => {
  try {
    await axios.get(`/api/project/update_token?project_id=${props.projectId}`);
    message.success("删除成功");
    loadTokens();
  } catch (error) {
    message.error("删除失败");
  }
};

onMounted(() => loadTokens());
</script>
