<template>
  <div class="notify-page">
    <n-card title="消息通知">
      <n-tabs type="line" v-model:value="activeTab">
        <n-tab-pane name="system" tab="系统通知">
          <n-list v-if="systemNotices.length > 0">
            <n-list-item v-for="notice in systemNotices" :key="notice._id">
              <n-space vertical>
                <n-text strong>{{ notice.title }}</n-text>
                <n-text depth="3">{{ notice.content }}</n-text>
                <n-text depth="3" style="font-size: 12px">
                  {{ formatDate(notice.add_time) }}
                </n-text>
              </n-space>
            </n-list-item>
          </n-list>
          <n-empty v-else description="暂无系统通知" />
          <n-pagination
            v-if="systemTotal > pageSize"
            :page="systemPage"
            :page-size="pageSize"
            :item-count="systemTotal"
            @update:page="handleSystemPageChange"
            show-size-picker
            :page-sizes="[10, 20, 50]"
            style="margin-top: 16px; justify-content: center"
          />
        </n-tab-pane>

        <n-tab-pane name="project" tab="项目动态">
          <n-timeline v-if="projectActivities.length > 0">
            <n-timeline-item
              v-for="activity in projectActivities"
              :key="activity._id"
              :type="activity.type"
              :title="activity.title"
              :content="activity.content"
              :time="formatDate(activity.add_time)"
            />
          </n-timeline>
          <n-empty v-else description="暂无项目动态" />
          <n-pagination
            v-if="projectTotal > pageSize"
            :page="projectPage"
            :page-size="pageSize"
            :item-count="projectTotal"
            @update:page="handleProjectPageChange"
            show-size-picker
            :page-sizes="[10, 20, 50]"
            style="margin-top: 16px; justify-content: center"
          />
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import { useMessage } from 'naive-ui';
import axios from 'axios';

const message = useMessage();
const activeTab = ref('system');
const systemNotices = ref([]);
const projectActivities = ref([]);
const systemPage = ref(1);
const projectPage = ref(1);
const pageSize = ref(10);
const systemTotal = ref(0);
const projectTotal = ref(0);

const formatDate = (timestamp) => {
  if (!timestamp) return '-';
  return new Date(timestamp).toLocaleString();
};

const fetchNotices = async (page = 1) => {
  try {
    const res = await axios.get('/api/log/list', {
      params: { page, limit: pageSize.value, type: 'system' }
    });
    if (res.data.errcode === 0) {
      systemNotices.value = res.data.data.list || [];
      systemTotal.value = res.data.data.total || 0;
    }
  } catch (error) {
    message.error('获取系统通知失败');
  }
};

const fetchActivities = async (page = 1) => {
  try {
    const res = await axios.get('/api/log/list', {
      params: { page, limit: pageSize.value, type: 'project' }
    });
    if (res.data.errcode === 0) {
      projectActivities.value = res.data.data.list || [];
      projectTotal.value = res.data.data.total || 0;
    }
  } catch (error) {
    message.error('获取项目动态失败');
  }
};

const handleSystemPageChange = (page) => {
  systemPage.value = page;
  fetchNotices(page);
};

const handleProjectPageChange = (page) => {
  projectPage.value = page;
  fetchActivities(page);
};

onMounted(() => {
  fetchNotices();
  fetchActivities();
});
</script>

<style scoped>
.notify-page {
  padding: 24px;
}
</style>
