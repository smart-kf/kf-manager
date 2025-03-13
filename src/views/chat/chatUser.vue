<template>
    <div class="chat-user">
        <div class="tabs">
            <!-- @change="onChangeTab" -->
            <a-tabs v-model:activeKey="activeKey" style="width: 100%;" @change="onChangeTab">
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
            <div v-if="activeKey===1">
                <div class="quick-reply-items">
                    <div v-for="item in quickReplyList" :key="item.id" class="quick-reply-item">
                        <div class="item-content">
                            <h3>{{ item.title }}</h3>
                            <div v-if="item.type === 'text'" class="content">
                                <a-popover>
                                    <template #content>
                                        <div style="max-width:200px;word-break: break-all;">{{  item.content }}</div>
                                    </template>
                                    {{ showText(item.content, 50) }}
                                </a-popover>
                            </div>
                            <img v-else-if="item.type === 'image'" :src="ls.get('cdnDomain') + item.content" alt="快捷回复图片" />
                            <video v-else-if="item.type === 'video'" controls>
                                <source :src="ls.get('cdnDomain') + item.content" type="video/mp4" />
                            </video>
                        </div>
                        <send-outlined @click="sendQuickReply(item)" :rotate="-45" :style="{fontSize: '20px',color: '#599cf8'}"/>
                        <!-- <a-button type="primary" @click="sendQuickReply(item)">发送</a-button> -->
                    </div>
                </div>
                <!-- <ul>
                    <li v-for="item in quickReplyList" :key="item.id">
                        {{ item.title }}  <a-button @click="sendQuickReply(item)" 
                        type="primary" html-type="submit" style="margin-left:80px">发送</a-button>

                    </li>
                </ul> -->
            </div>
        </div>
    </div>
</template>
<script setup>
import { defineProps, toRefs, ref, watch, defineEmits } from 'vue'
import { ChatApi ,MessageApi } from '@/webapi/index'
import { reactive } from 'vue';
import { message } from 'ant-design-vue';
import ls from '@/utils/Storage'
import { SendOutlined } from '@ant-design/icons-vue'
import { showText } from '@/utils/util'


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

const emit = defineEmits(['change','quick-reply'])


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

const quickReplyPage = ref(1)
const quickReplyPageSize = ref(20)
const activeKey = ref(0)
const quickReplyList = ref([])
const quickReplyFinish = ref(false)

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
    let msg
    if (key === 'blockAt') {
        params.updateType = 'block'
        if(blockAt > 0){
            params.block = 2
            toUser.value.user.blockAt = 0
            msg = '已取消拉黑'
        }else{
            params.block = 1
            toUser.value.user.blockAt = Date.now() / 1000 ;
            msg = '已拉黑'
        }
    }
    if(key === 'topAt'){
        params.updateType = 'top'
        if(topAt > 0){
            params.top = 2
            toUser.value.user.topAt = 0; 
            msg = '已取消置顶'
        }else{
            params.top = 1
            toUser.value.user.topAt = Date.now() / 1000 ;
            msg = '已置顶'
        }
    }
    const res = await ChatApi.updateUser(params)
    // TODO 拉黑后,修改list，移除当前粉丝item，反之，添加粉丝item到合适的时间去
    // TODO 置顶后，修改list，当前粉丝item移到最上面，反之，移到粉丝item到合适的时间去
    if(res.code === 200){
        message.success(msg)
        emit('change',JSON.parse(JSON.stringify(params)))
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
        toUser.value.user.remarkName = formState.remarkName
        toUser.value.user.comments = formState.comments
        toUser.value.user.mobile = formState.mobile
        emit('change',params)
    }
}

const onChangeTab = async (e) => {
    if(e === 1){
        if (quickReplyFinish.value) {
            return ;
        }
        let msgList = await MessageApi.getWelcomeList({msgType: 'quick_reply', page: quickReplyPage.value, pageSize: quickReplyPageSize.value})
        if(msgList.code === 200){
            quickReplyList.value = msgList.data.list || []
            quickReplyFinish.value = quickReplyList.value.length < quickReplyPageSize.value
        }
    }
}

const sendQuickReply = async (e) => {

    console.log('sendQuickReply:',e);


    let msg = {msgType: '', content: ''}
    if(e.type === 'text') {
        msg.content = e.content
        msg.msgType = 'text'
    } else if(e.type === 'image') {
        msg.content = `${e.content}`
        msg.msgType = 'image'
    } else if(e.type === 'video') {
        msg.content = `${e.content}`
        msg.msgType = 'video'
    } 
    // 发送出去. 
    console.log('msg:',msg);
    
    emit('quick-reply',msg)
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

.quick-reply-items {
    height: calc(100vh - 53px);
    display: flex;
    flex-direction: column;
    gap: 16px;
    overflow-y: auto;
    padding: 10px;

    .quick-reply-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border: 1px solid #e8e8e8;
      border-radius: 4px;
      padding: 16px;

      .item-content {
        h3 {
          margin-bottom: 8px;
        }

        .content{
            max-width: 150px;
        }

        img {
          max-width: 150px;
          max-height: 200px;
        }

        video {
          max-width: 150px;
          max-height: 200px;
        }
      }
    }
}
</style>