import { defineStore } from 'pinia'
import defaultUser from '@/assets/defaultUser.png'
export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: {
      name: 'dashazi',
      avatar: defaultUser
    }
  }),
  // 类似于Vuex中的getters，用于派生数据
  getters: {
    doubleCount: (state) => {
      return state.userInfo
    }
  },
  actions: {
    setUserInfo(userInfo) {
      this.userInfo = userInfo
    }
  }
})
