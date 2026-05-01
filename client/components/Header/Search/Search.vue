<template>
  <div class="search-wrapper">
    <n-input
      v-model:value="searchValue"
      placeholder="搜索接口、项目..."
      :style="{ width: '280px' }"
      clearable
      @keyup.enter="handleSearch"
      @focus="showDropdown = true"
      @blur="handleBlur"
    >
      <template #prefix>
        <n-icon>
          <svg viewBox="64 64 896 896" width="16" height="16" fill="currentColor">
            <path
              d="M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0011.6 0l43.6-43.5a8.2 8.2 0 000-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z"
            />
          </svg>
        </n-icon>
      </template>
    </n-input>

    <div
      class="search-dropdown"
      v-if="
        showDropdown && (searchResults.interfaces.length > 0 || searchResults.projects.length > 0)
      "
    >
      <div class="result-section" v-if="searchResults.interfaces.length > 0">
        <div class="section-title">接口</div>
        <div
          v-for="item in searchResults.interfaces"
          :key="item._id"
          class="result-item"
          @click="handleClickInterface(item)"
        >
          <n-tag size="small" :type="getMethodType(item.method)">{{ item.method }}</n-tag>
          <span class="item-title">{{ item.title }}</span>
          <span class="item-path">{{ item.path }}</span>
        </div>
      </div>
      <div class="result-section" v-if="searchResults.projects.length > 0">
        <div class="section-title">项目</div>
        <div
          v-for="item in searchResults.projects"
          :key="item._id"
          class="result-item"
          @click="handleClickProject(item)"
        >
          <span class="item-title">{{ item.name }}</span>
        </div>
      </div>
      <div class="view-all" v-if="searchValue" @click="handleViewAll">查看全部结果 ></div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from "vue";
import { useRouter } from "vue-router";
import { useMessage } from "naive-ui";
import axios from "axios";

const router = useRouter();
const message = useMessage();

const searchValue = ref("");
const showDropdown = ref(false);
const searching = ref(false);

const searchResults = reactive({
  interfaces: [],
  projects: [],
});

let searchTimer = null;

watch(searchValue, (newValue) => {
  if (searchTimer) {
    clearTimeout(searchTimer);
  }
  if (!newValue || newValue.trim().length < 2) {
    searchResults.interfaces = [];
    searchResults.projects = [];
    return;
  }
  searchTimer = setTimeout(() => {
    performSearch(newValue);
  }, 300);
});

const performSearch = async (keyword) => {
  searching.value = true;
  try {
    const res = await axios.get("/api/project/search", { params: { q: keyword } });
    if (res.data.errcode === 0) {
      searchResults.interfaces = (res.data.data.interfaceList || []).slice(0, 5);
      searchResults.projects = (res.data.data.projectList || []).slice(0, 5);
    }
  } catch (e) {
    console.error("搜索失败", e);
  } finally {
    searching.value = false;
  }
};

const getMethodType = (method) => {
  const typeMap = {
    GET: "info",
    POST: "success",
    PUT: "warning",
    DELETE: "error",
    PATCH: "warning",
  };
  return typeMap[method] || "info";
};

const handleSearch = () => {
  if (searchValue.value.trim()) {
    router.push({ path: "/search", query: { q: searchValue.value } });
  }
};

const handleClickInterface = (item) => {
  router.push(`/project/${item.project_id}/interface/api/${item._id}`);
  showDropdown.value = false;
  searchValue.value = "";
};

const handleClickProject = (item) => {
  router.push(`/project/${item._id}`);
  showDropdown.value = false;
  searchValue.value = "";
};

const handleViewAll = () => {
  router.push({ path: "/search", query: { q: searchValue.value } });
  showDropdown.value = false;
};

const handleBlur = () => {
  setTimeout(() => {
    showDropdown.value = false;
  }, 200);
};
</script>

<style scoped lang="scss">
.search-wrapper {
  position: relative;

  .search-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    width: 400px;
    max-height: 400px;
    overflow-y: auto;
    background: #fff;
    border: 1px solid #e8e8e8;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    margin-top: 4px;

    .result-section {
      padding: 8px 0;

      .section-title {
        padding: 4px 12px;
        font-size: 12px;
        color: #999;
        font-weight: 500;
      }

      .result-item {
        display: flex;
        align-items: center;
        padding: 8px 12px;
        cursor: pointer;
        gap: 8px;

        &:hover {
          background: #f5f5f5;
        }

        .item-title {
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .item-path {
          color: #999;
          font-size: 12px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 150px;
        }
      }
    }

    .view-all {
      padding: 8px 12px;
      border-top: 1px solid #f0f0f0;
      cursor: pointer;
      color: #1890ff;
      font-size: 12px;

      &:hover {
        background: #f5f5f5;
      }
    }
  }
}
</style>
