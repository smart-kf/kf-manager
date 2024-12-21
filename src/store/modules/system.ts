import { defineStore } from 'pinia'
// 默认的系统设置
export const useSystemStore = defineStore('system', {
  state: () => ({
    sidebar: true,
    device: 'desktop',
    theme: 'dark',
    layout: 'sidemenu', //sidemenu topmenu
    contentWidth: 'Fluid', //Fixed Fluid
    fixedHeader: false,
    fixSiderbar: false,
    autoHideHeader: false,
    color: '#1677ff', //主题颜色
    weak: false,
    gray: false,
    multiTab: false,
    showSettings: false,
    darkMode: false,
    lockScreen: false
  }),
  actions: {
    setUserInfo(userInfo) {
      this.userInfo = userInfo
    }
  }
})
