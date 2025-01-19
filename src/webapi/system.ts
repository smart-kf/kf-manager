import baseService from '@/utils/http/axios'

// 系统配置
export const getSysConfig = (data: any) => {
  return baseService.get(`api/kf-be/sysConfig`, data)
}
// 保存系统配置
export const saveSysConfig = (data: any) => {
  return baseService.post(`api/kf-be/sysConfig`, data)
}

// 操作日志
export const getQrcodeSwitch = (data: any) => {
  return baseService.post(`api/kf-be/sysLog`, data)
}
