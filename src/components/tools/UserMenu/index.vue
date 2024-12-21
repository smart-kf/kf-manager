<template>
  <div class="user-wrapper">
    <div class="content-box">
      <a-dropdown>
        <span class="action ant-dropdown-link user-dropdown-menu">
          <a-avatar class="avatar" size="small" :src="UserInfo.avatar" />
          <span class="nickname">{{ UserInfo.name }}</span>
        </span>
        <template #overlay>
          <a-menu class="user-dropdown-menu-wrapper">
            <a-menu-item key="4" @click="showSystemSetting">
              <a>
                <SettingOutlined />
                <span>{{ $t('tools.userMenu.systemConfig') }}</span>
              </a>
            </a-menu-item>
            <a-menu-item key="5" @click="onLockScreen">
              <a>
                <LockOutlined />
                <span>{{ $t('tools.userMenu.lockScreen') }}</span>
              </a>
            </a-menu-item>

            <a-menu-divider />
            <a-menu-item key="3">
              <a href="javascript:;" @click="handleLogout">
                <LogoutOutlined />
                <span>{{ $t('tools.userMenu.logout') }}</span>
              </a>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
  </div>
</template>

<script lang="ts" setup name="UserMenu">
import NoticeIcon from '@/components/NoticeIcon/index.vue'
import { logout } from '@/views/user/service'
import { USER_INFO } from '@/store/mutation-types'
import { Modal } from 'ant-design-vue'
import { QuestionCircleOutlined, SettingOutlined, LogoutOutlined, LockOutlined } from '@ant-design/icons-vue'
import { useI18n } from 'vue-i18n'
import { systemConfig } from '@/store/reactiveState'
import ls from '@/utils/Storage'
import { useRouter } from 'vue-router'
import { clearUserInfo } from '@/utils/util'

const props = defineProps(['theme'])
const { t } = useI18n()
const router = useRouter()
const UserInfo = ls.get(USER_INFO)
const handleLogout = () => {
  Modal.confirm({
    title: t('tools.userMenu.tip'),
    content: t('tools.userMenu.checkLogout'),
    onOk: () => {
      logout().then((res) => {
        clearUserInfo()
        router.push({ path: '/user/login' })
      })
    },
    onCancel() {}
  })
}
const showSystemSetting = () => {
  systemConfig.commit('SET_SETTING_DRAWER', true)
}

const onLockScreen = () => {
  systemConfig.commit('SET_LOCK_SCREEN', true)
}
</script>
<style lang="less">
.user-dropdown-menu-wrapper {
  .ant-dropdown-menu-item {
    width: 100% !important;
  }
}
</style>
