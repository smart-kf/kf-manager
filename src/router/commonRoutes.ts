import { UserLayout } from '@/layouts'
import { h } from 'vue'
import { BasicLayout, RouteView } from '@/layouts'
import { MailOutlined, AppstoreOutlined, SettingOutlined } from '@ant-design/icons-vue'
import { type Router } from './types'

// info:todo:1.如果使用服务端获取路由,path: '/',这块路由再写就会被覆盖
// 2.router.addRoute(parent, routeObj),添加parent,它就会自动加上/parent/xxx,直接写parent即可,就算嵌套多层也没事,自动变成/xxxx/xxxx/parent/xxxxx
// 3.以“/”开头的嵌套路径会被当作根路径，所以子路由上不用加“/”;
// 在生成路由时，主路由上的path会被自动添加到子路由之前，所以子路由上的path不用在重新声明主路由上的path了。
export default [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    redirect: '/qrCode',
    children: [
      {
        path: '/qrCode',
        name: 'qrCode',
        meta: { title: '二维码', icon: 'icon-erweima' },
        component: () => import('@/views/qrCode/index.vue')
      },
      {
        path: '/qrCode/order',
        name: 'qrCode-order',
        component: () => import('@/views/qrCode/order.vue'),
        meta: { title: '域名订单', hidden: true }
      },
      {
        path: '/chat',
        name: 'Chat',
        component: () => import('@/views/chat/index.vue'),
        meta: { title: '消息', icon: 'icon-xiaoxi1' }
      },
      {
        path: '/welcomeMsg',
        name: 'welcomeMsg',
        meta: { title: '欢迎语', icon: 'icon-huanyingyu' },
        component: () => import('@/views/welcomeMsg/index.vue')
      },
      // 没有想好怎么实现， 暂时屏蔽
      // {
      //   path: '/aiReply',
      //   name: 'aiReply',
      //   meta: { title: '智能回复', icon: 'icon-zhinenghuifu' },
      //   component: () => import('@/views/aiReply/index.vue')
      // },
      {
        path: '/quickReply',
        name: 'quickReply',
        meta: { title: '快捷回复', icon: 'icon-kuaijiehuifu' },
        component: () => import('@/views/quickReply/index.vue')
      },
      {
        path: '/speechCraft',
        name: 'speechCraft',
        meta: { title: '话术复制', icon: 'icon-fuzhi' },
        component: () => import('@/views/speech/index.vue')
      },
      {
        path: '/systemLog',
        name: 'systemLog',
        meta: { title: '日志', icon: 'icon-rizhi' },
        component: () => import('@/views/systemLog/index.vue')
      },
      {
        path: '/systemSetting',
        name: 'systemSetting',
        meta: { title: '设置', icon: 'icon-shezhi' },
        component: () => import('@/views/systemSetting/index.vue')
      }
    ]
  },
  {
    path: '/user',
    name: 'user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login.vue'),
        meta: { title: '登录' }
      },
      {
        path: 'recover',
        name: 'recover',
        component: undefined
      }
    ]
  },
  {
    path: '/:path(.*)',
    name: 'NoMatch',
    component: () => import('@/views/exception/404.vue')
  }
] as Router[]
