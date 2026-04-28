import { defineStore } from 'pinia'
import axios from 'axios'

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: null,
    loginState: 0,
  }),

  getters: {
    username: (state) => state.userInfo?.username || '',
    uid: (state) => state.userInfo?.uid || null,
    email: (state) => state.userInfo?.email || '',
    role: (state) => state.userInfo?.role || '',
  },

  actions: {
    setUser(userData) {
      this.userInfo = userData
      this.loginState = userData && userData.uid ? 1 : 0
    },

    async login(email, password) {
      const res = await axios.post('/api/user/login', { email, password })
      if (res.data.errcode === 0) {
        this.setUser(res.data.data)
        return res.data
      }
      throw new Error(res.data.errmsg || '登录失败')
    },

    async logout() {
      try {
        await axios.post('/api/user/logout')
      } catch (e) {
        console.error('登出请求失败', e)
      }
      this.userInfo = null
      this.loginState = 0
    },

    async fetchUserInfo() {
      try {
        const res = await axios.get('/api/user/current')
        if (res.data.errcode === 0) {
          this.setUser(res.data.data)
          return res.data.data
        }
      } catch (e) {
        console.error('获取用户信息失败', e)
      }
      return null
    },

    async updateUserInfo(data) {
      const res = await axios.put('/api/user/update', data)
      if (res.data.errcode === 0) {
        this.setUser({ ...this.userInfo, ...data })
        return res.data
      }
      throw new Error(res.data.errmsg || '更新失败')
    },

    isAdmin() {
      return this.role === 'admin'
    },
  },
})