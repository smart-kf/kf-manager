<template>
  <a-config-provider
    :locale="lang[locale]"
    :theme="{
      token: {
        colorPrimary: systemConfig.color,
        borderRadius: 2
      }
    }"
  >
    <!-- algorithm: theme.darkAlgorithm,夜间主题 -->
    <router-view />
  </a-config-provider>
</template>

<script lang="ts" setup name="App">
import { onErrorCaptured, h } from 'vue'
import zh_CN from 'ant-design-vue/es/locale/zh_CN'
import en_US from 'ant-design-vue/es/locale/en_US'
import { setDeviceType } from '@/utils/device'
import emitter from '@/utils/eventBus'
import { useRouter } from 'vue-router'
import { Modal } from 'ant-design-vue'
import { useI18n } from 'vue-i18n'
import { useSystemStore } from '@/store/modules'

const { locale } = useI18n()
const lang = { 'en-US': en_US, 'zh-CN': zh_CN }
const systemConfig = useSystemStore()

window.onresize = setDeviceType
setDeviceType()

const router = useRouter()
emitter.once('axios_goto_login', () => {
  router.push({ name: 'login' })
})

//全局错误处理
onErrorCaptured((err, instance, info) => {
  if (window.env !== 'localhost') {
    // debugger
    console.log(err, instance, info)
    // Modal.error({
    //   title: 'System Error',
    //   content: h('pre', err.stack),
    //   class: 'errorCapturedModal',
    //   width: '60%'
    // })
  }
})
</script>

<style>
/* 注入阿里图标 */
@import url('//at.alicdn.com/t/c/font_4789837_4550id1h8co.css');
</style>
