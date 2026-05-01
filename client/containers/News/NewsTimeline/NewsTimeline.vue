<template>
  <div class="news-timeline">
    <n-timeline>
      <n-timeline-item
        v-for="news in newsList"
        :key="news._id"
        :type="getNewsType(news.type)"
        :title="news.title"
        :time="formatTime(news.add_time)"
      >
        <n-card :bordered="false" size="small">
          <p>{{ news.content }}</p>
        </n-card>
      </n-timeline-item>
    </n-timeline>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const newsList = ref([]);

const getNewsType = (type) => {
  const typeMap = { project: "info", interface: "success", user: "warning" };
  return typeMap[type] || "default";
};

const formatTime = (time) => {
  return new Date(time).toLocaleString("zh-CN");
};

const loadNews = async () => {
  try {
    const res = await axios.get("/api/log/list");
    if (res.data.errcode === 0) newsList.value = res.data.data;
  } catch (error) {
    console.error("加载失败:", error);
  }
};

onMounted(() => loadNews());
</script>
