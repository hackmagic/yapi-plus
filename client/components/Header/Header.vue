<template>
  <n-layout-header class="header">
    <div class="header-content">
      <div class="header-left">
        <router-link to="/" class="logo">
          <LogoSVG />
          <span class="logo-text">YAPI Plus</span>
        </router-link>
      </div>

      <div class="header-center">
        <n-menu v-model:value="activeMenu" :options="menuOptions" mode="horizontal" />
      </div>

      <div class="header-right">
        <n-space>
          <Search />
          <template v-if="userStore.loginState">
            <n-tooltip trigger="hover">
              <template #trigger>
                <n-button text @click="router.push('/follows')">
                  <n-icon :size="20"><StarOutline /></n-icon>
                </n-button>
              </template>
              我的关注
            </n-tooltip>
            <n-tooltip trigger="hover">
              <template #trigger>
                <n-button text @click="router.push('/add-project')">
                  <n-icon :size="20"><AddOutline /></n-icon>
                </n-button>
              </template>
              新建项目
            </n-tooltip>
            <n-dropdown :options="userMenuOptions" @select="handleUserMenu">
              <n-button text>
                <n-avatar :size="28" :style="{ backgroundColor: '#2080f0' }">
                  {{ userStore.username?.charAt(0)?.toUpperCase() }}
                </n-avatar>
              </n-button>
            </n-dropdown>
          </template>
          <template v-else>
            <n-button @click="$router.push('/login')">登录</n-button>
          </template>
        </n-space>
      </div>
    </div>
  </n-layout-header>
</template>

<script setup>
import { ref, h, computed } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../../store/user";
import LogoSVG from "../../components/LogoSVG/LogoSVG.vue";
import Search from "./Search/Search.vue";
import { NIcon } from "naive-ui";
import { StarOutline, AddOutline } from "@vicons/ionicons5";

const router = useRouter();
const userStore = useUserStore();
const activeMenu = ref("home");

const menuOptions = computed(() => {
  const options = [
    { label: "首页", key: "home", onClick: () => router.push("/") },
    { label: "项目广场", key: "group", onClick: () => router.push("/group") },
  ];

  if (userStore.role === "admin") {
    options.push(
      { label: "AI 助手", key: "ai-agent", onClick: () => router.push("/ai-agent") },
      { label: "用户管理", key: "user-manage", onClick: () => router.push("/user") },
      { label: "系统设置", key: "system-settings", onClick: () => router.push("/system-settings") },
    );
  }

  return options;
});

const userMenuOptions = [
  { label: "个人中心", key: "profile", icon: () => h("span", {}, "👤") },
  { label: "退出登录", key: "logout", icon: () => h("span", {}, "🚪") },
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
  height: 60px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
  background: #fff;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.header-left {
  flex: 0 0 auto;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: inherit;
}

.logo-text {
  font-size: 20px;
  font-weight: bold;
  color: #2080f0;
}

.header-center {
  flex: 1;
  margin: 0 24px;
}

.header-right {
  flex: 0 0 auto;
}
</style>
