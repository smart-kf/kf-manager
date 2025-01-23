import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import store from '@/store'
import i18n from '@/locales/useI18n'
import 'virtual:svg-icons-register'

import Antd from 'ant-design-vue'
// import 'ant-design-vue/dist/antd.less'
import '@/style/global.less'
import '@/utils/default-passive-events'
import IconFont from '@/components/IconFont/index.vue'

import directives from '@/directives/index'

import VueQrcode from 'vue-qrcode'

const app = createApp(App)
//  注册图标组件
app.component('vue-qrcode', VueQrcode)
app.component('IconFont', IconFont)

app.use(Antd)
app.use(router)
app.use(store)
app.use(i18n)
app.use(directives)
app.mount('#app')

window.env = (import.meta as any).env.MODE
