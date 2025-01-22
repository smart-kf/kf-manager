import baseService from '@/utils/http/axios'

export const chatListPost = (data: any) => {
    return baseService.post(`api/kf-be/chat/list`, data)
}

export const chatMsgPost = (data: any) => {
    return baseService.post(`api/kf-be/chat/msgs`, data)
}