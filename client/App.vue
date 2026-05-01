<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-message-provider>
      <n-dialog-provider>
        <Header v-if="!isAuthPage" />
        <router-view />
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { NConfigProvider, NMessageProvider, NDialogProvider } from "naive-ui";
import Header from "./components/Header/Header.vue";

const route = useRoute();

const authPages = ["/login", "/reg", "/setup"];
const isAuthPage = computed(() => authPages.includes(route.path));

// Naive UI 主题配置
const themeOverrides = {
  common: {
    primaryColor: "#2080f0",
    primaryColorHover: "#4098fc",
    primaryColorPressed: "#1060c9",
    primaryColorSuppl: "#4098fc",
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
</style>
