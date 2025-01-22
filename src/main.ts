import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import store from '@/store'
import '@/style/global.less'
import i18n from '@/locales/useI18n'
import 'virtual:svg-icons-register'

import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import '@/utils/default-passive-events'
import IconFont from '@/components/IconFont/index.vue'

import directives from '@/directives/index'

const app = createApp(App)
//  注册图标组件
app.component('IconFont', IconFont)

app.use(Antd)
app.use(router)
app.use(store)
app.use(i18n)
app.use(directives)
app.mount('#app')

window.env = (import.meta as any).env.MODE
