<template>
  <div class="interface-menu">
    <div class="menu-header">
      <n-input v-model:value="searchKey" placeholder="搜索接口" clearable @input="handleSearch" />
      <n-button type="primary" @click="showAddCatModal" style="margin-top: 12px; width: 100%">
        <template #icon>
          <n-icon><AddCircleOutline /></n-icon>
        </template>
        添加分类
      </n-button>
    </div>

    <div class="menu-content">
      <n-tree
        :data="treeData"
        :expanded-keys="expandedKeys"
        :selected-keys="selectedKeys"
        block-line
        show-line
        @update:selected-keys="handleSelect"
        @update:expanded-keys="handleExpand"
      >
        <template #suffix="{ data }">
          <div class="tree-actions">
            <n-tooltip v-if="data.type === 'cat'" trigger="hover">
              <template #trigger>
                <n-button text size="small" @click.stop="showAddInterfaceModal(data)">
                  <template #icon>
                    <n-icon><AddOutline /></n-icon>
                  </template>
                </n-button>
              </template>
              添加接口
            </n-tooltip>
            <n-tooltip v-if="data.type === 'cat'" trigger="hover">
              <template #trigger>
                <n-button text size="small" @click.stop="showEditCatModal(data)">
                  <template #icon>
                    <n-icon><CreateOutline /></n-icon>
                  </template>
                </n-button>
              </template>
              编辑分类
            </n-tooltip>
            <n-popconfirm
              v-if="data.type === 'interface'"
              @positive-click="handleDeleteInterface(data)"
            >
              <template #trigger>
                <n-button text size="small">
                  <template #icon>
                    <n-icon><TrashOutline /></n-icon>
                  </template>
                </n-button>
              </template>
              确定删除此接口吗？
            </n-popconfirm>
          </div>
        </template>
      </n-tree>
    </div>

    <!-- 添加/编辑分类弹窗 -->
    <n-modal v-model:show="showCatModal" preset="dialog" :title="catModalTitle">
      <n-form>
        <n-form-item label="分类名称">
          <n-input v-model:value="catForm.name" />
        </n-form-item>
        <n-form-item label="分类描述">
          <n-input v-model:value="catForm.desc" type="textarea" />
        </n-form-item>
      </n-form>
      <template #action>
        <n-button @click="showCatModal = false">取消</n-button>
        <n-button type="primary" @click="handleSaveCat">保存</n-button>
      </template>
    </n-modal>

    <!-- 添加接口弹窗 -->
    <n-modal v-model:show="showInterfaceModal" preset="dialog" title="添加接口">
      <n-form>
        <n-form-item label="接口名称">
          <n-input v-model:value="interfaceForm.title" />
        </n-form-item>
        <n-form-item label="接口路径">
          <n-input v-model:value="interfaceForm.path" placeholder="/api/path" />
        </n-form-item>
        <n-form-item label="请求方法">
          <n-select v-model:value="interfaceForm.method" :options="methodOptions" />
        </n-form-item>
      </n-form>
      <template #action>
        <n-button @click="showInterfaceModal = false">取消</n-button>
        <n-button type="primary" @click="handleAddInterface">添加</n-button>
      </template>
    </n-modal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, h } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useMessage } from "naive-ui";
import { AddCircleOutline, AddOutline, CreateOutline, TrashOutline } from "@vicons/ionicons5";
import axios from "axios";

const props = defineProps({
  projectId: {
    type: [Number, String],
    required: true,
  },
  selectedId: {
    type: String,
    default: null,
  },
});

const emit = defineEmits(["select"]);

const router = useRouter();
const route = useRoute();
const message = useMessage();

const searchKey = ref("");
const treeData = ref([]);
const expandedKeys = ref([]);
const selectedKeys = ref([]);

// 分类弹窗
const showCatModal = ref(false);
const catModalTitle = ref("添加分类");
const catForm = reactive({
  _id: null,
  name: "",
  desc: "",
});

// 接口弹窗
const showInterfaceModal = ref(false);
const interfaceForm = reactive({
  title: "",
  path: "",
  method: "GET",
});

const methodOptions = [
  { label: "GET", value: "GET" },
  { label: "POST", value: "POST" },
  { label: "PUT", value: "PUT" },
  { label: "DELETE", value: "DELETE" },
];

// 加载接口列表
const loadInterfaceList = async () => {
  try {
    const res = await axios.get(`/api/interface/list_menu?project_id=${props.projectId}`);
    if (res.data.errcode === 0) {
      treeData.value = transformToTree(res.data.data);
    }
  } catch (error) {
    message.error("加载接口列表失败");
  }
};

// 转换为树形数据
const transformToTree = (data) => {
  return data.map((cat) => ({
    key: `cat_${cat._id}`,
    label: cat.name,
    type: "cat",
    data: cat,
    children: cat.list.map((inter) => ({
      key: String(inter._id),
      label: `${inter.title} (${inter.path})`,
      type: "interface",
      data: inter,
    })),
  }));
};

const handleSelect = (keys) => {
  selectedKeys.value = keys;
  if (keys.length > 0) {
    const key = keys[0];
    if (!key.startsWith("cat_")) {
      emit("select", key);
    }
  }
};

const handleExpand = (keys) => {
  expandedKeys.value = keys;
};

const handleSearch = (value) => {
  // 搜索逻辑
};

const showAddCatModal = () => {
  catModalTitle.value = "添加分类";
  catForm._id = null;
  catForm.name = "";
  catForm.desc = "";
  showCatModal.value = true;
};

const showEditCatModal = (data) => {
  catModalTitle.value = "编辑分类";
  catForm._id = data.data._id;
  catForm.name = data.data.name;
  catForm.desc = data.data.desc;
  showCatModal.value = true;
};

const handleSaveCat = async () => {
  try {
    const url = catForm._id ? "/api/interface/up_cat" : "/api/interface/add_cat";
    const res = await axios.post(url, {
      ...catForm,
      project_id: props.projectId,
    });
    if (res.data.errcode === 0) {
      message.success("保存成功");
      showCatModal.value = false;
      await loadInterfaceList();
    }
  } catch (error) {
    message.error("保存失败");
  }
};

const showAddInterfaceModal = (catData) => {
  interfaceForm.title = "";
  interfaceForm.path = "";
  interfaceForm.method = "GET";
  interfaceForm.catid = catData.data._id;
  showInterfaceModal.value = true;
};

const handleAddInterface = async () => {
  try {
    const res = await axios.post("/api/interface/add", {
      ...interfaceForm,
      project_id: props.projectId,
    });
    if (res.data.errcode === 0) {
      message.success("添加成功");
      showInterfaceModal.value = false;
      await loadInterfaceList();
      router.push(`/project/${props.projectId}/interface/api/${res.data.data._id}`);
    }
  } catch (error) {
    message.error("添加失败");
  }
};

const handleDeleteInterface = async (data) => {
  try {
    const res = await axios.post(`/api/interface/del?id=${data.data._id}`);
    if (res.data.errcode === 0) {
      message.success("删除成功");
      await loadInterfaceList();
    }
  } catch (error) {
    message.error("删除失败");
  }
};

watch(
  () => props.selectedId,
  (newId) => {
    if (newId) {
      selectedKeys.value = [newId];
    }
  },
);

onMounted(() => {
  loadInterfaceList();
});
</script>

<style scoped lang="scss">
.interface-menu {
  height: 100%;
  display: flex;
  flex-direction: column;

  .menu-header {
    padding: 12px;
    border-bottom: 1px solid #eee;
  }

  .menu-content {
    flex: 1;
    overflow: auto;
    padding: 12px;
  }

  .tree-actions {
    display: flex;
    gap: 4px;
    opacity: 0;
    transition: opacity 0.2s;
  }

  &:hover .tree-actions {
    opacity: 1;
  }
}
</style>
