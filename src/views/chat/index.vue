<template>
    <div class="chat-container">
        <ChatList :newMessage="newMessage" @onChangeChat="onChangeChat"/>
        <ChatRoom :toUser="toUser" @new-message="onNewMessage"/>
        <!-- <ChatUser :toUser="toUser"/> -->
    </div>
</template>
<script setup>
import { ref } from 'vue'
import ChatList from './ChatList.vue'
import ChatRoom from './ChatRoom.vue'


const toUser = ref()
const newMessage = ref()

const onChangeChat = (chat)=>{
    //TODO 聊天人？
    console.log('toUser:',chat);
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