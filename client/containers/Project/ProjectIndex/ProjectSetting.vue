<template>
  <div class="project-setting">
    <n-card title="项目设置">
      <n-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-placement="left"
        label-width="120"
      >
        <n-form-item label="项目名称" path="name">
          <n-input v-model:value="formData.name" />
        </n-form-item>

        <n-form-item label="项目描述" path="desc">
          <n-input v-model:value="formData.desc" type="textarea" :rows="3" />
        </n-form-item>

        <n-form-item label="项目图标">
          <n-upload :max="1" list-type="image-card">
            <n-button>上传图标</n-button>
          </n-upload>
        </n-form-item>

        <n-form-item label="权限设置">
          <n-radio-group v-model:value="formData.permission">
            <n-space>
              <n-radio value="private">私有</n-radio>
              <n-radio value="public">公开</n-radio>
            </n-space>
          </n-radio-group>
        </n-form-item>

        <n-form-item>
          <n-button type="primary" @click="handleSave" :loading="loading"> 保存设置 </n-button>
          <n-button
            style="margin-left: 12px"
            type="error"
            @click="handleDelete"
            :loading="deleting"
          >
            删除项目
          </n-button>
        </n-form-item>
      </n-form>
    </n-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useMessage, useDialog } from "naive-ui";
import { useRouter } from "vue-router";
import axios from "axios";

const props = defineProps({
  projectId: {
    type: String,
    required: true,
  },
});

const message = useMessage();
const dialog = useDialog();
const router = useRouter();

const formRef = ref(null);
const loading = ref(false);
const deleting = ref(false);

const formData = reactive({
  name: "",
  desc: "",
  icon: "",
  permission: "private",
});

const rules = {
  name: { required: true, message: "请输入项目名称", trigger: "blur" },
};

const handleSave = async () => {
  const valid = await formRef.value?.validate();
  if (!valid) return;

  loading.value = true;
  try {
    const res = await axios.put(`/api/project/up?id=${props.projectId}`, formData);
    if (res.data.errcode === 0) {
      message.success("保存成功");
    } else {
      message.error(res.data.errmsg || "保存失败");
    }
  } catch (error) {
    message.error("保存失败");
  } finally {
    loading.value = false;
  }
};

const handleDelete = () => {
  dialog.warning({
    title: "警告",
    content: "确定要删除此项目吗？此操作不可恢复。",
    positiveText: "确定删除",
    negativeText: "取消",
    onPositiveClick: async () => {
      deleting.value = true;
      try {
        const res = await axios.delete(`/api/project/del?id=${props.projectId}`);
        if (res.data.errcode === 0) {
          message.success("删除成功");
          router.push("/");
        } else {
          message.error(res.data.errmsg || "删除失败");
        }
      } catch (error) {
        message.error("删除失败");
      } finally {
        deleting.value = false;
      }
    },
  });
};

const fetchProjectInfo = async () => {
  try {
    const res = await axios.get(`/api/project/get?id=${props.projectId}`);
    if (res.data.errcode === 0) {
      const data = res.data.data;
      formData.name = data.name;
      formData.desc = data.desc;
      formData.icon = data.icon;
      formData.permission = data.permission || "private";
    }
  } catch (error) {
    message.error("获取项目信息失败");
  }
};

onMounted(() => {
  fetchProjectInfo();
});
</script>

<style scoped>
.project-setting {
  padding: 24px;
}
</style>
