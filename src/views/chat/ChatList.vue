<template>
    <div class="chat-list-container">
      <!-- 搜索框 -->
      <div class="search-box">
        <a-input-search
            v-model:value="searchBy"
            placeholder="搜索编号或备注"
            enter-button
            @search="onSearch"
        />
      </div>
  
      <!-- Tab 切换 -->
      <div class="tabs">
        <a-tabs v-model:activeKey="listType" @change="onChangeTab" style="width: 100%;">
            <a-tab-pane v-for="tab in tabs" :key="tab.value"  :tab="tab.label"></a-tab-pane>
        </a-tabs>
      </div>

      <!-- 聊天列表 -->
      <div v-scroll="handleScroll" class="chat-list">
        <div 
          v-for="chat in chatsList" 
          :key="chat.user.uuid" 
          :class="['chat-item',selectChatId===chat.user.uuid?'select-item':'',chat.user.topAt > 0 ? 'top-item' : '']" @click="onChangeChat(chat)">
          <div class="chat-left">
            <a-badge :count="chat.unreadMsgCnt">
              <img :src="mergeCdn(chat.user.avatar)" alt="Avatar" :class="['avatar',chat.user.isOnline ? '':'offline-avatar']" />
            </a-badge>
            <div class="chat-info">
              <span class="name">{{ chat.user.remarkName || chat.user.nickName }}</span>
              <p class="last-message">{{ chat.lastMessage }}</p>
            </div>
          </div>
          <div class="chat-right">
            <span class="status" :class="{ online: chat.user.isOnline }">
              {{ chat.user.isOnline ? '在线' : '离线' }}
            </span>
            <span class="time">{{ chat.lastChatAt ? dayjs(chat.lastChatAt).format('HH:mm') : '' }}</span>
          </div>
        </div>
      </div>
  
    </div>
  </template>
  
<script setup>
import { ref, defineEmits, onMounted, watch, defineProps, toRefs , defineExpose } from 'vue';
import dayjs from 'dayjs'
import { ChatApi } from '@/webapi/index'
import { message } from 'ant-design-vue';
import { mergeCdn } from '@/utils/util.ts'
import { throttle } from 'lodash-es'

const props = defineProps({
  newMessage: {
    type: Object,
    default: () => ({
      content: "",
      event: "message",
      guestAvatar: "", 
      guestId: '',
      guestName: '',
      isKf: '',
      kfId: '',
      msgId: '',
      msgType: 'text',
      platform: 'kf'
    })
  },
  updateInfo: {
    type: Object,
    default: ()=>({
      uuid: '',
      updateType: '',  //block\top\userinfo
      block: '', // 1拉黑，2取消拉黑
      top: '', //1置顶，2取消置顶
      mobile: '',
      remarkName: '',
      comments: ''
    })
  }
})

const { newMessage, updateInfo } = toRefs(props)

watch(() => props.newMessage, () => {
  if (newMessage.value?.guestId) {
    // 未读消息加1，展示最新消息，消息时间
    // 置顶
    handleNewMessage()
  }
}, {
  deep: true,
  immediate: true
})

const handleNewMessage = ()=>{
  const {guestId,msgType,content} = newMessage.value
  const idx = chatsList.value.findIndex((item)=>item.user.uuid === guestId)
  const fans = chatsList.value[idx]
  fans.lastMessage = msgType === 'text' ? content : msgType === 'video' ? '视频' : '图片'
  // 当前选中的粉丝和接收消息的粉丝不是同一个时，未读数加1
  if(selectChatId.value !== fans.user.uuid){
    fans.unreadMsgCnt++
  }
  fans.lastChatAt = Date.now()
  // 新消息需要向前排
  handleMsgTop(guestId)
}

const handleMsgTop = (guestId)=>{
  const idx = chatsList.value.findIndex((item)=>item.user.uuid === guestId)
  const fans = chatsList.value[idx]
  chatsList.value.splice(idx, 1);
  // 原本置顶的粉丝排第一
  if(fans.user.topAt > 0){
    chatsList.value.unshift(fans);
  }else{
    // 非置顶的粉丝排非置顶范围内的第一
    const index = chatsList.value.findIndex((item)=>item.user.topAt == 0)
    chatsList.value.splice(index,0,fans)
  }
}


watch(()=>updateInfo.value,()=>{
  const {updateType} = updateInfo.value
  switch (updateType) {
    case 'block':
      handleBlock()
      break;
    case 'top':
      handleTop()
      break;
    case 'userinfo':
      handleUpdate()
      break;
    default:
      break;
  }
},{
  deep: true,
})

const handleBlock = ()=>{
  const {block,uuid} = updateInfo.value
  if(block === 1){
    // 拉黑
    listType.value = 2
    onChangeTab()
    return
  }
  // 取消拉黑
  if(listType.value !==2) return
  // 从拉黑tab中移除
  const idx = chatsList.value.findIndex((item)=>item.user.uuid ===updateInfo.value.uuid)
  chatsList.value.splice(idx,1)
}

const handleTop = ()=>{
  if(listType.value !== 0)return
  const {top,uuid} = updateInfo.value
  const idx = chatsList.value.findIndex((item)=>item.user.uuid === uuid)
  const fans = chatsList.value[idx]
  chatsList.value.splice(idx,1)
  if(top===1){
    // 置顶
    fans.user.topAt = 1
    chatsList.value.unshift(fans);
    return
  }
  // 取消置顶
  fans.user.topAt = 0
  const index = chatsList.value.findIndex((item)=>item.user.topAt == 0)
  chatsList.value.splice(index,0,fans)
}

const handleUpdate = ()=>{
  const {uuid,remarkName} = updateInfo.value
  const idx = chatsList.value.findIndex((item)=>item.user.uuid === uuid)
  const fans = chatsList.value[idx]
  fans.user.remarkName = remarkName
}

const searchBy = ref('');
const listType = ref(0);
const selectChatId = ref('')

const tabs = [
    { label: '全部', value: 0 },
    { label: '未读', value: 1 },
    { label: '拉黑', value: 2 },
];

const chatsList = ref([]);

const emits = defineEmits(['on-change-chat'])
const onChangeChat = (chat)=>{
    // 如果有未读，清零
    if(chat.unreadMsgCnt > 0 )chat.unreadMsgCnt = 0
    
    selectChatId.value = chat.user.uuid
    emits('on-change-chat',chat)
}


const onSearch = ()=>{
  chatsList.value = []
  getChatList('')
}

const onChangeTab = ()=>{
  chatsList.value = []
  getChatList('')
}

const handleScroll = throttle(()=>{
  const idx = chatsList.value.length - 1
  const scrollId = chatsList.value[idx].user.uuid
  getChatList(scrollId)
},500)

const getChatList = async (scrollId)=>{
    const params = {
      ScrollReques: {
        asc: true,
        pageSize: 20,
        scrollID: {
          description: scrollId
        },
        sorters: [
          {
            Asc: true,
            Key: ""
          }
        ]
      },
      listType: listType.value,
      searchBy: searchBy.value
    }
    const res = await ChatApi.chatListPost(params)
    if(res && res.code === 200){
      const { chats=[] } = res.data
      console.log('chats:',chats);
      chatsList.value = [...chatsList.value, ...chats]
    }else{
      message.error(res.message || '请求失败，请联系管理员');
    }
}

// 用户上线
const onOnline = (e) => {
  console.log('chatList ---> ',e)
  const idx = chatsList.value.findIndex((item)=>item.user.uuid === e.guestId)
  if(idx !== -1) {
    chatsList.value[idx].user.isOnline = true
    console.log(chatsList.value[idx].user.nickName,'在线')
  }
}


const onOffline = (e) => {
  console.log('chatList ---> ',e)
  const idx = chatsList.value.findIndex((item)=>item.user.uuid === e.guestId)
  if(idx !== -1) {
    chatsList.value[idx].user.isOnline = true
    console.log(chatsList.value[idx].user.nickName,'在线')
  }
}



onMounted(()=>{
    getChatList('')
})


defineExpose({ onOnline, onOffline });

</script>
  
<style lang="less" scoped>

  
  .chat-list-container {
    width: 100%;
    max-width: 300px;
    background: #fff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    display: flex;
    flex-direction: column;

    :deep(.ant-tabs-top >.ant-tabs-nav){
      margin: 0;
    }

    :deep(.ant-tabs-nav::before){
      border-bottom: 0;
    }
  }
  
  /* 搜索框 */
  .search-box {
    padding: 10px;
    border-bottom: 1px solid #ddd;
    background: #f9f9f9;
  }
  
  .search-box input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 20px;
    font-size: 1em;
    outline: none;
  }
  
  /* Tabs */
  .tabs {
    display: flex;
    justify-content: space-around;
    padding: 0 10px;
    background: #f9f9f9;
    border-bottom: 1px solid #ddd;
  }
  
  .tabs button {
    padding: 10px 20px;
    border: none;
    background: #f0f0f0;
    border-radius: 20px;
    cursor: pointer;
    font-size: 1em;
  }
  
  .tabs button.active {
    background: #007bff;
    color: #fff;
  }
  
  /* 聊天列表 */
  .chat-list {
    flex: 1;
    overflow-y: auto;
  }
  
  .chat-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 10px;
    border-bottom: 1px solid #ddd;
    cursor: pointer;
    &:hover {
      background-color: #e6f4ff;
        // background-color: rgba(173, 216, 230, 0.5);
    }
  }

  .select-item{
    position: relative;
    background: #dedede;
  }
  .select-item:after{
      position: absolute;
      width: 6px;
      height: 100%;
      background-color: #1890ff;
      // background: rgba(173, 216, 230, 0.5);
      right:0 ;
      top: 0;
      content: "";
  }

  .top-item{
    background-color: #ebebeb;
  }
  
  .chat-left {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .avatar {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    border: 2px solid greenyellow;
    margin-left: 8px;
  }
  .offline-avatar{
    filter: grayscale(100%);
    transition: filter 0.3s ease;
  }
  
  .chat-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  
  .name {
    font-weight: bold;
    font-size: 1em;
    height: 22px;
  }
  
  .last-message {
    height: 20px;
    max-width: 150px;
    font-size: 0.9em;
    color: #888;
    margin-bottom: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .chat-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
  
  .status {
    font-size: 0.9em;
    color: #888;
    height: 22px;
  }
  
  .status.online {
    color: green;
  }
  
  .time {
    font-size: 0.8em;
    color: #999;
    height: 20px;
  }
  
  /* 响应式 */
  @media (max-width: 768px) {
    .chat-list-container {
      max-width: 100%;
    }
  
    .name {
      font-size: 0.9em;
    }
  
    .last-message {
      font-size: 0.8em;
    }
  
    .time {
      font-size: 0.7em;
    }
  }
  </style>
  