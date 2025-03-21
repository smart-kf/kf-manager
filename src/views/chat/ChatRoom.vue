<template>
  <div style="display: flex; flex: 1">
    <div class="chatroom-contain">
      <!-- 消息来源 -->
      <div v-if="toUser?.user?.nickName" class="info-container">
        <!-- 第一行: 昵称和IP -->
        <div class="info-row">
          <span class="nickname">{{ toUser.user.remarkName || toUser.user.nickName }}</span>
          <span class="ip">{{ toUser?.user?.ip || '0.0.0.0' }}</span>
        </div>
        <!-- 第二行: 系统类型、系统版本、网络类型 -->
        <div class="info-row">
          <span class="system-type">系统类型：{{ toUser?.user?.device }}</span>
          <span class="system-version">系统版本：{{ toUser?.user?.browser }}</span>
          <span class="network-type">网络类型：{{ toUser?.user?.networkType }}</span>
        </div>
      </div>

      <!-- 消息展示区域 -->
      <div v-scroll-to-top="loadHistoryMsg" class="message-display" ref="messageDisplay">
        <div v-for="(message, index) in messages" :key="index" :id="message.msgId" :class="['message', message.isKf == 1 ? 'right' : '']">
          <div class="avatar-and-name">
            <span class="name">{{ message.isKf === 1 ? '' : message.guestName }}</span>
            <img :src="message.isKf === 1 ? kfAvatar : mergeCdn(toUser.user.avatar)" alt="Avatar" />
          </div>
          <div class="message-content">
            <div v-if="message.msgType === 'text'" v-html="renderMessage(message.content)"></div>
            <div v-if="message.msgType === 'video'" class="video-contain">
              <MaterialPreview mediaType="video" :url="message.content"></MaterialPreview>
              <!-- <video :src="mergeCdn(message.content)" class="video-box"></video>
              <PlayCircleOutlined class="play-icon" @click="playVideo(message.content)" /> -->
            </div>
            <a-image v-if="message.msgType === 'image'" :width="200" :src="mergeCdn(message.content)" class="image-box" />
            <span class="time">{{ dayjs(message.msgTime).format('HH:mm:ss') }}</span>
          </div>
        </div>
      </div>

      <!-- 消息输入区域 -->
      <a-spin :spinning="loading">
        <div class="message-input">
          <div :class="['tools', { disable: disableChatBox() }]">
            <EmojiSelect @onChange="onEmojiChange"></EmojiSelect>
            <FileImageOutlined @click="selectFile('image')" class="emoji-text" />
            <VideoCameraOutlined @click="selectFile('video')" class="emoji-text" />
          </div>
          <a-textarea v-model:value="newMessage.content" v-focus placeholder="Type your message..." :bordered="false" @pressEnter="onSendMessage" :disabled="disableChatBox()" />
          <a-button @click="onSendMessage" type="primary" :class="['send-btn', { disable: disableChatBox() }]">发送</a-button>
        </div>
      </a-spin>
    </div>

    <!-- 当前用户信息 -->
    <ChatUser :key="toUser?.user?.uuid" v-if="toUser?.user?.nickName" :toUser="toUser" @change="onChangeUserInfo" @quick-reply="onQuickReply" />

    <!-- 视频播放弹窗 -->
    <a-modal title="视频播放" v-model:visible="visible" :footer="null" :destroyOnClose="true" :maskClosable="false" :width="680">
      <video :src="videoUrl" width="640" height="360" autoplay controls></video>
    </a-modal>

    <!-- 新消息音频 -->
    <audio id="audioPlayer" :src="voiceSrc" controls style="display: none;"></audio>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, toRefs, watch , computed } from 'vue';
import WebSocketClient from '@/utils/mySocket.js';
import EmojiSelect from '@/components/EmojiSelect/index.vue'
import { FileImageOutlined, VideoCameraOutlined, PlayCircleOutlined } from '@ant-design/icons-vue'
import dayjs from 'dayjs'
import { ChatApi } from '@/webapi/index'
import { message } from 'ant-design-vue';
import { throttle } from 'lodash-es'
import { mergeCdn, highlightURLs } from '@/utils/util.ts'
import ChatUser from './chatUser.vue'
import MaterialPreview from '@/components/MaterialPreview/index.vue'
import ls from '@/utils/Storage'
import msgVoice from '@/assets/newmsg.mp3'
import onlineVoice from '@/assets/online.mp3'
import { useUserStore } from '@/store/modules'

const systemConfig = JSON.parse(sessionStorage.getItem('systemConfig'))
const kfAvatar = `${ls.get('cdnDomain')}${systemConfig.avatarUrl}`
// const voiceFlag = systemConfig.newMessageVoice

const wsHost = ls.get('wsHost')
const wsFullHost = ls.get('wsFullHost')
const token = ls.get('token')
const loading = ref(false)

const props = defineProps({
  toUser: {
    type: Object,
    default: () => ({
      user: {},
      lastChatAt: 0,
      lastMessage: null
    })
  },
  batchSendMode: Boolean
})

const { toUser } = toRefs(props)
const scrollId = ref(0)
const allMsgLoaded = ref(false)

const disableChatBox = () => {
  if (props.batchSendMode) {
    return false
  }
  if (toUser.value?.user?.uuid) {
    return false
  }
  return true
}

watch(
  () => props.toUser,
  () => {
    if (toUser.value?.user?.uuid) {
      setTimeout(() => {
        getChatMsg()
        getChatUser(toUser.value.user.uuid)
      }, 0)
    }
  },
  {
    deep: true,
    immediate: true
  }
)

const getChatUser = async (uuid) => {
  const params = { uuid }
  const res = await ChatApi.chatUserGet(uuid)
  console.log('res:', res)
}

// ws实例
let wsClient

// {
//   "type": "msg",
//   "data": {
//     "msgType": "枚举值：text || image || video",
//     "msgId": 12345, // 消息id
//     "guestName": "客户名称",
//     "guestAvatar": "头像地址",
//     "guestId": "客户id",
//     "msgTime": 12345654324, //时间戳
//     "kfId": "客服id",
//     "content": "内容：text=文本、image、video = 地址",
//     "isKf": 1 || 2, //   1=客服消息，2=客户消息
//   }
// }

// 消息对象数组
const messages = ref([])

// 输入框中的新消息
const newMessage = ref({
  msgType: '', // "枚举值：text || image || video"
  msgId: '',
  content: '',
  guestName: '',
  guestAvatar: '',
  msgTime: '',
  guestId: '58|0233a664e9cb4d6e87fbb4c58137cb08',
  kfId: '',
  content: '', //"内容：text=文本、image、video = 地址"
  isKf: 1
})

const onBatchSendSuccess = () => {
  newMessage.value.content = ''
}

defineExpose({ onBatchSendSuccess })

// 消息展示区域引用
const messageDisplay = ref(null)

// 状态管理
let isCoolingDown = ref(false) // 是否在冷却期
let lastSendTime = ref(0) // 最后发送时间戳

const onSendMessage = (event, msgType, msgText) => {
  if (isCoolingDown.value) {
    message.error('消息发送过于频繁，请稍后再试')
    return
  }
  if (Date.now() - lastSendTime < 500) {
    isCoolingDown.value = true
  }
  throttledSend(event, msgType, msgText)
}

const throttledSend = throttle(
  (event, msgType, msgText) => {
    isCoolingDown.value = false
    sendMessage(event, msgType, msgText)
    lastSendTime.value = Date.now()
  },
  500,
  {
    leading: true, // 立即执行第一次点击
    trailing: false // 不执行最后一次点击的延迟回调
  }
)

// 回车，发送消息
const sendMessage = (event, msgType, msgText) => {
  // 阻止默认的换行行为
  event.preventDefault()

  // 验证消息长度:
  if (newMessage.value.content.length > 500) {
    message.error('消息长度不能超过500个字符')
    return
  }

  // 群发模式.
  if (props.batchSendMode) {
    // emit message 出去.
    emit('batch-send-message', {
      msgType: msgType ? msgType : 'text',
      content: newMessage.value.content.trim()
    })
    return
  }

  if (!toUser.value?.user?.uuid) {
    message.error('请选中聊天粉丝')
    return
  }

  newMessage.value.guestId = toUser.value?.user?.uuid
  const messageText = msgText ? msgText : newMessage.value.content.trim()
  if (messageText) {
    newMessage.value.msgType = msgType ? msgType : 'text'
    newMessage.value.content = messageText
    newMessage.value.msgTime = dayjs().unix()
    messages.value.push(JSON.parse(JSON.stringify(newMessage.value)))
    // 发送给服务器
    wsClient.sendMessage(JSON.parse(JSON.stringify(newMessage.value)))
    // 同步list中消息内容及时间
    emit('newMessage', JSON.parse(JSON.stringify(newMessage.value)))
    // 清空聊天
    newMessage.value.content = ''

    // 滚动到底部
    nextTick(() => {
      messageDisplay.value.scrollTop = messageDisplay.value.scrollHeight
    })
  } else {
    message.error('请勿发送空白消息')
  }

  nextTick(() => {
    messageDisplay.value.scrollTop = messageDisplay.value.scrollHeight
  })
}

// 切换表情包选择框
const onEmojiChange = (emoji) => {
  newMessage.value.content += emoji.i
}

// 选择文件
const selectFile = (type) => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = type === 'image' ? 'image/*' : 'video/*'
  input.onchange = async (event) => {
    const file = event.target.files[0]
    if (file) {
      console.log('file:', file)

      //上传至服务器，得到url后展示在消息框中
      const formData = new FormData()
      formData.append('file', file)
      formData.append('fileType', type)
      loading.value = true
      const res = await ChatApi.fileUpload(formData)
      loading.value = false
      if (res && res.code === 200 && res.data) {
        const { cdnHost, path } = res.data
        onSendMessage({ preventDefault: () => {} }, type, `${path}`)
      }
      // 滚动到底部
      nextTick(() => {
        messageDisplay.value.scrollTop = messageDisplay.value.scrollHeight
      })
    }
  }
  input.click()
}

// 上一次请求的内容高度
let preScrollHeight = 0
let preScrollTop = 0
const getChatMsg = async () => {
  if (toUser.value?.user?.uuid === '') {
    return
  }

  // 当加载了所有消息，不再发送请求，最老的消息都加载了就没得了.
  if (allMsgLoaded.value) {
    return
  }
  preScrollHeight = messageDisplay.value.scrollHeight
  preScrollTop = messageDisplay.value.scrollTop
  const params = {
    pageSize: 20,
    lastMsgTime: scrollId.value,
    guestId: toUser.value.user.uuid
  }
  const res = await ChatApi.chatMsgPost(params)
  console.log('res:', res)
  if (res && res.code === 200) {
    if (res.data && res.data.messages.length == 0) {
      allMsgLoaded.value = true
    }
    // page1: [m21 m22 m23 m24 ... m40]
    // page2: [m1 m2 m3 ... m20]
    if (res.data && res.data.messages.length > 0) {
      scrollId.value = res.data.messages[0].msgTime
    }
    messages.value = [...res.data?.messages, ...messages.value]

    nextTick(() => {
      if (preScrollHeight === 0) {
        messageDisplay.value.scrollTop = messageDisplay.value.scrollHeight - messageDisplay.value.clientHeight
      } else {
        messageDisplay.value.scrollTop = messageDisplay.value.scrollHeight - preScrollHeight + preScrollTop
      }
    })
  } else {
    message.error(res.message || '请求失败，请联系管理员')
  }
}

const loadHistoryMsg = throttle(() => {
  getChatMsg()
}, 500)

const visible = ref(false)
const videoUrl = ref('')
const playVideo = (url) => {
  videoUrl.value = mergeCdn(url)
  visible.value = true
}

const emit = defineEmits(['newMessage', 'changeUserInfo', 'msg:online', 'msg:offline'])

const onChangeUserInfo = (updateInfo) => {
  emit('changeUserInfo', updateInfo)
}

const onQuickReply = (msg) => {
  onSendMessage({ preventDefault: () => {} }, msg.msgType, msg.content)
}

const userStore = useUserStore()
const voiceFlag = computed(() => {
  console.log('消息提示音：',userStore.getUserInfo.newMessageVoice);
  return userStore.getUserInfo.newMessageVoice
})

let audio
const voiceSrc = ref(null)
const playVoice = (flag)=>{
  if(!voiceFlag.value) return
  if(audio) audio.pause();
  voiceSrc.value = flag ? msgVoice : onlineVoice
  nextTick(()=>{
    audio.play()
  })
}


// 自动滚动到最新消息
onMounted(() => {
  audio = document.getElementById('audioPlayer')

  let params = {
    wsHost: wsHost,
    wsFullHost: wsFullHost,
    token: token
  }

  // 监听消息
  wsClient = new WebSocketClient(params)

  wsClient.onMessage(res => {
    console.log('接收到啦：', res);
    // 播放新消息音频
    playVoice(true)
    

    // 是否是当前粉丝发的消息
    const guestId = res.guestId
    if (toUser.value?.user?.uuid === guestId) {
      // 将消息展示在聊天框中
      messages.value.push(JSON.parse(JSON.stringify(res)))
      // 发送已读消息
      newMessage.value.msgType = 'read'
      newMessage.value.guestId = toUser.value?.user?.uuid
      wsClient.sendMessage(JSON.parse(JSON.stringify(newMessage.value)))

      nextTick(() => {
        messageDisplay.value.scrollTop = messageDisplay.value.scrollHeight
      })
    }
    emit('newMessage', res)
  })

  wsClient.onOffline((res) => {
    emit('msg:offline', res)
  })

  wsClient.onOnline((res) => {
    // 播放上线音频
    playVoice(false)
    emit('msg:online',res)
  }) 

});


const renderMessage = (message) => {
  const messageEl = document.createElement('p')
  // 处理换行和 URL
  let html = highlightURLs(message)
  return html
}
</script>

<style lang="less" scoped>
.chatroom-contain {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.disable {
  cursor: not-allowed;
  pointer-events: none; /* 禁用所有鼠标事件 */
  filter: grayscale(80%); /* 灰化效果 */
  opacity: 0.7;
}
.to-user {
  width: 100%;
  height: 53px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

/* 消息展示区域 */
.message-display {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: #f9f9f9;
}

.message {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  max-width: 80%;
}

.message .avatar-and-name {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.message .avatar-and-name .name {
  font-size: 0.9em;
  color: #555;
}

.message img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.message-content {
  background: #e0e0e0;
  padding: 6px 10px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  p {
    margin-bottom: 0;
    overflow-wrap: anywhere;
  }

  .video-contain {
    position: relative;

    .video-box {
      // width: 200px;
      height: 120px;
    }

    .play-icon {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #fff;
      font-size: 36px;
      background: #ccc;
      border-radius: 50%;
    }
  }

  .image-box {
    width: 200px;
    height: 200px;
    object-fit: cover;
  }
}

.message-content .time {
  font-size: 0.75em;
  color: #888;
  margin-top: 5px;
  align-self: flex-end;
}

.message.right {
  margin-left: auto;
  flex-direction: row-reverse;
}

.message.right .message-content {
  background: #9eea6a;
}

/* 消息输入区域 */
.message-input {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 10px;
  border-top: 1px solid #ddd;
  background: #fff;
  min-height: 200px;
  border-right: 1px solid #ddd;
}

.message-input .tools {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.message-input .ant-input {
  flex: 1;
  padding: 10px;
  font-size: 1em;
  outline: none;
}

.message-input button {
  border: none;
  font-size: 1em;
  cursor: pointer;
}

.message-input .send-btn {
  width: 80px;
  position: absolute;
  right: 10px;
  bottom: 10px;
}

.emoji-text {
  padding: 10px;
  border: none;
  background: transparent;
  font-size: 16px;
  cursor: pointer;
}

.info-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 53px;
  padding: 5px 10px;
  background-color: #f9f9f9;
  border-bottom: 1px solid #ddd;
  font-size: 14px;
  color: #333;

  .info-row {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  .nickname {
    font-weight: bold;
    margin-right: 10px;
  }

  .ip {
    color: #555;
  }
}

.system-type,
.system-version,
.network-type {
  margin-right: 10px;
  color: #666;
}

.system-type:last-child,
.system-version:last-child,
.network-type:last-child {
  margin-right: 0;
}
</style>
