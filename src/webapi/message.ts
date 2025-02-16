import baseService from '@/utils/http/axios'

// 欢迎语，智能欢迎语，快捷回复
export const getWelcomeList = (data: any) => {
  return baseService.get(`api/kf-be/welcome/list`, { params: data })
}
// 欢迎语，智能欢迎语，快捷回复更新
export const updateWelcome = (data: any) => {
  return baseService.post(`api/kf-be/welcome/upsert`, data)
}

// 欢迎语，智能欢迎语，快捷回复删除
export const delWelcome = (data: any) => {
  return baseService.post(`api/kf-be/welcome/del`, data)
}
