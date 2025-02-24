<!-- 二维码页面 -->
<template>
  <div class="kf-body">
    <a-spin :spinning="state.loading">
      <div class="max-containter" style="margin: auto">
        <div class="base-info">
          <a-form name="basic" ref="formRef" :model="formData" autocomplete="off" :label-col="{ span: 4 }" :rules="rules" labelAlign="right">
            <a-form-item label="我的卡密" name="cardId"> {{ formData.cardId }} <a-button type="primary" @click="copyQrcode" size="small"> 复制 </a-button> </a-form-item>
            <!-- <a-form-item label="到期时间" name="endTime">
          <span class="red-tip">{{ formData.endTime }}</span>
        </a-form-item> -->
            <a-form-item label="客服昵称" name="nickname" require>
              <a-input v-model:value="formData.nickname" placeholder="请输入客服昵称" maxlenght="20" style="width: 300px" />
            </a-form-item>
            <a-form-item label="客服头像" name="avatarUrl">
              <a-avatar :size="80" wrap :src="getAavatarUrl(formData.avatarUrl)"> </a-avatar>
            </a-form-item>
            <a-form-item label="滚动公告" name="notice">
              <a-input v-model:value="formData.notice" placeholder="请输入滚动公告" showCount maxlenght="200" style="width: 300px" />
            </a-form-item>
            <a-form-item label="消息提示音" name="newMessageVoice">
              <a-radio-group v-model:value="formData.newMessageVoice" :options="state.radioOption" />
            </a-form-item>
            <a-form-item label="设备异常过滤" name="DeviceFilter">
              <a-radio-group v-model:value="formData.DeviceFilter" :options="state.radioOption" />
            </a-form-item>
            <a-form-item label="苹果手机过滤" name="appleFilter">
              <a-radio-group v-model:value="formData.appleFilter" :options="state.radioOption" /> <span class="red-tip">开启后，只有苹果手机能访问</span>
            </a-form-item>
            <a-form-item label="代理IP过滤" name="iPProxyFilter">
              <a-radio-group v-model:value="formData.iPProxyFilter" :options="state.radioOption" /> <span class="red-tip">开启后，代理ip不能访问</span>
            </a-form-item>
            <a-form-item label="模拟器过滤" name="simulatorFilter">
              <a-radio-group v-model:value="formData.simulatorFilter" :options="state.radioOption" /> <span class="red-tip">开启后，模拟器不能访问</span>
            </a-form-item>
            <a-form-item label="微信浏览器过滤" name="wechatFilter">
              <a-radio-group v-model:value="formData.wechatFilter" :options="state.radioOption" /> <span class="red-tip">开启后，非微信浏览器不能访问</span>
            </a-form-item>
            <a-form-item label="WS过滤" name="wsFilter"> <a-radio-group v-model:value="formData.wsFilter" :options="state.radioOption" /> <span class="red-tip">开启后，检测ws行为</span> </a-form-item>
          </a-form>
          <div class="bottom-btn">
            <a-button type="primary" @click="onSave">保存</a-button>
          </div>
        </div>
      </div>
    </a-spin>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { message as Message } from 'ant-design-vue'
import { useUserStore } from '@/store/modules'
import { SystemApi } from '@/webapi/index'
import ls from '@/utils/Storage'

const { userInfo }: any = useUserStore()

const formRef: any = ref('')
const formData: any = reactive({
  cardId: '', // 卡密
  nickname: '',
  avatarUrl: '',
  DeviceFilter: false, // 设备异常过滤
  appleFilter: false, // 苹果手机过滤器，开启后，只有苹果手机能访问
  iPProxyFilter: false, // 	代理ip过滤，开启后，代理ip不能访问
  newMessageVoice: false, // 消息提示音
  notice: '', //  滚动公告
  simulatorFilter: false, //  模拟器过滤，开启后，模拟器不能访问
  wechatFilter: false, // 非微信浏览器不能访问
  wsFilter: false // 开启之后 检测ws行为
})
const state = reactive({
  loading: false,
  radioOption: [
    { label: '开启', value: true },
    { label: '关闭', value: false }
  ]
})

const rules = {
  nickname: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
}
// 复制卡密
const copyQrcode = () => {
  navigator.clipboard
    .writeText(formData.cardId)
    .then(function () {
      Message.success('已成功复制到剪切板!')
    })
    .catch(function (err) {
      Message.success('无法复制到剪切板!')
    })
}

// 保存数据
const saveData = async () => {
  state.loading = true
  let params = {
    ...formData
  }
  let { code, data, message }: any = await SystemApi.saveSysConfig(params)
  state.loading = false
  if (code === 200) {
    Message.success('保存成功')
  } else {
    Message.error(message)
  }
}
const onSave = () => {
  formRef.value
    .validate()
    .then(() => {
      saveData()
    })
    .catch((err) => {
      console.log(err)
    })
}

const getAavatarUrl = (url = '') => {
  return url ? ls.get('cdnDomain') + url : userInfo.avatar
}

const initData = async () => {
  state.loading = true
  let { code, data, message }: any = await SystemApi.getSysConfig({})
  state.loading = false
  if (code === 200) {
    formData.nickname = data.nickname || ''
    formData.DeviceFilter = data.DeviceFilter || false
    formData.appleFilter = data.appleFilter || false
    formData.avatarUrl = data.avatarUrl || ''
    formData.cardId = data.cardId || ''
    formData.iPProxyFilter = data.iPProxyFilter || false
    formData.newMessageVoice = data.newMessageVoice || false
    formData.notice = data.notice || ''
    formData.simulatorFilter = data.simulatorFilter || false
    formData.wechatFilter = data.wechatFilter || false
    formData.wsFilter = data.wsFilter || false
    console.log(formData)
  } else {
    Message.error(message)
  }
}

onMounted(() => {
  initData()
})
</script>
<style lang="less" scoped>
.base-info {
  position: relative;
  box-sizing: border-box;
  width: 600px;
  margin: auto;
  overflow-x: auto;
  :deep(.ant-form-item) {
    margin-bottom: 16px;
  }
  .avatar {
    position: absolute;
    right: 5%;
    top: 32px;
  }
}
.bottom-btn {
  width: 100%;
  text-align: center;
  padding-bottom: 20px;
}
.red-tip {
  color: #ff4d4f;
}
</style>
