import baseService from '@/utils/http/axios'

export const chatListPost = (data: any) => {
    return baseService.post(`api/kf-be/chat/list`, data)
}

export const chatMsgPost = (data: any) => {
    return baseService.post(`api/kf-be/chat/msgs`, data)
}

export const chatUserGet = (uuid: any) => {
    return baseService.get(`api/kf-be/user?uuid=${uuid}`,{})
}

export const fileUpload = (data: any) => {
    return baseService.post(`api/kf-be/upload`,data)
}

export const updateUser = (data: any) => {
    return baseService.post(`/api/kf-be/user/update`,data)
}



