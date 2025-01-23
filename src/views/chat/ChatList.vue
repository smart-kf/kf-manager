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
          :class="['chat-item',selectChatId===chat.user.uuid?'select-item':'']" @click="onChangeChat(chat)">
          <div class="chat-left">
            <img :src="mergeCdn(chat.user.avatar)" alt="Avatar" :class="['avatar',chat.user.isOnline ? '':'offline-avatar']" />
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
import { ref, defineEmits, onMounted } from 'vue';
import dayjs from 'dayjs'
import { ChatApi } from '@/webapi/index'
import { message } from 'ant-design-vue';
import { mergeCdn } from '@/utils/util.ts'
import { throttle } from 'lodash-es'

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
onMounted(()=>{
    getChatList('')
})


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
    padding: 6px 10px;
    border-bottom: 1px solid #ddd;
    cursor: pointer;
    &:hover {
      background-color: #e6f4ff;
        // background-color: rgba(173, 216, 230, 0.5);
    }
  }

  .select-item{
    position: relative;
  }
  .select-item::before{
      position: absolute;
      width: 4px;
      height: 100%;
      background-color: #1890ff;
      // background: rgba(173, 216, 230, 0.5);
      top: 0;
      left: 0;
      content: "";
    }
  
  .chat-left {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .avatar {
    width: 32px;
    height: 32px;
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
  }
  
  .last-message {
    max-width: 150px;
    font-size: 0.9em;
    color: #666;
    margin-bottom: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .chat-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 5px;
  }
  
  .status {
    font-size: 0.9em;
    color: #888;
  }
  
  .status.online {
    color: green;
  }
  
  .time {
    font-size: 0.8em;
    color: #999;
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
  