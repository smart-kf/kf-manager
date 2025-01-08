import { fileURLToPath, URL } from 'node:url'
import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import mockDevServerPlugin from 'vite-plugin-mock-dev-server'
import vueSetupExtend from 'vite-plugin-vue-setup-extend'
import { visualizer } from 'rollup-plugin-visualizer'

const lifecycle = process.env.npm_lifecycle_event

export default defineConfig(({ mode }) => {
  return {
    server: {
      port: 8080,
      proxy: {
        '/api': {
          target: 'https://api.smartkf.top/', // 本地调试
          changeOrigin: true
          // rewrite: (path)=>path.replace(/^\/api/,'')
        }
      }
    },
    // 向import.meta.env注入变量,无法注入全局windows,只能注入import.meta.env中
    // 'import.meta.env.ENV_VARIABLE': JSON.stringify(process.env.ENV_VARIABLE),
    // https://cn.vitejs.dev/config/shared-options.html#envprefix
    build: {
      sourcemap: false,
      chunkSizeWarningLimit: 5000,
      minify: 'terser', // 压缩方式
      terserOptions: {
        compress: {
          // 生产环境时移除console.log调试代码
          drop_console: false,
          drop_debugger: true
        }
      },
      rollupOptions: {
        output: {
          chunkFileNames: 'js/[name]-[hash].js',
          entryFileNames: 'js/[name]-[hash].js',
          assetFileNames: '[ext]/[name]-[hash].[ext]',
          manualChunks: {
            vue: ['vue', 'vue-router'],
            antVue: ['ant-design-vue'],
            wangedit: ['wangeditor']
          }
          // manualChunks(id) {
          //   //静态资源分拆打包
          //   // 可参考https://www.cnblogs.com/jyk/p/16029074.html
          //   // node包插件打包在一起
          //   if (id.includes('node_modules')) {
          //     return id.toString().split('node_modules/')[1].split('/')[0].toString()
          //   }
          // }
        }
      }
    },
    plugins: [
      vue(),
      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        // 指定symbolId格式
        symbolId: 'icon-[dir]-[name]'
      }),
      mockDevServerPlugin({
        prefix: '/',
        include: 'mock/*.ts',
        log: false
      }),
      vueSetupExtend(),
      lifecycle === 'report' ? visualizer({ gzipSize: true, open: true, brotliSize: true, filename: 'report.html' }) : null
    ],
    resolve: {
      alias: [
        {
          find: '@',
          replacement: fileURLToPath(new URL('./src', import.meta.url))
        }
      ]
    },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true
        }
      }
    }
  }
})
