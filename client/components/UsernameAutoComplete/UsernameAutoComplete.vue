<template>
  <n-auto-complete
    v-model:value="inputValue"
    :options="options"
    :render-label="renderLabel"
    :render-tag="renderTag"
    placeholder="输入用户名或邮箱搜索"
    clearable
    @search="handleSearch"
    @select="handleSelect"
  />
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { NTag } from "naive-ui";
import axios from "axios";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "输入用户名或邮箱搜索",
  },
});

const emit = defineEmits(["update:modelValue", "select", "search"]);

const inputValue = ref(props.modelValue);
const suggestions = ref([]);
const loading = ref(false);

watch(
  () => props.modelValue,
  (val) => {
    inputValue.value = val;
  }
);

const options = computed(() => {
  return suggestions.value.map((user) => ({
    label: user.username,
    value: user.email || user.username,
    user: user,
  }));
});

const renderLabel = (option) => {
  const user = option.user;
  return h(
    "div",
    {
      style: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
      },
    },
    [
      h(
        "div",
        {
          style: {
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            background: "#2395f1",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "12px",
          },
        },
        user.username?.charAt(0)?.toUpperCase() || "?"
      ),
      h(
        "div",
        {
          style: {
            display: "flex",
            flexDirection: "column",
          },
        },
        [
          h("div", { style: { fontSize: "14px" } }, user.username),
          h(
            "div",
            { style: { fontSize: "12px", color: "#999" } },
            user.email
          ),
        ]
      ),
    ]
  );
};

const renderTag = (label, index) => {
  return h(
    NTag,
    {
      size: "small",
      type: "info",
    },
    { default: () => label }
  );
};

let searchTimer = null;

const handleSearch = async (query) => {
  if (searchTimer) {
    clearTimeout(searchTimer);
  }

  if (!query || query.length < 1) {
    suggestions.value = [];
    return;
  }

  searchTimer = setTimeout(async () => {
    await searchUsers(query);
  }, 300);
};

const searchUsers = async (query) => {
  loading.value = true;
  try {
    const res = await axios.get("/api/user/search", {
      params: { q: query },
    });
    if (res.data.errcode === 0) {
      suggestions.value = res.data.data || [];
    }
  } catch (e) {
    console.error("搜索用户失败", e);
    suggestions.value = [];
  } finally {
    loading.value = false;
  }
};

const handleSelect = (value, option) => {
  emit("update:modelValue", value);
  emit("select", option.user);
  emit("search", value);
};

const clear = () => {
  inputValue.value = "";
  suggestions.value = [];
  emit("update:modelValue", "");
};
</script>

<script>
import { h } from "vue";
export default {
  name: "UsernameAutoComplete",
};
</script>

<style scoped>
/* 组件样式由 Naive UI 自动处理 */
</style>
