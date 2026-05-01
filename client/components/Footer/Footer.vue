<template>
  <n-layout-footer class="footer">
    <div class="footer-content">
      <a href="https://github.com/hackmagic/yapi-plus" target="_blank">@2026 yapi plus</a>
      基于 yapi 开发 · MIT License
    </div>
  </n-layout-footer>
</template>

<script setup>
// 简洁的页脚组件
</script>

<style scoped lang="scss">
.footer {
  padding: 16px 24px;
  background: #1a1a2e;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);

  a {
    color: rgba(255, 255, 255, 0.7);
    text-decoration: none;

    &:hover {
      color: #fff;
    }
  }
}
</style>
