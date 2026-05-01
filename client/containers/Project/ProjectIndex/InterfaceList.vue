<template>
  <div class="interface-list">
    <n-space vertical :size="16">
      <n-card>
        <template #header>
          <n-space justify="space-between" align="center">
            <span>接口列表</span>
            <n-button type="primary" @click="handleAdd">添加接口</n-button>
          </n-space>
        </template>

        <n-input
          v-model:value="searchKeyword"
          placeholder="搜索接口"
          style="width: 300px; margin-bottom: 16px"
          @update:value="handleSearch"
        />

        <n-data-table
          :columns="columns"
          :data="interfaceList"
          :loading="loading"
          :pagination="pagination"
          :remote="true"
        />
      </n-card>
    </n-space>
  </div>
</template>

<script setup>
import { ref, h, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useMessage, NTag, NButton, NSpace } from "naive-ui";
import axios from "axios";

const props = defineProps({
  projectId: {
    type: String,
    required: true,
  },
});

const router = useRouter();
const message = useMessage();

const loading = ref(false);
const interfaceList = ref([]);
const searchKeyword = ref("");

const pagination = {
  page: 1,
  pageSize: 20,
  showSizePicker: true,
  pageSizes: [10, 20, 50],
  onChange: (page) => {
    pagination.page = page;
    fetchInterfaceList();
  },
};

const methodTypeMap = {
  GET: "success",
  POST: "primary",
  PUT: "warning",
  DELETE: "error",
};

const columns = [
  {
    title: "ID",
    key: "_id",
    width: 80,
  },
  {
    title: "接口名称",
    key: "title",
    render: (row) =>
      h(
        "a",
        {
          onClick: () => router.push(`/project/${props.projectId}/interface/${row._id}`),
        },
        row.title,
      ),
  },
  {
    title: "路径",
    key: "path",
    width: 250,
  },
  {
    title: "方法",
    key: "method",
    width: 100,
    render: (row) =>
      h(
        NTag,
        { type: methodTypeMap[row.method] || "default" },
        {
          default: () => row.method,
        },
      ),
  },
  {
    title: "更新时间",
    key: "up_time",
    width: 180,
    render: (row) => new Date(row.up_time).toLocaleString(),
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
              NButton,
              { size: "small", type: "primary", text: true, onClick: () => handleEdit(row) },
              {
                default: () => "编辑",
              },
            ),
            h(
              NButton,
              { size: "small", type: "error", text: true, onClick: () => handleDelete(row) },
              {
                default: () => "删除",
              },
            ),
          ],
        },
      ),
  },
];

const handleSearch = () => {
  pagination.page = 1;
  fetchInterfaceList();
};

const handleAdd = () => {
  router.push(`/project/${props.projectId}/interface/add`);
};

const handleEdit = (interfaceData) => {
  router.push(`/project/${props.projectId}/interface/${interfaceData._id}`);
};

const handleDelete = async (interfaceData) => {
  try {
    const res = await axios.delete(`/api/interface/del?id=${interfaceData._id}`);
    if (res.data.errcode === 0) {
      message.success("删除成功");
      fetchInterfaceList();
    } else {
      message.error(res.data.errmsg || "删除失败");
    }
  } catch (error) {
    message.error("删除失败");
  }
};

const fetchInterfaceList = async () => {
  loading.value = true;
  try {
    const res = await axios.get(`/api/interface/list`, {
      params: {
        project_id: props.projectId,
        page: pagination.page,
        limit: pagination.pageSize,
        keyword: searchKeyword.value,
      },
    });
    if (res.data.errcode === 0) {
      interfaceList.value = res.data.data.list;
    }
  } catch (error) {
    message.error("获取接口列表失败");
  } finally {
    loading.value = false;
  }
};

watch(
  () => props.projectId,
  () => {
    fetchInterfaceList();
  },
);

onMounted(() => {
  fetchInterfaceList();
});
</script>

<style scoped>
.interface-list {
  padding: 24px;
}
</style>
