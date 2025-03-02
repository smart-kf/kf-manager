<template>
  <div class="user-wrapper">
    <a-popover placement="rightTop">
      <template #content>
        <a-space direction="vertical">
          <div>
            <span>昵称：{{ userInfo.nickname }}</span>
          </div>
          <div>
            <span>到期时间：{{ state.cardExpire }}</span>
          </div>
          <a-button type="link" @click="loginOut">退出登录</a-button>
        </a-space>
      </template>
      <a-avatar :size="55" :src="getAavatarUrl(userInfo.avatarUrl)"> </a-avatar>
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
import { onMounted, reactive, computed } from 'vue'
import dayjs from 'dayjs'
import defaultUser from '@/assets/defaultUser.png'

const router = useRouter()
const userStore = useUserStore()

const userInfo = computed(() => {
  return userStore.getUserInfo
})

const state = reactive({
  nickname: '', // 昵称
  avatarUrl: '', // 头像
  cardExpire: '' //到期时间
})
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

const getAavatarUrl = (url = '') => {
  return url ? ls.get('cdnDomain') + url : defaultUser
}

onMounted(() => {
  let cardExpire = ls.get('cardExpire')
  if (cardExpire) {
    state.cardExpire = dayjs(cardExpire).format('YYYY-MM-DD HH:mm:ss')
  } else {
    state.cardExpire = '-'
  }
})
</script>
<style lang="less">
.user-wrapper {
  width: 100%;
  height: 80px;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ant-avatar {
  cursor: pointer;
}

.point {
  height: 80px;
  position: relative;
  display: inline-block; /* 或其他适合你的布局的display属性 */
}

.point::after {
  content: '';
  position: absolute;
  bottom: 12px;
  right: -2px;
  width: 8px;
  height: 8px;
  background-color: #52c41a;
  border-radius: 50%;
  border: 1px solid #fff;
}
</style>
