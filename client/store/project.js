import { defineStore } from 'pinia'
import axios from 'axios'

export const useProjectStore = defineStore('project', {
  state: () => ({
    currentProject: null,
    projectList: [],
    memberList: [],
    projectEnv: [],
  }),

  getters: {
    projectId: (state) => state.currentProject?._id,
    projectName: (state) => state.currentProject?.name || '',
    projectGroupId: (state) => state.currentProject?.group_id,
  },

  actions: {
    async fetchProject(projectId) {
      try {
        const res = await axios.get('/api/project/get', { params: { id: projectId } })
        if (res.data.errcode === 0) {
          this.currentProject = res.data.data
          this.projectEnv = res.data.data.env || []
          return res.data.data
        }
      } catch (e) {
        console.error('获取项目失败', e)
      }
      return null
    },

    async fetchProjectList(groupId) {
      try {
        const res = await axios.get('/api/project/list', { params: { group_id: groupId } })
        if (res.data.errcode === 0) {
          this.projectList = res.data.data
          return res.data.data
        }
      } catch (e) {
        console.error('获取项目列表失败', e)
      }
      return []
    },

    async fetchAllProjects() {
      try {
        const res = await axios.get('/api/project/list')
        if (res.data.errcode === 0) {
          this.projectList = res.data.data
          return res.data.data
        }
      } catch (e) {
        console.error('获取所有项目失败', e)
      }
      return []
    },

    async updateProject(projectId, data) {
      const res = await axios.put('/api/project/up', { id: projectId, ...data })
      if (res.data.errcode === 0) {
        if (this.currentProject && this.currentProject._id === projectId) {
          this.currentProject = { ...this.currentProject, ...data }
        }
        return res.data
      }
      throw new Error(res.data.errmsg || '更新失败')
    },

    async addMember(projectId, memberData) {
      const res = await axios.post('/api/project/addMember', {
        id: projectId,
        ...memberData
      })
      if (res.data.errcode === 0) {
        await this.fetchProject(projectId)
        return res.data
      }
      throw new Error(res.data.errmsg || '添加成员失败')
    },

    async removeMember(projectId, uid) {
      const res = await axios.post('/api/project/delMember', {
        id: projectId,
        uid
      })
      if (res.data.errcode === 0) {
        await this.fetchProject(projectId)
        return res.data
      }
      throw new Error(res.data.errmsg || '移除成员失败')
    },

    setProjectEnv(env) {
      this.projectEnv = env
    },
  },
})