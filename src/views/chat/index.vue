<template>
    <div class="chat-container">
        <ChatList 
            :newMessage="newMessage"
            @onChangeChat="onChangeChat"
            ref="chatListRef"
         />
        <ChatRoom 
            :key="toUser?.user?.uuid"
            :toUser="toUser" 
            @new-message="onNewMessage"
            @msg:online="onOnline"
            @msg:offline="onOffline"
         />
        <!-- <ChatUser :toUser="toUser"/> -->
    </div>
</template>
<script setup>
import { ref } from 'vue'
import ChatList from './ChatList.vue'
import ChatRoom from './ChatRoom.vue'

const chatListRef = ref(null);


const toUser = ref()
const newMessage = ref()

const onOnline = (e) => {
    chatListRef.value.onOnline(e);
}

const onOffline = (e) => {
    chatListRef.value.onOffline(e);
}

const onChangeChat = (chat)=>{
    //TODO 聊天人？
    console.log('toUser:',chat);
    chat.unreadMsgCnt = 0 
    toUser.value = chat
}

const onNewMessage = (message)=>{
    newMessage.value = message
}
</script>

<style lang="less" scoped>
.chat-container{
    display: flex;
    justify-content: flex-start;
    height: 100vh;
}
</style>