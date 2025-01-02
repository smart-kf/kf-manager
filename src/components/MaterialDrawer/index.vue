<template>
  <a-modal v-model:open="openModal" :title="title" @ok="handleOk">
    <p>Some contents...</p>
    <p>Some contents...</p>
    <p>Some contents...</p>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref, defineProps, onMounted, computed } from 'vue'
import { defineEmits } from 'vue'

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

const handleOk = () => {}

// 初始化信息，数据回显
const initData = () => {}
onMounted(() => {
  initData()
})
</script>

<style lang="less" scoped></style>
