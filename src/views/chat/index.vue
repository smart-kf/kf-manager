<template>
    <div class="chat-container">
        <ChatList @onChangeChat="onChangeChat"/>
        <ChatRoom :toUser="toUser"/>
        <!-- <ChatUser :toUser="toUser"/> -->
    </div>
</template>
<script setup>
import { ref } from 'vue'
import ChatList from './ChatList.vue'
import ChatRoom from './ChatRoom.vue'


const toUser = ref()

const onChangeChat = (chat)=>{
    //TODO 聊天人？
    console.log('toUser:',chat);
    toUser.value = chat
    
}
</script>

<style lang="less" scoped>
.chat-container{
    display: flex;
    justify-content: flex-start;
    height: 100vh;
}
</style>