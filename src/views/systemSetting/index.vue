<!-- 二维码页面 -->
<template>
  <div class="kf-body">
    <div class="base-info">
      <a-form name="basic" :model="formData" @finish="onFinish" autocomplete="off">
        <a-form-item label="我的卡密" name="idcard"> {{ formData.idcard }} <a-button type="primary" @click="copyQrcode" size="small"> 复制 </a-button> </a-form-item>
        <a-form-item label="到期时间" name="endTime">
          <span class="red-tip">{{ formData.endTime }}</span>
        </a-form-item>
        <a-form-item label="客服昵称" name="endTime">
          <a-input v-model:value="formData.nickName" placeholder="请输入客服昵称" maxlenght="10" style="width: 200px" />
        </a-form-item>
        <a-form-item label="客服头像" name="endTime">
          <a-avatar :size="80" wrap :src="formData.avatar"> </a-avatar>
        </a-form-item>
        <a-form-item label="停留秒数过滤" name="stopTime">
          <a-radio-group v-model:value="formData.stopTime" :options="state.radioOption" /> <span class="red-tip">注：过滤停留秒数为0</span>
        </a-form-item>
        <a-form-item label="扫码次数过滤" name="saomaNum">
          <a-radio-group v-model:value="formData.saomaNum" :options="state.radioOption" /> <span class="red-tip">注：扫码次数超过10次</span>
        </a-form-item>
        <a-form-item label="IP次数过滤" name="IpNum">
          <a-radio-group v-model:value="formData.IpNum" :options="state.radioOption" /> <span class="red-tip">注：过滤IP次数超过（含）3次</span>
        </a-form-item>
        <a-form-item label="未WS过滤" name="wsNum">
          <a-radio-group v-model:value="formData.wsNum" :options="state.radioOption" />
        </a-form-item>
      </a-form>
      <div class="bottom-btn">
        <a-button type="primary" @click="onSave">保存</a-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import { useUserStore } from '@/store/modules'
import { SystemApi } from '@/webapi/index'

const { userInfo }: any = useUserStore()
const formData: any = reactive({
  idCard: 'xxx',
  endTime: '2021 12 12 12 12 23',
  nickName: '大熊',
  avatar: userInfo.avatar,
  stopTime: false,
  saomaNum: true,
  IpNum: true,
  wsNum: false
})
const state = reactive({
  radioOption: [
    { label: '开启', value: true },
    { label: '关闭', value: false }
  ]
})
// 复制卡密
const copyQrcode = () => {
  navigator.clipboard
    .writeText(formData.idCard)
    .then(function () {
      message.success('已成功复制到剪切板!')
    })
    .catch(function (err) {
      message.success('无法复制到剪切板!')
    })
}
const onSave = () => {
  console.log('Success:')
}

const onFinish = (values: any) => {
  console.log('Success:', values)
}

const initData = async () => {
  let res = await SystemApi.getSysConfig({})
  console.log(res)
}

onMounted(() => {
  initData()
})
</script>
<style lang="less" scoped>
.base-info {
  position: relative;
  height: 100%;
  :deep(.ant-form-item) {
    margin-bottom: 16px;
  }
  .avatar {
    position: absolute;
    right: 5%;
    top: 32px;
  }
  .bottom-btn {
    position: absolute;
    bottom: 0;
    width: 100%;
    text-align: center;
  }
}
.red-tip {
  color: #ff4d4f;
}
</style>
