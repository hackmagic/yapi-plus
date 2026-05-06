<template>
  <div class="follows-page">
    <n-card title="我的关注" :bordered="false">
      <n-spin :show="loading">
        <n-empty
          v-if="followList.length === 0 && !loading"
          description="暂无关注的项目"
          size="large"
        >
          <template #extra>
            <n-button type="primary" @click="$router.push('/group')">去项目组看看</n-button>
          </template>
        </n-empty>

        <div v-else class="follow-grid">
          <div
            v-for="project in followList"
            :key="project._id"
            class="follow-item"
          >
            <div class="project-icon" :style="{ backgroundColor: project.color || '#2395f1' }">
              {{ project.name?.charAt(0)?.toUpperCase() || "P" }}
            </div>
            <div class="project-info">
              <h4>{{ project.name }}</h4>
              <p>{{ project.desc || "暂无描述" }}</p>
              <div class="project-meta">
                <n-tag :type="project.project_type === 'public' ? 'success' : 'default'" size="small">
                  {{ project.project_type === "public" ? "公开" : "私有" }}
                </n-tag>
                <span class="update-time">
                  {{ formatTime(project.up_time) }}
                </span>
              </div>
            </div>
            <div class="project-actions">
              <n-tooltip trigger="hover">
                <template #trigger>
                  <n-button text @click="handleView(project)">
                    <template #icon>
                      <n-icon><EyeOutline /></n-icon>
                    </template>
                  </n-button>
                </template>
                查看项目
              </n-tooltip>
              <n-tooltip trigger="hover">
                <template #trigger>
                  <n-button text @click="handleUnfollow(project)">
                    <template #icon>
                      <n-icon><StarOutline /></n-icon>
                    </template>
                  </n-button>
                </template>
                取消关注
              </n-tooltip>
            </div>
          </div>
        </div>
      </n-spin>
    </n-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useMessage } from "naive-ui";
import axios from "axios";
import { NIcon } from "naive-ui";
import { EyeOutline, StarOutline } from "@vicons/ionicons5";

const router = useRouter();
const message = useMessage();
const loading = ref(false);
const followList = ref([]);

const loadFollows = async () => {
  loading.value = true;
  try {
    const res = await axios.get("/api/follow/list");
    if (res.data.errcode === 0) {
      // 按更新时间排序
      followList.value = (res.data.data || []).sort((a, b) => {
        return (b.up_time || 0) - (a.up_time || 0);
      });
    }
  } catch (error) {
    console.error("加载失败:", error);
    message.error("加载关注列表失败");
  } finally {
    loading.value = false;
  }
};

const handleView = (project) => {
  router.push(`/project/${project._id}`);
};

const handleUnfollow = async (project) => {
  try {
    const res = await axios.post(`/api/follow/add`, {
      project_id: project._id,
      action: "del",
    });
    if (res.data.errcode === 0) {
      message.success("已取消关注");
      // 从列表中移除
      followList.value = followList.value.filter((p) => p._id !== project._id);
    } else {
      message.error(res.data.errmsg || "取消关注失败");
    }
  } catch (error) {
    message.error("取消关注失败");
  }
};

// 格式化时间
const formatTime = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp * 1000);
  const now = new Date();
  const diff = now - date;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "今天";
  if (days === 1) return "昨天";
  if (days < 7) return `${days}天前`;
  return date.toLocaleDateString();
};

onMounted(() => {
  loadFollows();
});
</script>

<style scoped lang="scss">
.follows-page {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.follow-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.follow-item {
  display: flex;
  flex-direction: column;
  padding: 16px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  background: #fff;
  transition: all 0.2s;

  &:hover {
    border-color: #2395f1;
    box-shadow: 0 2px 8px rgba(35, 149, 241, 0.15);
  }
}

.project-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 12px;
}

.project-info {
  flex: 1;

  h4 {
    margin: 0 0 8px;
    font-size: 16px;
    font-weight: 500;
    color: #333;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  p {
    margin: 0 0 12px;
    font-size: 13px;
    color: #999;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.project-meta {
  display: flex;
  align-items: center;
  gap: 8px;

  .update-time {
    font-size: 12px;
    color: #999;
  }
}

.project-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}
</style>
