<template>
    <div class="chat-user">
        <div class="tabs">
            <!-- @change="onChangeTab" -->
            <a-tabs v-model:activeKey="activeKey" style="width: 100%;">
                <a-tab-pane v-for="tab in tabs" :key="tab.value"  :tab="tab.label"></a-tab-pane>
            </a-tabs>
        </div>
    </div>
</template>
<script setup>
import { defineProps, toRefs, ref } from 'vue'
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


const tabs = [
    { label: '用户资料', value: 0 },
    { label: '快捷回复', value: 1 }
];

const activeKey = ref(0)




</script>
<style lang="less" scoped>
.chat-user{
    width: 100%;
    max-width: 300px;
    background: #fff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    display: flex;
    flex-direction: column;

    :deep(.ant-tabs-top >.ant-tabs-nav){
        margin: 0;
        padding: 0 10px;
        height: 53px;
    }   
}
</style>