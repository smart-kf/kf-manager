import baseService from '@/utils/http/axios'
import { baseURL } from '@/utils/util'

// 用户登录
export const userLogin = (data: any) => {
  const api = baseURL + `auth/login`
  return baseService.post(api, data)
}
