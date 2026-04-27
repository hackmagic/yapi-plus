<template>
  <n-layout-footer class="footer">
    <n-row justify="center">
      <n-col :span="24" class="footer-content">
        <p>© 2026 YAPI Plus - 基于 Vue 3 + VitePlus + Naive UI 构建</p>
        <n-space :size="16" justify="center">
          <a href="https://github.com" target="_blank">GitHub</a>
          <a href="#" target="_blank">使用文档</a>
          <a href="#" target="_blank">API 文档</a>
        </n-space>
      </n-col>
    </n-row>
  </n-layout-footer>
</template>

<script setup>
// Footer 组件
</script>

<style scoped>
.footer {
  padding: 24px;
  background: #fafafa;
  border-top: 1px solid #e8e8e8;
  text-align: center;
}

.footer-content {
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
}

.footer-content a {
  color: rgba(0, 0, 0, 0.45);
  text-decoration: none;
  transition: color 0.3s;
}

.footer-content a:hover {
  color: #2080f0;
}
</style>
