<template>
  <div class="project-page">
    <n-layout has-sider style="min-height: calc(100vh - 60px)">
      <n-layout-sider
        bordered
        :width="200"
        :collapsed-width="64"
        collapse-mode="width"
        :collapsed="collapsed"
        show-trigger
        @collapse="collapsed = true"
        @expand="collapsed = false"
      >
        <div class="project-info" v-if="!collapsed">
          <h3>{{ projectInfo?.name || "加载中..." }}</h3>
          <p class="project-desc">{{ projectInfo?.desc || "暂无描述" }}</p>
        </div>

        <n-menu
          :value="activeMenu"
          :collapsed="collapsed"
          :collapsed-width="64"
          :options="menuOptions"
          @update:value="handleMenuSelect"
        />
      </n-layout-sider>

      <n-layout>
        <n-layout-content content-style="padding: 16px;">
          <router-view />
        </n-layout-content>
      </n-layout>
    </n-layout>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, h } from "vue";
import { useRoute, useRouter } from "vue-router";
import { NIcon } from "naive-ui";
import {
  AppsOutline,
  SettingsOutline,
  SpeedometerOutline,
  DocumentTextOutline,
  LayersOutline,
  PulseOutline,
  ServerOutline,
  KeyOutline,
} from "@vicons/ionicons5";
import { useProjectStore } from "@/store/project";

const route = useRoute();
const router = useRouter();
const projectStore = useProjectStore();

const collapsed = ref(false);
const projectId = computed(() => route.params.id);
const projectInfo = computed(() => projectStore.currentProject);
const activeMenu = computed(() => {
  const metaKey = route.meta?.menuKey;
  if (metaKey) return metaKey;
  const path = route.path;
  if (path.endsWith("/activity")) return "activity";
  if (path.endsWith("/data")) return "data";
  if (path.endsWith("/wiki")) return "wiki";
  if (path.includes("/setting")) return "setting";
  return "interface";
});

const renderIcon = (icon) => {
  return () => h(NIcon, null, { default: () => h(icon) });
};

const menuOptions = computed(() => [
  {
    label: "接口",
    key: "interface",
    icon: renderIcon(AppsOutline),
  },
  {
    label: "测试",
    key: "col",
    icon: renderIcon(LayersOutline),
  },
  {
    label: "动态",
    key: "activity",
    icon: renderIcon(PulseOutline),
  },
  {
    label: "数据管理",
    key: "data",
    icon: renderIcon(ServerOutline),
  },
  {
    label: "Wiki",
    key: "wiki",
    icon: renderIcon(DocumentTextOutline),
  },
  {
    label: "设置",
    key: "setting",
    icon: renderIcon(SettingsOutline),
    children: [
      {
        label: "基础设置",
        key: "setting/base",
        icon: renderIcon(SettingsOutline),
      },
      {
        label: "成员管理",
        key: "setting/member",
        icon: renderIcon(SpeedometerOutline),
      },
      {
        label: "环境配置",
        key: "setting/env",
        icon: renderIcon(SpeedometerOutline),
      },
      {
        label: "Token 管理",
        key: "setting/token",
        icon: renderIcon(KeyOutline),
      },
      {
        label: "数据导出",
        key: "setting/data",
        icon: renderIcon(ServerOutline),
      },
    ],
  },
]);

const loadProject = async () => {
  if (projectId.value) {
    await projectStore.fetchProject(projectId.value);
  }
};

onMounted(() => {
  loadProject();
});

const handleMenuSelect = (key) => {
  if (key === "interface") {
    router.push(`/project/${projectId.value}/interface`);
  } else if (key === "col") {
    router.push(`/project/${projectId.value}/interface/col`);
  } else if (key === "activity") {
    router.push(`/project/${projectId.value}/activity`);
  } else if (key === "data") {
    router.push(`/project/${projectId.value}/data`);
  } else if (key === "wiki") {
    router.push(`/project/${projectId.value}/wiki`);
  } else if (key.startsWith("setting")) {
    router.push(`/project/${projectId.value}/${key}`);
  }
};
</script>

<style scoped lang="scss">
.project-page {
  min-height: 100vh;
}

.project-info {
  padding: 16px;
  border-bottom: 1px solid #e8e8e8;

  h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 500;
  }

  .project-desc {
    margin: 8px 0 0;
    font-size: 12px;
    color: #999;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
