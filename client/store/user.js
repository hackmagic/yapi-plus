import { defineStore } from 'pinia'
import { ref } from 'vue'

// 用户状态管理（从 Redux user reducer 迁移）
export const useUserStore = defineStore('user', () => {
  // State
  const uid = ref(null)
  const username = ref('')
  const email = ref('')
  const loginState = ref(0) // 0: 未登录, 1: 已登录
  const curUserRole = ref('')
  const breadcrumb = ref([])

  // Actions
  function setUser(userData) {
    uid.value = userData.uid
    username.value = userData.username
    email.value = userData.email
    loginState.value = 1
    curUserRole.value = userData.role
  }

  function logout() {
    uid.value = null
    username.value = ''
    email.value = ''
    loginState.value = 0
    curUserRole.value = ''
  }

  function setBreadcrumb(breadcrumbList) {
    breadcrumb.value = breadcrumbList
  }

  return {
    uid,
    username,
    email,
    loginState,
    curUserRole,
    breadcrumb,
    setUser,
    logout,
    setBreadcrumb,
  }
})
