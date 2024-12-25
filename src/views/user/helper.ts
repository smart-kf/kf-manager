import { timeFix } from '@/utils/util'
import ls from '@/utils/Storage'
import { message, notification } from 'ant-design-vue'
import { Router } from 'vue-router'

export const loginSuccess = (res, router: Router) => {
  // 延迟 1 秒显示欢迎信息
  setTimeout(() => {
    notification.success({
      message: '欢迎',
      description: `${timeFix()}，欢迎回来`
    })
  })
  if (res.token) {
    // ls.set(ACCESS_TOKEN, res.token, 7 * 24 * 60 * 60 * 1000);
    // ls.set(PERMISSION, Array.isArray(res.permission) ? res.permission : res.permission.split(','));
    // ls.set(USER_INFO, res);
  }
  router.push({ path: '/' })
}

export const requestFailed = (err) => {
  notification['error']({
    message: '错误',
    description: ((err.response || {}).data || {}).message || '请求出现错误，请稍后再试',
    duration: 4
  })
}

export const useGetCaptcha = (e, validate, state, form, registerBtn) => {
  e.preventDefault()
  validate(['mobile']).then((res) => {
    state.smsSendBtn = true
    const interval = window.setInterval(() => {
      if (state.time-- <= 0) {
        state.time = 60
        state.smsSendBtn = false
        window.clearInterval(interval)
      }
    }, 1000)

    message.loading('验证码发送中..', 1)
  })
}
