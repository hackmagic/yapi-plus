<template>
  <div class="follows-page">
    <n-card title="我的关注" :bordered="false">
      <n-data-table :columns="columns" :data="followList" :loading="loading" />
    </n-card>
  </div>
</template>

<script setup>
import { ref, h, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();
const loading = ref(false);
const followList = ref([]);

const columns = [
  { title: "项目名称", key: "name" },
  { title: "描述", key: "desc" },
  {
    title: "操作",
    key: "actions",
    render: (row) => h("button", { onClick: () => router.push(`/project/${row._id}`) }, "查看"),
  },
];

const loadFollows = async () => {
  loading.value = true;
  try {
    const res = await axios.get("/api/project/follow_list");
    if (res.data.errcode === 0) followList.value = res.data.data;
  } catch (error) {
    console.error("加载失败:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => loadFollows());
</script>
