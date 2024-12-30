<template>
  <div id="userLayout" :class="['user-layout-wrapper']">
    <div class="container">
      <div class="user-layout-content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="UserLayout">
import { onMounted, onBeforeUnmount } from 'vue'

onMounted(() => {
  document.body.classList.add('userLayout')
})
onBeforeUnmount(() => {
  document.body.classList.remove('userLayout')
})
</script>

<style lang="less" scoped>
#userLayout.user-layout-wrapper {
  height: 100%;
  .container {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url('@/assets/login-bg.jpeg');
    background-size: 100% 100%;

    a {
      text-decoration: none;
    }
  }
}
</style>
