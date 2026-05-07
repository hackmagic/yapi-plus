<template>
  <div class="group-list">
    <n-space vertical :size="16">
      <n-card>
        <template #header>
          <n-space justify="space-between" align="center">
            <span>我的项目组</span>
            <n-button type="primary" @click="showCreateModal = true"> 创建项目组 </n-button>
          </n-space>
        </template>

        <n-data-table
          :columns="columns"
          :data="groupList"
          :loading="loading"
          :pagination="pagination"
        />
      </n-card>
    </n-space>

    <!-- 创建项目组弹窗 -->
    <n-modal
      v-model:show="showCreateModal"
      preset="card"
      title="创建项目组"
      style="width: 500px"
    >
      <n-form
        ref="createFormRef"
        :model="createFormData"
        label-placement="left"
        label-width="100px"
      >
        <n-form-item label="组名称" path="group_name">
          <n-input v-model:value="createFormData.group_name" placeholder="请输入项目组名称" />
        </n-form-item>
        <n-form-item label="组描述" path="group_desc">
          <n-input
            v-model:value="createFormData.group_desc"
            type="textarea"
            placeholder="请输入项目组描述"
            :rows="3"
          />
        </n-form-item>
        <n-form-item label="组类型" path="type">
          <n-radio-group v-model:value="createFormData.type">
            <n-radio value="public">公开</n-radio>
            <n-radio value="private">私有</n-radio>
          </n-radio-group>
        </n-form-item>
      </n-form>
      <template #footer>
        <n-space justify="end">
          <n-button @click="handleCancelCreate">取消</n-button>
          <n-button type="primary" :loading="submitting" @click="handleCreateGroup">确定</n-button>
        </n-space>
      </template>
    </n-modal>
  </div>
</template>

<script setup>
import { ref, reactive, h, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useMessage } from "naive-ui";
import axios from "axios";
import { useGroupStore } from "@/store/group";

const router = useRouter();
const message = useMessage();
const groupStore = useGroupStore();

const loading = ref(false);
const groupList = ref([]);
const showCreateModal = ref(false);
const submitting = ref(false);
const createFormRef = ref(null);

const createFormData = reactive({
  group_name: "",
  group_desc: "",
  type: "public",
});

const pagination = {
  pageSize: 10,
};

const columns = [
  {
    title: "名称",
    key: "group_name",
    render: (row) =>
      h(
        "a",
        {
          onClick: () => router.push(`/group/${row._id}`),
        },
        row.group_name,
      ),
  },
  {
    title: "项目数",
    key: "project_count",
    width: 120,
  },
  {
    title: "成员数",
    key: "member_count",
    width: 120,
  },
  {
    title: "更新时间",
    key: "up_time",
    width: 180,
    render: (row) => new Date(row.up_time).toLocaleString(),
  },
];

const fetchGroupList = async () => {
  loading.value = true;
  try {
    const res = await axios.get("/api/group/list");
    if (res.data.errcode === 0) {
      groupList.value = res.data.data.list;
    }
  } catch (error) {
    message.error("获取项目组列表失败");
  } finally {
    loading.value = false;
  }
};

const handleCreateGroup = async () => {
  if (!createFormData.group_name.trim()) {
    message.warning("请输入项目组名称");
    return;
  }
  submitting.value = true;
  try {
    await groupStore.addGroup(createFormData);
    message.success("创建成功");
    showCreateModal.value = false;
    // 重置表单
    createFormData.group_name = "";
    createFormData.group_desc = "";
    createFormData.type = "public";
    fetchGroupList(); // 刷新列表
  } catch (e) {
    message.error("创建失败");
  } finally {
    submitting.value = false;
  }
};

const handleCancelCreate = () => {
  showCreateModal.value = false;
  // 重置表单
  createFormData.group_name = "";
  createFormData.group_desc = "";
  createFormData.type = "public";
};

onMounted(() => {
  fetchGroupList();
});
</script>

<style scoped>
.group-list {
  padding: 24px;
}
</style>
