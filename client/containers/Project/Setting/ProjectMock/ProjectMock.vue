<template>
  <div class="project-mock">
    <n-spin :show="loading">
      <n-form ref="formRef" :model="formData" label-placement="left" label-width="120px">
        <n-card title="Mock 设置">
          <n-form-item label="启用 Mock">
            <n-switch v-model:value="formData.enable">
              <template #checked>启用</template>
              <template #unchecked>禁用</template>
            </n-switch>
          </n-form-item>

          <template v-if="formData.enable">
            <n-form-item label="Mock 数据">
              <n-switch v-model:value="formData.dataFrom">
                <template #checked>真实响应</template>
                <template #unchecked>自定义数据</template>
              </n-switch>
            </n-form-item>

            <n-form-item label="延迟时间">
              <n-input-group>
                <n-input-number v-model:value="formData.delay" :min="0" :max="60000" />
                <n-input-group-label>ms</n-input-group-label>
              </n-input-group>
            </n-form-item>

            <n-form-item label="Mock JS 脚本">
              <n-input
                v-model:value="formData.script"
                type="textarea"
                :rows="10"
                placeholder="// Mock 脚本示例
const result = {
  code: 0,
  data: {
    list: [],
    total: 0
  }
};
Mock.mock(result.data, 'list', {
  'list|1-10': [{
    'id|+1': 1,
    'name': '@name',
    'email': '@email'
  }]
});
return result;"
              />
            </n-form-item>

            <n-form-item>
              <n-button type="primary" @click="handleSave" :loading="saving">保存设置</n-button>
              <n-button @click="handleTestMock">测试 Mock</n-button>
            </n-form-item>
          </template>
        </n-card>

        <n-card title="Mock 规则" style="margin-top: 16px" v-if="formData.enable">
          <n-space vertical>
            <n-button type="primary" @click="showRuleModal = true">
              <template #icon>
                <n-icon><AddOutline /></n-icon>
              </template>
              添加规则
            </n-button>

            <n-data-table
              :columns="ruleColumns"
              :data="ruleList"
              :row-key="(row) => row._id"
              :pagination="false"
            />
          </n-space>
        </n-card>
      </n-form>
    </n-spin>

    <n-modal v-model:show="showRuleModal" preset="dialog" title="添加 Mock 规则">
      <n-form ref="ruleFormRef" :model="ruleFormData" :rules="ruleFormRules">
        <n-form-item label="匹配路径" path="path">
          <n-input v-model:value="ruleFormData.path" placeholder="/api/user/:id" />
        </n-form-item>
        <n-form-item label="匹配方法" path="method">
          <n-select v-model:value="ruleFormData.method" :options="methodOptions" />
        </n-form-item>
        <n-form-item label="返回数据" path="response">
          <n-input
            v-model:value="ruleFormData.response"
            type="textarea"
            :rows="6"
            placeholder='{"code": 0, "data": {}}'
          />
        </n-form-item>
      </n-form>
      <template #action>
        <n-button @click="showRuleModal = false">取消</n-button>
        <n-button type="primary" @click="handleAddRule">确定</n-button>
      </template>
    </n-modal>
  </div>
</template>

<script setup>
import { ref, onMounted, h } from "vue";
import { useMessage, NButton, NIcon, NPopconfirm } from "naive-ui";
import axios from "axios";
import { AddOutline } from "@vicons/ionicons5";

const props = defineProps({
  projectId: {
    type: Number,
    required: true,
  },
});

const message = useMessage();

const loading = ref(false);
const saving = ref(false);
const showRuleModal = ref(false);
const ruleList = ref([]);

const formData = ref({
  enable: false,
  dataFrom: false,
  delay: 0,
  script: "",
});

const ruleFormData = ref({
  path: "",
  method: "GET",
  response: "",
});

const ruleFormRules = {
  path: { required: true, message: "请输入匹配路径", trigger: "blur" },
  method: { required: true, message: "请选择方法", trigger: "change" },
  response: { required: true, message: "请输入返回数据", trigger: "blur" },
};

const methodOptions = [
  { label: "GET", value: "GET" },
  { label: "POST", value: "POST" },
  { label: "PUT", value: "PUT" },
  { label: "DELETE", value: "DELETE" },
];

const ruleColumns = [
  { title: "路径", key: "path" },
  { title: "方法", key: "method", width: 100 },
  { title: "返回数据", key: "response", ellipsis: { tooltip: true } },
  {
    title: "操作",
    key: "actions",
    width: 120,
    render(row) {
      return h(
        NPopconfirm,
        {
          onPositiveClick: () => handleDeleteRule(row),
        },
        {
          trigger: () => h(NButton, { size: "small", type: "error" }, () => "删除"),
          default: () => "确定删除此规则吗？",
        },
      );
    },
  },
];

const loadSettings = async () => {
  loading.value = true;
  try {
    const res = await axios.get(`/api/project/get?id=${props.projectId}`);
    if (res.data.errcode === 0) {
      const data = res.data.data;
      if (data.mock_settings) {
        formData.value = { ...formData.value, ...data.mock_settings };
      }
      ruleList.value = data.mock_rules || [];
    }
  } catch (e) {
    message.error("加载设置失败");
  } finally {
    loading.value = false;
  }
};

const handleSave = async () => {
  saving.value = true;
  try {
    const res = await axios.post("/api/project/up", {
      id: props.projectId,
      mock_settings: formData.value,
    });
    if (res.data.errcode === 0) {
      message.success("保存成功");
    }
  } catch (e) {
    message.error("保存失败");
  } finally {
    saving.value = false;
  }
};

const handleTestMock = async () => {
  if (!formData.value.enable) {
    message.warning("请先启用 Mock");
    return;
  }

  try {
    // 构造测试请求
    const testPath = ruleList.value.length > 0 ? ruleList.value[0].path : "/test";
    
    // 显示加载状态
    message.loading("正在测试 Mock 配置...", { duration: 0 });
    
    // 调用后端 Mock 接口进行测试
    const baseUrl = window.location.origin;
    const mockUrl = `${baseUrl}/mock/${props.projectId}${testPath}`;
    
    const response = await fetch(mockUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // 隐藏加载消息
    message.destroyAll();

    if (response.ok) {
      const data = await response.json();
      message.success(`Mock 测试成功！响应状态: ${response.status}`);
      
      // 可以在这里添加更详细的响应展示
      console.log("Mock 响应数据:", data);
    } else {
      message.error(`Mock 测试失败: ${response.status} ${response.statusText}`);
    }
  } catch (e) {
    message.destroyAll();
    message.error("Mock 测试失败: " + e.message);
  }
};

const handleAddRule = async () => {
  if (!ruleFormData.value.path || !ruleFormData.value.response) {
    message.warning("请填写完整信息");
    return;
  }
  ruleList.value.push({
    ...ruleFormData.value,
    _id: Date.now(),
  });
  showRuleModal.value = false;
  ruleFormData.value = { path: "", method: "GET", response: "" };

  try {
    await axios.post("/api/project/up", {
      id: props.projectId,
      mock_rules: ruleList.value,
    });
  } catch (e) {
    message.error("保存规则失败");
  }
};

const handleDeleteRule = async (row) => {
  ruleList.value = ruleList.value.filter((r) => r._id !== row._id);
  try {
    await axios.post("/api/project/up", {
      id: props.projectId,
      mock_rules: ruleList.value,
    });
    message.success("删除成功");
  } catch (e) {
    message.error("删除失败");
  }
};

onMounted(() => {
  loadSettings();
});
</script>

<style scoped lang="scss">
.project-mock {
  padding: 16px;
}
</style>
