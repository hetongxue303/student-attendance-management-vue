<script setup lang="ts">
import Pagination from '@components/pagination/index.vue'
import { onMounted, reactive, ref, watch } from 'vue'
import { ElTable, FormInstance } from 'element-plus'
import { delayRequest } from '../../../utils/common'
import { clone, cloneDeep } from 'lodash'
import { Attendance, MyCourse } from '../../../types/entity'
import { QueryCourseMe } from '../../../types/query'
import { getCourseListMe } from '../../../api/course'
import { useUserStore } from '../../../store/modules/user'
import { addAttendance } from '../../../api/attendance'
import {
  NotificationError,
  NotificationSuccess
} from '../../../utils/element-plus'

const total = ref(0)
const loading = ref(false)
const tableData = ref<MyCourse[]>()
const tableRef = ref<InstanceType<typeof ElTable>>()
const selection = ref<MyCourse[]>([])
const query: QueryCourseMe = reactive({
  page: 1,
  size: 5,
  username: useUserStore().getUsername
})
const handleCurrent = (page: number) => (query.page = page)
const handleSize = (size: number) => (query.size = size)
const handleSelectionChange = (data: MyCourse[]) => (selection.value = data)
const reset = () => {
  query.course_name = undefined
}
const initTableData = () => {
  loading.value = true
  delayRequest(
    () => {
      getCourseListMe(query)
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
onMounted(() => initTableData())

const publish = ref(false)
const publishForm = ref<Attendance>({ time: 10 })
const publishFormRef = ref<FormInstance>()
const openPublish = (row: MyCourse) => {
  publish.value = true
  publishForm.value.course = row
  publishForm.value.course_id = row.course_id
}
const handlePublish = async (formEl?: FormInstance) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      if (!useUserStore().getRoles.includes('student'))
        publishForm.value.user_id = useUserStore().getUserId
      const { value } = publishForm
      addAttendance(value).then(({ data }) => {
        if (data.code === 200) {
          initTableData()
          NotificationSuccess('????????????')
          publish.value = false
          return
        }
        NotificationError('????????????,?????????!')
      })
    }
  })
}
watch(
  () => publish.value,
  (value) => {
    if (!value) publishForm.value = { time: 10 }
  },
  { deep: true }
)
</script>

<template>
  <el-dialog
    v-model="publish"
    title="????????????"
    width="20%"
    destroy-on-close
    :show-close="false"
    :close-on-click-modal="false"
    :style="{ borderRadius: '10px' }"
  >
    <el-form ref="publishFormRef" :model="publishForm" label-width="80">
      <el-form-item label="????????????">
        <span>{{ publishForm.course?.course_name }}</span>
      </el-form-item>
      <el-form-item label="????????????">
        <span>{{ publishForm.course?.count }}???</span>
      </el-form-item>
      <el-form-item label="????????????">
        <span>{{ publishForm.course?.time }}???</span>
      </el-form-item>
      <el-form-item
        prop="time"
        label="????????????"
        :rules="{ required: true, message: '?????????????????????', trigger: 'blur' }"
      >
        <el-input
          v-model="publishForm.time"
          :style="{ width: '100%' }"
          placeholder="????????????"
          type="number"
        >
          <template #append>??????</template>
        </el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="danger" text @click="publish = false">??????</el-button>
      <el-button type="primary" @click="handlePublish(publishFormRef)">
        ??????
      </el-button>
    </template>
  </el-dialog>
  <el-card>
    <el-row :gutter="10" :style="{ marginBottom: '18px' }">
      <el-col :span="4">
        <el-input v-model="query.course_name" placeholder="????????????" />
      </el-col>
      <el-col :span="4">
        <el-button
          type="warning"
          :style="{ borderRadius: '5px' }"
          @click.stop="reset"
        >
          ??????
        </el-button>
      </el-col>
    </el-row>
    <el-row :gutter="10" :style="{ marginBottom: '15px', marginLeft: '1px' }">
    </el-row>
    <el-table
      ref="tableRef"
      v-loading="loading"
      :data="tableData"
      empty-text="????????????"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="30" align="center" />
      <el-table-column prop="course_id" label="ID" width="50" />
      <el-table-column prop="course_name" label="??????" align="center" />
      <el-table-column prop="count" label="??????" align="center">
        <template #default="{ row }">
          <el-tag type="success" disable-transitions>
            {{ row.count }}???
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="time" label="??????" align="center">
        <template #default="{ row }">
          <el-tag type="warning" disable-transitions> {{ row.time }}???</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="college.college_name"
        label="????????????"
        align="center"
      />
      <el-table-column label="??????" align="center" width="220">
        <template #default="{ row }">
          <el-button
            type="primary"
            :style="{ borderRadius: '5px' }"
            @click="openPublish(row)"
          >
            ????????????
          </el-button>
          <el-button type="primary" :style="{ borderRadius: '5px' }">
            ????????????
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

<style scoped lang="scss">
:deep(input::-webkit-outer-spin-button),
:deep(input::-webkit-inner-spin-button) {
  -webkit-appearance: none !important;
}

:deep(input[type='number']) {
  -moz-appearance: textfield !important;
}
</style>
