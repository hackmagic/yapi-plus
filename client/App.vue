<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-message-provider>
      <n-dialog-provider>
        <Header v-if="!isAuthPage" />
        <div class="main-content">
          <router-view />
        </div>
        <Footer v-if="!isAuthPage" />
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { NConfigProvider, NMessageProvider, NDialogProvider } from "naive-ui";
import Header from "./components/Header/Header.vue";
import Footer from "./components/Footer/Footer.vue";

const route = useRoute();

const authPages = ["/", "/login", "/reg", "/setup"];
const isAuthPage = computed(() => authPages.includes(route.path));

// Naive UI 主题配置
const themeOverrides = {
  common: {
    primaryColor: "#2395f1",
    primaryColorHover: "#4098fc",
    primaryColorPressed: "#1a7dd8",
    primaryColorSuppl: "#66b9f7",
  },
};
</script>

<style>
#app {
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans",
    sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.main-content {
  min-height: calc(100vh - 56px);
}
</style>
