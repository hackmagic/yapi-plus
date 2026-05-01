<template>
  <div class="user-detail">
    <n-card>
      <template #header>
        <n-space justify="space-between" align="center">
          <span>用户详情</span>
          <n-button @click="$router.back()">返回</n-button>
        </n-space>
      </template>

      <n-descriptions label-placement="left" bordered :column="2">
        <n-descriptions-item label="用户名">
          {{ userInfo.username }}
        </n-descriptions-item>
        <n-descriptions-item label="邮箱">
          {{ userInfo.email }}
        </n-descriptions-item>
        <n-descriptions-item label="角色">
          <n-tag :type="userInfo.role === 'admin' ? 'error' : 'info'">
            {{ userInfo.role === "admin" ? "管理员" : "成员" }}
          </n-tag>
        </n-descriptions-item>
        <n-descriptions-item label="注册时间">
          {{ formatDate(userInfo.add_time) }}
        </n-descriptions-item>
        <n-descriptions-item label="最后登录">
          {{ formatDate(userInfo.last_login) }}
        </n-descriptions-item>
        <n-descriptions-item label="项目数">
          {{ userInfo.project_count || 0 }}
        </n-descriptions-item>
      </n-descriptions>
    </n-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useMessage } from "naive-ui";
import axios from "axios";

const route = useRoute();
const message = useMessage();
const userInfo = ref({});

const formatDate = (timestamp) => {
  if (!timestamp) return "-";
  return new Date(timestamp).toLocaleString();
};

const fetchUserInfo = async () => {
  try {
    const res = await axios.get(`/api/user/info?id=${route.params.id}`);
    if (res.data.errcode === 0) {
      userInfo.value = res.data.data;
    } else {
      message.error(res.data.errmsg || "获取用户信息失败");
    }
  } catch (error) {
    message.error("获取用户信息失败");
  }
};

onMounted(() => {
  fetchUserInfo();
});
</script>

<style scoped>
.user-detail {
  padding: 24px;
}
</style>
