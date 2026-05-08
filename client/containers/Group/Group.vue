<template>
  <div class="group-page">
    <!-- 分组信息卡片 -->
    <n-card :title="groupInfo?.group_name || '加载中...'" :bordered="false" class="group-info-card">
      <n-descriptions :column="2" v-if="groupInfo">
        <n-descriptions-item label="组名称">{{ groupInfo.group_name }}</n-descriptions-item>
        <n-descriptions-item label="组类型">
          {{ groupInfo.type === "public" ? "公开" : "私有" }}
        </n-descriptions-item>
        <n-descriptions-item label="描述" :span="2">
          {{ groupInfo.group_desc || "暂无描述" }}
        </n-descriptions-item>
      </n-descriptions>
    </n-card>

    <!-- 标签页 -->
    <div class="group-tabs">
      <n-tabs type="line" :value="activeTab" @update:value="handleTabChange">
        <n-tab-pane name="project" tab="项目列表" />
        <n-tab-pane
          v-if="groupInfo?.type === 'public'"
          name="member"
          tab="成员列表"
        />
        <n-tab-pane
          v-if="canViewLog"
          name="log"
          tab="分组动态"
        />
        <n-tab-pane
          v-if="canViewSetting"
          name="setting"
          tab="分组设置"
        />
      </n-tabs>
    </div>

    <!-- 标签页内容 -->
    <div class="tab-content">
      <router-view v-if="!showProjectTab" />
      <ProjectList v-else :group-id="groupId" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useGroupStore } from "@/store/group";
import { useUserStore } from "@/store/user";
import ProjectList from "../Project/ProjectList/ProjectList.vue";
import GroupSidebar from "./GroupList/GroupSidebar.vue";

const route = useRoute();
const router = useRouter();
const groupStore = useGroupStore();
const userStore = useUserStore();

const collapsed = ref(false);
const groupId = computed(() => route.params.id);
const groupInfo = ref(null);
const activeTab = ref("project");

const showProjectTab = computed(() => activeTab.value === "project");

// 权限控制
const userRole = computed(() => userStore.role);
const userRoleInGroup = computed(() => groupStore.roleInGroup || groupInfo.value?.role || "");

// 是否可以查看日志
const canViewLog = computed(() => {
  return (
    ["admin", "owner", "guest", "dev"].indexOf(userRoleInGroup.value) > -1 ||
    userRole.value === "admin"
  );
});

// 是否可以查看设置
const canViewSetting = computed(() => {
  return (
    (userRole.value === "admin" || userRoleInGroup.value === "owner") &&
    groupInfo.value?.type !== "private"
  );
});

const loadGroup = async () => {
  try {
    const data = await groupStore.fetchGroup(groupId.value);
    if (data) {
      groupInfo.value = data;
    }
  } catch (error) {
    console.error("加载失败:", error);
  }
};

// 项目数量统计
const projectCount = computed(() => {
  // 这里可以从ProjectList组件获取，或者从groupInfo里获取
  // 暂时先返回0，待ProjectList组件完善后对接
  return 0;
});

onMounted(() => {
  loadGroup();
  // 从路由中获取当前 tab
  const tab = route.path.split("/").pop();
  if (["home", "project", "member", "setting", "log"].includes(tab)) {
    activeTab.value = tab;
  }
});

watch(
  () => route.params.id,
  () => {
    loadGroup();
  },
);

const handleTabChange = (tab) => {
  activeTab.value = tab;
  router.push(`/group/${groupId.value}/${tab}`);
};

const handleGroupSelect = (group) => {
  if (group._id !== groupId.value) {
    router.push(`/group/${group._id}/project`);
  }
};
</script>

<style scoped lang="scss">
.group-page {
  min-height: 100%;
}

.group-info-card {
  margin-bottom: 16px;
}

.group-tabs {
  background: #fff;
  padding: 0 16px;
  border-radius: 4px 4px 0 0;
  border-bottom: 1px solid #f0f0f0;
}

.tab-content {
  background: #fff;
  padding: 16px;
  min-height: 400px;
  border-radius: 0 0 4px 4px;
}
</style>
