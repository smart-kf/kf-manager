<template>
    <div class="chat-user">
        <div class="tabs">
            <!-- @change="onChangeTab" -->
            <a-tabs v-model:activeKey="activeKey" style="width: 100%;">
                <a-tab-pane v-for="tab in tabs" :key="tab.value"  :tab="tab.label"></a-tab-pane>
            </a-tabs>
            <div v-if="activeKey===0" v-for="item in labels" class="item">
                <span style="display:inline-block; width: 80px;">{{ item.label }}</span>
                <span style="margin-left: 10px;">{{ toUser.user[item.key] }}</span>
            </div>
            <div v-if="activeKey===1" class="item">
                功能待上线，敬请期待！
            </div>
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

const labels = [
    {key:'ip',label: '注册IP',},
    {key:'area',label: 'IP地区'},
    {key:'label',label: '注册时间'},
    {key:'offlineAt',label:   '离线时间'},
    {key:'device',label:  '系统类型'},
    {key:'browser',label: '系统版本'},
    {key:'networkType',label: '网络类型'},
    {key:'scanCount',label: '扫码次数'},
    // {label: '聊天置顶'},
    // {label: '用户拉黑'},
]




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

    .item{
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding: 6px 10px;
        color: #888;
        cursor: pointer;
    }
}
</style>