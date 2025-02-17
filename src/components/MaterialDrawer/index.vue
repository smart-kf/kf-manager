<template>
  <a-modal v-model:visible="openModal" :title="title" @ok="handleOk" :confirmLoading="state.loading" :maskClosable="false" :centered="true" width="920px" :bodyStyle="{ minHeight: '400px' }">
    <a-tabs v-model:activeKey="state.activeKey" type="card">
      <a-tab-pane key="text" tab="文本回复"></a-tab-pane>
      <a-tab-pane key="image" tab="图片回复"></a-tab-pane>
      <a-tab-pane key="video" tab="视频回复"></a-tab-pane>
    </a-tabs>
    <div v-show="state.activeKey === 'text'" class="tab-body">
      <div class="title-body" v-if="showTitle()">
        <div class="label">标题:</div>
        <div style="width: 100%">
          <a-input type="text" placeholder="请输入标题" allowClear :maxlength="150" show-count v-model:value="state.title"> </a-input>
        </div>
      </div>
      <div class="title-body" v-if="showKeywords()">
        <div class="label">关键词:</div>
        <div style="width: 100%">
          <a-input type="text" placeholder="请输入关键词" allowClear :maxlength="150" show-count v-model:value="state.keyword"> </a-input>
        </div>
      </div>
      <!-- <span class="tip">温馨提示：下载链接需要添加http://或www,无需额外再设置超链接或添加代码！</span> -->
      <div class="text-body">
        <div class="label">内容:</div>
        <div style="width: 100%">
          <div style="border: 1px solid #ccc; min-width: 365px; max-width: 100%">
            <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig" mode="simple" />
            <Editor style="height: 225px; overflow-y: hidden" v-model="state.content" :defaultConfig="editorConfig" @custom-paste="customPaste" mode="simple" @onCreated="handleCreated" />
          </div>
        </div>
      </div>
    </div>
    <div v-show="state.activeKey === 'image'" class="tab-body">
      <div class="title-body" v-if="showTitle()">
        <div class="label">标题:</div>
        <div style="width: 100%">
          <a-input type="text" placeholder="请输入标题" allowClear :maxlength="150" show-count v-model:value="state.title"> </a-input>
        </div>
      </div>
      <div class="title-body" v-if="showKeywords()">
        <div class="label">关键词:</div>
        <div style="width: 100%">
          <a-input type="text" placeholder="请输入关键词" allowClear :maxlength="150" show-count v-model:value="state.keyword"> </a-input>
        </div>
      </div>
      <div :class="props.isAi ? 'img-body  ai-upload' : 'img-body'">
        <div>
          <a-upload-dragger
            v-model:file-list="state.fileList"
            :accept="state.imgAccept"
            :before-upload="beforeImgUpload"
            :action="state.action"
            :headers="state.headers"
            :data="{
              fileType: 'image'
            }"
            list-type="picture"
            :max-count="1"
            @change="handleChange"
          >
            <div>
              <CloudUploadOutlined style="font-size: 30px; color: #666" />
              <div style="margin-top: 8px">点击上传</div>
            </div>
          </a-upload-dragger>
        </div>
        <div class="img-tip">只能上传jpg/png文件，且不能超过{{ state.imgMaxSize }}M</div>
      </div>
    </div>
    <div v-show="state.activeKey === 'video'" class="tab-body">
      <div class="title-body" v-if="showTitle()">
        <div class="label">标题:</div>
        <div style="width: 100%">
          <a-input type="text" placeholder="请输入标题" allowClear :maxlength="150" show-count v-model:value="state.title"> </a-input>
        </div>
      </div>
      <div class="title-body" v-if="showKeywords()">
        <div class="label">关键词:</div>
        <div style="width: 100%">
          <a-input type="text" placeholder="请输入关键词" allowClear :maxlength="150" show-count v-model:value="state.keyword"> </a-input>
        </div>
      </div>
      <div :class="props.isAi ? 'img-body  ai-upload' : 'img-body'">
        <div>
          <a-upload-dragger
            v-model:file-list="state.videoList"
            :accept="state.videoAccept"
            :before-upload="beforeVideoUpload"
            :action="state.action"
            :headers="state.headers"
            :data="{
              fileType: 'video'
            }"
            list-type="picture"
            :max-count="1"
            @change="handleChange"
          >
            <div v-if="state.videoList.length < 1">
              <CloudUploadOutlined style="font-size: 30px; color: #666" />
              <div style="margin-top: 8px">点击上传</div>
            </div>
          </a-upload-dragger>
        </div>
        <div class="img-tip">支持avi，wmv，flv，mp4格式文件，不能超过{{ state.videoMaxSize }}M</div>
      </div>
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref, defineProps, onMounted, computed, reactive, watch, nextTick, shallowRef, onBeforeUnmount } from 'vue'
import { CloudUploadOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import '@wangeditor/editor/dist/css/style.css'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { IDomEditor } from '@wangeditor/editor'
import { message as Message } from 'ant-design-vue'
import { MessageApi } from '@/webapi/index'
import ls from '@/utils/Storage'

const emits = defineEmits(['update:modelValue', 'refesh'])

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: true
  },
  title: {
    type: String,
    default: '添加欢迎语'
  },
  isAi: {
    // 是否是智能欢迎语
    type: Boolean,
    default: false
  },
  msgType: {
    type: String,
    default: 'welcome_msg' // =quick_reply, 欢迎语=welcome_msg, 智能回复=smart_msg
  },
  actionType: {
    type: String,
    default: 'add' // edit
  },
  editData: {
    type: Object,
    default: () => {}
  }
})
const openModal = computed({
  get: () => {
    return props.modelValue
  },
  set: (val) => {
    emits('update:modelValue', val)
  }
})
watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      initEditor()
    }
  }
)

const editorRef = shallowRef()
// 编辑器配置项
const editorConfig: any = {
  placeholder: '请输入内容...', //初始的提示内容
  maxLength: 255
}
// 编辑器工具栏
const toolbarConfig = {
  toolbarKeys: [
    'emotion' // 标题选择
  ]
}
// 自定义编辑器复制，只能复制纯文本
const customPaste = (editor: IDomEditor, event: ClipboardEvent): boolean => {
  const text = event.clipboardData.getData('text/plain') // 获取粘贴的纯文本
  // 同步
  editor.insertText(text)

  // 阻止默认的粘贴行为
  event.preventDefault()
  return false
}

const state = reactive({
  content: '',
  activeKey: 'text',
  loading: false,
  formData: {},
  title: '',
  keyword: '',
  fileList: [] as any,
  videoList: [] as any,
  action: window.location.origin + '/api/kf-be/upload',
  previewVideo: '',
  previewImage: '',
  headers: {
    Authorization: ls.get('token')
  },
  imgAccept: 'image/png,image/jpg,image/jpeg',
  videoAccept: 'video/*',
  imgMaxSize: 5, // 图片最大size 5M
  videoMaxSize: 10, // 视频最大size 10m
  previewVisible: false // 图片预览弹窗
})

// 重置数据
const resetData = () => {
  state.title = ''
  state.content = ''
  state.activeKey = 'text'
  state.formData = {}
  state.fileList = []
  state.videoList = []
  state.previewVideo = ''
  state.previewImage = ''
}
// 数据回显
const initEditor = () => {
  resetData()
  if (props.actionType === 'edit') {
    state.title = props.isAi ? props.editData.title : ''
    state.activeKey = props.editData.contentType
    if (props.editData.type === 'text') {
      state.activeKey = 'text'
    }
    if (props.editData.type === 'video') {
      state.activeKey = 'video'
      state.videoList = [{ name: '视频', thumbUrl: props.editData.content }]
      // 显示预览视频
    }
    if (props.editData.type === 'image') {
      state.activeKey = 'image'
      state.fileList = [{ name: '图片', thumbUrl: props.editData.content }]
      // 显示预览视频
    }
  }
}

const showTitle = () => {
  return props.msgType === 'quick_reply' || props.msgType === 'smart_msg'
}
const showKeywords = () => {
  return props.msgType === 'smart_msg'
}

// 初始化
const handleCreated = (editor) => {
  editorRef.value = editor // 记录 editor 实例，重要！
  editorRef.value.setHtml(state.content || props.editData.content || '')
}

const handleOk = async () => {
  // 校验
  let params: any = {
    msgType: props.msgType,
    enable: true,
    type: state.activeKey
  }
  if (showTitle() && !state.title) {
    Message.error('标题不能为空')
    return
  }
  if (showKeywords() && !state.keyword) {
    Message.error('关键词不能为空')
    return
  }

  if (state.activeKey === 'text') {
    let text = editorRef.value.getText()
    if (!text) {
      Message.error('回复内容不能为空')
      return
    } else {
      params.content = text
    }
  }
  if (state.activeKey === 'video') {
    if (!state.videoList.length) {
      Message.error('回复内容不能为空')
      return
    } else {
      params.content = state.previewVideo
    }
  }
  if (state.activeKey === 'image') {
    if (!state.fileList.length) {
      Message.error('回复内容不能为空')
      return
    } else {
      params.content = state.previewImage
    }
  }

  if (props.editData.id) {
    params.id = props.editData.id
    params.sort = props.editData.sort
  }
  if (showTitle()) {
    params.title = state.title
  }
  if (showKeywords()) {
    params.keyword = state.keyword
  }
  state.loading = true
  let { code, message }: any = await MessageApi.updateWelcome(params)
  state.loading = false
  if (code === 200) {
    Message.success(params.id ? '更新成功！' : '新增成功')
    emits('refesh')
    emits('update:modelValue', false)
  } else {
    Message.error(message || '请求失败')
  }
}

// 图片上传校验
const beforeImgUpload = (file) => {
  let isImg = state.imgAccept.indexOf(file.type) !== -1
  if (!isImg) {
    Message.error(`只支持png/jpg格式`)
    return false
  }
  if (file.size > 1024 * 1024 * state.imgMaxSize) {
    Message.error(`文件最大不能超过${state.imgMaxSize}M`)
    return false
  }
  return true
}

// 视频上传校验
const beforeVideoUpload = (file) => {
  let isVideo = file.type.indexOf('video') !== -1
  if (!isVideo) {
    Message.error(`只支持avi，wmv，flv，mp4格式文件`)
    return false
  }
  if (file.size > 1024 * 1024 * state.videoMaxSize) {
    Message.error(`文件最大不能超过${state.videoMaxSize}M`)
    return false
  }
  return true
}

const handleChange = (info: any) => {
  const status = info.file.status
  if (status !== 'uploading') {
    if (info.fileList.length) {
      const { data } = info.file.response
      let url = data.cdnHost + data.path
      if (state.activeKey === 'image') {
        state.previewImage = url
      } else {
        state.previewVideo = url
      }
    } else {
      state.previewImage = ''
    }
  }
  if (status === 'done') {
    Message.success(`${info.file.name} 上传成功`)
  } else if (status === 'error') {
    Message.error(`${info.file.name} 上传失败`)
  }
}

onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy() // 销毁 editor 实例
})

// 预览图片
const handlePreview = () => {}
</script>

<style lang="less" scoped>
.tip {
  color: #666;
  font-size: 12px;
}
.text-body {
  display: flex;
  padding-top: 8px;
}
.title-body {
  display: flex;
  padding-bottom: 8px;
}
.label {
  width: 65px;
  &::before {
    display: inline-block;
    margin-inline-end: 4px;
    color: #ff4d4f;
    font-size: 14px;
    font-family: SimSun, sans-serif;
    line-height: 1;
    content: '*';
  }
}

.img-body {
  width: 400px;
  .img-tip {
    color: #666;
    padding-top: 12px;
    font-size: 12px;
  }
  .upload-dragger {
    display: none !important;
  }
}
.ai-upload {
  margin-left: 60px;
}
</style>
