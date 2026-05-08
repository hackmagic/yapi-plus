<template>
  <n-layout-header class="header">
    <div class="header-inner">
      <div class="header-left">
        <router-link to="/group" class="logo-link" title="YAPI Plus">
          <LogoSVG />
          <span class="logo-text">YAPI</span>
        </router-link>
      </div>

      <div class="header-center">
        <Breadcrumb />
      </div>

      <div class="header-right" v-if="isLogin">
        <n-space align="center" :size="6">
          <Search />

          <n-tooltip trigger="hover">
            <template #trigger>
              <router-link to="/my-projects" class="toolbar-btn">
                <n-icon :size="18"><AppsOutline /></n-icon>
              </router-link>
            </template>
            我的项目
          </n-tooltip>

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
              <router-link to="/ai-chat" class="toolbar-btn">
                <n-icon :size="18"><ChatbubbleEllipsesOutline /></n-icon>
              </router-link>
            </template>
            AI 对话
          </n-tooltip>

          <n-tooltip trigger="hover">
            <template #trigger>
              <router-link to="/add-project" class="toolbar-btn">
                <n-icon :size="18"><AddOutline /></n-icon>
              </router-link>
            </template>
            新建项目
          </n-tooltip>

          <n-tooltip trigger="hover">
            <template #trigger>
              <a href="https://hellosean1025.github.io/yapi" target="_blank" class="toolbar-btn">
                <n-icon :size="18"><HelpCircleOutline /></n-icon>
              </a>
            </template>
            使用文档
          </n-tooltip>

          <n-dropdown :options="userMenuOptions" @select="handleUserMenu" trigger="click">
            <n-button text class="user-btn">
              <n-avatar
                :size="28"
                round
                :src="avatarUrl"
                :style="{ backgroundColor: '#2395f1' }"
              >
                {{ username?.charAt(0)?.toUpperCase() }}
              </n-avatar>
              <span class="user-name">{{ username }}</span>
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
import { h, computed } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../../store/user";
import LogoSVG from "../../components/LogoSVG/LogoSVG.vue";
import Search from "./Search/Search.vue";
import Breadcrumb from "../Breadcrumb/Breadcrumb.vue";
import { NIcon, useMessage } from "naive-ui";
import {
  StarOutline,
  AddOutline,
  AppsOutline,
  PersonOutline,
  LogOutOutline,
  ChevronDownOutline,
  HelpCircleOutline,
  SettingsOutline,
  ChatbubbleEllipsesOutline,
} from "@vicons/ionicons5";

const router = useRouter();
const userStore = useUserStore();
const message = useMessage();

const isLogin = computed(() => userStore.isLogin);
const username = computed(() => userStore.username);
const userRole = computed(() => userStore.role);
const uid = computed(() => userStore.uid);

const avatarUrl = computed(() => {
  if (uid.value) {
    return `/api/user/avatar?uid=${uid.value}`;
  }
  return "";
});

const renderIcon = (icon) => {
  return () => h(NIcon, null, { default: () => h(icon) });
};

const userMenuOptions = computed(() => {
  const options = [
    { label: "个人中心", key: "profile", icon: renderIcon(PersonOutline) },
  ];

  // 管理员显示系统设置
  if (userRole.value === "admin") {
    options.push(
      { label: "系统设置", key: "system", icon: renderIcon(SettingsOutline) },
      { label: "用户管理", key: "userlist", icon: renderIcon(PersonOutline) }
    );
  }

  options.push({ type: "divider", key: "d1" });
  options.push({ label: "退出登录", key: "logout", icon: renderIcon(LogOutOutline) });

  return options;
});

const handleUserMenu = (key) => {
  switch (key) {
    case "profile":
      router.push(`/user/profile`);
      break;
    case "system":
      router.push("/system-settings");
      break;
    case "userlist":
      router.push("/user");
      break;
    case "logout":
      handleLogout();
      break;
  }
};

const handleLogout = async () => {
  try {
    await userStore.logout();
    message.success("退出成功");
    router.push("/login");
  } catch (e) {
    console.error("退出失败", e);
    message.error("退出失败，请重试");
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
