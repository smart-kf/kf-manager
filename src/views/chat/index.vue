<template>
    <div class="chat-container">
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
        <input v-model="newMessage" type="text" placeholder="Type your message..." />
        <button @click="sendMessage">Send</button>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted, nextTick } from 'vue';
  
  export default {
    setup() {
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
  
          // 滚动到底部
          nextTick(() => {
            messageDisplay.value.scrollTop = messageDisplay.value.scrollHeight;
          });
        }
      };
  
      // 自动滚动到最新消息
      onMounted(() => {
        nextTick(() => {
          messageDisplay.value.scrollTop = messageDisplay.value.scrollHeight;
        });
      });
  
      return {
        messages,
        newMessage,
        sendMessage,
        messageDisplay,
      };
    },
  };
  </script>
  
  <style scoped>
  /* 全局样式 */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: Arial, sans-serif;
    background-color: #f4f4f4;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
  }
  
  .chat-container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
    max-width: 600px;
    height: 90vh;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;
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
    padding: 10px;
    border-top: 1px solid #ddd;
    background: #fff;
  }
  
  .message-input input {
    flex: 1;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 20px;
    font-size: 1em;
    outline: none;
  }
  
  .message-input button {
    margin-left: 10px;
    padding: 10px 20px;
    border: none;
    border-radius: 20px;
    background: #007bff;
    color: #fff;
    font-size: 1em;
    cursor: pointer;
  }
  
  .message-input button:hover {
    background: #0056b3;
  }
  </style>
  