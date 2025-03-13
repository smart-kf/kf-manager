<template>
  <a-popover>
    <template #content>
      <div style="max-width: 300px; word-break: break-all">{{ props.text }}</div>
    </template>
    {{ showText(props.text) }}
  </a-popover>
</template>

<script lang="ts" setup name="HeaderNotice">
import { ref } from 'vue'
import { showText } from '@/utils/util'

const props = defineProps({
  text: {
    type: String,
    default: ''
  }
})
</script>

<style lang="less" scoped></style>
