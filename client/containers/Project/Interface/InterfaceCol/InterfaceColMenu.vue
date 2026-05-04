<template>
  <div class="interface-col-menu">
    <div class="menu-toolbar">
      <n-button type="primary" size="small" @click="handleAddCol"> 新建集合 </n-button>
    </div>

    <div class="col-list">
      <n-spin :show="loading">
        <div v-if="colList.length === 0" class="empty-tip">暂无集合，请创建</div>
        <n-collapse v-else>
          <n-collapse-item v-for="col in colList" :key="col._id" :title="col.name" :name="col._id">
            <template #header-extra>
              <n-space size="small">
                <n-button text size="tiny" @click.stop="handleEditCol(col)">
                  <n-icon><CreateOutline /></n-icon>
                </n-button>
                <n-button text size="tiny" type="error" @click.stop="handleDeleteCol(col)">
                  <n-icon><TrashOutline /></n-icon>
                </n-button>
              </n-space>
            </template>

            <div class="col-content">
              <div class="case-list">
                <div
                  v-for="caseItem in col.cases"
                  :key="caseItem._id"
                  class="case-item"
                  @click="handleSelectCase(caseItem)"
                >
                  <span class="case-name">{{ caseItem.name }}</span>
                </div>
              </div>
              <n-button size="small" dashed block @click.stop="handleAddCase(col)">
                + 添加用例
              </n-button>
            </div>
          </n-collapse-item>
        </n-collapse>
      </n-spin>
    </div>

    <n-modal
      v-model:show="showColModal"
      preset="dialog"
      :title="editingCol ? '编辑集合' : '新建集合'"
      @positive-click="handleSaveCol"
    >
      <n-form ref="colFormRef" :model="colFormData" :rules="colRules">
        <n-form-item label="集合名称" path="name">
          <n-input v-model:value="colFormData.name" placeholder="请输入集合名称" />
        </n-form-item>
        <n-form-item label="描述" path="desc">
          <n-input
            v-model:value="colFormData.desc"
            type="textarea"
            placeholder="请输入描述"
            :rows="3"
          />
        </n-form-item>
      </n-form>
    </n-modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useMessage, useDialog } from "naive-ui";
import { useInterfaceColStore } from "@/store/interfaceCol";
import { CreateOutline, TrashOutline } from "@vicons/ionicons5";

const props = defineProps({
  projectId: {
    type: [Number, String],
    required: true,
  },
});

const emit = defineEmits(["select"]);

const route = useRoute();
const router = useRouter();
const message = useMessage();
const dialog = useDialog();
const interfaceColStore = useInterfaceColStore();

const loading = ref(false);
const showColModal = ref(false);
const editingCol = ref(null);
const colFormRef = ref(null);

const colFormData = ref({
  name: "",
  desc: "",
});

const colRules = {
  name: { required: true, message: "请输入集合名称", trigger: "blur" },
};

const colList = computed(() => interfaceColStore.colList);

const loadColList = async () => {
  loading.value = true;
  try {
    await interfaceColStore.fetchColList(props.projectId);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadColList();
});

watch(
  () => props.projectId,
  () => {
    loadColList();
  },
);

const handleAddCol = () => {
  editingCol.value = null;
  colFormData.value = { name: "", desc: "" };
  showColModal.value = true;
};

const handleEditCol = (col) => {
  editingCol.value = col;
  colFormData.value = { name: col.name, desc: col.desc || "" };
  showColModal.value = true;
};

const handleSaveCol = async () => {
  try {
    await colFormRef.value?.validate();
    if (editingCol.value) {
      await interfaceColStore.updateCol(editingCol.value._id, colFormData.value);
      message.success("更新成功");
    } else {
      await interfaceColStore.addCol(props.projectId, colFormData.value);
      message.success("创建成功");
    }
    showColModal.value = false;
    await loadColList();
  } catch (e) {
    if (e.message) {
      message.error(e.message);
    }
  }
};

const handleDeleteCol = (col) => {
  dialog.warning({
    title: "确认删除",
    content: `确定要删除集合 "${col.name}" 及其下面的所有测试用例吗？此操作不可恢复。`,
    positiveText: "确定删除",
    negativeText: "取消",
    onPositiveClick: async () => {
      try {
        await interfaceColStore.deleteCol(col._id);
        message.success("删除成功");
        await loadColList();
      } catch (e) {
        message.error(e.message || "删除失败");
      }
    },
  });
};

const handleSelectCase = (caseItem) => {
  emit("select", {
    type: "case",
    id: caseItem._id,
    path: `/project/${props.projectId}/interface/case/${caseItem._id}`,
  });
};

const handleAddCase = (col) => {
  router.push(`/project/${props.projectId}/interface/col/${col._id}/addCase`);
};
</script>

<style scoped lang="scss">
.interface-col-menu {
  padding: 12px;

  .menu-toolbar {
    margin-bottom: 12px;
  }

  .col-list {
    .empty-tip {
      text-align: center;
      color: #999;
      padding: 20px;
    }
  }

  .col-content {
    .case-list {
      margin-bottom: 8px;

      .case-item {
        padding: 8px 12px;
        cursor: pointer;
        border-radius: 4px;
        margin-bottom: 4px;

        &:hover {
          background-color: #f5f5f5;
        }

        .case-name {
          font-size: 13px;
        }
      }
    }
  }
}
</style>
