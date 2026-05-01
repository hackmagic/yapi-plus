<template>
  <n-layout-footer class="footer">
    <div class="footer-wrapper">
      <n-grid :cols="4" :x-gap="24" :y-gap="16" responsive="screen" :item-responsive="true">
        <n-gi span="4 m:1 l:1">
          <div class="footer-section">
            <h4 class="footer-title">
              <n-icon><LogoGithub /></n-icon>
              GitHub
            </h4>
            <p><a href="https://github.com/YMFE/yapi" target="_blank">YAPI 源码仓库</a></p>
            <p><a href="https://github.com/jihene/yapi-plus" target="_blank">YAPI Plus 源码</a></p>
          </div>
        </n-gi>

        <n-gi span="4 m:1 l:1">
          <div class="footer-section">
            <h4 class="footer-title">
              <n-icon><PeopleOutline /></n-icon>
              团队
            </h4>
            <p><a href="https://ymfe.org" target="_blank">YMFE</a></p>
          </div>
        </n-gi>

        <n-gi span="4 m:1 l:1">
          <div class="footer-section">
            <h4 class="footer-title">
              <n-icon><ChatboxEllipsesOutline /></n-icon>
              反馈
            </h4>
            <p><a href="https://github.com/YMFE/yapi/issues" target="_blank">GitHub Issues</a></p>
            <p><a href="https://github.com/YMFE/yapi/pulls" target="_blank">GitHub Pull Requests</a></p>
          </div>
        </n-gi>

        <n-gi span="4 m:1 l:1">
          <div class="footer-section">
            <h4 class="footer-title">Copyright</h4>
            <p>© 2018-{{ currentYear }} YMFE</p>
            <p>
              <a :href="`https://github.com/YMFE/yapi/blob/master/CHANGELOG.md`" target="_blank">
                版本: {{ version }}
              </a>
            </p>
            <p><a href="https://hellosean1025.github.io/yapi" target="_blank">使用文档</a></p>
          </div>
        </n-gi>
      </n-grid>
    </div>
  </n-layout-footer>
</template>

<script setup>
import { computed } from "vue";
import { NIcon } from "naive-ui";
import {
  LogoGithub,
  PeopleOutline,
  ChatboxEllipsesOutline,
} from "@vicons/ionicons5";

// 版本信息 - 可从后端获取或使用固定值
const version = "1.12.0";
const currentYear = computed(() => new Date().getFullYear());
</script>

<style scoped lang="scss">
.footer {
  padding: 24px 0;
  background: #fafafa;
  border-top: 1px solid #e8e8e8;
}

.footer-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.footer-section {
  h4 {
    margin: 0 0 12px 0;
    font-size: 14px;
    font-weight: 600;
    color: #333;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  p {
    margin: 0 0 8px 0;
    font-size: 13px;
  }

  a {
    color: #666;
    text-decoration: none;
    transition: color 0.3s;

    &:hover {
      color: #2395f1;
    }
  }
}
</style>
