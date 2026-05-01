<template>
  <div class="import-interface">
    <n-card title="导入接口到集合">
      <n-form ref="formRef" :model="formData" :rules="formRules" label-placement="left">
        <n-form-item label="选择接口" path="interfaceIds">
          <n-transfer
            v-model:value="formData.interfaceIds"
            :options="interfaceOptions"
            :render-source-item="renderSourceItem"
            filterable
            :filter="filterOption"
          />
        </n-form-item>
      </n-form>

      <n-space justify="end">
        <n-button @click="handleCancel">取消</n-button>
        <n-button type="primary" @click="handleImport" :loading="importing">导入</n-button>
      </n-space>
    </n-card>

    <n-card title="已选择的接口" style="margin-top: 16px" v-if="selectedInterfaces.length > 0">
      <n-data-table
        :columns="columns"
        :data="selectedInterfaces"
        :row-key="(row) => row._id"
        :pagination="false"
      />
    </n-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, h } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useMessage, NTag } from "naive-ui";
import axios from "axios";

const props = defineProps({
  colId: {
    type: [Number, String],
    required: true,
  },
});

const route = useRoute();
const router = useRouter();
const message = useMessage();

const loading = ref(false);
const importing = ref(false);
const allInterfaces = ref([]);

const formData = ref({
  interfaceIds: [],
});

const formRules = {
  interfaceIds: {
    type: "array",
    required: true,
    message: "请选择至少一个接口",
    trigger: "change",
  },
};

const interfaceOptions = computed(() => {
  return allInterfaces.value.map((item) => ({
    label: `${item.title} (${item.path})`,
    value: item._id,
    ...item,
  }));
});

const selectedInterfaces = computed(() => {
  return formData.value.interfaceIds
    .map((id) => allInterfaces.value.find((item) => item._id === id))
    .filter(Boolean);
});

const renderSourceItem = (option) => {
  return h("div", { style: "display: flex; align-items: center; gap: 8px;" }, [
    h(NTag, { size: "small", type: methodTypeMap[option.method] || "info" }, () => option.method),
    h("span", {}, option.title),
  ]);
};

const methodTypeMap = {
  GET: "info",
  POST: "success",
  PUT: "warning",
  DELETE: "error",
  PATCH: "warning",
};

const filterOption = (pattern, option) => {
  const searchText = (option.title + option.path).toLowerCase();
  return searchText.includes(pattern.toLowerCase());
};

const columns = [
  {
    title: "接口名称",
    key: "title",
  },
  {
    title: "路径",
    key: "path",
  },
  {
    title: "方法",
    key: "method",
    width: 100,
    render(row) {
      return h(
        NTag,
        { type: methodTypeMap[row.method] || "info", size: "small" },
        () => row.method,
      );
    },
  },
  {
    title: "操作",
    key: "actions",
    width: 80,
    render(row) {
      return h("span", {}, "已选择");
    },
  },
];

const loadInterfaces = async () => {
  loading.value = true;
  try {
    const projectId = route.params.id;
    const res = await axios.get(`/api/interface/list_menu?project_id=${projectId}`);
    if (res.data.errcode === 0) {
      const interfaces = [];
      res.data.data.forEach((cat) => {
        cat.list.forEach((item) => {
          interfaces.push({
            _id: item._id,
            title: item.title,
            path: item.path,
            method: item.method,
          });
        });
      });
      allInterfaces.value = interfaces;
    }
  } catch (e) {
    message.error("加载接口列表失败");
  } finally {
    loading.value = false;
  }
};

const handleImport = async () => {
  if (formData.value.interfaceIds.length === 0) {
    message.warning("请选择至少一个接口");
    return;
  }

  importing.value = true;
  try {
    const res = await axios.post("/api/interfaceCol/add_case_list", {
      col_id: props.colId,
      interface_list: formData.value.interfaceIds,
    });
    if (res.data.errcode === 0) {
      message.success("导入成功");
      router.back();
    }
  } catch (e) {
    message.error(e.message || "导入失败");
  } finally {
    importing.value = false;
  }
};

const handleCancel = () => {
  router.back();
};

onMounted(() => {
  loadInterfaces();
});
</script>

<style scoped lang="scss">
.import-interface {
  padding: 16px;
}
</style>
