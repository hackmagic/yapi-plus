<template>
  <div class="token-setting">
    <n-space vertical :size="16">
      <n-alert type="info"> Token 用于 API 访问认证，请妥善保管 </n-alert>

      <n-button type="primary" @click="handleGenerate" :loading="generating">
        生成新 Token
      </n-button>

      <n-card v-if="tokenList.length > 0">
        <n-list>
          <n-list-item v-for="token in tokenList" :key="token._id">
            <n-space justify="space-between" align="center">
              <n-space vertical>
                <n-text strong>{{ token.name }}</n-text>
                <n-text depth="3" style="font-size: 12px">
                  创建于 {{ formatDate(token.add_time) }}
                </n-text>
              </n-space>
              <n-space>
                <n-button text @click="handleCopy(token.token)"> 复制 </n-button>
                <n-popconfirm @positive-click="handleDelete(token)">
                  <template #trigger>
                    <n-button text type="error">删除</n-button>
                  </template>
                  确定要删除此 Token 吗？
                </n-popconfirm>
              </n-space>
            </n-space>
          </n-list-item>
        </n-list>
      </n-card>

      <n-empty v-else description="暂无 Token" />
    </n-space>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useMessage } from "naive-ui";
import axios from "axios";
import copy from "copy-to-clipboard";

const props = defineProps({
  projectId: {
    type: String,
    required: true,
  },
});

const message = useMessage();
const generating = ref(false);
const tokenList = ref([]);

const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleString();
};

const handleGenerate = async () => {
  generating.value = true;
  try {
    const res = await axios.post(`/api/project/token`, {
      project_id: props.projectId,
    });

    if (res.data.errcode === 0) {
      message.success("Token 生成成功");
      fetchTokens();
    } else {
      message.error(res.data.errmsg || "生成失败");
    }
  } catch (error) {
    message.error("生成失败");
  } finally {
    generating.value = false;
  }
};

const handleCopy = (token) => {
  copy(token);
  message.success("已复制到剪贴板");
};

const handleDelete = async (token) => {
  try {
    const res = await axios.delete(`/api/project/token`, {
      params: {
        project_id: props.projectId,
        token_id: token._id,
      },
    });

    if (res.data.errcode === 0) {
      message.success("删除成功");
      fetchTokens();
    } else {
      message.error(res.data.errmsg || "删除失败");
    }
  } catch (error) {
    message.error("删除失败");
  }
};

const fetchTokens = async () => {
  try {
    const res = await axios.get(`/api/project/token_list`, {
      params: {
        project_id: props.projectId,
      },
    });

    if (res.data.errcode === 0) {
      tokenList.value = res.data.data.list;
    }
  } catch (error) {
    message.error("获取 Token 列表失败");
  }
};

onMounted(() => {
  fetchTokens();
});
</script>

<style scoped>
.token-setting {
  padding: 16px 0;
}
</style>
