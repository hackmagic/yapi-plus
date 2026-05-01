<template>
  <div class="data-setting">
    <n-space vertical :size="16">
      <n-alert type="warning"> 导入数据将覆盖现有数据，请谨慎操作 </n-alert>

      <n-tabs type="line">
        <n-tab-pane name="import" tab="导入数据">
          <n-upload :max="1" accept=".json" @change="handleImport" :custom-request="customRequest">
            <n-button>选择 JSON 文件</n-button>
          </n-upload>
        </n-tab-pane>

        <n-tab-pane name="export" tab="导出数据">
          <n-space>
            <n-button @click="handleExport('json')"> 导出为 JSON </n-button>
            <n-button @click="handleExport('swagger')"> 导出为 Swagger </n-button>
          </n-space>
        </n-tab-pane>

        <n-tab-pane name="clear" tab="清空数据">
          <n-popconfirm @positive-click="handleClear">
            <template #trigger>
              <n-button type="error"> 清空所有数据 </n-button>
            </template>
            确定要清空所有数据吗？此操作不可恢复！
          </n-popconfirm>
        </n-tab-pane>
      </n-tabs>
    </n-space>
  </div>
</template>

<script setup>
import { useMessage } from "naive-ui";
import axios from "axios";

const props = defineProps({
  projectId: {
    type: String,
    required: true,
  },
});

const message = useMessage();

const customRequest = ({ file }) => {
  return { abort: () => {} };
};

const handleImport = async ({ file }) => {
  try {
    const formData = new FormData();
    formData.append("file", file.file);
    formData.append("project_id", props.projectId);
    formData.append("type", "yapi");

    const res = await axios.post("/api/open/import_data", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (res.data.errcode === 0) {
      message.success("导入成功");
    } else {
      message.error(res.data.errmsg || "导入失败");
    }
  } catch (error) {
    message.error("导入失败");
  }
};

const handleExport = async (type) => {
  try {
    const res = await axios.get("/api/open/export_data", {
      params: {
        project_id: props.projectId,
        type,
      },
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `export.${type === "json" ? "json" : "swagger.json"}`);
    document.body.appendChild(link);
    link.click();
    link.remove();

    message.success("导出成功");
  } catch (error) {
    message.error("导出失败");
  }
};

const handleClear = async () => {
  try {
    const res = await axios.delete(`/api/project/clear`, {
      params: {
        project_id: props.projectId,
      },
    });

    if (res.data.errcode === 0) {
      message.success("清空成功");
    } else {
      message.error(res.data.errmsg || "清空失败");
    }
  } catch (error) {
    message.error("清空失败");
  }
};
</script>

<style scoped>
.data-setting {
  padding: 16px 0;
}
</style>
