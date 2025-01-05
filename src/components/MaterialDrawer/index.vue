<template>
  <a-modal v-model:open="openModal" :title="title" @ok="handleOk" :maskClosable="false" :centered="true" width="920px" :bodyStyle="{ minHeight: '300px' }">
    <a-tabs v-model:activeKey="state.activeKey" type="card">
      <a-tab-pane key="text" tab="文本回复"></a-tab-pane>
      <a-tab-pane key="image" tab="图片回复"></a-tab-pane>
      <a-tab-pane key="video" tab="视频回复"></a-tab-pane>
    </a-tabs>
    <div v-show="state.activeKey === 'text'" class="tab-body">
      <div class="title-body" v-if="props.isAi">
        <div class="label">标题:</div>
        <div style="width: 100%">
          <a-input type="text" placeholder="请输入标题" allowClear :maxlength="150" show-count v-model:value="state.title"> </a-input>
        </div>
      </div>
      <span class="tip">温馨提示：下载链接需要添加http://或www,无需额外再设置超链接或添加代码！</span>
      <div class="text-body">
        <div class="label">内容:</div>
        <div style="width: 100%">
          <div id="wanged"></div>
        </div>
      </div>
    </div>
    <div v-show="state.activeKey === 'image'" class="tab-body">
      <div class="title-body" v-if="props.isAi">
        <div class="label">标题:</div>
        <div style="width: 100%">
          <a-input type="text" placeholder="请输入标题" allowClear :maxlength="150" show-count v-model:value="state.title"> </a-input>
        </div>
      </div>
      <div class="img-body">
        <div>
          <a-upload-dragger
            v-model:file-list="state.fileList"
            :accept="state.imgAccept"
            :before-upload="beforeImgUpload"
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            list-type="picture-card"
            :max-count="1"
            @preview="handlePreview"
          >
            <div v-if="state.fileList.length < 1">
              <CloudUploadOutlined style="font-size: 30px; color: #666" />
              <div style="margin-top: 8px">将文件拖拽到此处，或点击上传</div>
            </div>
          </a-upload-dragger>
        </div>
        <div class="img-tip">只能上传jpg/png文件，且不能超过{{ state.imgMaxSize }}M</div>
        <a-modal :open="state.previewVisible" :title="state.previewTitle" :footer="null" @cancel="state.previewVisible = false">
          <img alt="example" style="width: 100%" :src="state.previewImage" />
        </a-modal>
      </div>
    </div>
    <div v-show="state.activeKey === 'video'" class="tab-body">
      <div class="title-body" v-if="props.isAi">
        <div class="label">标题:</div>
        <div style="width: 100%">
          <a-input type="text" placeholder="请输入标题" allowClear :maxlength="150" show-count v-model:value="state.title"> </a-input>
        </div>
      </div>
      <div class="img-body">
        <div>
          <a-upload-dragger
            v-model:file-list="state.fileList"
            :accept="state.videoAccept"
            :before-upload="beforeVideoUpload"
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            list-type="picture-card"
            :max-count="1"
            @preview="handlePreview"
          >
            <div v-if="state.fileList.length < 1">
              <CloudUploadOutlined style="font-size: 30px; color: #666" />
              <div style="margin-top: 8px">将文件拖拽到此处，或点击上传</div>
            </div>
          </a-upload-dragger>
        </div>
        <div class="img-tip">支持avi，wmv，flv，mp4格式文件，不能超过{{ state.videoMaxSize }}M</div>
        <a-modal :open="state.previewVisible" :title="state.previewTitle" :footer="null" @cancel="state.previewVisible = false">
          <img alt="example" style="width: 100%" :src="state.previewImage" />
        </a-modal>
      </div>
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref, defineProps, onMounted, computed, reactive, watch, nextTick, shallowRef, onBeforeUnmount } from 'vue'
import { CloudUploadOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import E from 'wangeditor'
import { message } from 'ant-design-vue'
const emits = defineEmits(['update:modelValue'])

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

const editorEl: any = ref('')

const state = reactive({
  activeKey: 'text',
  formData: {},
  title: '',
  fileList: [] as any,
  videoList: [] as any,
  previewTitle: '',
  previewImage: '',
  imgAccept: 'image/png,image/jpg,image/jpeg',
  videoAccept: 'video/*',
  imgMaxSize: 5, // 图片最大size 5M
  videoMaxSize: 10, // 视频最大size 10m
  previewVisible: false // 图片预览弹窗
})

const handleOk = () => {}

// 重置数据
const resetData = () => {
  state.title = ''
  state.activeKey = 'text'
  state.formData = {}
  state.fileList = []
  state.videoList = []
  state.previewTitle = ''
  state.previewImage = ''
}
// 数据回显
const initEditor = () => {
  resetData()
  if (props.actionType === 'edit') {
    state.title = props.isAi ? props.editData.title : ''
    state.activeKey = props.editData.contentType
    if (state.activeKey === 'image') {
      // 显示预览图片
    }
    if (state.activeKey === 'video') {
      // 显示预览视频
    }
  }
  nextTick(() => {
    if (!editorEl.value) {
      editorEl.value = new E(document.getElementById('wanged'))
      editorEl.value.config.menus = [
        //自定义菜单
        'bold', //粗体
        'italic', //斜体
        'underline', //下划线
        'strikeThrough', //删除线
        'fontSize',
        'fontName',
        'lineHeight',
        'foreColor',
        'backColor',
        'link', // 插入链接
        'list', // 列表
        'justify', //对齐方式
        'quote', //引用
        'emoticon', //表情
        'undo', //撤销
        'redo' //重复
      ]
      editorEl.value.config.height = 170
      editorEl.value.config.showFullScreen = false
      editorEl.value.create()
    }
    if (props.actionType === 'edit' && props.editData.contentType === 'text') {
      editorEl.value.txt.html(props.editData.content)
    } else {
      editorEl.value.txt.html('')
    }
  })
}

// 图片上传校验
const beforeImgUpload = (file) => {
  let isImg = state.imgAccept.indexOf(file.type) !== -1
  if (!isImg) {
    message.error(`只支持png/jpg格式`)
    return false
  }
  if (file.size > 1024 * 1024 * state.imgMaxSize) {
    message.error(`文件最大不能超过${state.imgMaxSize}M`)
    return false
  }
  return true
}

// 视频上传校验
const beforeVideoUpload = (file) => {
  let isVideo = file.type.indexOf('video') !== -1
  if (!isVideo) {
    message.error(`只支持avi，wmv，flv，mp4格式文件`)
    return false
  }
  if (file.size > 1024 * 1024 * state.videoMaxSize) {
    message.error(`文件最大不能超过${state.videoMaxSize}M`)
    return false
  }
  return true
}

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
  width: 60px;
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
}
</style>
