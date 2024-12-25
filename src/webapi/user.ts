import baseService from '@/utils/http/axios'

// 用户登录
export const userLogin = (data: any) => {
  return baseService.post(`auth/login`, data)
}
// 获取验证图片
export const getCaptchaImg = (id: String) => {
  return baseService.post(`api/public/captcha/${id}`, {})
}

// 获取验证码id
export const getCaptchaId = () => {
  return baseService.get(`/public/captchaId`, {})
}
// export const getCaptchaId = () => {
//   return baseService.get(`public/captchaId`, {})
// }
