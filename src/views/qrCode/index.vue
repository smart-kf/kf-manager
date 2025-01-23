<!-- 二维码页面 -->
<template>
  <div class="kf-body">
    <a-spin :spinning="state.loading">
      <div class="max-containter">
        <div class="qrcode-top">
          <div class="qrcode">
            <div>
              <div class="qrcode-title">默认二维码</div>
              <div class="qrcode-canvas" id="qrcode">
                <img :src="qrcode.imageUrl" style="width: 200px" alt="" />
              </div>
              <div style="color: #7ec051; font-size: 12px">码正常 12-12 11:23:59</div>
            </div>
          </div>
          <div class="desc">
            <div class="qrcode-title">【使用说明】</div>
            <div>1.失效码：使码永久失效，无法引流</div>
            <div>2.更换码：生成新码，旧码可以继续使用</div>
            <div>3.暂停引新粉：老用户依然可以进入，但新用户不行</div>
            <div>4.点击域名列表，可以切换当前展示的二维码</div>
            <div>5.大家都在使用【多条独立域名分散引流】，以降低资源浪费</div>
            <div>6.谨慎使用换码，因为点击换码后，旧码将不会检测和通知</div>
          </div>
        </div>
        <div style="padding: 16px 0">
          <a-button type="primary" class="green-btn" :icon="h(PlusOutlined)">购买独立域名</a-button>
        </div>
        <div>
          <a-table
            bordered
            :data-source="state.dataSource"
            :columns="columns"
            size="middle"
            :loading="state.tableLoading"
            rowKey="id"
            :row-selection="{ selectedRowKeys: state.selectedRowKeys, type: 'radio', onChange: onSelectChange }"
          >
            <template #bodyCell="{ column, text, record }">
              <template v-if="column.dataIndex === 'status'">
                <span v-if="record.status === 1" style="color: #7ec051">正常</span>
                <span v-if="record.status === 2" style="color: #ff4d4f">微信封禁</span>
                <span v-if="record.status === 3" style="color: #ff4d4f">系统封禁</span>
              </template>
              <template v-if="column.dataIndex === 'operation'">
                <a-space>
                  <a-tooltip title="下载二维码图片">
                    <a-button type="primary" @click="downLoadQrCode" size="small">
                      <template #icon><DownloadOutlined /></template>
                    </a-button>
                  </a-tooltip>
                  <a-tooltip title="复制二维码链接">
                    <a-button type="primary" @click="copyQrcode(record)" size="small">
                      <template #icon><LinkOutlined /></template>
                    </a-button>
                  </a-tooltip>
                  <a-tooltip title="使码永久失效，无法引流">
                    <a-button type="primary" size="small" @click="closeQrcode(record)">失效码</a-button>
                  </a-tooltip>
                  <a-tooltip title="生成新码，旧码可以继续使用">
                    <a-button type="primary" size="small" @click="changeQrcode(record)">更换码</a-button>
                  </a-tooltip>
                  <a-tooltip title="老用户依然可以进入，但新用户不行">
                    <a-button type="primary" size="small">暂停引新粉</a-button>
                  </a-tooltip>
                </a-space>
              </template>
            </template>
          </a-table>
        </div>
      </div>
    </a-spin>
  </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { h, createVNode } from 'vue'
import { PlusOutlined, AuditOutlined, DownloadOutlined, LinkOutlined, ExclamationCircleOutlined } from '@ant-design/icons-vue'
import logo from '@/assets/defaultUser.png'
import QRCode from 'qrcode'
import { message as Message, Modal } from 'ant-design-vue'
import { QrcodeApi } from '@/webapi/index'

const state = reactive({
  dataSource: [],
  editableData: {},
  tableLoading: false,
  loading: false,
  selectItem: {} as any, // 被操作的项
  selectedRowKeys: []
})
const qrcode = reactive({
  status: 'active',
  value: '',
  imageUrl: '',
  icon: logo
})
const qrcodeCanvasRef: any = ref('')

const columns = [
  {
    title: '独立域名',
    key: 'domain',
    dataIndex: 'domain'
  },
  {
    title: '域名状态',
    key: 'status', // 1=正常，2=微信封禁, 3=系统封禁
    dataIndex: 'status',
    width: 250
  },
  {
    title: '操作',
    dataIndex: 'operation',
    width: 400
  }
]

const getQrcodeUrl = (url: string, domain: string) => {
  return window.location.protocol + '//' + domain + url
}

const onSelectChange = (selectedRowKeys, selectedRows) => {
  state.selectedRowKeys = [...selectedRowKeys]
  state.selectItem = { ...selectedRows[0] }
  qrcode.value = getQrcodeUrl(state.selectItem.qrCodeUrl, state.selectItem.domain)
  createQrcode(qrcode.value)
}

const createQrcode = (value) => {
  QRCode.toDataURL(value)
    .then((url) => {
      qrcode.imageUrl = url
    })
    .catch((err) => {
      console.error(err)
    })
}
// 复制二维码
const copyQrcode = (record) => {
  navigator.clipboard
    .writeText(getQrcodeUrl(record.qrCodeUrl, record.domain))
    .then(function () {
      Message.success('已成功复制到剪切板!')
    })
    .catch(function (err) {
      Message.success('无法复制到剪切板!')
    })
}

// 下载二维码
const downLoadQrCode = async () => {
  const url = await qrcodeCanvasRef.value.toDataURL()
  const a = document.createElement('a')
  a.download = 'QRCode.png'
  a.href = url
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

const getQrcodeList = async () => {
  state.tableLoading = true
  let { code, data, message }: any = await QrcodeApi.getQrcode({})
  state.tableLoading = false
  if (code === 200) {
    state.dataSource = data.domains || []
    if (data.domains.length) {
      let firstItem = data.domains[0]
      if (state.selectItem.id) {
        let item = data.domains.find((el) => el.id === state.selectItem.id)
        if (item) {
          onSelectChange([item.id], [item])
        } else {
          onSelectChange([firstItem.id], [firstItem])
        }
      } else {
        onSelectChange([firstItem.id], [firstItem])
      }
    }
  } else {
    Message.error(message || '请求失败')
  }
}
// 使码失效
const offQrcode = async (reocrd: any) => {
  state.loading = true
  let params = {
    id: reocrd.id
  }
  let { code, data, message }: any = await QrcodeApi.getQrcodeOff(params)
  state.loading = false
  if (code === 200) {
    Message.success('操作成功')
    getQrcodeList()
  } else {
    Message.error(message || '请求失败')
  }
}
// 更换码
const switchQrcode = async (reocrd: any) => {
  state.loading = true
  let params = {
    id: reocrd.id
  }
  let { code, data, message }: any = await QrcodeApi.getQrcodeSwitch(params)
  state.loading = false
  if (code === 200) {
    Message.success('操作成功')
    state.selectItem = { ...reocrd }
    getQrcodeList()
  } else {
    Message.error(message || '请求失败')
  }
}

const closeQrcode = (reocrd) => {
  Modal.confirm({
    title: '提示',
    icon: createVNode(ExclamationCircleOutlined),
    content: '失效后无法引流，确定要失效吗？',
    okText: '确认',
    cancelText: '取消',
    onOk() {
      offQrcode(reocrd)
    },
    onCancel() {}
  })
}
const changeQrcode = (reocrd) => {
  Modal.confirm({
    title: '提示',
    icon: createVNode(ExclamationCircleOutlined),
    content: '生成新码，旧码可以继续使用，但不会检测和通知，确定要更换吗？',
    okText: '确认',
    cancelText: '取消',
    onOk() {
      switchQrcode(reocrd)
    },
    onCancel() {}
  })
}

onMounted(() => {
  getQrcodeList()
})
</script>
<style lang="less" scoped>
.qrcode-top {
  display: flex;
  .qrcode {
    width: 400px;
    & > div {
      width: 200px;
      margin-left: 20px;
      text-align: center;
    }
    .qrcode-canvas {
      padding: 12px 0;
    }
  }
  .desc {
    flex: 1;
    min-width: 300px;
    line-height: 28px;
    color: #999;
  }
  .qrcode-title {
    color: #599cf8;
    font-weight: 600;
    font-size: 16px;
  }
}
</style>
