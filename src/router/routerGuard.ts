import NProgress from 'nprogress' // progress bar
import '@/components/NProgress/nprogress.less' // progress bar custom style
import { hasPermission } from './permission'
import ls from '@/utils/Storage'
import { setDocumentTitle } from '@/utils/domUtil'
import type { Router } from 'vue-router'
import { useUserStore } from '@/store/modules/index' // 确保导入你的 store
import { SystemApi } from '@/webapi/index'
import { notification } from 'ant-design-vue'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['login', 'register', 'registerResult'] // 不进行拦截的路由名称集合
const defaultRoutePath = '/qrCode'

export const setupBeforeEach = (router: Router) => {
  router.beforeEach(async (to, from, next) => {
    const userStore = useUserStore()
    NProgress.start() // 加载进度条
    setDocumentTitle(to) // 设置页面标题
    const token = ls.get('token')
    if (token) {
      if (to.path === '/user/login') {
        ls.remove('token')
        next()
        NProgress.done()
      } else {
        try {
          // 如果有信息，卡密一定存在，头像和昵称可能没有
          if (userStore.getUserInfo && userStore.getUserInfo.cardId) {
            next() // 继续路由跳转
          } else {
            let res = await SystemApi.getSysConfig({})
            userStore.setUserInfo(res.data)
            next() // 继续路由跳转
          }
        } catch (error) {
          console.error('Error fetching user data:', error)
          next({ path: '/user/login' })
        }
      }
    } else {
      if (whiteList.includes(to.name as any)) {
        // 在免登录白名单，直接进入
        next()
      } else {
        next({ path: '/user/login' })
        NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
      }
    }
  })

  // 路由懒加载失败时的提示
  router.onError((error) => {
    if (window.env === 'localhost') {
      notification.error({
        message: 'Dynamic import error',
        description: error.stack
      })
    } else {
      router.push({ name: 'error', params: { errorMsg: error.stack } })
    }
  })
}

export const setupAfterEach = (router: Router) => {
  router.afterEach(() => {
    NProgress.done() // finish progress bar
  })
}
