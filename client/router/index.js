import { createRouter, createWebHistory } from 'vue-router'

// 路由配置（从 React Router 迁移）
// 注意：这里先创建一个基础路由，后续需要逐步迁移所有页面
const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../containers/Home/Home.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../containers/Login/Login.vue'),
  },
  {
    path: '/reg',
    name: 'reg',
    component: () => import('../containers/Login/Reg.vue'),
  },
  {
    path: '/group',
    name: 'group',
    component: () => import('../containers/Group/Group.vue'),
  },
  {
    path: '/project/:id',
    name: 'project',
    component: () => import('../containers/Project/Project.vue'),
  },
  {
    path: '/user',
    name: 'user',
    component: () => import('../containers/User/User.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 路由守卫（从 React Router 的认证逻辑迁移）
router.beforeEach((to, from, next) => {
  // TODO: 实现认证逻辑
  // 检查用户登录状态
  // const isAuthenticated = checkAuth()
  
  // 如果需要认证但未登录，跳转到登录页
  // if (to.name !== 'login' && !isAuthenticated) {
  //   next({ name: 'login' })
  // } else {
  //   next()
  // }
  
  next()
})

export default router
