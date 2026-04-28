import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../containers/Home/Home.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../containers/Login/Login.vue')
  },
  {
    path: '/reg',
    name: 'Reg',
    component: () => import('../containers/Login/Reg.vue')
  },
  {
    path: '/setup',
    name: 'Setup',
    component: () => import('../containers/Setup/SetupWizard.vue')
  },
  {
    path: '/group/:id',
    name: 'Group',
    component: () => import('../containers/Group/Group.vue'),
    children: [
      {
        path: '',
        redirect: (to) => `/group/${to.params.id}/home`
      },
      {
        path: 'home',
        component: () => import('../containers/Group/GroupHome/GroupHome.vue')
      },
      {
        path: 'project',
        component: () => import('../containers/Group/ProjectList/ProjectList.vue')
      },
      {
        path: 'member',
        component: () => import('../containers/Group/MemberList/MemberList.vue')
      },
      {
        path: 'setting',
        component: () => import('../containers/Group/GroupSetting/GroupSetting.vue')
      },
      {
        path: 'log',
        component: () => import('../containers/Group/GroupLog/GroupLog.vue')
      }
    ]
  },
  {
    path: '/project/:id',
    name: 'Project',
    component: () => import('../containers/Project/Project.vue'),
    children: [
      {
        path: 'interface',
        component: () => import('../containers/Project/Interface/Interface.vue')
      },
      {
        path: 'setting',
        component: () => import('../containers/Project/ProjectSetting/ProjectSetting.vue')
      }
    ]
  },
  {
    path: '/add-project',
    name: 'AddProject',
    component: () => import('../containers/AddProject/AddProject.vue')
  },
  {
    path: '/user',
    name: 'UserList',
    component: () => import('../containers/User/UserList/UserList.vue'),
    meta: { requiresAdmin: true }
  },
  {
    path: '/user/:id',
    name: 'UserDetail',
    component: () => import('../containers/User/UserList/UserDetail.vue'),
    meta: { requiresAdmin: true }
  },
  {
    path: '/follows',
    name: 'Follows',
    component: () => import('../containers/Follows/Follows.vue')
  },
  {
    path: '/system-settings',
    name: 'SystemSettings',
    component: () => import('../containers/SystemSettings/SystemSettings.vue'),
    meta: { requiresAdmin: true }
  },
  {
    path: '/ai-agent',
    name: 'AiAgent',
    component: () => import('../containers/AiAgent/AiAgent.vue'),
    meta: { requiresAdmin: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 检查是否需要管理员权限
  if (to.meta.requiresAdmin) {
    // TODO: 实现管理员权限检查
    // const userInfo = getUserInfo()
    // if (userInfo.role !== 'admin') {
    //   next('/login')
    //   return
    // }
  }
  
  next()
})

export default router
