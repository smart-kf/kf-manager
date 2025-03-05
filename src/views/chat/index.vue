<template>
    <div class="chat-container">
        <ChatList :newMessage="newMessage"
            :updateInfo="updateInfo"
            ref="chatListRef"
            @onChangeChat="onChangeChat"/>

        <ChatRoom :key="toUser?.user?.uuid" 
            :toUser="toUser" 
            @new-message="onNewMessage"
            @changeUserInfo="onChangeUserInfo"
             @msg:online="onOnline"
            @msg:offline="onOffline"
        />
    </div>
</template>
<script setup>
import { ref } from 'vue'
import ChatList from './ChatList.vue'
import ChatRoom from './ChatRoom.vue'

const chatListRef = ref(null);


const toUser = ref()
const newMessage = ref()
const updateInfo = ref()

const onOnline = (e) => {
    chatListRef.value.onOnline(e);
}

const onOffline = (e) => {
    chatListRef.value.onOffline(e);
}

const onChangeChat = (chat)=>{
    console.log('toUser:',chat);
    chat.unreadMsgCnt = 0 
    toUser.value = chat
}

// 收到新推送消息，修改list中的未读数，时间，聊天内容展示等
const onNewMessage = (message)=>{
    newMessage.value = message
}

// 置顶，拉黑，修改粉丝信息等
const onChangeUserInfo = (info)=>{
    updateInfo.value = info
}
</script>

<style lang="less" scoped>
.chat-container{
    display: flex;
    justify-content: flex-start;
    height: 100vh;
}
</style>