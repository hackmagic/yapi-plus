import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import path from 'path'

export default defineConfig({
  plugins: [vue(), vueJsx()],
  optimizeDeps: {},
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client'),
      'client': path.resolve(__dirname, './client'),
      'common': path.resolve(__dirname, './common'),
      'exts': path.resolve(__dirname, './exts')
    }
  },
  server: {
    port: 4000,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'static/prd',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          lib: ['axios', 'moment', 'mockjs'],
          ui: ['naive-ui']
        }
      }
    }
  }
})
