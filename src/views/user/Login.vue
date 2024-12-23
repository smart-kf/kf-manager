<template>
  <div class="main">
    <div>
      <a-form id="formLogin" class="user-layout-login" @submit="handleSubmit" :model="formRef">
        <a-tabs :activeKey="customActiveKey" :tabBarStyle="{ textAlign: 'center', borderBottom: 'unset' }" @change="handleTabClick">
          <!-- 账户密码登录 -->
          <a-tab-pane key="tab1" tab="卡密登录">
            <a-form-item v-bind="validateInfos.username">
              <a-input type="text" placeholder="请输入卡号" v-model:value="formRef.username">
                <template #prefix>
                  <UserOutlined :style="{ color: 'rgba(0,0,0,.25)' }" />
                </template>
              </a-input>
            </a-form-item>

            <a-form-item v-bind="validateInfos.password">
              <a-input-password placeholder="请输入密码(可选)" v-model:value="formRef.password">
                <template #prefix>
                  <LockOutlined :style="{ color: 'rgba(0,0,0,.25)' }" />
                </template>
              </a-input-password>
            </a-form-item>
          </a-tab-pane>
          <!-- 手机号登录 -->
          <a-tab-pane key="tab2" tab="卡密续费">
            <a-form-item v-bind="validateInfos.mobile">
              <a-input type="text" placeholder="原卡卡号" v-model:value="formRef.mobile">
                <MobileOutlined :style="{ color: 'rgba(0,0,0,.25)' }" />
              </a-input>
            </a-form-item>
            <a-form-item v-bind="validateInfos.mobile">
              <a-input type="text" placeholder="新卡卡号" v-model:value="formRef.mobile">
                <MobileOutlined :style="{ color: 'rgba(0,0,0,.25)' }" />
              </a-input>
            </a-form-item>
            <a-form-item v-bind="validateInfos.password">
              <a-input-password placeholder="原卡密码(可选)" v-model:value="formRef.password">
                <template #prefix>
                  <LockOutlined :style="{ color: 'rgba(0,0,0,.25)' }" />
                </template>
              </a-input-password>
            </a-form-item>
          </a-tab-pane>
        </a-tabs>

        <a-form-item style="margin-top: 24px">
          <a-button type="primary" htmlType="submit" class="login-button" :loading="state.loginBtn" :disabled="state.loginBtn">登录</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script lang="ts" setup name="Login">
import { encryptByMd5 } from '@/utils/encrypt'
import { ref, reactive, UnwrapRef, onMounted } from 'vue'
import { Form } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { MobileOutlined, MailOutlined, UserOutlined, LockOutlined } from '@ant-design/icons-vue'
import * as api from './service'
import { loginSuccess, requestFailed } from './helper'
import { FormState } from './types'
import config from '@/config/defaultSettings'
import generateAsyncRoutes from '@/router/generateAsyncRoutes'
import { useGetCaptcha } from './helper'

const useForm = Form.useForm
const router = useRouter()

onMounted(() => {
  api
    .get2step()
    .then((res) => {
      requiredTwoStepCaptcha.value = res.result.stepCode
    })
    .catch(() => {
      requiredTwoStepCaptcha.value = 0
    })
  requiredTwoStepCaptcha.value = 1
})

const state = reactive({
  time: 60,
  loginBtn: false,
  loginType: 0,
  smsSendBtn: false
})

// #region 表单相关
const formRef: UnwrapRef<FormState> = reactive({
  rememberMe: false,
  username: '',
  password: '',
  mobile: '',
  captcha: ''
})

const handleUsernameOrEmail = (rule, value: string) => {
  const regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/
  if (regex.test(value)) {
    state.loginType = 0
  } else {
    state.loginType = 1
  }
  return Promise.resolve()
}
const rulesRef = reactive({
  rememberMe: [{ trigger: 'checked' }],
  username: [
    {
      required: true,
      message: '卡号必填！'
    }
  ]
})
const { validate, validateInfos } = useForm(formRef, rulesRef)
const isLoginError = ref(false)
const handleSubmit = (e: Event) => {
  e.preventDefault()
  state.loginBtn = true
  const validateFieldsKey = customActiveKey.value === 'tab1' ? ['username', 'password'] : ['mobile', 'captcha']

  validate(validateFieldsKey)
    .then(async () => {
      formRef.password = encryptByMd5(formRef.password)
      const res = await api.userLogin(formRef)
      if (res) {
        // mock用,可删
        if (res.code === 403) {
          isLoginError.value = true
          formRef.password = ''
          state.loginBtn = false
          return
        }
        if (config.useAsyncRouter) {
          generateAsyncRoutes(router, res.menu)
        }
        loginSuccess(res, router)
        isLoginError.value = false
      } else {
        // requestFailed(res)
        isLoginError.value = true
        formRef.password = ''
      }
      state.loginBtn = false
    })
    .catch((e) => {
      state.loginBtn = false
    })
}
// #endregion

//#region 切换tab
const customActiveKey = ref<string>('tab1')
const handleTabClick = (key: string) => {
  customActiveKey.value = key
}
//#endregion

//#region 获取验证码
const getCaptcha = (e: Event) => {
  useGetCaptcha(e, validate, state, formRef, null)
}
//#endregion

//#region TwoStepCaptcha暂时没用
const requiredTwoStepCaptcha = ref<number>(0)
const stepCaptchaVisible = ref<boolean>(false)
const stepCaptchaSuccess = (res) => {
  loginSuccess(res, router)
}
const stepCaptchaCancel = () => {
  api.logout().then(() => {
    state.loginBtn = false
    stepCaptchaVisible.value = false
  })
}
//#endregion
</script>

<style lang="less" scoped>
@import '../../style/index.less';

.user-layout-login {
  label {
    font-size: 14px;
  }

  .getCaptcha {
    display: block;
    width: 100%;
    height: 40px;
  }

  .forge-password {
    font-size: 14px;
  }

  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }

  .user-login-other {
    text-align: left;
    margin-top: 24px;
    line-height: 22px;

    .anticon {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.2);
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: @primary-color;
      }
    }

    .register {
      float: right;
    }
  }
}
</style>
