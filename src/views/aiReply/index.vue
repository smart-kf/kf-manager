<!-- 二维码页面 -->
<template>
  <div class="kf-body">
    <div class="top-action">
      <a-button type="primary" @click="onAddMsg">添加智能欢迎语</a-button>
      <div @click="onRefesh">
        <span class="refesh">
          <ReloadOutlined />
        </span>
      </div>
    </div>
    <a-table bordered :data-source="state.dataSource" :loading="state.loading" :columns="columns" size="middle" :scroll="{ x: 1200 }" :pagination="false">
      <template #bodyCell="{ column, text, record }">
        <template v-if="column.dataIndex === 'content'">
          <template v-if="record.type === 'video'">
            <MaterialPreview mediaType="video" :url="record.content"></MaterialPreview>
          </template>
          <template v-else-if="record.type === 'image'">
            <MaterialPreview :url="record.content"></MaterialPreview>
          </template>
          <template v-else>
            <TextTip :text="record.content" />
          </template>
        </template>
        <template v-if="column.dataIndex === 'title'">
          <TextTip :text="record.title" />
        </template>
        <template v-if="column.dataIndex === 'enable'">
          <a-switch v-model:checked="record.enable" @change="onChangeStatus(record)" />
        </template>
        <template v-if="column.dataIndex === 'operation'">
          <a-space>
            <span class="table-link-action" @click="onEdit(record)"> <EditOutlined />修改 </span>

            <a-popconfirm title="确定要删除吗？" @confirm="onDelete(record)">
              <span class="table-link-action"> <DeleteOutlined />删除 </span>
            </a-popconfirm>
          </a-space>
        </template>
      </template>
    </a-table>
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
    <MaterialDrawer
      v-model:model-value="state.showDia"
      :is-ai="true"
      :max-sort="state.maxSort"
      :msgType="searchParams.msgType"
      :action-type="state.actionType"
      @refesh="getTableList"
      :edit-data="state.editData"
    ></MaterialDrawer>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted, reactive } from 'vue'
import { ReloadOutlined, EditOutlined, DeleteOutlined, SaveTwoTone } from '@ant-design/icons-vue'
import MaterialDrawer from '@/components/MaterialDrawer/index.vue'
import TextTip from '@/components/TextTip/index.vue'
import MaterialPreview from '@/components/MaterialPreview/index.vue'
import { message as Message } from 'ant-design-vue'
import { MessageApi } from '@/webapi/index'

const state = reactive({
  dataSource: [],
  editableData: {},
  editData: {},
  actionType: 'add',
  showDia: false,
  loading: false,
  total: 0,
  maxSort: 0
})

const searchParams = reactive({
  page: 1,
  pageSize: 20,
  msgType: 'smart_msg' //doc:"快捷回复=quick_reply, 欢迎语=welcome_msg, 智能回复
})

const columns = [
  {
    title: '标题',
    key: 'title',
    align: 'center',
    dataIndex: 'title',
    ellipsis: true,
    width: 300
  },
  {
    title: '关键词',
    key: 'keyword',
    align: 'center',
    dataIndex: 'keyword',
    ellipsis: true,
    width: 200
  },
  {
    title: '回复内容',
    key: 'content',
    align: 'center',
    ellipsis: true,
    dataIndex: 'content'
  },
  {
    title: '是否启用',
    align: 'center',
    dataIndex: 'enable',
    key: 'enable',
    width: 150
  },
  {
    title: '操作',
    align: 'center',
    fixed: 'right',
    dataIndex: 'operation',
    width: 200
  }
]

// 新增欢迎语
const onAddMsg = () => {
  state.actionType = 'add'
  state.showDia = true
}
const onEdit = (item) => {
  state.actionType = 'edit'
  state.editData = item
  state.showDia = true
}

const onDelete = async (record) => {
  let params = {
    id: record.id
  }
  let { code, data = {}, message }: any = await MessageApi.delWelcome(params)
  if (code === 200) {
    Message.success('删除成功')
    getTableList()
  } else {
    Message.error(message || '请求失败')
  }
}
const onPageChange = (page, pageSize) => {
  searchParams.page = page
  searchParams.pageSize = pageSize
  getTableList()
}

const onRefesh = () => {
  getTableList()
}

const onChangeStatus = async (record) => {
  let params: any = {
    ...record,
    msgType: searchParams.msgType
  }
  let { code, message }: any = await MessageApi.updateWelcome(params)
  if (code === 200) {
    getTableList()
    Message.success('更新成功！')
  } else {
    Message.error(message || '请求失败')
  }
}

const getTableList = async () => {
  let params: any = {
    ...searchParams
  }
  state.loading = true
  let { code, data = {}, message }: any = await MessageApi.getWelcomeList(params)
  state.loading = false
  if (code === 200) {
    state.dataSource = (data.list || []).map((el) => {
      if (el.sort > state.maxSort) {
        state.maxSort = el.sort
      }
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
</style>
