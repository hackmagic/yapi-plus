import { defineStore } from 'pinia'
import axios from 'axios'

export const useInterfaceColStore = defineStore('interfaceCol', {
  state: () => ({
    colList: [],
    currentCol: null,
    caseList: [],
    isShowCol: false,
  }),

  getters: {
    currentColId: (state) => state.currentCol?._id,
  },

  actions: {
    setColData(data) {
      if (data.isShowCol !== undefined) {
        this.isShowCol = data.isShowCol
      }
      if (data.colList) {
        this.colList = data.colList
      }
      if (data.currentCol) {
        this.currentCol = data.currentCol
      }
      if (data.caseList) {
        this.caseList = data.caseList
      }
    },

    async fetchColList(projectId) {
      try {
        const res = await axios.get('/api/interfaceCol/list', { params: { project_id: projectId } })
        if (res.data.errcode === 0) {
          this.colList = res.data.data
          return res.data.data
        }
      } catch (e) {
        console.error('获取集合列表失败', e)
      }
      return []
    },

    async fetchCaseList(colId) {
      try {
        const res = await axios.get('/api/interfaceCol/getCaseList', { params: { col_id: colId } })
        if (res.data.errcode === 0) {
          this.caseList = res.data.data
          return res.data.data
        }
      } catch (e) {
        console.error('获取用例列表失败', e)
      }
      return []
    },

    async addCol(projectId, data) {
      const res = await axios.post('/api/interfaceCol/add', {
        project_id: projectId,
        ...data
      })
      if (res.data.errcode === 0) {
        await this.fetchColList(projectId)
        return res.data
      }
      throw new Error(res.data.errmsg || '添加集合失败')
    },

    async updateCol(colId, data) {
      const res = await axios.put('/api/interfaceCol/up', { id: colId, ...data })
      if (res.data.errcode === 0) {
        const index = this.colList.findIndex(c => c._id === colId)
        if (index !== -1) {
          this.colList[index] = { ...this.colList[index], ...data }
        }
        return res.data
      }
      throw new Error(res.data.errmsg || '更新集合失败')
    },

    async deleteCol(colId, projectId) {
      const res = await axios.delete('/api/interfaceCol/del', { data: { id: colId } })
      if (res.data.errcode === 0) {
        await this.fetchColList(projectId)
        return res.data
      }
      throw new Error(res.data.errmsg || '删除集合失败')
    },

    async addCase(colId, data) {
      const res = await axios.post('/api/interfaceCase/add', {
        col_id: colId,
        ...data
      })
      if (res.data.errcode === 0) {
        await this.fetchCaseList(colId)
        return res.data
      }
      throw new Error(res.data.errmsg || '添加用例失败')
    },

    async updateCase(caseId, data) {
      const res = await axios.put('/api/interfaceCase/up', { id: caseId, ...data })
      if (res.data.errcode === 0) {
        const index = this.caseList.findIndex(c => c._id === caseId)
        if (index !== -1) {
          this.caseList[index] = { ...this.caseList[index], ...data }
        }
        return res.data
      }
      throw new Error(res.data.errmsg || '更新用例失败')
    },

    async deleteCase(caseId, colId) {
      const res = await axios.delete('/api/interfaceCase/del', { data: { id: caseId } })
      if (res.data.errcode === 0) {
        await this.fetchCaseList(colId)
        return res.data
      }
      throw new Error(res.data.errmsg || '删除用例失败')
    },

    async runCases(colId) {
      const res = await axios.post('/api/interfaceCol/run', { col_id: colId })
      if (res.data.errcode === 0) {
        return res.data.data
      }
      throw new Error(res.data.errmsg || '运行失败')
    },

    setCurrentCol(col) {
      this.currentCol = col
    },
  },
})