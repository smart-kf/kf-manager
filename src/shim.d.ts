declare module '*.vue' {
  import { ComponentOptions } from 'vue'
  const componentOptions: ComponentOptions
  export default componentOptions
}

// 扩展window对象
declare interface Window {
  env: string
  pagetitle: string
  __hasGenConstantRouterComponents: any
}

// declare module '*.png' {
//   const content: any
//   export default content
// }
