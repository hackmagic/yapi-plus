<template>
  <div class="add-group">
    <n-card title="创建项目组">
      <n-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-placement="left"
        label-width="120"
      >
        <n-form-item label="项目组名称" path="group_name">
          <n-input v-model:value="formData.group_name" placeholder="请输入项目组名称" />
        </n-form-item>

        <n-form-item label="项目组描述" path="group_desc">
          <n-input
            v-model:value="formData.group_desc"
            type="textarea"
            :rows="4"
            placeholder="请输入项目组描述"
          />
        </n-form-item>

        <n-form-item label="项目组类型">
          <n-radio-group v-model:value="formData.type">
            <n-space>
              <n-radio value="public">公开</n-radio>
              <n-radio value="private">私有</n-radio>
            </n-space>
          </n-radio-group>
        </n-form-item>

        <n-form-item>
          <n-space>
            <n-button type="primary" @click="handleSubmit" :loading="loading"> 创建项目组 </n-button>
            <n-button @click="$router.back()">取消</n-button>
          </n-space>
        </n-form-item>
      </n-form>
    </n-card>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { useMessage } from "naive-ui";
import { useGroupStore } from "@/store/group";

const router = useRouter();
const message = useMessage();
const groupStore = useGroupStore();

const formRef = ref(null);
const loading = ref(false);

const formData = reactive({
  group_name: "",
  group_desc: "",
  type: "public",
});

const rules = {
  group_name: { required: true, message: "请输入项目组名称", trigger: "blur" },
};

const handleSubmit = async () => {
  const valid = await formRef.value?.validate();
  if (!valid) return;

  loading.value = true;
  try {
    const res = await groupStore.addGroup(formData);
    message.success("创建成功");
    // 跳转到项目组首页
    router.push(`/group/${res.data._id}/home`);
  } catch (e) {
    message.error(e.message || "创建失败");
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.add-group {
  padding: 24px;
  max-width: 800px;
  margin: 0 auto;
}
</style>