<template>
  <div class="activity-page">
    <n-card title="项目动态" :bordered="false">
      <n-spin :show="loading">
        <n-empty v-if="activityList.length === 0 && !loading" description="暂无动态" />
        <n-timeline v-else>
          <n-timeline-item
            v-for="activity in activityList"
            :key="activity._id"
            :type="getActivityType(activity.type)"
            :title="getActivityTitle(activity.type)"
            :time="formatTime(activity.add_time)"
          >
            <p>{{ activity.content }}</p>
            <p class="activity-user">操作人: {{ activity.username }}</p>
          </n-timeline-item>
        </n-timeline>
      </n-spin>
    </n-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

const route = useRoute();

const projectId = computed(() => route.params.id);
const loading = ref(false);
const activityList = ref([]);

const formatTime = (timestamp) => {
  if (!timestamp) return "";
  return new Date(timestamp * 1000).toLocaleString();
};

const getActivityType = (type) => {
  const typeMap = {
    add: "success",
    update: "info",
    delete: "error",
    create: "success",
    edit: "info",
  };
  return typeMap[type] || "default";
};

const getActivityTitle = (type) => {
  const titleMap = {
    add: "新增",
    update: "更新",
    delete: "删除",
    create: "创建",
    edit: "编辑",
  };
  return titleMap[type] || "操作";
};

const loadActivities = async () => {
  loading.value = true;
  try {
    const res = await axios.get("/api/project/activity", {
      params: { project_id: projectId.value },
    });
    if (res.data.errcode === 0) {
      activityList.value = res.data.data || [];
    }
  } catch (e) {
    console.error("加载动态失败", e);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadActivities();
});
</script>

<style scoped lang="scss">
.activity-page {
  min-height: 400px;

  .activity-user {
    font-size: 12px;
    color: #999;
    margin-top: 4px;
  }
}
</style>
