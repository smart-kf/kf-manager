<template>
  <a-modal v-model:open="openModal" :title="title" @ok="handleOk" :maskClosable="false" :centered="true" width="920px" :bodyStyle="{ minHeight: '300px' }">
    <a-tabs v-model:activeKey="state.activeKey" type="card">
      <a-tab-pane key="text" tab="文本回复"></a-tab-pane>
      <a-tab-pane key="image" tab="图片回复"></a-tab-pane>
      <a-tab-pane key="video" tab="视频回复"></a-tab-pane>
    </a-tabs>
    <div v-show="state.activeKey === 'text'" class="tab-body">
      <span class="tip">温馨提示：下载链接需要添加http://或www,无需额外再设置超链接或添加代码！</span>
      <div class="text-body">
        <div class="label">内容:</div>
        <div style="width: 100%">
          <div id="wanged"></div>
        </div>
      </div>
    </div>
    <div v-show="state.activeKey === 'image'" class="tab-body">222</div>
    <div v-show="state.activeKey === 'video'" class="tab-body">222</div>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref, defineProps, onMounted, computed, reactive, watch, nextTick, shallowRef, onBeforeUnmount } from 'vue'
import E from 'wangeditor'
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
  activeKey: 'text'
})

const handleOk = () => {}

const initEditor = () => {
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
      editorEl.value.config.height = 180
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

// 初始化信息，数据回显
const initData = () => {}
onMounted(() => {
  initData()
})
</script>

<style lang="less" scoped>
.tip {
  color: #666;
  font-size: 12px;
}
.text-body {
  display: flex;
  padding-top: 8px;
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
}
</style>
