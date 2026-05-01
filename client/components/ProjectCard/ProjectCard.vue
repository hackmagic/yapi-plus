<template>
  <n-card class="project-card" hoverable @click="handleClick">
    <template #header>
      <n-space align="center">
        <n-avatar :style="{ backgroundColor: '#2080f0' }">
          {{ projectData.name?.charAt(0)?.toUpperCase() }}
        </n-avatar>
        <n-ellipsis style="max-width: 200px">
          {{ projectData.name }}
        </n-ellipsis>
      </n-space>
    </template>

    <n-space vertical :size="8">
      <n-text depth="3">
        {{ projectData.desc || "暂无描述" }}
      </n-text>

      <n-space justify="space-between">
        <n-tag size="small" type="info"> 接口: {{ projectData.interface_count || 0 }} </n-tag>
        <n-text depth="3" style="font-size: 12px">
          {{ formatDate(projectData.up_time) }}
        </n-text>
      </n-space>
    </n-space>

    <template #action>
      <n-space justify="end">
        <n-button text @click.stop="handleEdit"> 编辑 </n-button>
        <n-popconfirm @positive-click="handleDelete">
          <template #trigger>
            <n-button text>删除</n-button>
          </template>
          确定要删除此项目吗？
        </n-popconfirm>
      </n-space>
    </template>
  </n-card>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useMessage } from "naive-ui";
import axios from "axios";

const props = defineProps({
  projectData: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["delete", "edit"]);
const router = useRouter();
const message = useMessage();

const formatDate = (timestamp) => {
  if (!timestamp) return "";
  return new Date(timestamp).toLocaleDateString();
};

const handleClick = () => {
  router.push(`/project/${props.projectData._id}`);
};

const handleEdit = () => {
  emit("edit", props.projectData);
};

const handleDelete = async () => {
  try {
    const res = await axios.delete(`/api/project/del?id=${props.projectData._id}`);
    if (res.data.errcode === 0) {
      message.success("删除成功");
      emit("delete", props.projectData._id);
    } else {
      message.error(res.data.errmsg || "删除失败");
    }
  } catch (error) {
    message.error("删除失败");
  }
};
</script>

<style scoped>
.project-card {
  cursor: pointer;
  transition: transform 0.3s;
}

.project-card:hover {
  transform: translateY(-4px);
}
</style>
