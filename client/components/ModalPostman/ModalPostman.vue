<template>
  <n-modal v-model:show="showModal" preset="card" style="width: 800px" title="导入 Postman 数据">
    <n-space vertical :size="16">
      <n-alert type="info"> 请上传 Postman 导出的 JSON 文件（Collection v2.1 格式） </n-alert>

      <n-upload :max="1" accept=".json" @change="handleFileChange" :custom-request="customRequest">
        <n-button>选择 Postman JSON 文件</n-button>
      </n-upload>

      <n-form v-if="fileInfo" label-placement="left" label-width="100">
        <n-form-item label="文件名称">
          {{ fileInfo.name }}
        </n-form-item>
        <n-form-item label="文件大小">
          {{ formatFileSize(fileInfo.size) }}
        </n-form-item>
      </n-form>

      <n-space justify="end">
        <n-button @click="showModal = false">取消</n-button>
        <n-button type="primary" @click="handleImport" :loading="importing"> 开始导入 </n-button>
      </n-space>
    </n-space>
  </n-modal>
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

const emit = defineEmits(["imported"]);

const message = useMessage();
const showModal = ref(false);
const importing = ref(false);
const fileInfo = ref(null);
const selectedFile = ref(null);

const handleFileChange = ({ file }) => {
  fileInfo.value = file.file;
  selectedFile.value = file.file;
};

const customRequest = ({ file }) => {
  // 阻止自动上传
  return { abort: () => {} };
};

const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
};

const handleImport = async () => {
  if (!selectedFile.value) {
    message.error("请选择文件");
    return;
  }

  importing.value = true;
  try {
    const formData = new FormData();
    formData.append("file", selectedFile.value);
    formData.append("project_id", props.projectId);
    formData.append("type", "postman");

    const res = await axios.post("/api/open/import_data", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (res.data.errcode === 0) {
      message.success("导入成功");
      showModal.value = false;
      emit("imported");
    } else {
      message.error(res.data.errmsg || "导入失败");
    }
  } catch (error) {
    message.error("导入失败");
  } finally {
    importing.value = false;
  }
};

defineExpose({
  show: () => {
    showModal.value = true;
  },
});
</script>
