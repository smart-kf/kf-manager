<template>
  <div class="user-wrapper">
    <a-popover placement="rightTop" v-model:visible="state.visible" trigger="click" overlayClassName="custom-popover">
      <template #content>
        <a-space direction="vertical" style="margin: 10px 15px 10px 0px">
          <div>
            <span class="label">昵称</span><span class="nickName">{{ userInfo.nickname }}</span>
          </div>
          <div>
            <span class="label">到期时间</span> <span class="expireTime">{{ state.cardExpire }}</span>
          </div>
          <div style="height: 20px"></div>
          <div style="text-align: end">
            <a-space :size="15">
              <span class="table-link-action" @click="changePwd"><EditOutlined></EditOutlined><span>修改密码</span></span>
              <span class="table-link-action" @click="loginOut"><LoginOutlined></LoginOutlined><span>退出登录</span></span>
            </a-space>
          </div>
        </a-space>
      </template>
      <a-avatar :size="55" :src="getAavatarUrl(userInfo.avatarUrl)"> </a-avatar>
    </a-popover>
    <div class="point"></div>

    <a-modal v-model:visible="state.showPwdDia" title="修改密码" @ok="onSave">
      <a-form :model="formData" ref="formRef" layout="vertical" :rules="rules">
        <a-form-item label="旧密码" name="oldPassWord">
          <a-input-password placeholder="请输入旧密码，否则请忽略" allowClear :maxlength="50" v-model:value="formData.oldPassword" />
        </a-form-item>
        <a-form-item label="新密码" name="newPassword">
          <a-input-password placeholder="请输入新密码" :maxlength="50" allowClear v-model:value="formData.newPassword" />
        </a-form-item>
        <a-form-item label="确认密码" name="repeatPassword">
          <a-input-password placeholder="请再次输入新密码" :maxlength="50" allowClear v-model:value="formData.repeatPassword" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { Modal } from 'ant-design-vue'
import { LogoutOutlined, UserOutlined, EditOutlined, LoginOutlined } from '@ant-design/icons-vue'
import { useUserStore } from '@/store/modules'
import { useRouter } from 'vue-router'
import { UserApi } from '@/webapi/index'
import { message as Message } from 'ant-design-vue'
import ls from '@/utils/Storage'
import { onMounted, reactive, computed, ref } from 'vue'
import dayjs from 'dayjs'
import defaultUser from '@/assets/defaultUser.png'
import { min } from 'moment'

const router = useRouter()
const userStore = useUserStore()

const userInfo = computed(() => {
  return userStore.getUserInfo || {}
})

const state = reactive({
  nickname: '', // 昵称
  avatarUrl: '', // 头像
  cardExpire: '', //到期时间
  showPwdDia: false,
  visible: false
})

const formRef: any = ref('')
const formData = reactive({
  oldPassword: '',
  newPassword: '',
  repeatPassword: ''
})

const rules = {
  newPassword: [
  { required: true, message: '请输入新密码', trigger: 'blur' },
  { min: 6, max: 18,message: '长度6~18', trigger: 'blur' }
  ],
  repeatPassword: [
    { required: true, message: '请输入确认密码', trigger: 'blur' },
    { min: 6, max: 18,message: '长度6~18', trigger: 'blur' }
  ]
}

const changePwd = () => {
  state.visible = false
  state.showPwdDia = true
}
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

const onSave = () => {
  formRef.value
    .validate()
    .then(async () => {
      if (formData.newPassword !== formData.repeatPassword) {
        Message.error('新密码和确认密码不一致，请重新输入')
        return
      }
      if (formData.newPassword === formData.oldPassword) {
        Message.error('新密码和旧密码相同，请重新输入')
        return
      }
      let res = await UserApi.updatePassword(formData)
      if(res.code == 200) {
        Message.success('修改成功, 即将退出登录')
        setTimeout(() => {
          ls.clear()
        router.replace('/user/login')
        }, 2000);
      }
    })
    .catch((err) => {
      console.log(err)
    })
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
  background: #fff !important;
}
.label {
  display: inline-block;
  width: 70px;
  color: #999;
}
.nickName {
  font-size: 16px;
  font-weight: bold;
  color: #87d068;
}
.expireTime {
  color: #f50;
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

.custom-popover {
  .ant-popover-inner {
    border-radius: 15px;
  }
}
</style>
