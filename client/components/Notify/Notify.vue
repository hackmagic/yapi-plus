<template>
  <div class="notify-wrapper">
    <n-popover trigger="click" placement="bottom-end" :width="320">
      <template #trigger>
        <n-badge :value="unreadCount" :max="99" :show="unreadCount > 0">
          <n-button text>
            <template #icon>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path
                  d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"
                />
              </svg>
            </template>
          </n-button>
        </n-badge>
      </template>

      <div class="notify-panel">
        <div class="panel-header">
          <span class="title">通知中心</span>
          <n-button text size="small" @click="handleMarkAllRead" v-if="noticeList.length > 0">
            全部已读
          </n-button>
        </div>

        <n-spin :show="loading">
          <div class="notice-list" v-if="noticeList.length > 0">
            <div
              v-for="item in noticeList"
              :key="item._id"
              :class="['notice-item', { unread: !item.read }]"
              @click="handleClickNotice(item)"
            >
              <div class="notice-content">
                <div class="notice-title" v-html="item.content"></div>
                <div class="notice-time">{{ formatTime(item.add_time) }}</div>
              </div>
              <n-badge v-if="!item.read" dot />
            </div>
          </div>
          <n-empty v-else description="暂无通知" :show-icon="false" />
        </n-spin>

        <div class="panel-footer">
          <n-button text size="small" @click="handleViewAll"> 查看全部 > </n-button>
        </div>
      </div>
    </n-popover>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useMessage } from "naive-ui";
import axios from "axios";

const router = useRouter();
const message = useMessage();

const loading = ref(false);
const unreadCount = ref(0);
const noticeList = ref([]);

const fetchUnreadCount = async () => {
  try {
    const res = await axios.get("/api/log/unread_count");
    if (res.data.errcode === 0) {
      unreadCount.value = res.data.data.count;
    }
  } catch (error) {
    console.error("获取未读通知数量失败", error);
  }
};

const loadNoticeList = async () => {
  loading.value = true;
  try {
    const res = await axios.get("/api/log/list", { params: { limit: 20 } });
    if (res.data.errcode === 0) {
      noticeList.value = res.data.data || [];
    }
  } catch (e) {
    console.error("加载通知列表失败", e);
  } finally {
    loading.value = false;
  }
};

const formatTime = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp * 1000);
  const now = new Date();
  const diff = now - date;

  if (diff < 60000) return "刚刚";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`;
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}天前`;

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};

const handleClickNotice = async (item) => {
  if (!item.read) {
    try {
      await axios.post("/api/log/read", { id: item._id });
      item.read = true;
      unreadCount.value = Math.max(0, unreadCount.value - 1);
    } catch (e) {
      console.error("标记已读失败", e);
    }
  }
};

const handleMarkAllRead = async () => {
  try {
    await axios.post("/api/log/read_all");
    unreadCount.value = 0;
    noticeList.value.forEach((item) => {
      item.read = true;
    });
    message.success("已全部标记为已读");
  } catch (e) {
    message.error("操作失败");
  }
};

const handleViewAll = () => {
  router.push("/follows");
};

onMounted(() => {
  fetchUnreadCount();
  loadNoticeList();
});
</script>

<style scoped lang="scss">
.notify-wrapper {
  display: inline-flex;
}

.notify-panel {
  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    border-bottom: 1px solid #f0f0f0;

    .title {
      font-weight: 500;
      font-size: 14px;
    }
  }

  .notice-list {
    max-height: 400px;
    overflow-y: auto;

    .notice-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px;
      cursor: pointer;
      border-bottom: 1px solid #f5f5f5;
      transition: background 0.2s;

      &:hover {
        background: #fafafa;
      }

      &.unread {
        background: #f0f7ff;
      }

      .notice-content {
        flex: 1;
        min-width: 0;

        .notice-title {
          font-size: 13px;
          color: #333;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .notice-time {
          font-size: 12px;
          color: #999;
          margin-top: 4px;
        }
      }
    }
  }

  .panel-footer {
    padding: 8px 12px;
    text-align: center;
    border-top: 1px solid #f0f0f0;
  }
}
</style>
