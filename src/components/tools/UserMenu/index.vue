<template>
  <div class="user-wrapper">
    <a-avatar :size="44" wrap :src="userInfo.avatar"> </a-avatar>
  </div>
</template>

<script lang="ts" setup>
import { Modal } from 'ant-design-vue'
import { LogoutOutlined, UserOutlined } from '@ant-design/icons-vue'
import { useUserStore } from '@/store/modules'
import { useRouter } from 'vue-router'
import { clearUserInfo } from '@/utils/util'

const router = useRouter()
const { userInfo }: any = useUserStore()

// 登出
const handleLogout = () => {
  Modal.confirm({
    title: '提示',
    content: '退出登录',
    onOk: () => {},
    onCancel() {}
  })
}
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
</style>
