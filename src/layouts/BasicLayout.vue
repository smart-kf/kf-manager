<template>
  <a-layout>
    <side-menu mode="inline" :menus="menus" :theme="theme" :collapsed="collapsed" :collapsible="true"></side-menu>
    <a-layout>
      <a-layout-content
        id="layoutContent"
        :style="{
          height: '100%'
        }"
      >
        <transition name="page-transition">
          <section>
            <router-view />
          </section>
        </transition>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script lang="ts" setup name="BasicLayout">
import { ref, watch, onMounted, nextTick } from 'vue'
import RouteView from './RouteView.vue'
import SideMenu from '@/components/Menu/SideMenu.vue'
import { convertRoutes } from '@/router/generateAsyncRoutes'
import { filteRouterPermission } from '@/router/permission'
import { cloneDeep } from 'lodash-es'
import { useSystemStore } from '@/store/modules'
import { useRouter } from 'vue-router'

const router = useRouter()
const collapsed = ref(false)
const menus = ref([])
const { sidebar, theme } = useSystemStore()

watch(
  () => sidebar,
  (val) => {
    collapsed.value = !val
  }
)

// created()
// bug:TODO:克隆时报警告[Vue warn]: Avoid app logic that relies on enumerating keys on a component instance. The keys will be empty in production mode to avoid performance overhead.目前还不知道解决方案
const mainMenu = cloneDeep(router.getRoutes())
const orginRoutes = filteRouterPermission(mainMenu, [])
// 相对路径转绝对路径
// 系统菜单以/为第一级,/外面的都不显示在菜单中,但是可以跳转到该路由
const routes = convertRoutes(orginRoutes.find((item) => item.path === '/'))
menus.value = (routes && routes.children) || []
collapsed.value = !sidebar

onMounted(() => {
  const userAgent = navigator.userAgent
  if (userAgent.indexOf('Edge') > -1) {
    nextTick(() => {
      collapsed.value = !collapsed.value
      setTimeout(() => {
        collapsed.value = !collapsed.value
      }, 16)
    })
  }
})
</script>

<style lang="less">
/*
 * The following styles are auto-applied to elements with
 * transition="page-transition" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the page transition by editing
 * these styles.
 */
.page-transition-enter {
  opacity: 0;
}

.page-transition-leave-active {
  opacity: 0;
}

.page-transition-enter .page-transition-container,
.page-transition-leave-active .page-transition-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
