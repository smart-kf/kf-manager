<template>
  <router-view v-slot="{ Component }" v-if="isKeep">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>
  <router-view v-else />
</template>
<script lang="ts" setup name="RouteView">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  keepAlive: {
    type: Boolean,
    default: false
  }
})
const router = useRouter()
const isKeep = ref(false)

watch(
  () => router.currentRoute.value,
  (newVal) => {
    // 应当全部组件皆缓存，否则会导致切换页面后页面还原成原始状态
    // 若确实不需要，可改为 return meta.keepAlive ? isKeep : notKeep
    const routeKeepAlive = router.currentRoute.value.meta.keepAlive
    if (!routeKeepAlive && !props.keepAlive) {
      isKeep.value = false
    } else {
      isKeep.value = true
    }
  },
  {
    immediate: true
  }
)
</script>
