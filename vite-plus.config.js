// VitePlus 配置文件
// VitePlus 会自动使用 vite.config.js，这里提供一些额外的配置

export default {
  // VitePlus 特有的配置可以放在这里
  // 大部分配置仍然在 vite.config.js 中
  
  // 构建配置
  build: {
    // 生产构建输出目录
    outDir: 'static/prd',
    
    // 静态资源目录
    assetsDir: 'assets',
    
    // 启用 Rolldown 进行更快的生产构建
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          'naive-ui': ['naive-ui'],
          'utils': ['axios', 'json5'],
        }
      }
    }
  },
  
  // 检查配置
  check: {
    // 启用类型检查
    typescript: true,
    
    // 启用 linting
    lint: true,
    
    // 启用格式化检查
    format: true,
  },
}
