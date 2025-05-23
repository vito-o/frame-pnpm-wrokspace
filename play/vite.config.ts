import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3000,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'https://ww-aiot.com:9527/gpt-api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  resolve: {
    alias: {
      '@': '/src',
      '@packages': path.resolve(__dirname, '../packages')
    },
    extensions: [".vue",'.js', '.json', '.ts', '.tsx'],//使用别名省略的后缀名
  },
})
