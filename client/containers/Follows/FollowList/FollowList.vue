<template>
  <div class="follows-page">
    <n-card title="我的关注">
      <n-list v-if="follows.length > 0">
        <n-list-item v-for="item in follows" :key="item._id">
          <template #prefix>
            <n-avatar :style="{ backgroundColor: '#2080f0' }">
              {{ item.name?.charAt(0)?.toUpperCase() }}
            </n-avatar>
          </template>
          <n-space vertical>
            <n-text strong>
              <router-link :to="item.link">{{ item.name }}</router-link>
            </n-text>
            <n-text depth="3">{{ item.desc }}</n-text>
            <n-text depth="3" style="font-size: 12px">
              更新于 {{ formatDate(item.up_time) }}
            </n-text>
          </n-space>
          <template #suffix>
            <n-button text type="error" @click="handleUnfollow(item)"> 取消关注 </n-button>
          </template>
        </n-list-item>
      </n-list>
      <n-empty v-else description="暂无关注内容" />
    </n-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useMessage } from "naive-ui";
import axios from "axios";

const message = useMessage();
const follows = ref([]);

const formatDate = (timestamp) => {
  if (!timestamp) return "-";
  return new Date(timestamp).toLocaleString();
};

const fetchFollows = async () => {
  try {
    const res = await axios.get("/api/follow/list");
    if (res.data.errcode === 0) {
      follows.value = res.data.data.list;
    }
  } catch (error) {
    message.error("获取关注列表失败");
  }
};

const handleUnfollow = async (item) => {
  try {
    const res = await axios.delete(`/api/follow/del?id=${item._id}`);
    if (res.data.errcode === 0) {
      message.success("取消关注成功");
      fetchFollows();
    } else {
      message.error(res.data.errmsg || "取消关注失败");
    }
  } catch (error) {
    message.error("取消关注失败");
  }
};

onMounted(() => {
  fetchFollows();
});
</script>

<style scoped>
.follows-page {
  padding: 24px;
}
</style>
