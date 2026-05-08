<template>
  <div class="add-project">
    <n-card title="创建项目">
      <n-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-placement="left"
        label-width="120"
      >
        <n-form-item label="项目名称" path="name">
          <n-input v-model:value="formData.name" placeholder="请输入项目名称" />
        </n-form-item>

        <n-form-item label="所属项目组" path="group_id">
          <n-select
            v-model:value="formData.group_id"
            :options="groupOptions"
            placeholder="请选择项目组"
            :render-label="renderGroupLabel"
          />
        </n-form-item>

        <n-form-item label="基本路径" path="basepath">
          <n-input
            v-model:value="formData.basepath"
            placeholder="/api, /v1 等（可选）"
            @blur="handlePathFormat"
          >
            <template #suffix>
              <n-tooltip trigger="hover">
                <template #trigger>
                  <n-icon><HelpCircleOutline /></n-icon>
                </template>
                接口基本路径，为空是根路径
              </n-tooltip>
            </template>
          </n-input>
        </n-form-item>

        <n-form-item label="项目描述" path="desc">
          <n-input
            v-model:value="formData.desc"
            type="textarea"
            :rows="4"
            placeholder="请输入项目描述（可选，不超过144字）"
            :maxlength="144"
            show-count
          />
        </n-form-item>

        <n-form-item label="项目权限">
          <n-radio-group v-model:value="formData.project_type">
            <n-space vertical>
              <n-radio value="private">
                <span>私有</span>
                <span class="radio-desc">只有组长和项目开发者可以索引并查看项目信息</span>
              </n-radio>
              <n-radio value="public">
                <span>公开</span>
                <span class="radio-desc">任何人都可以索引并查看项目信息</span>
              </n-radio>
            </n-space>
          </n-radio-group>
        </n-form-item>

        <n-form-item label="Mock 地址">
          <n-input v-model:value="formData.mock_url" placeholder="/mock" />
        </n-form-item>

        <n-form-item>
          <n-space>
            <n-button type="primary" @click="handleSubmit" :loading="loading"> 创建项目 </n-button>
            <n-button @click="$router.back()">取消</n-button>
          </n-space>
        </n-form-item>
      </n-form>
    </n-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useMessage } from "naive-ui";
import axios from "axios";
import { HelpCircleOutline } from "@vicons/ionicons5";

const router = useRouter();
const message = useMessage();

const formRef = ref(null);
const loading = ref(false);
const groupOptions = ref([]);

const formData = reactive({
  name: "",
  desc: "",
  group_id: null,
  basepath: "",
  project_type: "private",
  mock_url: "/mock",
});

const rules = {
  name: { required: true, message: "请输入项目名称", trigger: "blur" },
  group_id: {
    validator: (rule, value) => {
      return value !== null && value !== undefined && value !== "";
    },
    message: "请选择项目组",
    trigger: "change",
  },
};

// 格式化路径
const handlePathFormat = () => {
  if (formData.basepath) {
    let path = formData.basepath.trim();
    // 确保路径以 / 开头
    if (path && !path.startsWith("/")) {
      path = "/" + path;
    }
    // 移除末尾的 /
    if (path.endsWith("/") && path.length > 1) {
      path = path.slice(0, -1);
    }
    formData.basepath = path;
  }
};

// 自定义分组标签渲染
const renderGroupLabel = (option) => {
  return option.label;
};

// 获取分组列表
const fetchGroups = async () => {
  try {
    const res = await axios.get("/api/group/list");
    if (res.data.errcode === 0) {
      groupOptions.value = res.data.data.list
        .filter((group) => group.role === "dev" || group.role === "owner" || group.role === "admin")
        .map((group) => ({
          label: group.group_name,
          value: group._id,
          disabled: !(group.role === "dev" || group.role === "owner" || group.role === "admin"),
        }));

      // 默认选择第一个可用的分组
      if (groupOptions.value.length > 0 && !formData.group_id) {
        formData.group_id = groupOptions.value[0].value;
      }
    }
  } catch (error) {
    message.error("获取项目组列表失败");
  }
};

// 获取group_name
const getGroupName = (groupId) => {
  const group = groupOptions.value.find((g) => g.value === groupId);
  return group ? group.label : "";
};

const handleSubmit = async () => {
  const valid = await formRef.value?.validate();
  if (!valid) return;

  loading.value = true;
  try {
    // 转换参数以匹配后端期望
    const postData = {
      name: formData.name,
      desc: formData.desc,
      group_id: formData.group_id,
      group_name: getGroupName(formData.group_id),
      basepath: formData.basepath || "",
      project_type: formData.project_type,
      mock_url: formData.mock_url,
    };
    const res = await axios.post("/api/project/add", postData);
    if (res.data.errcode === 0) {
      message.success("创建成功!");
      router.push(`/project/${res.data.data._id}/interface/api`);
    } else {
      message.error(res.data.errmsg || "创建失败");
    }
  } catch (error) {
    message.error("创建失败");
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchGroups();
});
</script>

<style scoped lang="scss">
.add-project {
  padding: 24px;
  max-width: 800px;
  margin: 0 auto;
}

.radio-desc {
  display: block;
  font-size: 12px;
  color: #999;
  margin-top: 2px;
}
</style>
