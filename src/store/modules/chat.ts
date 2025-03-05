import { defineStore } from 'pinia'
// 默认的系统设置
export const useChatStore = defineStore('chat', {
  state: () => ({
    chatInfo: null
  }),
  actions: {
    setChatInfo(chatInfo) {
      this.chatInfo = chatInfo
    }
  }
})
