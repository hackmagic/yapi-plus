<template>
  <div class="data-page">
    <n-card title="数据管理">
      <n-tabs type="line">
        <n-tab-pane name="import" tab="导入数据">
          <n-space vertical :size="16">
            <n-alert type="info"> 支持导入 Swagger、Postman、Har 等格式的数据 </n-alert>

            <n-form
              ref="importFormRef"
              :model="importData"
              label-placement="left"
              label-width="100"
            >
              <n-form-item label="导入格式">
                <n-select v-model:value="importData.type" :options="formatOptions" />
              </n-form-item>

              <n-form-item label="上传文件">
                <n-upload :max="1" accept=".json" @change="handleFileUpload">
                  <n-button>选择文件</n-button>
                </n-upload>
              </n-form-item>

              <n-form-item>
                <n-button type="primary" @click="handleImport" :loading="importing">
                  开始导入
                </n-button>
              </n-form-item>
            </n-form>
          </n-space>
        </n-tab-pane>

        <n-tab-pane name="export" tab="导出数据">
          <n-space vertical :size="16">
            <n-alert type="info"> 导出项目数据为 JSON、Swagger 等格式 </n-alert>

            <n-form
              ref="exportFormRef"
              :model="exportData"
              label-placement="left"
              label-width="100"
            >
              <n-form-item label="导出格式">
                <n-select v-model:value="exportData.type" :options="exportFormatOptions" />
              </n-form-item>

              <n-form-item label="接口范围">
                <n-radio-group v-model:value="exportData.scope">
                  <n-space>
                    <n-radio value="all">全部接口</n-radio>
                    <n-radio value="selected">选中接口</n-radio>
                  </n-space>
                </n-radio-group>
              </n-form-item>

              <n-form-item>
                <n-button type="primary" @click="handleExport" :loading="exporting">
                  开始导出
                </n-button>
              </n-form-item>
            </n-form>
          </n-space>
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useMessage } from "naive-ui";
import axios from "axios";

const props = defineProps({
  projectId: {
    type: String,
    required: true,
  },
});

const message = useMessage();
const importing = ref(false);
const exporting = ref(false);

const importData = reactive({
  type: "swagger",
  file: null,
});

const exportData = reactive({
  type: "json",
  scope: "all",
});

const formatOptions = [
  { label: "Swagger JSON", value: "swagger" },
  { label: "Postman", value: "postman" },
  { label: "HAR", value: "har" },
  { label: "YAPI JSON", value: "yapi" },
];

const exportFormatOptions = [
  { label: "YAPI JSON", value: "json" },
  { label: "Swagger JSON", value: "swagger" },
];

const handleFileUpload = ({ file }) => {
  importData.file = file.file;
};

const handleImport = async () => {
  if (!importData.file) {
    message.error("请选择文件");
    return;
  }

  importing.value = true;
  try {
    const formData = new FormData();
    formData.append("file", importData.file);
    formData.append("type", importData.type);
    formData.append("project_id", props.projectId);

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
  } finally {
    importing.value = false;
  }
};

const handleExport = async () => {
  exporting.value = true;
  try {
    const res = await axios.get("/api/open/export_data", {
      params: {
        project_id: props.projectId,
        type: exportData.type,
        scope: exportData.scope,
      },
      responseType: "blob",
    });

    // 下载文件
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `export.${exportData.type}`);
    document.body.appendChild(link);
    link.click();
    link.remove();

    message.success("导出成功");
  } catch (error) {
    message.error("导出失败");
  } finally {
    exporting.value = false;
  }
};
</script>

<style scoped>
.data-page {
  padding: 24px;
}
</style>
