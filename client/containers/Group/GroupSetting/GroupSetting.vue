<template>
  <div class="group-setting-page">
    <n-card title="组设置" :bordered="false">
      <n-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-placement="left"
        label-width="100px"
      >
        <n-form-item label="组名称" path="group_name">
          <n-input v-model:value="formData.group_name" placeholder="请输入组名称" />
        </n-form-item>

        <n-form-item label="组类型" path="type">
          <n-radio-group v-model:value="formData.type">
            <n-radio value="public">公开</n-radio>
            <n-radio value="private">私有</n-radio>
          </n-radio-group>
        </n-form-item>

        <n-form-item label="描述" path="group_desc">
          <n-input
            v-model:value="formData.group_desc"
            type="textarea"
            placeholder="请输入组描述"
            :rows="4"
          />
        </n-form-item>

        <n-form-item>
          <n-button type="primary" @click="handleSave" :loading="saving"> 保存设置 </n-button>
        </n-form-item>
      </n-form>
    </n-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useMessage } from "naive-ui";
import { useGroupStore } from "@/store/group";

const route = useRoute();
const message = useMessage();
const groupStore = useGroupStore();

const groupId = computed(() => route.params.id);
const formRef = ref(null);
const saving = ref(false);

const formData = ref({
  group_name: "",
  type: "public",
  group_desc: "",
});

const rules = {
  group_name: { required: true, message: "请输入组名称", trigger: "blur" },
};

const loadGroup = async () => {
  const data = await groupStore.fetchGroup(groupId.value);
  if (data) {
    formData.value = {
      group_name: data.group_name,
      type: data.type || "public",
      group_desc: data.group_desc || "",
    };
  }
};

onMounted(() => {
  loadGroup();
});

const handleSave = async () => {
  try {
    await formRef.value?.validate();
    saving.value = true;
    await groupStore.updateGroup(groupId.value, formData.value);
    message.success("保存成功");
  } catch (e) {
    if (e.message) {
      message.error(e.message);
    }
  } finally {
    saving.value = false;
  }
};
</script>

<style scoped>
.group-setting-page {
  min-height: 400px;
  max-width: 600px;
}
</style>
