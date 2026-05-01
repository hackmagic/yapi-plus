<template>
  <div class="home-container">
    <n-layout>
      <n-layout-content content-style="padding: 24px;">
        <n-space vertical :size="24">
          <n-card title="欢迎使用 YAPI Plus">
            <p>基于 Vue 3 + VitePlus + Naive UI 构建的现代化 API 管理平台</p>
            <n-space style="margin-top: 16px;">
              <n-button type="primary" @click="$router.push('/add-group')"> 创建项目组 </n-button>
              <n-button @click="$router.push('/add-project')"> 创建项目 </n-button>
            </n-space>
          </n-card>

          <!-- 我的项目 -->
          <n-card title="我的项目">
            <n-spin :show="loading">
              <n-empty v-if="projectList.length === 0 && !loading" description="暂无项目，请先创建项目组和项目" />
              <div v-else class="project-grid">
                <div
                  v-for="project in projectList"
                  :key="project._id"
                  class="project-item"
                  @click="$router.push(`/project/${project._id}`)"
                >
                  <div class="project-icon" :style="{ backgroundColor: project.color || '#2080f0' }">
                    {{ project.name?.charAt(0)?.toUpperCase() || "P" }}
                  </div>
                  <div class="project-info">
                    <h4>{{ project.name }}</h4>
                    <p>{{ project.desc || "暂无描述" }}</p>
                    <n-tag :type="project.project_type === 'public' ? 'success' : 'default'" size="small">
                      {{ project.project_type === "public" ? "公开" : "私有" }}
                    </n-tag>
                  </div>
                </div>
              </div>
            </n-spin>
          </n-card>

          <n-row :gutter="[16, 16]">
            <n-col :span="8">
              <n-card title="API 管理" hoverable>
                <p>完整的 API 接口管理，支持 RESTful API 设计</p>
              </n-card>
            </n-col>
            <n-col :span="8">
              <n-card title="Mock 服务" hoverable>
                <p>强大的 Mock 功能，支持自定义 Mock 规则</p>
              </n-card>
            </n-col>
            <n-col :span="8">
              <n-card title="AI 助手" hoverable>
                <p>AI 驱动的 API 文档生成和测试用例生成</p>
              </n-card>
            </n-col>
          </n-row>
        </n-space>
      </n-layout-content>
    </n-layout>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useProjectStore } from "@/store/project";
import { useUserStore } from "@/store/user";

const router = useRouter();
const projectStore = useProjectStore();
const userStore = useUserStore();

const loading = ref(false);
const projectList = computed(() => projectStore.projectList);

const loadProjects = async () => {
  if (!userStore.loginState) return;
  loading.value = true;
  try {
    await projectStore.fetchAllProjects();
  } catch (e) {
    console.error("加载项目失败", e);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadProjects();
});
</script>

<style scoped>
.home-container {
  min-height: 100vh;
}

.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}

.project-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  border: 1px solid #eee;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.project-item:hover {
  border-color: #2080f0;
  background: #fafafa;
}

.project-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
  font-weight: 600;
  flex-shrink: 0;
}

.project-info {
  flex: 1;
  min-width: 0;
}

.project-info h4 {
  margin: 0 0 4px;
  font-size: 14px;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.project-info p {
  margin: 0 0 8px;
  font-size: 12px;
  color: #999;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>

<style scoped>
.home-container {
  min-height: 100vh;
}
</style>
