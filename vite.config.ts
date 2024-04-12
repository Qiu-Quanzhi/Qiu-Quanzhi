import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

//import compression from 'vite-plugin-compression'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // compression({
    //   algorithm: "brotliCompress",
    //   ext: ".br",
    //   threshold: 0
    // })
  ],
  base: './',
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        "en": resolve(__dirname, 'en.html'),
        "zh-hk": resolve(__dirname, 'zh-hk.html'),
      },
    },

    target: 'esnext',
    modulePreload: {
      polyfill: false
    },
    reportCompressedSize: false,
  }
})
