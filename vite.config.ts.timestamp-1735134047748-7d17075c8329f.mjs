// vite.config.ts
import { fileURLToPath, URL } from "node:url";
import path from "path";
import { defineConfig } from "file:///F:/kfProject/code/kf-manager/node_modules/vite/dist/node/index.js";
import vue from "file:///F:/kfProject/code/kf-manager/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///F:/kfProject/code/kf-manager/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import { createSvgIconsPlugin } from "file:///F:/kfProject/code/kf-manager/node_modules/vite-plugin-svg-icons/dist/index.mjs";
import mockDevServerPlugin from "file:///F:/kfProject/code/kf-manager/node_modules/vite-plugin-mock-dev-server/dist/index.js";
import vueSetupExtend from "file:///F:/kfProject/code/kf-manager/node_modules/vite-plugin-vue-setup-extend/dist/index.mjs";
import { visualizer } from "file:///F:/kfProject/code/kf-manager/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
var __vite_injected_original_import_meta_url = "file:///F:/kfProject/code/kf-manager/vite.config.ts";
var lifecycle = process.env.npm_lifecycle_event;
var vite_config_default = defineConfig(({ mode }) => {
  return {
    server: {
      port: 8080,
      proxy: {
        "/api": {
          target: "https://api.smartkf.top/",
          // 本地调试
          changeOrigin: true
          // rewrite: (path)=>path.replace(/^\/api/,'')
        }
      }
    },
    // 向import.meta.env注入变量,无法注入全局windows,只能注入import.meta.env中
    // 'import.meta.env.ENV_VARIABLE': JSON.stringify(process.env.ENV_VARIABLE)
    // https://cn.vitejs.dev/config/shared-options.html#envprefix
    build: {
      sourcemap: false,
      chunkSizeWarningLimit: 5e3,
      minify: "terser",
      // 压缩方式
      terserOptions: {
        compress: {
          // 生产环境时移除console.log调试代码
          drop_console: true,
          drop_debugger: true
        }
      },
      rollupOptions: {
        output: {
          chunkFileNames: "js/[name]-[hash].js",
          entryFileNames: "js/[name]-[hash].js",
          assetFileNames: "[ext]/[name]-[hash].[ext]",
          manualChunks(id) {
            if (id.includes("node_modules")) {
              return "vendors";
            }
          }
        }
      }
    },
    plugins: [
      vue(),
      vueJsx(),
      // vueDevTools(),
      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹
        iconDirs: [path.resolve(process.cwd(), "src/assets/icons")],
        // 指定symbolId格式
        symbolId: "icon-[dir]-[name]"
      }),
      mockDevServerPlugin({
        prefix: "/",
        include: "mock/*.ts",
        log: false
      }),
      vueSetupExtend(),
      lifecycle === "report" ? visualizer({ gzipSize: true, open: true, brotliSize: true, filename: "report.html" }) : null
    ],
    resolve: {
      alias: [
        {
          find: "@",
          replacement: fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
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
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJGOlxcXFxrZlByb2plY3RcXFxcY29kZVxcXFxrZi1tYW5hZ2VyXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJGOlxcXFxrZlByb2plY3RcXFxcY29kZVxcXFxrZi1tYW5hZ2VyXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9GOi9rZlByb2plY3QvY29kZS9rZi1tYW5hZ2VyL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZmlsZVVSTFRvUGF0aCwgVVJMIH0gZnJvbSAnbm9kZTp1cmwnXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xuaW1wb3J0IHZ1ZUpzeCBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUtanN4J1xuXG5pbXBvcnQgeyBjcmVhdGVTdmdJY29uc1BsdWdpbiB9IGZyb20gJ3ZpdGUtcGx1Z2luLXN2Zy1pY29ucydcbmltcG9ydCBtb2NrRGV2U2VydmVyUGx1Z2luIGZyb20gJ3ZpdGUtcGx1Z2luLW1vY2stZGV2LXNlcnZlcidcbmltcG9ydCB2dWVTZXR1cEV4dGVuZCBmcm9tICd2aXRlLXBsdWdpbi12dWUtc2V0dXAtZXh0ZW5kJ1xuaW1wb3J0IHsgdmlzdWFsaXplciB9IGZyb20gJ3JvbGx1cC1wbHVnaW4tdmlzdWFsaXplcidcblxuY29uc3QgbGlmZWN5Y2xlID0gcHJvY2Vzcy5lbnYubnBtX2xpZmVjeWNsZV9ldmVudFxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IG1vZGUgfSkgPT4ge1xuICByZXR1cm4ge1xuICAgIHNlcnZlcjoge1xuICAgICAgcG9ydDogODA4MCxcbiAgICAgIHByb3h5OiB7XG4gICAgICAgICcvYXBpJzoge1xuICAgICAgICAgIHRhcmdldDogJ2h0dHBzOi8vYXBpLnNtYXJ0a2YudG9wLycsIC8vIFx1NjcyQ1x1NTczMFx1OEMwM1x1OEJENVxuICAgICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZVxuICAgICAgICAgIC8vIHJld3JpdGU6IChwYXRoKT0+cGF0aC5yZXBsYWNlKC9eXFwvYXBpLywnJylcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgLy8gXHU1NDExaW1wb3J0Lm1ldGEuZW52XHU2Q0U4XHU1MTY1XHU1M0Q4XHU5MUNGLFx1NjVFMFx1NkNENVx1NkNFOFx1NTE2NVx1NTE2OFx1NUM0MHdpbmRvd3MsXHU1M0VBXHU4MEZEXHU2Q0U4XHU1MTY1aW1wb3J0Lm1ldGEuZW52XHU0RTJEXG4gICAgLy8gJ2ltcG9ydC5tZXRhLmVudi5FTlZfVkFSSUFCTEUnOiBKU09OLnN0cmluZ2lmeShwcm9jZXNzLmVudi5FTlZfVkFSSUFCTEUpXG4gICAgLy8gaHR0cHM6Ly9jbi52aXRlanMuZGV2L2NvbmZpZy9zaGFyZWQtb3B0aW9ucy5odG1sI2VudnByZWZpeFxuICAgIGJ1aWxkOiB7XG4gICAgICBzb3VyY2VtYXA6IGZhbHNlLFxuICAgICAgY2h1bmtTaXplV2FybmluZ0xpbWl0OiA1MDAwLFxuICAgICAgbWluaWZ5OiAndGVyc2VyJywgLy8gXHU1MzhCXHU3RjI5XHU2NUI5XHU1RjBGXG4gICAgICB0ZXJzZXJPcHRpb25zOiB7XG4gICAgICAgIGNvbXByZXNzOiB7XG4gICAgICAgICAgLy8gXHU3NTFGXHU0RUE3XHU3M0FGXHU1ODgzXHU2NUY2XHU3OUZCXHU5NjY0Y29uc29sZS5sb2dcdThDMDNcdThCRDVcdTRFRTNcdTc4MDFcbiAgICAgICAgICBkcm9wX2NvbnNvbGU6IHRydWUsXG4gICAgICAgICAgZHJvcF9kZWJ1Z2dlcjogdHJ1ZVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgICBvdXRwdXQ6IHtcbiAgICAgICAgICBjaHVua0ZpbGVOYW1lczogJ2pzL1tuYW1lXS1baGFzaF0uanMnLFxuICAgICAgICAgIGVudHJ5RmlsZU5hbWVzOiAnanMvW25hbWVdLVtoYXNoXS5qcycsXG4gICAgICAgICAgYXNzZXRGaWxlTmFtZXM6ICdbZXh0XS9bbmFtZV0tW2hhc2hdLltleHRdJyxcbiAgICAgICAgICBtYW51YWxDaHVua3MoaWQpIHtcbiAgICAgICAgICAgIC8vXHU5NzU5XHU2MDAxXHU4RDQ0XHU2RTkwXHU1MjA2XHU2MkM2XHU2MjUzXHU1MzA1XG4gICAgICAgICAgICAvLyBcdTUzRUZcdTUzQzJcdTgwMDNodHRwczovL3d3dy5jbmJsb2dzLmNvbS9qeWsvcC8xNjAyOTA3NC5odG1sXG4gICAgICAgICAgICAvLyBub2RlXHU1MzA1XHU2M0QyXHU0RUY2XHU2MjUzXHU1MzA1XHU1NzI4XHU0RTAwXHU4RDc3XG4gICAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ25vZGVfbW9kdWxlcycpKSB7XG4gICAgICAgICAgICAgIHJldHVybiAndmVuZG9ycydcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIHBsdWdpbnM6IFtcbiAgICAgIHZ1ZSgpLFxuICAgICAgdnVlSnN4KCksXG4gICAgICAvLyB2dWVEZXZUb29scygpLFxuICAgICAgY3JlYXRlU3ZnSWNvbnNQbHVnaW4oe1xuICAgICAgICAvLyBcdTYzMDdcdTVCOUFcdTk3MDBcdTg5ODFcdTdGMTNcdTVCNThcdTc2ODRcdTU2RkVcdTY4MDdcdTY1ODdcdTRFRjZcdTU5MzlcbiAgICAgICAgaWNvbkRpcnM6IFtwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSwgJ3NyYy9hc3NldHMvaWNvbnMnKV0sXG4gICAgICAgIC8vIFx1NjMwN1x1NUI5QXN5bWJvbElkXHU2ODNDXHU1RjBGXG4gICAgICAgIHN5bWJvbElkOiAnaWNvbi1bZGlyXS1bbmFtZV0nXG4gICAgICB9KSxcbiAgICAgIG1vY2tEZXZTZXJ2ZXJQbHVnaW4oe1xuICAgICAgICBwcmVmaXg6ICcvJyxcbiAgICAgICAgaW5jbHVkZTogJ21vY2svKi50cycsXG4gICAgICAgIGxvZzogZmFsc2VcbiAgICAgIH0pLFxuICAgICAgdnVlU2V0dXBFeHRlbmQoKSxcbiAgICAgIGxpZmVjeWNsZSA9PT0gJ3JlcG9ydCcgPyB2aXN1YWxpemVyKHsgZ3ppcFNpemU6IHRydWUsIG9wZW46IHRydWUsIGJyb3RsaVNpemU6IHRydWUsIGZpbGVuYW1lOiAncmVwb3J0Lmh0bWwnIH0pIDogbnVsbFxuICAgIF0sXG4gICAgcmVzb2x2ZToge1xuICAgICAgYWxpYXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGZpbmQ6ICdAJyxcbiAgICAgICAgICByZXBsYWNlbWVudDogZmlsZVVSTFRvUGF0aChuZXcgVVJMKCcuL3NyYycsIGltcG9ydC5tZXRhLnVybCkpXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9LFxuICAgIGNzczoge1xuICAgICAgcHJlcHJvY2Vzc29yT3B0aW9uczoge1xuICAgICAgICBsZXNzOiB7XG4gICAgICAgICAgamF2YXNjcmlwdEVuYWJsZWQ6IHRydWVcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBOFEsU0FBUyxlQUFlLFdBQVc7QUFDalQsT0FBTyxVQUFVO0FBQ2pCLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sU0FBUztBQUNoQixPQUFPLFlBQVk7QUFFbkIsU0FBUyw0QkFBNEI7QUFDckMsT0FBTyx5QkFBeUI7QUFDaEMsT0FBTyxvQkFBb0I7QUFDM0IsU0FBUyxrQkFBa0I7QUFUNEksSUFBTSwyQ0FBMkM7QUFXeE4sSUFBTSxZQUFZLFFBQVEsSUFBSTtBQUM5QixJQUFPLHNCQUFRLGFBQWEsQ0FBQyxFQUFFLEtBQUssTUFBTTtBQUN4QyxTQUFPO0FBQUEsSUFDTCxRQUFRO0FBQUEsTUFDTixNQUFNO0FBQUEsTUFDTixPQUFPO0FBQUEsUUFDTCxRQUFRO0FBQUEsVUFDTixRQUFRO0FBQUE7QUFBQSxVQUNSLGNBQWM7QUFBQTtBQUFBLFFBRWhCO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQUlBLE9BQU87QUFBQSxNQUNMLFdBQVc7QUFBQSxNQUNYLHVCQUF1QjtBQUFBLE1BQ3ZCLFFBQVE7QUFBQTtBQUFBLE1BQ1IsZUFBZTtBQUFBLFFBQ2IsVUFBVTtBQUFBO0FBQUEsVUFFUixjQUFjO0FBQUEsVUFDZCxlQUFlO0FBQUEsUUFDakI7QUFBQSxNQUNGO0FBQUEsTUFDQSxlQUFlO0FBQUEsUUFDYixRQUFRO0FBQUEsVUFDTixnQkFBZ0I7QUFBQSxVQUNoQixnQkFBZ0I7QUFBQSxVQUNoQixnQkFBZ0I7QUFBQSxVQUNoQixhQUFhLElBQUk7QUFJZixnQkFBSSxHQUFHLFNBQVMsY0FBYyxHQUFHO0FBQy9CLHFCQUFPO0FBQUEsWUFDVDtBQUFBLFVBQ0Y7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxJQUNBLFNBQVM7QUFBQSxNQUNQLElBQUk7QUFBQSxNQUNKLE9BQU87QUFBQTtBQUFBLE1BRVAscUJBQXFCO0FBQUE7QUFBQSxRQUVuQixVQUFVLENBQUMsS0FBSyxRQUFRLFFBQVEsSUFBSSxHQUFHLGtCQUFrQixDQUFDO0FBQUE7QUFBQSxRQUUxRCxVQUFVO0FBQUEsTUFDWixDQUFDO0FBQUEsTUFDRCxvQkFBb0I7QUFBQSxRQUNsQixRQUFRO0FBQUEsUUFDUixTQUFTO0FBQUEsUUFDVCxLQUFLO0FBQUEsTUFDUCxDQUFDO0FBQUEsTUFDRCxlQUFlO0FBQUEsTUFDZixjQUFjLFdBQVcsV0FBVyxFQUFFLFVBQVUsTUFBTSxNQUFNLE1BQU0sWUFBWSxNQUFNLFVBQVUsY0FBYyxDQUFDLElBQUk7QUFBQSxJQUNuSDtBQUFBLElBQ0EsU0FBUztBQUFBLE1BQ1AsT0FBTztBQUFBLFFBQ0w7QUFBQSxVQUNFLE1BQU07QUFBQSxVQUNOLGFBQWEsY0FBYyxJQUFJLElBQUksU0FBUyx3Q0FBZSxDQUFDO0FBQUEsUUFDOUQ7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLElBQ0EsS0FBSztBQUFBLE1BQ0gscUJBQXFCO0FBQUEsUUFDbkIsTUFBTTtBQUFBLFVBQ0osbUJBQW1CO0FBQUEsUUFDckI7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
