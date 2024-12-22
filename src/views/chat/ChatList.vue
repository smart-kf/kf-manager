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
        <a-tabs v-model:activeKey="activeTab" style="width: 100%;">
            <a-tab-pane v-for="tab in tabs" :key="tab.value"  :tab="tab.label"></a-tab-pane>
        </a-tabs>
      </div>

      <!-- 聊天列表 -->
      <div class="chat-list">
        <div 
          v-for="chat in filteredChats" 
          :key="chat.id" 
          class="chat-item" @click="onChangeChat(chat)">
          <div class="chat-left">
            <img :src="chat.externalUser.avatar" alt="Avatar" class="avatar" />
            <div class="chat-info">
              <span class="name">{{ chat.externalUser.nickName }}</span>
              <p class="last-message">{{ chat.lastMessage.content.text.content }}</p>
            </div>
          </div>
          <div class="chat-right">
            <span class="status" :class="{ online: chat.externalUser.isOnline }">
              {{ chat.isOnline ? '在线' : '离线' }}
            </span>
            <span class="time">{{ dayjs(chat.lastChatAt).format('HH:mm') }}</span>
          </div>
        </div>
      </div>
  
    </div>
  </template>
  
<script setup>
import { ref, computed, defineEmits, onMounted } from 'vue';
import baseService from '@/utils/http/axios'
import dayjs from 'dayjs'

const searchBy = ref('');
const activeTab = ref(0);
const scrollID = ref('')

const tabs = [
    { label: '全部', value: 0 },
    { label: '未读', value: 1 },
    { label: '拉黑', value: 2 },
];

const chats = ref([
    {
        externalUser: {
            nickName: 'Alice',
            avatar: 'https: //via.placeholder.com/40',
            isOnline: true,
        },
        lastMessage: {
            from: '',
            fromType: '',
            to: '',
            toType: '',
            content: {
                type: 0, //0:文本 1:语音 2:图片 3:视频 4:网址 5:其他文
                text: {
                    content: 'Hey, how are you?'
                }
            }
        },
    },
    {
        externalUser: {
            nickName: 'Bob',
            avatar: 'https: //via.placeholder.com/40',
            isOnline: false,
        },
        lastMessage: {
            from: '',
            fromType: '',
            to: '',
            toType: '',
            content: {
                type: 0, //0:文本 1:语音 2:图片 3:视频 4:网址 5:其他文
                text: {
                    content: 'See you tomorrow!'
                }
            }
        },
    },
    {
        externalUser: {
            nickName: 'Charlie',
            avatar: 'https: //via.placeholder.com/40',
            isOnline: false,
        },
        lastMessage: {
            from: '',
            fromType: '',
            to: '',
            toType: '',
            content: {
                type: 0, //0:文本 1:语音 2:图片 3:视频 4:网址 5:其他文
                text: {
                    content: 'Blocked user.'
                }
            }
        },
    },
    
    // {
    //     id: 3,
    //     avatar: 'https://via.placeholder.com/40',
    //     name: 'Charlie',
    //     lastMessage: 'Blocked user.',
    //     time: 'Yesterday',
    //     isOnline: false,
    //     status: 'blocked',
    // },
]);

const filteredChats = computed(() => {
    return chats.value
});

const emits = defineEmits(['on-change-chat'])
const onChangeChat = (chat)=>{
    console.log('onChangeChat:',chat);
    emits('on-change-chat',chat)
}

onChangeChat(chats.value[0])


const onSearch = ()=>{

}

const getChatList = async ()=>{
    const params = {
        searchBy: searchBy.value,
        listType: activeTab.value,
        scrollID: scrollID.value
    }
    const api = ''
    // TODO 发请求
    const res = await baseService.post(api,params)
        const {chats} = res
        chats.value = res.chats || []
}
onMounted(()=>{
    // getChatList()
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
    padding: 0 10px;
  }
  
  .chat-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 10px;
    border-bottom: 1px solid #ddd;
    cursor: pointer;
  }
  
  .chat-left {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
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
  