<template>
  <a-sub-menu v-if="menu.children && !menu.hideChildrenInMenu" :key="menu.path" popupClassName="popupSubMenu">
    <template #icon>
      <SvgIcon :name="menu.meta.icon" v-if="menu.meta.icon" />
    </template>
    <template #title>{{ menu.meta.title }}</template>
    <template v-if="!menu.hideChildrenInMenu">
      <template v-for="sub in menu.children">
        <!-- 递归组件 -->
        <RenderSubMenu :menu="sub" />
      </template>
    </template>
  </a-sub-menu>
  <!-- renderMenuItem -->
  <a-menu-item :key="menu.path" v-else-if="!menu.meta.hidden">
    <template #title>{{ menu.meta.title }}</template>
    <router-link :to="filterParams(menu.path)">
      <div class="menu-title">
        <IconFont :name="menu.meta.icon" size="20"></IconFont>
        <span>{{ menu.meta.title }}</span>
      </div>
    </router-link>
  </a-menu-item>
</template>
<script lang="ts" setup name="RenderSubMenu">
import SvgIcon from '@/components/SvgIcon/index.vue'

const props = defineProps(['menu'])

// info:todo:貌似没用
if (props.menu.children && props.menu.hideChildrenInMenu) {
  // 把有子菜单的 并且 父菜单是要隐藏子菜单的
  // 都给子菜单增加一个 hidden 属性
  // 用来给刷新页面时， selectedKeys 做控制用
  props.menu.children.forEach((item) => {
    item.meta = Object.assign(item.meta, { hidden: true })
  })
}

// info:todo:目前没有发现需要入口带参数的情况,一般这种跳转的都是二级页面,是从其他页面跳转过来的,不需要显示在菜单中,目前菜单中是这种路径的,点击也会报404,因为没有对:pageNo([1-9]\\d*)?进行翻译,直接当做了路径去匹配,目前做法是去掉后面的参数
const filterParams = (menu) => {
  return menu.indexOf('/:') > 0 ? menu.split('/:')[0] : menu
}
</script>
<style lang="less" scoped>
.menu-title {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  span:last-child {
    font-size: 12px;
    font-weight: normal;
    padding-top: 2px;
    opacity: 1;
    margin-inline-start: 0;
  }
}
</style>
