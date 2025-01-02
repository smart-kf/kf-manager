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
    <a-table bordered :data-source="state.dataSource" :columns="columns" size="middle">
      <template #bodyCell="{ column, text, record }">
        <template v-if="column.dataIndex === 'content'">
          <template v-if="record.contentType === 'video'">
            <span>{{ record.content }}</span>
          </template>
          <template v-else-if="record.contentType === 'image'">
            <a-image :width="100" :height="100" :src="record.content" :fallback="failImg" />
          </template>
          <template v-else>
            <span>{{ record.content }}</span>
          </template>
        </template>
        <template v-if="column.dataIndex === 'sendSort'">
          <a-input-number id="inputNumber" v-model:value="record.sendSort" :min="1" :max="9999" />
        </template>
        <template v-if="column.dataIndex === 'status'">
          <a-switch v-model:checked="record.status" />
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
    <MaterialDrawer v-model:model-value="state.showDia"></MaterialDrawer>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted, reactive } from 'vue'
import { h } from 'vue'
import { ReloadOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import MaterialDrawer from '@/components/MaterialDrawer/index.vue'
import { message } from 'ant-design-vue'
import logo from '@/assets/defaultUser.png'
import failImg from '@/assets/failImg.png'

const state = reactive({
  dataSource: [],
  editableData: {},
  editData: {},
  actionType: 'add',
  showDia: false
})

const columns = [
  {
    title: '标题',
    key: 'title',
    align: 'center',
    dataIndex: 'title',
    ellipsis: true
  },
  {
    title: '回复内容',
    key: 'content',
    align: 'center',
    ellipsis: true,
    dataIndex: 'content'
  },
  {
    title: '显示顺序',
    key: 'sendSort',
    align: 'center',
    dataIndex: 'sendSort',
    width: 120
  },
  {
    title: '是否启用',
    align: 'center',
    dataIndex: 'status',
    key: 'status',
    width: 120
  },
  {
    title: '操作',
    align: 'center',
    dataIndex: 'operation',
    width: 200
  }
]

const onRefesh = () => {
  console.log(222)
}
// 新增欢迎语
const onAddMsg = () => {
  state.actionType = 'add'
  state.showDia = true
}
const onEdit = (item) => {
  state.actionType = 'edit'
  state.editData = item
}

const onDelete = (item) => {
  state.dataSource = state.dataSource.filter((el) => el.id !== item.id)
  state.showDia = true
}

const initData = () => {
  state.dataSource = [
    {
      id: 1,
      title: '文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本',
      content: '文本',
      sendSort: 1,
      contentType: 'text',
      status: true,
      updateTime: '2024-13-13 13:13:13'
    },
    {
      id: 2,
      content: logo,
      sendSort: 2,
      contentType: 'image',
      status: true,
      updateTime: '2024-13-13 13:13:13'
    },
    {
      id: 3,
      content: '视频',
      sendSort: 3,
      contentType: 'video',
      status: false,
      updateTime: '2024-13-13 13:13:13'
    }
  ]
  console.log(state)
}

onMounted(() => {
  initData()
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
