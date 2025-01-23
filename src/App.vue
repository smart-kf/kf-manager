<template>
  <a-config-provider :locale="lang[locale]">
    <!-- algorithm: theme.darkAlgorithm,夜间主题 -->
    <router-view />
  </a-config-provider>
</template>

<script lang="ts" setup name="App">
import zh_CN from 'ant-design-vue/es/locale/zh_CN'
import en_US from 'ant-design-vue/es/locale/en_US'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const lang = { 'en-US': en_US, 'zh-CN': zh_CN }
</script>

<style>
/* 注入阿里图标 */
@import url('//at.alicdn.com/t/c/font_4789837_4550id1h8co.css');
</style>
