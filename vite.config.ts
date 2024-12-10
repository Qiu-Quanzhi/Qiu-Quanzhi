import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    createSvgIconsPlugin({
      iconDirs: [resolve(__dirname, 'src/icons')]
    }),
  ],
  base: './',
  build: {
    rollupOptions: {
      input: {
        "index": resolve(__dirname, 'index.html'),
        "en": resolve(__dirname, 'en.html'),
        "zh-hk": resolve(__dirname, 'zh-hk.html'),
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
