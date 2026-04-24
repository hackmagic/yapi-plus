import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
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
          vendor: ['react', 'react-dom', 'redux', 'react-redux', 'react-router-dom'],
          lib: ['axios', 'moment', 'mockjs'],
          ui: ['naive-ui']
        }
      }
    }
  }
})
