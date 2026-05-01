<template>
  <n-layout-header class="header">
    <div class="header-inner">
      <div class="header-left">
        <router-link to="/" class="logo-link" title="首页">
          <LogoSVG />
        </router-link>
      </div>

      <div class="header-center">
        <Breadcrumb />
      </div>

      <div class="header-right" v-if="userStore.loginState">
        <n-space align="center" :size="6">
          <Search />

          <n-tooltip trigger="hover">
            <template #trigger>
              <router-link to="/follows" class="toolbar-btn">
                <n-icon :size="18"><StarOutline /></n-icon>
              </router-link>
            </template>
            我的关注
          </n-tooltip>

          <n-tooltip trigger="hover">
            <template #trigger>
              <router-link to="/add-project" class="toolbar-btn">
                <n-icon :size="18"><AddOutline /></n-icon>
              </router-link>
            </template>
            新建项目
          </n-tooltip>

          <n-dropdown :options="userMenuOptions" @select="handleUserMenu">
            <n-button text class="user-btn">
              <n-avatar :size="28" round :style="{ backgroundColor: '#2080f0' }">
                {{ userStore.username?.charAt(0)?.toUpperCase() }}
              </n-avatar>
              <span class="user-name">{{ userStore.username }}</span>
              <n-icon :size="14"><ChevronDownOutline /></n-icon>
            </n-button>
          </n-dropdown>
        </n-space>
      </div>

      <div class="header-right" v-else>
        <n-space :size="10">
          <n-button text style="color:#515a6e" @click="router.push('/login')">登录</n-button>
          <n-button type="primary" @click="router.push('/reg')">注册</n-button>
        </n-space>
      </div>
    </div>
  </n-layout-header>
</template>

<script setup>
import { h } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../../store/user";
import LogoSVG from "../../components/LogoSVG/LogoSVG.vue";
import Search from "./Search/Search.vue";
import Breadcrumb from "../Breadcrumb/Breadcrumb.vue";
import { NIcon } from "naive-ui";
import {
  StarOutline,
  AddOutline,
  PersonOutline,
  LogOutOutline,
  ChevronDownOutline,
} from "@vicons/ionicons5";

const router = useRouter();
const userStore = useUserStore();

const renderIcon = (icon) => {
  return () => h(NIcon, null, { default: () => h(icon) });
};

const userMenuOptions = [
  { label: "个人中心", key: "profile", icon: renderIcon(PersonOutline) },
  { label: "退出登录", key: "logout", icon: renderIcon(LogOutOutline) },
];

const handleUserMenu = (key) => {
  if (key === "profile") {
    router.push("/user/profile");
  } else if (key === "logout") {
    userStore.logout();
    router.push("/login");
  }
};
</script>

<style scoped>
.header {
  height: 56px;
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  width: 100%;
  padding: 0 16px;
  max-width: 1400px;
  margin: 0 auto;
}

.header-left {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
}

.logo-link {
  display: flex;
  align-items: center;
  height: 56px;
  padding: 0 12px;
  text-decoration: none;
  border-right: 1px solid #e8e8e8;
  transition: background 0.2s;
}

.logo-link:hover {
  background: #f5f7fa;
}

.header-center {
  flex: 1;
  padding: 0 20px;
  min-width: 0;
}

.header-right {
  flex: 0 0 auto;
}

.toolbar-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  color: #666;
  text-decoration: none;
  border-radius: 4px;
  transition: all 0.2s;
}

.toolbar-btn:hover {
  color: #2080f0;
  background: #f0f7ff;
}

.user-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background 0.2s;
}

.user-btn:hover {
  background: #f5f7fa;
}

.user-name {
  font-size: 14px;
  color: #333;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
