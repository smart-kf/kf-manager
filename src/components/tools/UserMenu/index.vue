<template>
  <div class="user-wrapper">
    <a-popover placement="rightTop">
      <template #content>
        <a-space direction="vertical">
          <div><span>卡密到期时间：2025-12-12 23:23:23</span></div>
          <a-button type="link" @click="showNotice">公告</a-button>
          <a-button type="link" @click="loginOut">退出登录</a-button>
        </a-space>
      </template>
      <a-avatar :size="44" :src="userInfo.avatar"> </a-avatar>
    </a-popover>
    <div class="point"></div>
  </div>
</template>

<script lang="ts" setup>
import { Modal } from 'ant-design-vue'
import { LogoutOutlined, UserOutlined } from '@ant-design/icons-vue'
import { useUserStore } from '@/store/modules'
import { useRouter } from 'vue-router'
import { UserApi } from '@/webapi/index'
import { message as Message } from 'ant-design-vue'
import ls from '@/utils/Storage'

const router = useRouter()
const { userInfo }: any = useUserStore()

// 登出
const loginOut = () => {
  Modal.confirm({
    title: '提示',
    content: '确定退出登录？',
    onOk: () => {
      doLoginOut()
    },
    onCancel() {}
  })
}

const doLoginOut = async () => {
  let { code, data = {}, message }: any = await UserApi.loginOut({})
  if (code === 200) {
    ls.clear()
    router.replace('/user/login')
  } else {
    Message.error(message || '请求失败')
  }
}
const showNotice = () => {}
</script>
<style lang="less">
.user-wrapper {
  width: 100%;
  height: 60px;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ant-avatar {
  cursor: pointer;
}

.point {
  height: 60px;
  position: relative;
  display: inline-block; /* 或其他适合你的布局的display属性 */
}

.point::after {
  content: '';
  position: absolute;
  bottom: 7px;
  right: -2px;
  width: 8px;
  height: 8px;
  background-color: #52c41a;
  border-radius: 50%;
  border: 1px solid #fff;
}
</style>
