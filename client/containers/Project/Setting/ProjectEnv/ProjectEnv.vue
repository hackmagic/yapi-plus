<template>
  <div class="project-env">
    <n-layout has-sider style="min-height: 500px">
      <n-layout-sider bordered :width="200">
        <div style="padding: 12px">
          <n-button type="primary" @click="addEnv" style="width: 100%; margin-bottom: 12px">
            <template #icon>
              <n-icon><AddOutline /></n-icon>
            </template>
            添加环境
          </n-button>
          <n-list>
            <n-list-item
              v-for="(env, index) in envList"
              :key="index"
              :class="{ active: currentIndex === index }"
              @click="selectEnv(index)"
              style="cursor: pointer"
            >
              <div style="display: flex; justify-content: space-between; align-items: center">
                <span>{{ env.name || `环境${index + 1}` }}</span>
                <n-popconfirm @positive-click="deleteEnv(index)">
                  <template #trigger>
                    <n-button text size="small" type="error">
                      <template #icon>
                        <n-icon><TrashOutline /></n-icon>
                      </template>
                    </n-button>
                  </template>
                  确定删除此环境吗？
                </n-popconfirm>
              </div>
            </n-list-item>
          </n-list>
        </div>
      </n-layout-sider>

      <n-layout-content style="padding: 24px">
        <div v-if="currentEnv">
          <n-form :model="currentEnv" label-placement="left" label-width="100px">
            <n-form-item label="环境名称">
              <n-input v-model:value="currentEnv.name" placeholder="开发环境、生产环境" />
            </n-form-item>
            <n-form-item label="域名">
              <n-input v-model:value="currentEnv.domain" placeholder="http://api.example.com" />
            </n-form-item>
            <n-form-item label="全局Header">
              <header-editor v-model="currentEnv.header" />
            </n-form-item>
            <n-form-item>
              <n-button type="primary" @click="saveEnv">保存环境</n-button>
            </n-form-item>
          </n-form>
        </div>
      </n-layout-content>
    </n-layout>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useMessage } from "naive-ui";
import { AddOutline, TrashOutline } from "@vicons/ionicons5";
import axios from "axios";

const props = defineProps({
  projectId: {
    type: Number,
    required: true,
  },
});

const message = useMessage();

const envList = ref([]);
const currentIndex = ref(0);
const projectId = ref(props.projectId);

const currentEnv = computed(() => {
  return envList.value[currentIndex.value] || null;
});

const loadEnv = async () => {
  try {
    const res = await axios.get(`/api/project/get?id=${projectId.value}`);
    if (res.data.errcode === 0) {
      envList.value = res.data.data.env || [];
    }
  } catch (error) {
    message.error("加载环境配置失败");
  }
};

const addEnv = () => {
  envList.value.unshift({
    name: "新环境",
    domain: "",
    header: [],
  });
  currentIndex.value = 0;
};

const selectEnv = (index) => {
  currentIndex.value = index;
};

const deleteEnv = (index) => {
  envList.value.splice(index, 1);
  if (currentIndex.value >= envList.value.length) {
    currentIndex.value = Math.max(0, envList.value.length - 1);
  }
  saveEnv();
};

const saveEnv = async () => {
  try {
    const res = await axios.post(`/api/project/up`, {
      id: projectId.value,
      env: envList.value,
    });
    if (res.data.errcode === 0) {
      message.success("保存成功");
    }
  } catch (error) {
    message.error("保存失败");
  }
};

onMounted(() => {
  loadEnv();
});
</script>

<style scoped lang="scss">
.project-env {
  :deep(.active) {
    background-color: #f0f0f0;
  }
}
</style>
