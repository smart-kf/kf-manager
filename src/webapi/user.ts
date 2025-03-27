import baseService from '@/utils/http/axios'

// 用户登录
export const userLogin = (data: any) => {
  return baseService.post(`api/kf-be/login`, data)
}
// 用户登录
export const loginOut = (data: any) => {
  return baseService.post(`api/kf-be/logout`, data)
}

// 修改密码
export const updatePassword = (data: any) => {
  return baseService.post(`api/kf-be/change-password`, data)
}
