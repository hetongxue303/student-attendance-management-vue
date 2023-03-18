<script setup lang="ts">
import Pagination from '@components/pagination/index.vue'
import { onMounted, reactive, ref, watch } from 'vue'
import { QueryChoice } from '../../../types/query'
import { Choice } from '../../../types/entity'
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
import {
  getChoiceListByPage,
  updateBatchChoiceStatus,
  updateChoiceStatus
} from '../../../api/choice'

const total = ref(0)
const loading = ref(false)
const operate = ref(true)
const tableData = ref<Choice[]>()
const tableRef = ref<InstanceType<typeof ElTable>>()
const selection = ref<Choice[]>([])
const query: QueryChoice = reactive({ page: 1, size: 5 })
const handleCurrent = (page: number) => (query.page = page)
const handleSize = (size: number) => (query.size = size)
const handleSelectionChange = (data: Choice[]) => (selection.value = data)
const reset = () => {
  query.course_name = undefined
}
const initTableData = () => {
  loading.value = true
  delayRequest(
    () => {
      getChoiceListByPage(query)
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

const handleOperate = async (status: number, choice_id: number) => {
  updateChoiceStatus({ choice_status: status, choice_id }).then(({ data }) => {
    if (data.code === 200) {
      NotificationSuccess(status === 1 ? '已同意' : '已拒绝')
      initTableData()
      return
    }
    NotificationError('操作失败，请重试!')
  })
}
const handleBatchOperate = async (status: number) => {
  ConfirmBox(
    `确定 ${status === 1 ? '同意' : '拒绝'} 选中的信息吗？`,
    '提示',
    () => {
      updateBatchChoiceStatus({
        choice_status: status,
        ids: selection.value.map((i) => i.choice_id) as number[]
      }).then(({ data }) => {
        if (data.code === 200) {
          NotificationSuccess(status === 1 ? '已同意' : '已拒绝')
          initTableData()
          return
        }
        NotificationError('操作失败，请重试!')
      })
    }
  )
}
watch(
  () => query,
  () => initTableData(),
  { deep: true }
)
watch(
  () => selection.value,
  (value) => (operate.value = value.length < 1),
  { immediate: true, deep: true }
)
onMounted(() => initTableData())
</script>

<template>
  <el-card>
    <el-row :gutter="10" :style="{ marginBottom: '18px' }">
      <el-col :span="4">
        <el-input v-model="query.course_name" placeholder="课程名称" />
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
        type="success"
        :disabled="operate"
        :style="{ borderRadius: '5px' }"
        @click="handleBatchOperate(1)"
      >
        批量同意
      </el-button>
      <el-button
        type="danger"
        :disabled="operate"
        :style="{ borderRadius: '5px' }"
        @click="handleBatchOperate(0)"
      >
        批量拒绝
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
      <el-table-column prop="course.course_name" label="课程名称" />
      <el-table-column prop="user.real_name" label="学生姓名" />
      <el-table-column label="选课时间" width="180">
        <template #default="{ row }">
          {{ moment(row.create_time).format(DATE_TIME_FORMAT) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="180">
        <template #default="{ row }">
          <el-button
            type="success"
            :style="{ borderRadius: '5px' }"
            @click="handleOperate(1, row.choice_id)"
          >
            同意
          </el-button>
          <el-button
            type="danger"
            :style="{ borderRadius: '5px' }"
            @click="handleOperate(0, row.choice_id)"
          >
            拒绝
          </el-button>
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
