<template>
  <a-image v-if="mediaType === 'image'" style="height: 100%; object-fit: cover" :width="props.videoW" :height="props.videoH" :src="getMediaSrc()" :fallback="failImg" />
  <div v-else>
    <div class="previewBox" :style="getComputedStyle()">
      <div class="mask" @click="previewVideo"></div>
      <span class="play">
        <SvgIcon name="player" width="30px" height="30px" />
      </span>
    </div>
    <a-modal
      v-model:visible="state.showDia"
      :footer="null"
      :title="null"
      :width="750"
      :maskClosable="false"
      :bodyStyle="{
        padding: '30px 0 0 0'
      }"
    >
      <video width="750" height="480" :src="state.videoUrl" controls>Your browser does not support the video tag.</video>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { getCdnDomain } from '@/utils/Storage'
import failImg from '@/assets/failImg.png'
import SvgIcon from '@/components/SvgIcon/index.vue'

const props = defineProps({
  mediaType: {
    type: String,
    default: 'image' // image ro video
  },
  needPrefix: {
    type: Boolean,
    default: true
  },
  url: {
    type: String,
    default: ''
  },
  videoW: {
    type: Number,
    default: 120
  },
  videoH: {
    type: Number,
    default: 60
  }
})
const state = reactive({
  showDia: false,
  videoUrl: ''
})

const getMediaSrc = () => {
  return props.needPrefix ? getCdnDomain() + props.url : props.url
}

const getComputedStyle = () => {
  return {
    height: Number(props.videoH) + 'px',
    width: Number(props.videoW) + 'px'
  }
}

const previewVideo = () => {
  state.videoUrl = getMediaSrc()
  state.showDia = true
}
</script>

<style lang="less" scoped>
.previewBox {
  cursor: pointer;
  margin: auto;
  position: relative;
}
.mask {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
}
.mask:hover {
  background: rgba(0, 0, 0, 0.4);
}

.play {
  pointer-events: none;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.image-box {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
