import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

const jsxInJsPlugin = {
  name: 'jsx-in-js',
  enforce: 'post',
  transform(code, id) {
    if (id.endsWith('.js') && !id.includes('node_modules')) {
      if (code.includes('</') || code.includes('/>')) {
        return import('esbuild').then(esbuild =>
          esbuild.transform(code, {
            loader: 'jsx',
            jsx: 'automatic',
            jsxImportSource: 'react',
            sourcemap: true
          })
        )
      }
    }
  }
}

export default defineConfig({
  plugins: [react(), jsxInJsPlugin],
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
