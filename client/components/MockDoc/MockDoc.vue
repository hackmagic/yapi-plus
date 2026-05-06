<template>
  <n-drawer v-model:show="showDrawer" :width="800" placement="right">
    <n-drawer-content title="高级 Mock 配置">
      <n-tabs type="line">
        <n-tab-pane name="mock" tab="Mock 模板">
          <n-space vertical :size="16">
            <n-alert type="info"> 使用 Mock.js 语法定义 Mock 数据模板 </n-alert>

            <n-input
              v-model:value="mockTemplate"
              type="textarea"
              :rows="20"
              placeholder="@natural(1, 100)
@cname
@email
@url"
            />

            <n-space justify="end">
              <n-button @click="showDrawer = false">取消</n-button>
              <n-button type="primary" @click="handleSave" :loading="saving"> 保存 </n-button>
            </n-space>
          </n-space>
        </n-tab-pane>

        <n-tab-pane name="preview" tab="预览">
          <n-button @click="handlePreview" :loading="previewing"> 生成预览 </n-button>

          <n-card v-if="previewData" style="margin-top: 16px">
            <pre>{{ formatJson(previewData) }}</pre>
          </n-card>
        </n-tab-pane>
      </n-tabs>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup>
import { ref } from "vue";
import { useMessage } from "naive-ui";
import Mock from "mockjs";
import axios from "axios";

const props = defineProps({
  interfaceId: {
    type: String,
    required: true,
  },
  visible: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:visible"]);

const message = useMessage();
const showDrawer = ref(props.visible);
const saving = ref(false);
const previewing = ref(false);
const mockTemplate = ref("");
const previewData = ref(null);

const formatJson = (data) => {
  return JSON.stringify(data, null, 2);
};

const handleSave = async () => {
  saving.value = true;
  try {
    // Mock 模板保存：使用 interface up 接口
    const res = await axios.post(`/api/interface/up`, {
      id: props.interfaceId,
      mock_template: mockTemplate.value,
    });

    if (res.data.errcode === 0) {
      message.success("保存成功");
      showDrawer.value = false;
      emit("update:visible", false);
    } else {
      message.error(res.data.errmsg || "保存失败");
    }
  } catch (error) {
    message.error("保存失败");
  } finally {
    saving.value = false;
  }
};

const handlePreview = () => {
  previewing.value = true;
  try {
    const data = Mock.mock(JSON.parse(mockTemplate.value || "{}"));
    previewData.value = data;
    message.success("预览生成成功");
  } catch (error) {
    message.error("预览失败：" + error.message);
  } finally {
    previewing.value = false;
  }
};
</script>

<style scoped>
pre {
  background: #f5f5f5;
  padding: 16px;
  border-radius: 4px;
  overflow-x: auto;
  font-family: "Courier New", monospace;
  font-size: 13px;
}
</style>
