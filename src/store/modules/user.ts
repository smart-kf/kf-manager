import { defineStore } from 'pinia'
export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: {
      nickname: ''
    } as any
  }),
  // 类似于Vuex中的getters，用于派生数据
  getters: {
    getUserInfo: (state) => {
      return state.userInfo
    }
  },
  actions: {
    setUserInfo(userInfo) {
      this.userInfo = userInfo
      sessionStorage.setItem('systemConfig', JSON.stringify(userInfo))
    }
  }
})
