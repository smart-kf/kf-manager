<template>
    <div class="chat-contain">
        <ChatList @onChangeChat="onChangeChat"/>
        <ChatRoom/>
    </div>
</template>
<script setup>
import ChatList from './ChatList.vue'
import ChatRoom from './ChatRoom.vue'


const onChangeChat = (chat)=>{
    //TODO 聊天人？
    console.log();
    
}
</script>

<style lang="less" scoped>
.chat-contain{
    display: flex;
    justify-content: flex-start;
}
</style>