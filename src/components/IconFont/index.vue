<template>
  <i :class="className" :style="{ color: color, fontSize: fontSize }"> </i>
</template>

<script lang="ts" setup name="SvgIcon">
// 注意svg文件的<svg> 标签上必须有 fill="currentColor" 字段,这样才能从外部的span等标签复制颜色,否则颜色不可变
import { computed } from 'vue'

const props = defineProps({
  prefix: {
    type: String,
    default: 'iconfont'
  },
  name: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: ''
  },
  size: {
    type: [Number, String],
    default: 16
  }
})
const className = computed(() => `${props.prefix} ${props.name}`)
const fontSize = computed(() => (Number.isNaN(props.size) ? '14px' : Number(props.size) + 'px'))
</script>
