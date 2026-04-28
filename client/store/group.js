import { defineStore } from 'pinia'
import axios from 'axios'

export const useGroupStore = defineStore('group', {
  state: () => ({
    currentGroup: null,
    groupList: [],
    memberList: [],
  }),

  getters: {
    groupId: (state) => state.currentGroup?._id,
    groupName: (state) => state.currentGroup?.group_name || '',
  },

  actions: {
    async fetchGroup(groupId) {
      try {
        const res = await axios.get('/api/group/get', { params: { id: groupId } })
        if (res.data.errcode === 0) {
          this.currentGroup = res.data.data
          return res.data.data
        }
      } catch (e) {
        console.error('获取组信息失败', e)
      }
      return null
    },

    async fetchGroupList() {
      try {
        const res = await axios.get('/api/group/list')
        if (res.data.errcode === 0) {
          this.groupList = res.data.data
          return res.data.data
        }
      } catch (e) {
        console.error('获取组列表失败', e)
      }
      return []
    },

    async addGroup(data) {
      const res = await axios.post('/api/group/add', data)
      if (res.data.errcode === 0) {
        await this.fetchGroupList()
        return res.data
      }
      throw new Error(res.data.errmsg || '添加组失败')
    },

    async updateGroup(groupId, data) {
      const res = await axios.put('/api/group/up', { id: groupId, ...data })
      if (res.data.errcode === 0) {
        if (this.currentGroup && this.currentGroup._id === groupId) {
          this.currentGroup = { ...this.currentGroup, ...data }
        }
        return res.data
      }
      throw new Error(res.data.errmsg || '更新组失败')
    },

    async addMember(groupId, memberData) {
      const res = await axios.post('/api/group/addMember', {
        id: groupId,
        ...memberData
      })
      if (res.data.errcode === 0) {
        await this.fetchGroup(groupId)
        return res.data
      }
      throw new Error(res.data.errmsg || '添加成员失败')
    },

    async removeMember(groupId, uid) {
      const res = await axios.post('/api/group/delMember', {
        id: groupId,
        uid
      })
      if (res.data.errcode === 0) {
        await this.fetchGroup(groupId)
        return res.data
      }
      throw new Error(res.data.errmsg || '移除成员失败')
    },

    async fetchMemberList(groupId) {
      try {
        const res = await axios.get('/api/group/getMemberList', { params: { id: groupId } })
        if (res.data.errcode === 0) {
          this.memberList = res.data.data
          return res.data.data
        }
      } catch (e) {
        console.error('获取成员列表失败', e)
      }
      return []
    },
  },
})