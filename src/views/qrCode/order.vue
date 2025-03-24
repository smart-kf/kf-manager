<!-- 二维码页面 -->
<template>
  <div class="kf-body">
    <div class="top-action">
      <a-button @click="onBack" type="primary"
        ><template #icon><LeftOutlined /></template>返回
      </a-button>
      <a-button type="primary" @click="onRefesh" shape="circle" title="刷新"
        ><template #icon><ReloadOutlined /></template
      ></a-button>
    </div>
    <a-table bordered :data-source="domainOrderState.list" :loading="domainOrderState.tableLoading" :columns="domainColumns" size="middle" :scroll="{ x: 1200, y: tableHight }" :pagination="false">
      <template #bodyCell="{ column, text, record }">
        <template v-if="column.dataIndex === 'status'">
          <a-tag v-if="record.status === 1">创建</a-tag>
          <a-tag v-if="record.status === 2" color="green">已支付</a-tag>
          <a-tag v-if="record.status === 3" color="red">已取消</a-tag>
        </template>
        <template v-if="['tradeId', 'fromAddress', 'toAddress'].includes(column.dataIndex)">
          <TextTip :text="record[column.dataIndex]" />
        </template>
        <template v-if="column.dataIndex === 'operation'">
          <a-space>
            <span class="table-link-action" @click="pay(record)" v-if="record.status === 1">去支付</span>
            <span else>-</span>
          </a-space>
        </template>
      </template>
    </a-table>
  </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { message as Message, Modal } from 'ant-design-vue'
import { ReloadOutlined, LeftOutlined } from '@ant-design/icons-vue'
import { QrcodeApi } from '@/webapi/index'
import TextTip from '@/components/TextTip/index.vue'
import dayjs from 'dayjs'
import { useRouter } from 'vue-router'
const router = useRouter()

const tableHight = computed(() => {
  return window.innerHeight - 140
})
// 域名订单
const domainOrderState = reactive({
  list: [],
  tableLoading: false
})
const domainColumns = [
  {
    title: '订单号',
    key: 'orderNo',
    fixed: 'left',
    dataIndex: 'orderNo',
    width: 200
  },
  ,
  {
    title: '域名',
    key: 'domain',
    dataIndex: 'domain',
    width: 200
  },
  {
    title: '支付ID',
    key: 'tradeId',
    dataIndex: 'tradeId',
    width: 200
  },
  {
    title: '支付地址',
    key: 'fromAddress',
    dataIndex: 'fromAddress',
    width: 200
  },
  {
    title: '价格',
    key: 'price',
    dataIndex: 'price',
    width: 100
  },
  {
    title: '订单过期时间',
    key: 'expire_time',
    dataIndex: 'expire_time',
    width: 200
  },
  {
    title: '接收地址',
    key: 'toAddress',
    dataIndex: 'toAddress',
    width: 200
  },
  {
    title: '状态',
    key: 'status',
    dataIndex: 'status',
    width: 100
  },
  {
    title: '区块链确定时间',
    key: 'confirmTime',
    dataIndex: 'confirmTime',
    width: 200
  },
  {
    title: '操作',
    align: 'center',
    fixed: 'right',
    dataIndex: 'operation',
    width: 100
  }
]

const pay = (row) => {
  window.open(row.payUrl)
}
const getDomainOrderList = () => {
  domainOrderState.tableLoading = true
  QrcodeApi.domainOrderList({}).then((res: any) => {
    if (res.code === 200) {
      domainOrderState.list = (res.data.list || []).map((el) => {
        el.expire_time = el.expire_time === 0 ? '-' : dayjs(el.expire_time * 1000).format('YYYY-MM-DD HH:mm:ss')
        el.confirmTime = el.confirmTime === 0 ? '-' : dayjs(el.confirmTime * 1000).format('YYYY-MM-DD HH:mm:ss')
        el.price = el.price / 1e6 + 'USDT'
        el.toAddress = el.toAddress || '-'
        el.domain = el.domain || '-'
        return el
      })
    }
    domainOrderState.tableLoading = false
  })
}

const onBack = () => {
  router.go(-1)
}
const onRefesh = () => {
  getDomainOrderList()
}

onMounted(() => {
  getDomainOrderList()
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

.top-action {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 12px;
}
</style>
