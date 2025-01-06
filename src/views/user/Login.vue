<template>
  <div class="main">
    <a-button type="primary" class="login-button" @click="loginHandle">登录</a-button>
  </div>
</template>

<script lang="ts" setup name="Login">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { UserApi } from '@/webapi/index'
import type { Rule } from 'ant-design-vue/es/form'
import ls from '@/utils/Storage'

const router = useRouter()

const loginHandle = () => {
  ls.set('token', 'xxx')
  router.push({ name: 'qrCode' })
}
</script>

<style lang="less" scoped>
@import '@/style/index.less';
.main {
  position: relative;
}
.login-title {
  position: absolute;
  top: -40px;
  padding: 3px;
  border-radius: 50%;
  background-color: #fff;
  left: 50%;
  transform: translateX(-50%);
  img {
    width: 86px;
    height: 86px;
  }
}
.user-layout-login {
  background: #fff;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 2px 11px 1px #cbbdf075;
  min-width: 260px;
  min-height: 374px;
  width: 460px;
  margin: 0 auto;

  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }
}
.login-tab {
  :deep(.ant-tabs-nav-list) {
    width: 100%;
    .ant-tabs-tab {
      margin: 0;
      justify-content: center;
      width: 33.33%;
    }
  }
}
.other-btn {
  padding-bottom: 12px;
  button {
    width: 100%;
  }
}
.agreement-content {
  height: 60vh;
  overflow-y: auto;
  p {
    margin: 0;
  }
}
</style>
