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
  {
    path: "/group/:id",
    name: "Group",
    component: () => import("../containers/Group/Group.vue"),
    children: [
      {
        path: "",
        redirect: (to) => `/group/${to.params.id}/home`,
      },
      {
        path: "home",
        component: () => import("../containers/Group/GroupHome/GroupHome.vue"),
      },
      {
        path: "project",
        component: () => import("../containers/Group/ProjectList/ProjectList.vue"),
      },
      {
        path: "member",
        component: () => import("../containers/Group/MemberList/MemberList.vue"),
      },
      {
        path: "setting",
        component: () => import("../containers/Group/GroupSetting/GroupSetting.vue"),
      },
      {
        path: "log",
        component: () => import("../containers/Group/GroupLog/GroupLog.vue"),
      },
    ],
  },
  {
    path: "/project/:id",
    name: "Project",
    component: () => import("../containers/Project/Project.vue"),
    children: [
      {
        path: "interface",
        component: () => import("../containers/Project/Interface/Interface.vue"),
      },
      {
        path: "setting",
        component: () => import("../containers/Project/ProjectSetting/ProjectSetting.vue"),
      },
      {
        path: "activity",
        name: "Activity",
        component: () => import("../containers/Project/Activity/Activity.vue"),
      },
      {
        path: "data",
        name: "ProjectData",
        component: () => import("../containers/Project/ProjectData/DataPage.vue"),
      },
      {
        path: "members",
        name: "ProjectMember",
        component: () => import("../containers/Project/Setting/ProjectMember/ProjectMember.vue"),
      },
    ],
  },
  {
    path: "/add-project",
    name: "AddProject",
    component: () => import("../containers/AddProject/AddProject.vue"),
  },
  {
    path: "/add-group",
    name: "AddGroup",
    component: () => import("../containers/AddGroup/AddGroup.vue"),
  },
  {
    path: "/user",
    name: "UserList",
    component: () => import("../containers/User/UserList/UserList.vue"),
    meta: { requiresAdmin: true },
  },
  {
    path: "/user/:id",
    name: "UserDetail",
    component: () => import("../containers/User/UserList/UserDetail.vue"),
    meta: { requiresAdmin: true },
  },
  {
    path: "/user/profile",
    name: "UserProfile",
    component: () => import("../containers/User/UserList/UserSettings.vue"),
  },
  {
    path: "/follows",
    name: "Follows",
    component: () => import("../containers/Follows/Follows.vue"),
  },
  {
    path: "/system-settings",
    name: "SystemSettings",
    component: () => import("../containers/SystemSettings/SystemSettings.vue"),
    meta: { requiresAdmin: true },
  },
  {
    path: "/ai-agent",
    name: "AiAgent",
    component: () => import("../containers/AiAgent/AiAgent.vue"),
    meta: { requiresAdmin: true },
  },
  {
    path: "/search",
    name: "Search",
    component: () => import("../containers/Search/Search.vue"),
  },
  {
    path: "/news",
    name: "News",
    component: () => import("../containers/News/NewsTimeline/NewsTimeline.vue"),
  },
  {
    path: "/news/list",
    name: "NewsList",
    component: () => import("../containers/News/NewsList/NewsList.vue"),
  },
  {
    path: "/project/:projectId/interface/col/:colId",
    name: "InterfaceColContent",
    component: () => import("../containers/Project/Interface/Interface.vue"),
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
    path: "/project/:projectId/setting/mock",
    name: "ProjectMock",
    component: () => import("../containers/Project/Setting/ProjectMock/ProjectMock.vue"),
  },
  {
    path: "/project/:projectId/setting/request",
    name: "ProjectRequest",
    component: () => import("../containers/Project/Setting/ProjectRequest/ProjectRequest.vue"),
  },
  {
    path: "/project/:projectId/setting/tag",
    name: "ProjectTag",
    component: () => import("../containers/Project/Setting/ProjectMessage/ProjectTag.vue"),
  },
  {
    path: "/devtools",
    name: "DevTools",
    component: () => import("../containers/DevTools/DevTools.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 路由守卫优化：缓存用户信息，401/登出/定时失效
let lastUserInfo = null;
let lastUserFetchedAt = 0;
const USER_CACHE_MAX_AGE = 5 * 60 * 1000; // 5分钟

router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAdmin) {
    const isLoginPage = to.path === "/login";
    if (!isLoginPage) {
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
        if (!userInfo || userInfo.role !== "admin") {
          next("/login");
          return;
        }
      } catch (e) {
        // 401/失效/异常，清理缓存
        lastUserInfo = null;
        lastUserFetchedAt = 0;
        next("/login");
        return;
      }
    }
  }
  next();
});

export default router;
