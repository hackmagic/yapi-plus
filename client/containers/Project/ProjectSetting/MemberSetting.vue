<template>
  <div class="member-setting">
    <n-space vertical :size="16">
      <n-button type="primary" @click="showAddMember = true"> 添加成员 </n-button>

      <n-data-table :columns="columns" :data="memberList" :loading="loading" />
    </n-space>

    <n-modal v-model:show="showAddMember" preset="card" title="添加成员" style="width: 500px">
      <n-form @submit.prevent="handleAddMember">
        <n-form-item label="用户邮箱">
          <n-input v-model:value="memberEmail" placeholder="请输入用户邮箱" />
        </n-form-item>
        <n-form-item label="角色">
          <n-select v-model:value="memberRole" :options="roleOptions" />
        </n-form-item>
        <n-space justify="end">
          <n-button @click="showAddMember = false">取消</n-button>
          <n-button type="primary" @click="handleAddMember" :loading="adding"> 添加 </n-button>
        </n-space>
      </n-form>
    </n-modal>
  </div>
</template>

<script setup>
import { ref, h, onMounted } from "vue";
import { useMessage, NTag, NButton, NSpace, NPopconfirm } from "naive-ui";
import axios from "axios";

const props = defineProps({
  projectId: {
    type: String,
    required: true,
  },
});

const message = useMessage();
const loading = ref(false);
const adding = ref(false);
const memberList = ref([]);
const showAddMember = ref(false);
const memberEmail = ref("");
const memberRole = ref("dev");

const roleOptions = [
  { label: "开发者", value: "dev" },
  { label: "管理员", value: "admin" },
  { label: "访客", value: "guest" },
];

const columns = [
  {
    title: "用户名",
    key: "username",
  },
  {
    title: "邮箱",
    key: "email",
  },
  {
    title: "角色",
    key: "role",
    width: 120,
    render: (row) => {
      const roleMap = {
        admin: "error",
        dev: "primary",
        guest: "default",
      };
      return h(
        NTag,
        { type: roleMap[row.role] || "default" },
        {
          default: () => row.role,
        },
      );
    },
  },
  {
    title: "操作",
    key: "actions",
    width: 150,
    render: (row) =>
      h(
        NSpace,
        {},
        {
          default: () => [
            h(
              NPopconfirm,
              {
                onPositiveClick: () => handleRemoveMember(row),
              },
              {
                trigger: () =>
                  h(
                    NButton,
                    { size: "small", type: "error", text: true },
                    {
                      default: () => "移除",
                    },
                  ),
                default: () => "确定要移除此成员吗？",
              },
            ),
          ],
        },
      ),
  },
];

const handleAddMember = async () => {
  if (!memberEmail.value) {
    message.error("请输入用户邮箱");
    return;
  }

  adding.value = true;
  try {
    const res = await axios.post(`/api/project/add_member`, {
      project_id: props.projectId,
      email: memberEmail.value,
      role: memberRole.value,
    });

    if (res.data.errcode === 0) {
      message.success("添加成功");
      showAddMember.value = false;
      memberEmail.value = "";
      fetchMembers();
    } else {
      message.error(res.data.errmsg || "添加失败");
    }
  } catch (error) {
    message.error("添加失败");
  } finally {
    adding.value = false;
  }
};

const handleRemoveMember = async (member) => {
  try {
    const res = await axios.delete(`/api/project/del_member`, {
      params: {
        project_id: props.projectId,
        member_id: member._id,
      },
    });

    if (res.data.errcode === 0) {
      message.success("移除成功");
      fetchMembers();
    } else {
      message.error(res.data.errmsg || "移除失败");
    }
  } catch (error) {
    message.error("移除失败");
  }
};

const fetchMembers = async () => {
  loading.value = true;
  try {
    const res = await axios.get(`/api/project/get?id=${props.projectId}`);
    if (res.data.errcode === 0) {
      memberList.value = res.data.data.members || [];
    }
  } catch (error) {
    message.error("获取成员列表失败");
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchMembers();
});
</script>

<style scoped>
.member-setting {
  padding: 16px 0;
}
</style>
