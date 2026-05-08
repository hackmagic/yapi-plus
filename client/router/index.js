import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "../store/user";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("../containers/Home/Home.vue"),
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../containers/Login/Login.vue"),
  },
  {
    path: "/reg",
    name: "Reg",
    component: () => import("../containers/Login/Reg.vue"),
  },
  {
    path: "/setup",
    name: "Setup",
    component: () => import("../containers/Setup/SetupWizard.vue"),
  },
  // 使用全局布局的路由
  {
    path: "/group/:id",
    component: () => import("../layouts/MainLayout.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        redirect: (to) => `/group/${to.params.id}/home`,
      },
      {
        path: "home",
        name: "GroupHome",
        component: () => import("../containers/Group/GroupHome/GroupHome.vue"),
        meta: { showSidebar: true },
      },
      {
        path: "project",
        name: "GroupProject",
        component: () => import("../containers/Group/ProjectList/ProjectList.vue"),
        meta: { showSidebar: true },
      },
      {
        path: "member",
        name: "GroupMember",
        component: () => import("../containers/Group/MemberList/MemberList.vue"),
        meta: { showSidebar: true },
      },
      {
        path: "setting",
        name: "GroupSetting",
        component: () => import("../containers/Group/GroupSetting/GroupSetting.vue"),
        meta: { showSidebar: true },
      },
      {
        path: "log",
        name: "GroupLog",
        component: () => import("../containers/Group/GroupLog/GroupLog.vue"),
        meta: { showSidebar: true },
      },
    ],
  },
  {
    path: "/project/:id",
    component: () => import("../layouts/MainLayout.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        redirect: (to) => `/project/${to.params.id}/interface`,
      },
      {
        path: "interface",
        name: "ProjectInterface",
        component: () => import("../containers/Project/Project.vue"),
        meta: { showSidebar: false }, // Project.vue 有自己的侧边栏
        children: [
          {
            path: "",
            redirect: (to) => `/project/${to.params.id}/interface`,
          },
          {
            path: "/project/:id/interface",
            component: () => import("../containers/Project/Interface/Interface.vue"),
          },
        ],
      },
      {
        path: "setting",
        name: "ProjectSetting",
        component: () => import("../containers/Project/Project.vue"),
        meta: { showSidebar: false },
        children: [
          {
            path: "",
            component: () => import("../containers/Project/ProjectSetting/ProjectSetting.vue"),
          },
        ],
      },
      {
        path: "activity",
        name: "ProjectActivity",
        component: () => import("../containers/Project/Project.vue"),
        meta: { showSidebar: false },
        children: [
          {
            path: "",
            component: () => import("../containers/Project/Activity/Activity.vue"),
          },
        ],
      },
      {
        path: "data",
        name: "ProjectData",
        component: () => import("../containers/Project/Project.vue"),
        meta: { showSidebar: false },
        children: [
          {
            path: "",
            component: () => import("../containers/Project/ProjectData/DataPage.vue"),
          },
        ],
      },
      {
        path: "members",
        name: "ProjectMember",
        component: () => import("../containers/Project/Project.vue"),
        meta: { showSidebar: false },
        children: [
          {
            path: "",
            component: () => import("../containers/Project/ProjectSetting/MemberSetting.vue"),
          },
        ],
      },
    ],
  },
  // 使用全局布局的独立页面
  {
    path: "/add-project",
    component: () => import("../layouts/MainLayout.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "AddProject",
        component: () => import("../containers/AddProject/AddProject.vue"),
        meta: { showSidebar: false },
      },
    ],
  },
  {
    path: "/add-group",
    component: () => import("../layouts/MainLayout.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "AddGroup",
        component: () => import("../containers/AddGroup/AddGroup.vue"),
        meta: { showSidebar: false },
      },
    ],
  },
  {
    path: "/user",
    component: () => import("../layouts/MainLayout.vue"),
    meta: { requiresAdmin: true },
    children: [
      {
        path: "",
        name: "UserList",
        component: () => import("../containers/User/UserList/UserList.vue"),
        meta: { showSidebar: false },
      },
    ],
  },
  {
    path: "/user/:id",
    component: () => import("../layouts/MainLayout.vue"),
    meta: { requiresAdmin: true },
    children: [
      {
        path: "",
        name: "UserDetail",
        component: () => import("../containers/User/UserList/UserDetail.vue"),
        meta: { showSidebar: false },
      },
    ],
  },
  {
    path: "/user/profile",
    component: () => import("../layouts/MainLayout.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "UserProfile",
        component: () => import("../containers/User/UserList/UserSettings.vue"),
        meta: { showSidebar: false },
      },
    ],
  },
  {
    path: "/follows",
    component: () => import("../layouts/MainLayout.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "Follows",
        component: () => import("../containers/Follows/Follows.vue"),
        meta: { showSidebar: true },
      },
    ],
  },
  {
    path: "/my-projects",
    component: () => import("../layouts/MainLayout.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "MyProjects",
        component: () => import("../containers/Project/ProjectList/ProjectList.vue"),
        meta: { showSidebar: true },
      },
    ],
  },
  {
    path: "/system-settings",
    component: () => import("../layouts/MainLayout.vue"),
    meta: { requiresAdmin: true },
    children: [
      {
        path: "",
        name: "SystemSettings",
        component: () => import("../containers/SystemSettings/SystemSettings.vue"),
        meta: { showSidebar: false },
      },
    ],
  },
  {
    path: "/ai-agent",
    component: () => import("../layouts/MainLayout.vue"),
    meta: { requiresAdmin: true },
    children: [
      {
        path: "",
        name: "AiAgent",
        component: () => import("../containers/AiAgent/AiAgent.vue"),
        meta: { showSidebar: false },
      },
    ],
  },
  {
    path: "/ai-chat",
    component: () => import("../layouts/MainLayout.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "AiChat",
        component: () => import("../containers/AiAgent/AiChat.vue"),
        meta: { showSidebar: false },
      },
    ],
  },
  {
    path: "/search",
    component: () => import("../layouts/MainLayout.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "Search",
        component: () => import("../containers/Search/Search.vue"),
        meta: { showSidebar: false },
      },
    ],
  },
  {
    path: "/news",
    component: () => import("../layouts/MainLayout.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "News",
        component: () => import("../containers/News/NewsTimeline/NewsTimeline.vue"),
        meta: { showSidebar: true },
      },
    ],
  },
  {
    path: "/news/list",
    component: () => import("../layouts/MainLayout.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "NewsList",
        component: () => import("../containers/News/NewsList/NewsList.vue"),
        meta: { showSidebar: true },
      },
    ],
  },
  {
    path: "/project/:projectId/interface/col/:colId",
    name: "InterfaceColContent",
    component: () => import("../containers/Project/Interface/Interface.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        redirect: (to) => `/project/${to.params.projectId}/interface/col/${to.params.colId}/list`,
      },
      {
        path: "list",
        component: () =>
          import("../containers/Project/Interface/InterfaceCol/InterfaceColContent.vue"),
      },
      {
        path: "run",
        component: () => import("../containers/Project/Interface/InterfaceCol/CaseReport.vue"),
      },
      {
        path: "import",
        component: () => import("../containers/Project/Interface/InterfaceCol/ImportInterface.vue"),
      },
      {
        path: "addCase",
        component: () => import("../containers/Project/Interface/InterfaceList/Run/Run.vue"),
      },
    ],
  },
  {
    path: "/project/:projectId/interface/case/:caseId",
    name: "InterfaceCaseContent",
    component: () => import("../containers/Project/Interface/Interface.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        component: () =>
          import("../containers/Project/Interface/InterfaceCol/InterfaceCaseContent.vue"),
      },
      {
        path: "run",
        component: () => import("../containers/Project/Interface/InterfaceList/Run/Run.vue"),
      },
    ],
  },
  {
    path: "/project/:id/interface/api/:actionId",
    name: "InterfaceWithId",
    component: () => import("../containers/Project/Interface/Interface.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        component: () =>
          import("../containers/Project/Interface/InterfaceList/InterfaceEditForm.vue"),
      },
      {
        path: "run",
        component: () => import("../containers/Project/Interface/InterfaceList/Run/Run.vue"),
      },
    ],
  },
  {
    path: "/devtools",
    name: "DevTools",
    component: () => import("../containers/DevTools/DevTools.vue"),
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 路由守卫：检查认证状态
let lastUserInfo = null;
let lastUserFetchedAt = 0;
const USER_CACHE_MAX_AGE = 5 * 60 * 1000; // 5分钟

router.beforeEach(async (to, from, next) => {
  const isLoginPage = to.path === "/login" || to.path === "/reg" || to.path === "/setup";
  
  // 公开页面直接放行
  if (isLoginPage) {
    next();
    return;
  }

  try {
    const userStore = useUserStore();
    
    // 判断缓存是否可用
    const now = Date.now();
    let userInfo = null;
    
    if (lastUserInfo && now - lastUserFetchedAt < USER_CACHE_MAX_AGE) {
      userInfo = lastUserInfo;
    } else {
      userInfo = await userStore.fetchUserInfo({ maxAgeMs: USER_CACHE_MAX_AGE });
      lastUserInfo = userInfo;
      lastUserFetchedAt = now;
    }
    
    // 如果需要管理员权限
    if (to.meta.requiresAdmin) {
      if (!userInfo || userInfo.role !== "admin") {
        next("/login");
        return;
      }
    } 
    // 如果只需要登录
    else if (to.meta.requiresAuth) {
      if (!userInfo) {
        next("/login");
        return;
      }
    }
    
    next();
  } catch (e) {
    // 401/失效/异常，清理缓存并重定向到登录页
    lastUserInfo = null;
    lastUserFetchedAt = 0;
    next("/login");
  }
});

export default router;
