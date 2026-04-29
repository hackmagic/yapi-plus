import { defineStore } from 'pinia'
import http, { unwrapResponse } from '../services/http'

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
        const res = await http.get('/api/project/get', { params: { id: projectId } })
        const data = unwrapResponse(res, '获取项目失败')
        this.currentProject = data
        this.projectEnv = data.env || []
        return data
      } catch (e) {
        console.error('获取项目失败', e)
      }
      return null
    },

    async fetchProjectList(groupId) {
      try {
        const res = await http.get('/api/project/list', { params: { group_id: groupId } })
        const data = unwrapResponse(res, '获取项目列表失败')
        this.projectList = data
        return data
      } catch (e) {
        console.error('获取项目列表失败', e)
      }
      return []
    },

    async fetchAllProjects() {
      try {
        const res = await http.get('/api/project/list')
        const data = unwrapResponse(res, '获取所有项目失败')
        this.projectList = data
        return data
      } catch (e) {
        console.error('获取所有项目失败', e)
      }
      return []
    },

    async updateProject(projectId, data) {
      const res = await http.put('/api/project/up', { id: projectId, ...data })
      unwrapResponse(res, '更新失败')
      if (this.currentProject && this.currentProject._id === projectId) {
        this.currentProject = { ...this.currentProject, ...data }
      }
      return res.data
    },

    async addMember(projectId, memberData) {
      const res = await http.post('/api/project/addMember', {
        id: projectId,
        ...memberData
      })
      unwrapResponse(res, '添加成员失败')
      await this.fetchProject(projectId)
      return res.data
    },

    async removeMember(projectId, uid) {
      const res = await http.post('/api/project/delMember', {
        id: projectId,
        uid
      })
      unwrapResponse(res, '移除成员失败')
      await this.fetchProject(projectId)
      return res.data
    },

    setProjectEnv(env) {
      this.projectEnv = env
    },
  },
})