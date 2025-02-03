import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue()
  ],
  base: './',
  build: {
    rollupOptions: {
      input: {
        "index": resolve(__dirname, 'index.html'),
        "zh-cn": resolve(__dirname, 'zh-cn.html'),
        "zh-hk": resolve(__dirname, 'zh-hk.html'),
        "en": resolve(__dirname, 'en.html'),
      },
    },

    target: 'esnext',
    modulePreload: {
      polyfill: false
    },
    reportCompressedSize: false,
  },
  resolve:{
    alias: {
      "@": resolve(__dirname,"src/"),
      "components": resolve(__dirname,"src/components/")
    }
  }
})
