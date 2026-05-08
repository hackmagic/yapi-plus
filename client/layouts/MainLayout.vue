<template>
  <n-layout class="main-layout">
    <!-- 顶部导航栏 -->
    <n-layout-header bordered class="layout-header">
      <div class="header-inner">
        <!-- 左侧 Logo -->
        <div class="header-logo" @click="$router.push('/')">
          <LogoSVG class="logo-icon" />
          <span class="logo-text">YAPI Plus</span>
        </div>

        <!-- 中间全局搜索框 -->
        <div class="header-search">
          <n-input
            v-model:value="searchKeyword"
            placeholder="搜索分组/项目/接口/文档"
            clearable
            @keyup.enter="handleSearch"
          >
            <template #prefix>
              <n-icon><SearchOutline /></n-icon>
            </template>
          </n-input>
        </div>

        <!-- 右侧用户区域 -->
        <div class="header-user">
          <n-button quaternary @click="$router.push('/user/profile')">
            <n-icon><SettingsOutline /></n-icon>
          </n-button>

          <n-dropdown
            :options="userMenuOptions"
            @select="handleUserMenuSelect"
          >
            <n-avatar
              :size="32"
              :style="{ backgroundColor: '#2080f0', cursor: 'pointer' }"
            >
              {{ userStore.username?.charAt(0)?.toUpperCase() || "U" }}
            </n-avatar>
          </n-dropdown>
        </div>
      </div>
    </n-layout-header>

    <!-- 主体内容区 -->
    <n-layout has-sider class="layout-body">
      <!-- 左侧侧边栏 -->
      <n-layout-sider
        v-if="showSidebar"
        bordered
        :width="240"
        :collapsed="collapsed"
        :collapsed-width="64"
        collapse-mode="width"
        show-trigger
        @collapse="collapsed = true"
        @expand="collapsed = false"
      >
        <GroupSidebar :collapsed="collapsed" @select="handleGroupSelect" />
      </n-layout-sider>

      <!-- 主内容区 -->
      <n-layout-content class="layout-content">
        <router-view />
      </n-layout-content>
    </n-layout>

    <!-- 全局页脚 -->
    <n-layout-footer class="layout-footer">
      <div class="footer-inner">
        <div class="footer-col">
          <h4>GitHub</h4>
          <a href="https://github.com/hackmagic/yapi-plus" target="_blank">源码仓库</a>
        </div>
        <div class="footer-col">
          <h4>团队</h4>
          <a href="https://github.com/hackmagic/yapi-plus/blob/master/README.md" target="_blank">团队介绍</a>
        </div>
        <div class="footer-col">
          <h4>反馈</h4>
          <a href="https://github.com/hackmagic/yapi-plus/issues" target="_blank">GitHub Issues</a>
        </div>
        <div class="footer-col">
          <h4>Copyright</h4>
          <p>Copyright © 2018-2026 YMFE</p>
          <p>版本 1.10.2</p>
        </div>
      </div>
    </n-layout-footer>
  </n-layout>
</template>

<script setup>
import { ref, computed, h } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/user";
import LogoSVG from "@/components/LogoSVG/LogoSVG.vue";
import GroupSidebar from "@/containers/Group/GroupList/GroupSidebar.vue";
import { NIcon } from "naive-ui";
import {
  SearchOutline,
  SettingsOutline,
  PersonOutline,
  LogOutOutline,
} from "@vicons/ionicons5";

const router = useRouter();
const userStore = useUserStore();

const collapsed = ref(false);
const searchKeyword = ref("");

// 是否显示侧边栏（根据路由meta配置）
const showSidebar = computed(() => {
  const route = router.currentRoute.value;
  return userStore.isLogin && route.meta?.showSidebar !== false;
});

// 用户下拉菜单选项
const userMenuOptions = computed(() => [
  {
    label: "个人中心",
    key: "profile",
    icon: () => h(NIcon, null, { default: () => h(PersonOutline, null) }),
  },
  {
    label: "退出登录",
    key: "logout",
    icon: () => h(NIcon, null, { default: () => h(LogOutOutline, null) }),
  },
]);

const handleUserMenuSelect = (key) => {
  if (key === "profile") {
    router.push("/user/profile");
  } else if (key === "logout") {
    handleLogout();
  }
};

const handleLogout = async () => {
  try {
    await userStore.logout();
    router.push("/login");
  } catch (e) {
    console.error("登出失败", e);
  }
};

const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    router.push({ path: "/search", query: { q: searchKeyword.value } });
  }
};

const handleGroupSelect = (group) => {
  router.push(`/group/${group._id}/home`);
};
</script>

<style scoped lang="scss">
.main-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.layout-header {
  padding: 0 24px;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  z-index: 100;
  height: 60px;
  display: flex;
  align-items: center;
}

.header-inner {
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 24px;
}

.header-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  flex-shrink: 0;

  .logo-icon {
    width: 32px;
    height: 32px;
  }

  .logo-text {
    font-size: 18px;
    font-weight: 600;
    color: #333;
  }
}

.header-search {
  flex: 1;
  max-width: 500px;
}

.header-user {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.layout-body {
  flex: 1;
}

.layout-content {
  padding: 24px;
  background: #f5f7fa;
  min-height: calc(100vh - 60px - 120px); // header + footer 高度
}

.layout-footer {
  background: #1a1a2e;
  color: rgba(255, 255, 255, 0.7);
  padding: 40px 24px;
}

.footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;

  .footer-col {
    h4 {
      color: #fff;
      margin: 0 0 12px;
      font-size: 16px;
    }

    a, p {
      color: rgba(255, 255, 255, 0.6);
      text-decoration: none;
      font-size: 14px;
      margin: 0 0 8px;
      display: block;

      &:hover {
        color: #fff;
      }
    }

    p {
      margin: 0 0 4px;
    }
  }
}

@media (max-width: 768px) {
  .header-search {
    display: none;
  }

  .footer-inner {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
