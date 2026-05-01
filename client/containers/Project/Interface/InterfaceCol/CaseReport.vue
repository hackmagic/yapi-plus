<template>
  <div class="case-report">
    <div class="report-header">
      <n-space>
        <n-button type="primary" @click="handleRunReport" :loading="running">
          <template #icon>
            <n-icon><RefreshOutline /></n-icon>
          </template>
          重新运行
        </n-button>
        <n-button @click="handleExport">
          <template #icon>
            <n-icon><DownloadOutline /></n-icon>
          </template>
          导出报告
        </n-button>
      </n-space>
    </div>

    <n-spin :show="loading">
      <n-card title="测试报告" v-if="reportData">
        <n-grid :cols="4" :x-gap="16" :y-gap="16">
          <n-gi>
            <div class="stat-card">
              <div class="stat-value">{{ totalCases }}</div>
              <div class="stat-label">总用例数</div>
            </div>
          </n-gi>
          <n-gi>
            <div class="stat-card success">
              <div class="stat-value">{{ successCount }}</div>
              <div class="stat-label">成功</div>
            </div>
          </n-gi>
          <n-gi>
            <div class="stat-card error">
              <div class="stat-value">{{ failCount }}</div>
              <div class="stat-label">失败</div>
            </div>
          </n-gi>
          <n-gi>
            <div class="stat-card">
              <div class="stat-value">{{ passRate }}%</div>
              <div class="stat-label">通过率</div>
            </div>
          </n-gi>
        </n-grid>

        <n-divider />

        <n-tabs type="line" animated>
          <n-tab-pane name="result" tab="执行结果">
            <n-data-table
              :columns="columns"
              :data="reportData.resultList || []"
              :row-key="(row) => row.id"
              :pagination="false"
            />
          </n-tab-pane>
          <n-tab-pane name="log" tab="执行日志">
            <n-log :log="logContent" :rows="20" style="background: #1a1a1a; color: #ccc" />
          </n-tab-pane>
        </n-tabs>
      </n-card>

      <n-empty v-else description="暂无测试报告" />
    </n-spin>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, h } from "vue";
import { useRoute } from "vue-router";
import { useMessage, NTag, NButton, NIcon } from "naive-ui";
import axios from "axios";
import { RefreshOutline, DownloadOutline } from "@vicons/ionicons5";

const props = defineProps({
  colId: {
    type: [Number, String],
    required: true,
  },
});

const route = useRoute();
const message = useMessage();

const loading = ref(false);
const running = ref(false);
const reportData = ref(null);

const totalCases = computed(() => {
  if (!reportData.value) return 0;
  return (reportData.value.resultList || []).length;
});

const successCount = computed(() => {
  if (!reportData.value) return 0;
  return (reportData.value.resultList || []).filter((r) => r.status === "ok").length;
});

const failCount = computed(() => {
  if (!reportData.value) return 0;
  return (reportData.value.resultList || []).filter((r) => r.status === "failed").length;
});

const passRate = computed(() => {
  if (totalCases.value === 0) return 0;
  return Math.round((successCount.value / totalCases.value) * 100);
});

const logContent = computed(() => {
  if (!reportData.value || !reportData.value.log) return "";
  return reportData.value.log.join("\n");
});

const columns = [
  {
    title: "用例名称",
    key: "name",
  },
  {
    title: "接口路径",
    key: "path",
  },
  {
    title: "方法",
    key: "method",
    width: 80,
    render(row) {
      const typeMap = {
        GET: "info",
        POST: "success",
        PUT: "warning",
        DELETE: "error",
      };
      return h(NTag, { type: typeMap[row.method] || "info" }, () => row.method);
    },
  },
  {
    title: "状态",
    key: "status",
    width: 100,
    render(row) {
      return h(NTag, { type: row.status === "ok" ? "success" : "error" }, () =>
        row.status === "ok" ? "通过" : "失败",
      );
    },
  },
  {
    title: "响应时间",
    key: "res_time",
    width: 100,
    render(row) {
      return `${row.res_time || 0} ms`;
    },
  },
  {
    title: "状态码",
    key: "httpCode",
    width: 100,
  },
  {
    title: "详情",
    key: "message",
    render(row) {
      return row.message || "-";
    },
  },
];

const loadReport = async () => {
  loading.value = true;
  try {
    const res = await axios.get("/api/interfaceCol/run", { params: { col_id: props.colId } });
    if (res.data.errcode === 0) {
      reportData.value = res.data.data;
    }
  } catch (e) {
    message.error("加载报告失败");
  } finally {
    loading.value = false;
  }
};

const handleRunReport = async () => {
  running.value = true;
  try {
    const res = await axios.post("/api/interfaceCol/run", { col_id: props.colId });
    if (res.data.errcode === 0) {
      reportData.value = res.data.data;
      message.success("运行完成");
    }
  } catch (e) {
    message.error("运行失败");
  } finally {
    running.value = false;
  }
};

const handleExport = () => {
  if (!reportData.value) return;
  const content = JSON.stringify(reportData.value, null, 2);
  const blob = new Blob([content], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `test-report-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  message.success("导出成功");
};

onMounted(() => {
  loadReport();
});
</script>

<style scoped lang="scss">
.case-report {
  padding: 16px;

  .report-header {
    margin-bottom: 16px;
  }

  .stat-card {
    padding: 16px;
    background: #f5f5f5;
    border-radius: 8px;
    text-align: center;

    &.success {
      background: #f6ffed;
      border: 1px solid #b7eb8f;
    }

    &.error {
      background: #fff1f0;
      border: 1px solid #ffa39e;
    }

    .stat-value {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 4px;
    }

    .stat-label {
      color: #666;
      font-size: 12px;
    }
  }
}
</style>
