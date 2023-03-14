<script setup lang="ts">
import Pagination from '@components/pagination/index.vue'
import { onMounted, reactive, ref, watch } from 'vue'
import { ElTable } from 'element-plus'
import { delayRequest } from '../../../utils/common'
import { clone, cloneDeep } from 'lodash'
import moment from 'moment'
import { DATE_TIME_FORMAT } from '../../../settings'
import {
  ConfirmBox,
  NotificationError,
  NotificationSuccess
} from '../../../utils/element-plus'
import { Check } from '../../../types/entity'
import { QueryCheck } from '../../../types/query'
import {
  batchDeleteCheck,
  deleteCheck,
  getCheckListByPage
} from '../../../api/check'

const total = ref(0)
const loading = ref(false)
const tableData = ref<Check[]>()
const tableRef = ref<InstanceType<typeof ElTable>>()
const selection = ref<Check[]>([])
const query: QueryCheck = reactive({ page: 1, size: 5 })
const disabled = reactive({ delete: true })
const handleCurrent = (page: number) => (query.page = page)
const handleSize = (size: number) => (query.size = size)
const handleSelectionChange = (data: Check[]) => (selection.value = data)
const reset = () => {
  query.real_name = undefined
}
const initTableData = () => {
  loading.value = true
  delayRequest(
    () => {
      getCheckListByPage(query)
        .then(({ data }) => {
          if (data.code === 200) {
            const { content } = data
            tableData.value = cloneDeep(content.record)
            total.value = clone(content.total)
          }
        })
        .finally(() => (loading.value = false))
    },
    5,
    500
  )
}
watch(
  () => query,
  () => initTableData(),
  { deep: true }
)
watch(
  () => selection.value,
  () => (disabled.delete = selection.value.length < 1),
  { immediate: true, deep: true }
)
onMounted(() => initTableData())
const handleDelete = (id: number) => {
  deleteCheck(id).then(async ({ data }) => {
    if (data.code === 200) {
      NotificationSuccess('删除成功')
      initTableData()
      return
    }
    NotificationError('删除失败，请重试!')
  })
}
const handleBatchDelete = () => {
  ConfirmBox('确认删除选中的数据吗?', '提示', () => {
    batchDeleteCheck(
      selection.value.map((item: Check) => item.check_id) as number[]
    ).then(({ data }) => {
      if (data.code === 200) {
        NotificationSuccess('删除成功')
        initTableData()
        return
      }
      NotificationError('删除失败，请重试!')
    })
  })
}
</script>

<template>
  <el-card>
    <el-row :gutter="10" :style="{ marginBottom: '18px' }">
      <el-col :span="4">
        <el-input v-model="query.college_name" placeholder="学院名称" />
      </el-col>
      <el-col :span="4">
        <el-button
          type="warning"
          :style="{ borderRadius: '5px' }"
          @click.stop="reset"
        >
          重置
        </el-button>
      </el-col>
    </el-row>
    <el-row :gutter="10" :style="{ marginBottom: '15px', marginLeft: '1px' }">
      <el-button
        type="danger"
        :disabled="disabled.delete"
        :style="{ borderRadius: '5px' }"
        @click="handleBatchDelete"
      >
        批量删除
      </el-button>
    </el-row>
    <el-table
      ref="tableRef"
      v-loading="loading"
      :data="tableData"
      empty-text="暂无数据"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="30" align="center" />
      <el-table-column prop="check_id" label="ID" width="50" />
      <el-table-column prop="user.real_name" label="姓名" align="center" />
      <el-table-column prop="user.real_name" label="课程名称" align="center" />
      <el-table-column label="签到时间" width="180" align="center">
        <template #default="{ row }">
          {{ moment(row.check_time).format(DATE_TIME_FORMAT) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="180">
        <template #default="{ row }">
          <el-popconfirm
            title="确定删除本条数据吗？"
            @confirm="handleDelete(row.college_id)"
          >
            <template #reference>
              <el-button type="danger" :style="{ borderRadius: '5px' }">
                删除
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      :current-page="query.page"
      :page-size="query.size"
      :total="total"
      @current-change="handleCurrent"
      @size-change="handleSize"
    />
  </el-card>
</template>

<style scoped lang="scss"></style>
