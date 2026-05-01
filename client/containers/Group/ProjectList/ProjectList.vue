<template>
  <div class="project-list-page">
    <n-spin :show="loading">
      <n-empty v-if="projectList.length === 0 && !loading" description="暂无项目" />
      <div v-else class="project-grid">
        <n-card
          v-for="project in projectList"
          :key="project._id"
          class="project-card"
          hoverable
          @click="handleProjectClick(project)"
        >
          <div class="project-icon" :style="{ backgroundColor: project.color || '#2080f0' }">
            {{ project.name?.charAt(0)?.toUpperCase() || "P" }}
          </div>
          <div class="project-info">
            <h4>{{ project.name }}</h4>
            <p>{{ project.desc || "暂无描述" }}</p>
            <div class="project-meta">
              <span>{{ project.basepath || "/" }}</span>
              <n-tag :type="project.project_type === 'public' ? 'success' : 'default'" size="small">
                {{ project.project_type === "public" ? "公开" : "私有" }}
              </n-tag>
            </div>
          </div>
        </n-card>
      </div>
    </n-spin>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useProjectStore } from "@/store/project";

const props = defineProps({
  groupId: {
    type: [Number, String],
    default: null,
  },
});

const router = useRouter();
const projectStore = useProjectStore();

const loading = ref(false);
const projectList = computed(() => projectStore.projectList);

const loadProjects = async () => {
  loading.value = true;
  try {
    if (props.groupId) {
      await projectStore.fetchProjectList(props.groupId);
    } else {
      await projectStore.fetchAllProjects();
    }
  } catch (e) {
    console.error("加载项目失败", e);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadProjects();
});

const handleProjectClick = (project) => {
  router.push(`/project/${project._id}`);
};
</script>

<style scoped lang="scss">
.project-list-page {
  min-height: 400px;
}

.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.project-card {
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .project-icon {
    width: 48px;
    height: 48px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 12px;
  }

  .project-info {
    h4 {
      margin: 0 0 8px;
      font-size: 16px;
      font-weight: 500;
    }

    p {
      margin: 0 0 12px;
      font-size: 13px;
      color: #999;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .project-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
      color: #999;
    }
  }
}
</style>
