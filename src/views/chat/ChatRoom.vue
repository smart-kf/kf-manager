<template>
    <div class="chatroom-contain">
      <!-- 消息来源 -->
      <div class="info-container">
        <!-- 第一行: 昵称和IP -->
        <div class="info-row">
        <span class="nickname">{{ toUser.externalUser.nickName }}</span>
        <span class="ip">{{ toUser.ip || '0.0.0.0' }}</span>
        </div>
        <!-- 第二行: 系统类型、系统版本、网络类型 -->
        <div class="info-row">
        <span class="system-type">系统类型：{{ clientInfo.system }}</span>
        <span class="system-version">系统版本：{{ clientInfo.system }}</span>
        <span class="network-type">网络类型：{{ clientInfo.networkType }}</span>
        </div>
    </div>

      <!-- 消息展示区域 -->
      <div class="message-display" ref="messageDisplay">
        <div
          v-for="(message, index) in messages"
          :key="index"
          :class="['message', message.sender === 'me' ? 'right' : '']"
        >
          <div class="avatar-and-name">
            <span class="name">{{ message.name }}</span>
            <img :src="message.avatar" alt="Avatar" />
          </div>
          <div class="message-content">
            <p>{{ message.text }}</p>
            <span class="time">{{ message.time }}</span>
          </div>
        </div>
      </div>
  
      <!-- 消息输入区域 -->
      <div class="message-input">
        <div class="tools">
             <EmojiSelect @onChange="onEmojiChange"></EmojiSelect>
             <FileImageOutlined @click="selectFile('image')" class="emoji-text"/>
             <VideoCameraOutlined @click="selectFile('video')" class="emoji-text"/>
        </div>
        <a-textarea v-model:value="newMessage" v-focus placeholder="Type your message..." :bordered="false" @pressEnter="sendMessage"/>
      </div>

      
    </div>
  </template>
  
<script setup>
import { ref, onMounted, nextTick, defineProps, toRefs } from 'vue';
import WebSocketClient from '@/utils/websocket.js';
import EmojiSelect from '@/components/EmojiSelect/index.vue'
import { FileImageOutlined, VideoCameraOutlined } from '@ant-design/icons-vue'

const props = defineProps({
    toUser:{
        type: Object,
        default: ()=>({
                externalUser: {
                    nickName: '',
                    avatar: '',
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
        })
    }
})


const { toUser } = toRefs(props)

const clientInfo = ref({
    system: 'Unknown',
    networkType: 'Unknown'
})


      // ws实例
      let wsClient

      // 消息对象数组
      const messages = ref([
        {
          sender: 'other',
          name: 'User 1',
          avatar: 'https://via.placeholder.com/40',
          text: 'Hello! How are you?',
          time: '10:15 AM',
        },
        {
          sender: 'me',
          name: 'You',
          avatar: 'https://via.placeholder.com/40',
          text: "I'm good, thanks! How about you?",
          time: '10:16 AM',
        },
      ]);
  
      // 输入框中的新消息
      const newMessage = ref('');
  
      // 消息展示区域引用
      const messageDisplay = ref(null);
  
      // 发送消息
      const sendMessage = () => {
        const messageText = newMessage.value.trim();
        if (messageText) {
          const currentTime = new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          });
          messages.value.push({
            sender: 'me',
            name: 'You',
            avatar: 'https://via.placeholder.com/40',
            text: messageText,
            time: currentTime,
          });
          newMessage.value = '';

          wsClient.sendMessage(messageText)
  
          // 滚动到底部
          nextTick(() => {
            messageDisplay.value.scrollTop = messageDisplay.value.scrollHeight;
          });
        }
      };


      // 切换表情包选择框
    const onEmojiChange = (emoji) => {
        newMessage.value += emoji.i;
    };

    

    // 选择文件
    const selectFile = (type) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = type === 'image' ? 'image/*' : 'video/*';
      input.onchange = (event) => {
        const file = event.target.files[0];
        if (file) {
            //TODO 上传至服务器，得到url后展示在消息框中
        //   const currentTime = new Date().toLocaleTimeString([], {
        //     hour: '2-digit',
        //     minute: '2-digit',
        //   });
        //   messages.value.push({
        //     sender: 'me',
        //     name: 'You',
        //     avatar: 'https://via.placeholder.com/40',
        //     text: `Sent a ${type}: ${file.name}`,
        //     time: currentTime,
        //   });

          // 滚动到底部
          nextTick(() => {
            messageDisplay.value.scrollTop = messageDisplay.value.scrollHeight;
          });
        }
      };
      input.click();
    };
      
// 获取客户端信息
const getClientInfo = ()=>{
    // 获取系统信息
    const userAgent = navigator.userAgent;
    if (/Windows NT/i.test(userAgent)) clientInfo.value.system = "Windows";
    else if (/Mac OS/i.test(userAgent)) clientInfo.value.system = "macOS";
    else if (/Android/i.test(userAgent)) clientInfo.value.system = "Android";
    else if (/iPhone|iPad|iPod/i.test(userAgent)) clientInfo.value.system = "iOS";

    // 获取网络类型
    const networkType = navigator.connection?.effectiveType || "Unknown";
    clientInfo.value.networkType = networkType
}
        
  
      // 自动滚动到最新消息
      onMounted(() => {
        getClientInfo()

        nextTick(() => {
          messageDisplay.value.scrollTop = messageDisplay.value.scrollHeight;
        });

        // 监听消息
        wsClient = new WebSocketClient('ws://localhost:8089', {
            reconnectInterval: 5000,
            heartbeatInterval: 30000,
            heartbeatMessage: { type: 'ping' }
        });

        wsClient.onMessage((message)=>{
            const currentTime = new Date().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
            });
          messages.value.push({
            sender: 'other',
            name: 'User 1',
            avatar: 'https://via.placeholder.com/40',
            text: message,
            time: currentTime,
          });
            
        })
      });
  
     
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

  .to-user{
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
    padding: 10px 15px;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
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
    background: #d1e7ff;
  }
  
  /* 消息输入区域 */
  .message-input {
  display: flex;
  flex-direction: column;
  padding: 10px;
  border-top: 1px solid #ddd;
  background: #fff;
  min-height: 200px;
}

.message-input .tools {
  display: flex;
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
  padding: 10px;
  border: none;
  background: transparent;
  color: #fff;
  font-size: 1em;
  cursor: pointer;
}

.emoji-text{
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



.system-type, .system-version, .network-type {
  margin-right: 10px;
  color: #666;
}

.system-type:last-child, .system-version:last-child, .network-type:last-child {
  margin-right: 0;
}
  </style>
  