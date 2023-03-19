<script setup lang="ts">
import Pagination from '@components/pagination/index.vue'
import { onMounted, reactive, ref, watch } from 'vue'
import { ElTable } from 'element-plus'
import { delayRequest } from '../../../utils/common'
import { clone, cloneDeep } from 'lodash'
import moment from 'moment'
import { DATE_TIME_FORMAT } from '../../../settings'
import { addCheck, getCheckListByPageStudent } from '../../../api/check'
import { Attendance, Check } from '../../../types/entity'
import { QueryCheck } from '../../../types/query'
import {
  NotificationError,
  NotificationSuccess
} from '../../../utils/element-plus'

const total = ref(0)
const loading = ref(false)
const tableData = ref<Check[]>()
const tableRef = ref<InstanceType<typeof ElTable>>()
const selection = ref<Check[]>([])
const query: QueryCheck = reactive({ page: 1, size: 5 })
const disabled = reactive({
  add: false,
  update: true,
  delete: true,
  export: true
})
const handleCurrent = (page: number) => (query.page = page)
const handleSize = (size: number) => (query.size = size)
const handleSelectionChange = (data: Check[]) => (selection.value = data)
const reset = () => {}
const initTableData = () => {
  loading.value = true
  delayRequest(
    () => {
      getCheckListByPageStudent(query)
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
const handleCheck = (row: Attendance) => {
  addCheck({ attendance_id: row.attendance_id, course_id: row.course_id }).then(
    ({ data }) => {
      if (data.code === 200) {
        NotificationSuccess('签到成功')
        initTableData()
        return
      }
      NotificationError('签到失败,请重试!')
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
  () => {
    disabled.update = selection.value.length !== 1
    disabled.delete = selection.value.length < 1
  },
  { immediate: true, deep: true }
)
onMounted(() => initTableData())
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
    <el-table
      ref="tableRef"
      v-loading="loading"
      :data="tableData"
      empty-text="暂无数据"
      @selection-change="handleSelectionChange"
    >
      <el-table-column prop="course.course_name" label="课程名称" />
      <el-table-column prop="user.real_name" label="教师姓名" />
      <el-table-column label="状态" width="180">
        <template #default="{ row }">
          {{ row.status === 0 ? '签到中' : '已结束' }}
        </template>
      </el-table-column>
      <el-table-column label="发布时间" width="180">
        <template #default="{ row }">
          {{ moment(row.attendance_time).format(DATE_TIME_FORMAT) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="180">
        <template #default="{ row }">
          <el-button
            type="success"
            :style="{ borderRadius: '5px' }"
            :disabled="row.is_checked"
            @click="handleCheck(row)"
          >
            {{ row.is_checked ? '已签到' : '签到' }}
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
