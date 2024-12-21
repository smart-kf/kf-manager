<template>
    <a-popover overlayClassName="my-emoji-popover" placement="topLeft" trigger="click">
        <template #content>
            <EmojiPicker :native="true" @select="onSelectEmoji" />
        </template>
        <div class="emoji-text">
            <smile-outlined/>
        </div>
    </a-popover>
</template>
<script setup>
import { defineEmits } from 'vue';
import EmojiPicker from 'vue3-emoji-picker'
import 'vue3-emoji-picker/css'
import { SmileOutlined } from '@ant-design/icons-vue'


const emits = defineEmits(['on-change'])
const onSelectEmoji = (emoji)=>{
    emits('on-change',emoji)
}

</script>
<style lang="less" scoped>
.emoji-text{
    padding: 10px;
    border: none;
    background: transparent;
    font-size: 16px;
    cursor: pointer;
}

</style>
<style lang="less">
.my-emoji-popover{
    .ant-popover-inner{
        padding: 0;
        box-shadow: none;
    }
}
</style>