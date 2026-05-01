<template>
  <div class="setting-container">
    <n-layout has-sider>
      <n-layout-sider bordered :width="200">
        <n-menu :value="activeKey" :options="menuOptions" @update:value="handleMenuSelect" />
      </n-layout-sider>
      <n-layout-content style="padding: 24px">
        <router-view />
      </n-layout-content>
    </n-layout>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const activeKey = computed(() => route.path);

const menuOptions = [
  { label: "基本设置", key: `/project/${route.params.id}/setting/base` },
  { label: "成员管理", key: `/project/${route.params.id}/setting/member` },
  { label: "环境配置", key: `/project/${route.params.id}/setting/env` },
  { label: "Token管理", key: `/project/${route.params.id}/setting/token` },
  { label: "数据管理", key: `/project/${route.params.id}/setting/data` },
];

const handleMenuSelect = (key) => {
  router.push(key);
};
</script>
