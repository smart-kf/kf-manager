<template>
    <div class="chatroom-contain">
      <!-- 消息来源 -->
      <div class="info-container">
        <!-- 第一行: 昵称和IP -->
        <div class="info-row">
        <span class="nickname">{{ toUser?.user?.nickName }}</span>
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
      <div class="message-display" ref="messageDisplay">
        <div
          v-for="(message, index) in messages"
          :key="index"
          :class="['message', message.isKf == '1' ? 'right' : '']"
        >
          <div class="avatar-and-name">
            <span class="name">{{ message.isKf === '1' ? '' : message.guestName }}</span>
            <img :src="message.guestAvatar" alt="Avatar" />
          </div>
          <div class="message-content">
            <p v-if="message.msgType === 'text'">{{ message.content }}</p>
            <video v-if="message.msgType === 'video'" :src="message.content" controls class="video-box"></video>
            <a-image v-if="message.msgType === 'image'" :width="200" :src="message.content" class="image-box"/>
            <!-- <img v-if="message.msgType === 'image'" :src="'https://cdn.smartkf.top/static/avatar/guest.png'"   @click="onViewImg(message.content)"/> -->
            <span class="time">{{ dayjs(message.msgTime).format('HH:mm:ss') }}</span>
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
        <a-textarea v-model:value="newMessage.content" v-focus placeholder="Type your message..." :bordered="false" @pressEnter="sendMessage"/>
      </div>

      
    </div>
  </template>
  
<script setup>
import { ref, onMounted, nextTick, defineProps, toRefs,watch } from 'vue';
import WebSocketClient from '@/utils/mySocket.js';
import EmojiSelect from '@/components/EmojiSelect/index.vue'
import { FileImageOutlined, VideoCameraOutlined } from '@ant-design/icons-vue'
import dayjs from 'dayjs'
import { ChatApi } from '@/webapi/index'
import { message } from 'ant-design-vue';

const props = defineProps({
  toUser:{
    type: Object,
    default: ()=>({
      user:{},
      lastChatAt: 0,
      lastMessage: null
    })
  }
})


const { toUser } = toRefs(props)

watch(()=>props.toUser,()=>{
  if(toUser.value?.user?.uuid){
    getChatMsg()
  }
},{
  deep: true,
  immediate: true
})



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
const messages = ref([
  // {
  //   msgType: 'text', image || video
  //   content: '',
  //   msgTime: '', // 时间戳
  //   guestAvatar: '',  //头像
  //   time: '10:15 AM',
  // },
]);
  
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
  
// 消息展示区域引用
const messageDisplay = ref(null);
  
// 回车，发送消息
const sendMessage = () => {
  const messageText = newMessage.value.content.trim();
  if (messageText) {
    newMessage.value.msgType = 'text'
    newMessage.value.content = messageText
    newMessage.value.msgTime = Date.now()
    newMessage.value.guestAvatar = 'https://www.helloimg.com/i/2025/01/06/677bc71442919.png'
    messages.value.push(JSON.parse(JSON.stringify(newMessage.value)));
    // 发送给服务器
    wsClient.sendMessage(JSON.parse(JSON.stringify(newMessage.value)))
    // 清空聊天
    newMessage.value.content = '';

    // 滚动到底部
    nextTick(() => {
      messageDisplay.value.scrollTop = messageDisplay.value.scrollHeight;
    });
  }
};


// 切换表情包选择框
const onEmojiChange = (emoji) => {
  newMessage.value.content += emoji.i;
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

const getChatMsg = async(scrollId)=>{
  const params = {
    ScrollRequest: {
      "asc": true,
      "pageSize": 20,
      "scrollID": {
        description: scrollId
      },
      "sorters": [
        {
          "Asc": true,
          "Key": "string"
        }
      ]
    },
    guestId: toUser.value.user.uuid
  }
  const res = await ChatApi.chatMsgPost(params)
  console.log('res:',res);
  if(res&&res.code === 200){
    messages.value = [...res.data?.messages, ...messages.value]
    
    if(!scrollId){
      setTimeout(() => {
        messageDisplay.value.scrollTop = messageDisplay.value.scrollHeight;
      }, 500);
    }
  }else{
    message.error(res.message || '请求失败，请联系管理员');
  }
  
}
   
        
  
// 自动滚动到最新消息
onMounted(() => {

  nextTick(() => {
    messageDisplay.value.scrollTop = messageDisplay.value.scrollHeight;
  });

  // 监听消息
  wsClient = new WebSocketClient();

  wsClient.onMessage(res=>{
    console.log('接收到啦：',res);
    messages.value.push(JSON.parse(JSON.stringify(res)));
  })

  // wsClient.onMessage((res)=>{
  //   console.log('wsClient.onMessage',res);
    
  //   const {type,data} = res || {}
  //   // 文本
  //   switch (data?.msgType) {
  //     case "text":
  //       messages.value.push({
  //         msgType: 'text',
  //         guestName: data.guestName,
  //         guestAvatar: data.guestAvatar,
  //         content: data.content,
  //         msgTime: dayjs(data.msgTime).format('HH:mm:ss'),
  //       });
  //     break;
  //     case "video":
  //       messages.value.push({
  //         msgType: 'video',
  //         guestName: data.guestName,
  //         guestAvatar: data.guestAvatar,
  //         content: data.content,
  //         msgTime: dayjs(data.msgTime).format('HH:mm:ss'),
  //       });
  //       break
  //     case "image":
  //       messages.value.push({
  //         msgType: 'image',
  //         guestName: data.guestName,
  //         guestAvatar: data.guestAvatar,
  //         content: data.content,
  //         msgTime: dayjs(data.msgTime).format('HH:mm:ss'),
  //       });
  //       break
  //     default:
  //       break;
  //   }
      
    
      
  // })
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
  padding: 6px 10px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;

  p{
    margin-bottom: 0;
  }

  .video-box{
    width: 200px;
    height: 120px;
  }

  .image-box{
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
  background: #9EEA6A;
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
