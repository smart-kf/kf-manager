<!-- 二维码页面 -->
<template>
  <div class="kf-body">
    <div>
      <a-form :model="searchParams" class="search-form">
        <a-form-item label="操作类型">
          <a-input v-model:value="searchParams.function" placeholder="请输入" allowClear />
        </a-form-item>

        <a-form-item label="创建时间">
          <a-range-picker v-model:value="searchParams.time" />
        </a-form-item>
        <a-form-item>
          <a-space>
            <a-button @click="onReset">重置</a-button>
            <a-button type="primary" @click="onSearch">查询</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </div>
    <a-table bordered :data-source="state.dataSource" :loading="state.loading" :columns="columns" size="middle" :scroll="{ x: 'max-content' }" :pagination="false"> </a-table>
    <a-pagination
      size="small"
      v-model:current="searchParams.page"
      :defaultPageSize="20"
      :total="state.total"
      @change="onPageChange"
      show-size-changer
      show-quick-jumper
      :show-total="(total) => `共 ${total} 条`"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted, reactive } from 'vue'
import { message as Message } from 'ant-design-vue'
import { SystemApi } from '@/webapi/index'
import dayjs from 'dayjs'

const state = reactive({
  dataSource: [],
  editableData: {},
  editData: {} as any,
  actionType: 'add',
  showDia: false,
  loading: false,
  showStatusDia: false,
  total: 0
})

const searchParams = reactive({
  page: 1,
  pageSize: 20,
  function: '',
  time: []
})

const columns = [
  {
    title: '操作类型',
    key: 'function',
    align: 'center',
    ellipsis: true,
    dataIndex: 'function',
    width: 100
  },
  {
    title: '内容',
    key: 'content',
    align: 'center',
    ellipsis: true,
    dataIndex: 'content',
    width: 200
  },
  {
    title: 'ip',
    align: 'center',
    dataIndex: 'ip',
    key: 'ip',
    width: 100
  },

  {
    title: '创建时间',
    align: 'center',
    dataIndex: 'createTimeText',
    key: 'createTimeText',
    width: 120
  }
]

const onReset = () => {
  searchParams.page = 1
  searchParams.pageSize = 20
  searchParams.time = []
  searchParams.function = ''
  getTableList()
}

const onSearch = () => {
  searchParams.page = 1
  getTableList()
}

const onPageChange = (page, pageSize) => {
  searchParams.page = page
  searchParams.pageSize = pageSize
  getTableList()
}
const getTableList = async () => {
  let params: any = {
    ...searchParams
  }
  if (params.time && params.time.length) {
    params.startTime = dayjs(params.time[0]).valueOf()
    params.endTime = dayjs(params.time[1]).valueOf()
  }
  state.loading = true
  let { code, data = {}, message }: any = await SystemApi.getLogList(params)
  state.loading = false
  if (code === 200) {
    state.dataSource = (data.list || []).map((el) => {
      el.createTimeText = dayjs(el.createTime).format('YYYY-MM-DD HH:mm:ss')
      return el
    })
    state.total = data.total || 0
  } else {
    Message.error(message || '请求失败')
  }
}

onMounted(() => {
  getTableList()
})
</script>
<style lang="less" scoped>
.top-action {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 12px;
}
.refesh {
  cursor: pointer;
  width: 27px;
  height: 27px;
  line-height: 24px;
  text-align: center;
  display: inline-block;
  border-radius: 50%;
  border: 1px solid #eee;
  background-color: #fff;
  &:hover {
    background-color: #eee;
  }
}
.anticon-edit span {
  margin-inline-start: 0;
}
.search-form {
  display: flex;
  flex-wrap: wrap;
  .ant-form-item {
    width: 30%;
    padding-right: 3%;
    .ant-form-item-label {
      width: 120px;
    }
  }
}
.search-btn {
  text-align: center;
  padding-bottom: 12px;
}
</style>
