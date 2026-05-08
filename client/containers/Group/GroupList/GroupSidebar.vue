<template>
  <div class="group-sidebar">
    <n-menu
      :value="selectedGroupId"
      :options="menuOptions"
      :collapsed="collapsed"
      :collapsed-width="64"
      :collapsed-icon-size="22"
      @update:value="handleSelect"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useGroupStore } from "@/store/group";
import { HomeOutline, PeopleOutline } from "@vicons/ionicons5";
import { NIcon, NMenu } from "naive-ui";
import { h } from "vue";

const props = defineProps({
  collapsed: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["select"]);

const router = useRouter();
const route = useRoute();
const groupStore = useGroupStore();
const selectedGroupId = ref(route.params.id ? String(route.params.id) : "");

const menuOptions = computed(() => {
  const data = groupStore.groupList;
  const groups = data?.list || [];
  return groups.map((group) => ({
    label: group.group_name,
    key: String(group._id),
    icon: () => {
      if (group.type === "private") {
        return h(NIcon, null, { default: () => h(HomeOutline, null) });
      }
      return h(NIcon, null, { default: () => h(PeopleOutline, null) });
    },
  }));
});

const handleSelect = (key) => {
  selectedGroupId.value = key;
  emit("select", { _id: key });
  router.push(`/group/${key}/home`);
};

onMounted(async () => {
  if (!groupStore.groupList?.list?.length) {
    await groupStore.fetchGroupList();
  }
});
</script>

<style scoped lang="scss">
.group-sidebar {
  height: 100%;
  overflow-y: auto;
}
</style>
