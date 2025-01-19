<!-- 二维码页面 -->
<template>
  <div class="kf-body">
    <div class="qrcode-top">
      <div class="qrcode">
        <div>
          <div class="qrcode-title">默认二维码</div>
          <div class="qrcode-canvas" id="qrcode">
            <a-qrcode ref="qrcodeCanvasRef" error-level="H" :status="qrcode.status" :size="200" :value="qrcode.value" :icon="qrcode.icon" />
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
      <a-table bordered :data-source="state.dataSource" :columns="columns" size="middle" :loading="state.tableLoading">
        <template #bodyCell="{ column, text, record }">
          <template v-if="column.dataIndex === 'status'">
            <span v-if="record.status === 1" style="color: #7ec051">正常</span>
            <span v-if="record.status === 2" style="color: #ff4d4f">停用</span>
          </template>
          <template v-if="column.dataIndex === 'note'">
            <a-input-group compact>
              <a-input v-model:value="record.note" maxlenght="150" placeholder="修改后，请点击保存" style="width: 80%" />
              <a-tooltip title="保存">
                <a-button>
                  <template #icon><AuditOutlined /></template>
                </a-button>
              </a-tooltip>
            </a-input-group>
          </template>
          <template v-if="column.dataIndex === 'operation'">
            <a-space>
              <a-tooltip title="下载二维码图片">
                <a-button type="primary" @click="downLoadQrCode" size="small">
                  <template #icon><DownloadOutlined /></template>
                </a-button>
              </a-tooltip>
              <a-tooltip title="复制二维码链接">
                <a-button type="primary" @click="copyQrcode" size="small">
                  <template #icon><LinkOutlined /></template>
                </a-button>
              </a-tooltip>
              <a-tooltip title="使码永久失效，无法引流">
                <a-button type="primary" size="small" @click="closeQrcode(record)">失效码</a-button>
              </a-tooltip>
              <a-tooltip title="生成新码，旧码可以继续使用">
                <a-button type="primary" size="small">更换码</a-button>
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
</template>
<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { h, createVNode } from 'vue'
import { PlusOutlined, AuditOutlined, DownloadOutlined, LinkOutlined, ExclamationCircleOutlined } from '@ant-design/icons-vue'
import logo from '@/assets/defaultUser.png'
import { message, Modal } from 'ant-design-vue'
import { QrcodeApi } from '@/webapi/index'

const state = reactive({
  dataSource: [],
  editableData: {},
  tableLoading: false
})
const qrcode = reactive({
  status: 'active',
  value: '',
  icon: logo
})
const qrcodeCanvasRef: any = ref('')

const columns = [
  {
    title: '序号',
    key: 'indexNum',
    dataIndex: 'indexNum',
    width: 50
  },
  {
    title: '独立域名',
    key: 'domain',
    dataIndex: 'domain'
  },
  {
    title: '域名状态',
    key: 'status',
    dataIndex: 'status',
    width: 100
  },
  {
    title: '换码时间',
    dataIndex: 'updateTime',
    key: 'updateTime',
    width: 200
  },
  {
    title: '备注',
    dataIndex: 'note',
    key: 'note'
  },
  {
    title: '操作',
    dataIndex: 'operation',
    width: 300
  }
]
// 复制二维码
const copyQrcode = () => {
  navigator.clipboard
    .writeText(qrcode.value)
    .then(function () {
      message.success('已成功复制到剪切板!')
    })
    .catch(function (err) {
      message.success('无法复制到剪切板!')
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
    state.dataSource = (data.domains || []).map((el, index) => {
      el.indexNum = index + 1
      return el
    })
    qrcode.value = data.qrCodeUrl
  } else {
    message.error(message || '请求失败')
  }
}
// 使码失效
const OffQrcode = async (reocrd: any) => {
  // let res = await QrcodeApi.getQrcodeOff()
  console.log('这个接口不行')
}

const closeQrcode = (reocrd) => {
  Modal.confirm({
    title: '提示',
    icon: createVNode(ExclamationCircleOutlined),
    content: '失效后无法引流，确定要失效吗？',
    okText: '确认',
    cancelText: '取消',
    onOk() {
      OffQrcode(reocrd)
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
    width: 50%;
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
