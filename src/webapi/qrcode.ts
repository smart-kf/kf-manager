import baseService from '@/utils/http/axios'

// 获取二维码和域名列表的接口
export const getQrcode = (data: any) => {
  return baseService.get(`api/kf-be/qrcode`, data)
}
// 二维码功能开关
export const getQrcodeOff = (data: any) => {
  return baseService.post(`api/kf-be/qrcode/on-off`, data)
}

// 更换二维码
export const getQrcodeSwitch = (data: any) => {
  return baseService.post(`api/kf-be/qrcode/switch`, data)
}

export const getDomainPrice = () => {
  return baseService.get(`api/kf-be/qrcode/domain-price`)
}

export const createDomainOrder = (data:any) => {
  return baseService.post(`api/kf-be/qrcode/create-domain-order`, data)
}

export const domainOrderList = (data:any) => {
  return baseService.get(`api/kf-be/qrcode/domain-order-list`, data)
}