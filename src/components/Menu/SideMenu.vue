<template>
  <a-layout-sider :class="['sider', 'shadow', theme]" width="256px" :collapsible="collapsible" v-model:collapsed="sideMenuCollapsed" :trigger="null">
    <!-- <logo /> -->
    <Menu :collapsed="collapsed" :menu="menus" :theme="theme" :mode="mode" @select="onSelect"></Menu>
  </a-layout-sider>
</template>

<script lang="ts" setup name="SideMenu">
import { watch, ref } from 'vue'
// import Logo from '@/components/tools/Logo.vue'
import Menu from './Menu.vue'

const props = defineProps({
  mode: {
    type: String,
    required: false,
    default: 'inline'
  },
  theme: {
    type: String,
    required: false,
    default: 'dark'
  },
  collapsible: {
    type: Boolean,
    required: false,
    default: false
  },
  collapsed: {
    type: Boolean,
    required: false,
    default: false
  },
  menus: {
    type: Array,
    required: true
  }
})

const sideMenuCollapsed = ref(false)
watch(
  () => props.collapsed,
  (newVal) => {
    // 先处理成不折叠
    sideMenuCollapsed.value = newVal
  },
  {
    immediate: true
  }
)

const emit = defineEmits(['menuSelect'])
const onSelect = (obj) => {
  emit('menuSelect', obj)
}
</script>
