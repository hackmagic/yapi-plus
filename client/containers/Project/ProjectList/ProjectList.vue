<template>
  <div class="project-list">
    <n-space vertical :size="16">
      <n-card>
        <template #header>
          <n-space justify="space-between" align="center">
            <span>我的项目</span>
            <n-button type="primary" @click="$router.push('/add-project')">
              创建项目
            </n-button>
          </n-space>
        </template>
        
        <n-row :gutter="[16, 16]">
          <n-col :span="6" v-for="project in projectList" :key="project._id">
            <ProjectCard 
              :project-data="project"
              @delete="handleDelete"
              @edit="handleEdit"
            />
          </n-col>
        </n-row>
        
        <n-empty v-if="projectList.length === 0" description="暂无项目">
          <template #extra>
            <n-button @click="$router.push('/add-project')">
              创建第一个项目
            </n-button>
          </template>
        </n-empty>
      </n-card>
    </n-space>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useMessage } from 'naive-ui'
import ProjectCard from '../../components/ProjectCard/ProjectCard.vue'
import axios from 'axios'

const message = useMessage()
const projectList = ref([])

const handleDelete = (projectId) => {
  projectList.value = projectList.value.filter(p => p._id !== projectId)
}

const handleEdit = (project) => {
  message.info(`编辑项目: ${project.name}`)
}

const fetchProjects = async () => {
  try {
    const res = await axios.get('/api/project/list')
    if (res.data.errcode === 0) {
      projectList.value = res.data.data.list
    }
  } catch (error) {
    message.error('获取项目列表失败')
  }
}

onMounted(() => {
  fetchProjects()
})
</script>

<style scoped>
.project-list {
  padding: 24px;
}
</style>
