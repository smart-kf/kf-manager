<!-- 二维码页面 -->
<template>
    <div class="kf-body">
    <a-table
            bordered
            :data-source="domainOrderState.list"
            :columns="domainColumns"
            size="middle"
            :loading="domainOrderState.tableLoading"
            rowKey="orderNo"
            :pagination="false"
        >
            <template #bodyCell="{ column, text, record }">
                <template v-if="column.dataIndex === 'status'">
                <a-tag v-if="record.status === 1" color="gray">已创建</a-tag>
                <a-tag v-if="record.status === 2" color="#87d068">已支付</a-tag>
                <a-tag v-if="record.status === 3" color="red">已取消</a-tag>
            </template>
            <template v-if="['tradeId', 'fromAddress', 'toAddress'].includes(column.dataIndex)">
                <a-popover>
                    <template #content>
                    <span>{{ text }}</span>
                    </template>
                    <span class="trim-text">{{ text }}</span>
                </a-popover>
            </template>
            <template v-if="column.dataIndex === 'operation'">
                <a-space>
                    <span class="table-link-action" @click="pay(record)" v-if="record.status === 1">支付</span>
                </a-space>
                </template>
            </template>
        </a-table>
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
  import dayjs from 'dayjs'
  
  // 域名订单
  const domainOrderState = reactive({
    list: [],
    tableLoading: false,
  })
  const domainColumns = [
  {
      title: '订单号',
      key: 'orderNo',
      dataIndex: 'orderNo'
    },
    ,
    {
      title: '域名',
      key: 'domain',
      dataIndex: 'domain'
    },
    {
      title: '支付id',
      key: 'tradeId',
      dataIndex: 'tradeId'
    },
    {
      title: '支付地址',
      key: 'fromAddress',
      dataIndex: 'fromAddress'
    },
    {
      title: '价格',
      key: 'price',
      dataIndex: 'price'
    },
    {
      title: '订单过期时间',
      key: 'expire_time',
      dataIndex: 'expire_time'
    },
    {
      title: '接收地址',
      key: 'toAddress',
      dataIndex: 'toAddress'
    },
    {
      title: '状态',
      key: 'status',
      dataIndex: 'status'
    },
    {
      title: '区块链确定时间',
      key: 'confirmTime',
      dataIndex: 'confirmTime'
    },
    {
        title: '操作',
        key: 'operation',
        dataIndex: 'operation',
    }
  ]
 
  const pay = (row) => {
    window.open(row.payUrl)
  }
  const getDomainOrderList = () => {
    domainOrderState.tableLoading = true 
    QrcodeApi.domainOrderList().then(res => {
      if(res.code === 200) {
        domainOrderState.list = (res.data.list || []).map(el => {
          if(el.expire_time === 0 ) {
            el.expire_time = '-'
          } else {
            el.expire_time = dayjs(el.expire_time*1000).format('YYYY-MM-DD HH:mm:ss')
          }
          if(el.confirmTime === 0) {
            el.confirmTime = '-'
          } else {
            el.confirmTime = dayjs(el.confirmTime*1000).format('YYYY-MM-DD HH:mm:ss')
          }
          el.price = el.price / 1e6 + 'USDT'
          return el
        })
  
        console.log(res)
      }
      domainOrderState.tableLoading = false 
    })
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

  // 最多显示 200宽度，多余的用省略号显示
  .trim-text{
    display: inline-block;
    width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  </style>
  