import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import path from 'path'
import { peerDependencies } from './package.json'
// import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    vue(), 
    dts(),
    // visualizer({
    //   filename: 'stats.html',       // 输出的分析文件
    //   open: true,                   // 构建后自动打开浏览器
    //   gzipSize: true,               // 显示 gzip 后大小
    //   brotliSize: true              // 显示 brotli 后大小
    // })
  ],
  build: {  
    lib: {
      entry: path.resolve(__dirname, 'index.ts'),
      name: 'docs-aic-editor',
      fileName: 'index',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: Object.keys(peerDependencies),
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: 'Vue'
        }
      }
    }
  }
})
