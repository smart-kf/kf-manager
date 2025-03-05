<template>
    <div class="chat-user">
        <div class="tabs">
            <!-- @change="onChangeTab" -->
            <a-tabs v-model:activeKey="activeKey" style="width: 100%;">
                <a-tab-pane v-for="tab in tabs" :key="tab.value"  :tab="tab.label"></a-tab-pane>
            </a-tabs>
            <div v-if="activeKey===0" >
                <div v-for="item in labels" class="item">
                    <template v-if="!['blockAt','topAt'].includes(item.key)">
                        <span style="display:inline-block; width: 80px;">{{ item.label }}</span>
                        <span style="margin-left: 10px;">{{ toUser.user[item.key] }}</span>
                    </template>
                    <template v-else>
                        <span style="display:inline-block; width: 80px;">{{ item.label }}</span>
                        <span v-if="item.key==='blockAt'" @click="onClick(item.key)" class="clickable">{{ toUser.user.blockAt > 0 ? '取消拉黑' : '拉黑' }}</span>
                        <span v-if="item.key==='topAt'"  @click="onClick(item.key)" class="clickable">{{ toUser.user.topAt > 0 ? '取消置顶' : '置顶' }}</span>
                    </template>
                </div>
                <!--  -->
                <a-form :model="formState" :colon="false" class="edit-form">
                        <a-form-item label="手机号" name="mobile">
                            <a-input v-model:value="formState.mobile" />
                        </a-form-item>
                        <a-form-item label="昵称" name="remarkName">
                            <a-input v-model:value="formState.remarkName" />
                        </a-form-item>
                        <a-form-item label="备注" name="comments">
                            <a-textarea v-model:value="formState.comments" :rows="3" :maxlength="200" show-count/>
                        </a-form-item>
                        <a-form-item>
                            <a-button @click="onUpdateUser" type="primary" html-type="submit" style="margin-left:80px">提交</a-button>
                        </a-form-item>
                    </a-form>
            </div>
            <!-- TODO 快捷回复 -->
            <div v-if="activeKey===1" class="item">
                功能待上线，敬请期待！
            </div>
        </div>
    </div>
</template>
<script setup>
import { defineProps, toRefs, ref, watch, defineEmits } from 'vue'
import { ChatApi } from '@/webapi/index'
import { reactive } from 'vue';
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

const emit = defineEmits(['change'])


const { toUser } = toRefs(props)

watch(() => props.toUser,() => {
    if(toUser.value?.user){
        setTimeout(() => {
            const {mobile,remarkName,nickName,comments} = toUser.value.user
            formState.mobile = mobile
            formState.remarkName = remarkName || nickName
            formState.comments = comments
        }, 0);
    }
},{
    deep: true,
    immediate: true
})


const tabs = [
    { label: '用户资料', value: 0 },
    { label: '快捷回复', value: 1 }
];

const formState = reactive({
    mobile: '',
    remarkName: '',
    comments: ''
})

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
    {key:'topAt',label: '聊天置顶'},
    {key:'blockAt',label: '用户拉黑'},
]

const onClick = async (key)=>{
    const {uuid,blockAt,topAt} = toUser.value.user
    const params = {uuid}
    if (key === 'blockAt') {
        blockAt > 0 ? params.block = 2 : params.block = 1
        params.updateType = 'block'
    }
    if(key === 'topAt'){
        topAt > 0 ? params.top = 2 : params.top = 1
        params.updateType = 'top'
    }
    const res = await ChatApi.updateUser(params)
    // TODO 拉黑后,修改list，移除当前粉丝item，反之，添加粉丝item到合适的时间去
    // 
    // TODO 置顶后，修改list，当前粉丝item移到最上面，反之，移到粉丝item到合适的时间去
    if(res.code === 200){
        message.success('操作成功')
        emit('change',params)
    }
}

const onUpdateUser = async()=>{
    const {uuid} = toUser.value.user
    const params = {
        uuid,
        updateType:'userinfo',
        ...formState
    }
    const res = await ChatApi.updateUser(params)
    if(res.code === 200){
        message.success('修改成功')
        emit('change',params)
    }
}



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
        .clickable{
            margin-left: 10px;
            cursor: pointer;
            color: #599cf8;
        }
    }
}

:deep(.edit-form){
    width: 95%;
    margin-top: 10px;
    .ant-form-item-label{
        width: 80px;
    }

    .ant-form-item-label > label{
        color: #888;
    }
}
</style>