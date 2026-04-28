<template>
  <div class="search-page">
    <div class="search-header">
      <n-input
        v-model:value="keyword"
        placeholder="搜索接口、项目..."
        size="large"
        clearable
        @keyup.enter="handleSearch"
        @update:value="handleSearch"
      >
        <template #prefix>
          <n-icon>
            <svg viewBox="64 64 896 896" width="20" height="20" fill="currentColor">
              <path d="M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0011.6 0l43.6-43.5a8.2 8.2 0 000-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z" />
            </svg>
          </n-icon>
        </template>
      </n-input>
    </div>

    <n-spin :show="loading">
      <n-tabs type="line" animated v-model:value="activeTab">
        <n-tab-pane name="interfaces" :tab="`接口 (${results.interfaces.length})`">
          <div class="result-list" v-if="results.interfaces.length > 0">
            <div
              v-for="item in results.interfaces"
              :key="item._id"
              class="result-item"
              @click="handleClickInterface(item)"
            >
              <n-space align="center" :size="8">
                <n-tag size="small" :type="getMethodType(item.method)">{{ item.method }}</n-tag>
                <span class="item-title">{{ item.title }}</span>
              </n-space>
              <div class="item-path">{{ item.path }}</div>
              <div class="item-desc" v-if="item.desc">{{ item.desc }}</div>
            </div>
          </div>
          <n-empty v-else-if="!loading" description="暂无搜索结果" />
        </n-tab-pane>

        <n-tab-pane name="projects" :tab="`项目 (${results.projects.length})`">
          <div class="result-list" v-if="results.projects.length > 0">
            <div
              v-for="item in results.projects"
              :key="item._id"
              class="result-item"
              @click="handleClickProject(item)"
            >
              <div class="item-title">{{ item.name }}</div>
              <div class="item-desc" v-if="item.desc">{{ item.desc }}</div>
              <div class="item-meta">
                <span>成员: {{ item.member_count || 0 }}</span>
                <span>接口: {{ item.interface_count || 0 }}</span>
              </div>
            </div>
          </div>
          <n-empty v-else-if="!loading" description="暂无搜索结果" />
        </n-tab-pane>

        <n-tab-pane name="groups" :tab="`分组 (${results.groups.length})`">
          <div class="result-list" v-if="results.groups.length > 0">
            <div
              v-for="item in results.groups"
              :key="item._id"
              class="result-item"
              @click="handleClickGroup(item)"
            >
              <div class="item-title">{{ item.group_name }}</div>
              <div class="item-desc" v-if="item.desc">{{ item.desc }}</div>
            </div>
          </div>
          <n-empty v-else-if="!loading" description="暂无搜索结果" />
        </n-tab-pane>
      </n-tabs>
    </n-spin>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMessage, NTag } from 'naive-ui'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const message = useMessage()

const loading = ref(false)
const keyword = ref('')
const activeTab = ref('interfaces')

const results = reactive({
  interfaces: [],
  projects: [],
  groups: []
})

const getMethodType = (method) => {
  const typeMap = {
    GET: 'info',
    POST: 'success',
    PUT: 'warning',
    DELETE: 'error',
    PATCH: 'warning'
  }
  return typeMap[method] || 'info'
}

const performSearch = async (q) => {
  if (!q || q.trim().length < 1) {
    results.interfaces = []
    results.projects = []
    results.groups = []
    return
  }

  loading.value = true
  try {
    const res = await axios.get('/api/project/search', { params: { q } })
    if (res.data.errcode === 0) {
      results.interfaces = res.data.data.interfaceList || []
      results.projects = res.data.data.projectList || []
      results.groups = res.data.data.groupList || []
    }
  } catch (e) {
    message.error('搜索失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  performSearch(keyword.value)
}

const handleClickInterface = (item) => {
  router.push(`/project/${item.project_id}/interface/api/${item._id}`)
}

const handleClickProject = (item) => {
  router.push(`/project/${item._id}`)
}

const handleClickGroup = (item) => {
  router.push(`/group/${item._id}`)
}

onMounted(() => {
  if (route.query.q) {
    keyword.value = route.query.q
    performSearch(keyword.value)
  }
})

watch(() => route.query.q, (newQ) => {
  if (newQ && newQ !== keyword.value) {
    keyword.value = newQ
    performSearch(keyword.value)
  }
})
</script>

<style scoped lang="scss">
.search-page {
  padding: 24px;
  max-width: 900px;
  margin: 0 auto;

  .search-header {
    margin-bottom: 24px;
  }

  .result-list {
    .result-item {
      padding: 16px;
      border-bottom: 1px solid #f0f0f0;
      cursor: pointer;
      transition: background 0.2s;

      &:hover {
        background: #fafafa;
      }

      .item-title {
        font-size: 15px;
        font-weight: 500;
        color: #333;
      }

      .item-path {
        margin-top: 4px;
        font-size: 13px;
        color: #666;
      }

      .item-desc {
        margin-top: 8px;
        font-size: 13px;
        color: #999;
      }

      .item-meta {
        margin-top: 8px;
        font-size: 12px;
        color: #999;

        span {
          margin-right: 16px;
        }
      }
    }
  }
}
</style>