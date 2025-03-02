<!-- 二维码页面 -->
<template>
  <div class="kf-body">
    <div class="main">
      <div><a-alert message="您可以通过此操作将其他账户的设置复制到当前账户" type="info" show-icon /></div>
      <div class="copy-btn"><a-button type="primary" @click="speechCopy">话术复制</a-button></div>
    </div>
  </div>
  <a-modal v-model:visible="state.visible" title="一键配置" :confirmLoading="state.loading" @ok="handleOk" :width="670">
    <a-form :model="formState" name="basic" ref="formRef" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }" autocomplete="off" :rules="rules">
      <a-form-item label="话术模板卡密" name="cardId">
        <a-input v-model:value="formState.cardId" placeholder="输入您包装好的卡密" allowClear :maxlength="150" />
      </a-form-item>
      <a-form-item label="复制的类型" name="copyType">
        <div class="copy-body">
          <a-form-item-rest>
            <a-checkbox-group v-model:value="formState.copyTypeAll" @change="onChangeAll">
              <a-checkbox :value="true" name="type">全选</a-checkbox>
            </a-checkbox-group>
          </a-form-item-rest>
          <a-checkbox-group ref="checkGroupRef" v-model:value="formState.copyType" @change="onChangeOne">
            <a-checkbox value="avatar" name="type">头像</a-checkbox>
            <a-checkbox value="nickname" name="type">昵称</a-checkbox>
            <a-checkbox value="welcomeMsg" name="type">欢迎语</a-checkbox>
            <a-checkbox value="quickReply" name="type">快捷回复</a-checkbox>
            <a-checkbox value="smartReply" name="type">智能回复</a-checkbox>
            <a-checkbox value="settings" name="type">其他设置</a-checkbox>
          </a-checkbox-group>
        </div>
      </a-form-item>
      <a-form-item label="被替换内容" name="replaceTargetContent">
        <a-input v-model:value="formState.replaceTargetContent" placeholder="请输入原文本中需要被替换内容" allowClear :maxlength="150" />
      </a-form-item>
      <a-form-item label="替换内容" name="replaceContent">
        <a-input v-model:value="formState.replaceContent" placeholder="请输入要替换成什么内容" allowClear :maxlength="150" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue'
import type { Rule } from 'ant-design-vue/es/form'
import { message as Message } from 'ant-design-vue'
import { MessageApi } from '@/webapi/index'

const formRef: any = ref(null)
const checkGroupRef: any = ref(null)

const state = reactive({
  visible: false,
  loading: false
})

const formState = reactive({
  cardId: '',
  quickReply: false, //是否复制快速发送
  smartReply: false, //是否复制智能回复
  welcomeMsg: false, //是否复制欢迎语
  settings: false, //是否复制设置
  nickname: false, //是否复制昵称
  avatar: false, //是否复制头像
  copyTypeAll: [], // 是否全选
  copyType: [], // 被复制选择的类型
  replaceContent: '', // 替换内容
  replaceTargetContent: '' // 被替换内容
})

const rules: Record<string, Rule[]> = {
  cardId: [{ required: true, message: '请输入卡密' }],
  copyType: [{ required: true, message: '请选择复制类型' }]
}

const handleOk = async () => {
  formRef.value
    .validate()
    .then(() => {
      onSaveSubmit()
    })
    .catch((err) => {
      // console.log(err)
    })
}

const onSaveSubmit = async () => {
  let params = {
    cardId: formState.cardId,
    replaceContent: formState.replaceContent,
    replaceTargetContent: formState.replaceTargetContent,
    quickReply: false,
    smartReply: false,
    welcomeMsg: false,
    settings: false,
    nickname: false,
    avatar: false
  }
  formState.copyType.forEach((el) => {
    params[el] = true
  })
  state.loading = true
  let { code, data, message }: any = await MessageApi.copyWelcome(params)
  state.loading = false
  if (code === 200) {
    state.visible = false
    Message.success('复制成功')
  } else {
    Message.error(message || '请求失败')
  }
}

const onChangeOne = () => {
  if (formState.copyType.length === 6) {
    formState.copyTypeAll = [true]
  } else {
    formState.copyTypeAll = []
  }
}
const onChangeAll = () => {
  if (formState.copyTypeAll.length) {
    formState.copyType = ['avatar', 'nickname', 'welcomeMsg', 'quickReply', 'smartReply', 'settings']
  } else {
    formState.copyType = []
  }
}
const speechCopy = () => {
  resetData()
  state.visible = true
}

const resetData = () => {
  formState.cardId = ''
  formState.quickReply = false //是否复制快速发送
  formState.smartReply = false //是否复制智能回复
  formState.welcomeMsg = false //是否复制欢迎语
  formState.settings = false //是否复制设置
  formState.nickname = false //是否复制昵称
  formState.avatar = false //是否复制头像
  formState.copyTypeAll = [] // 是否全选
  formState.copyType = [] // 被复制选择的类型
  formState.replaceContent = '' // 替换内容
  formState.replaceTargetContent = '' // 被替换内容
}
</script>
<style lang="less" scoped>
.main {
  width: 400px;
  height: 300px;
  margin: 20vh auto 0;
  text-align: center;
}
.copy-btn {
  margin: 24px;
}
.copy-body {
  .ant-checkbox-group {
    line-height: 36px;
  }
  .ant-checkbox-wrapper {
    margin-left: 0px !important;
  }
}
</style>
