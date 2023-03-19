<script setup lang="ts">
import Pagination from '@components/pagination/index.vue'
import { onMounted, reactive, ref, watch } from 'vue'
import type { TabsPaneContext } from 'element-plus'
import { ElTable, FormInstance } from 'element-plus'
import { delayRequest } from '../../../utils/common'
import { clone, cloneDeep } from 'lodash'
import { Attendance, Course } from '../../../types/entity'
import { useUserStore } from '../../../store/modules/user'
import {
  addAttendance,
  getAttendanceListByPage,
  updateAttendanceStatus,
  updateBatchAttendanceStatus
} from '../../../api/attendance'
import {
  ConfirmBox,
  NotificationError,
  NotificationSuccess
} from '../../../utils/element-plus'
import { QueryAttendance, QueryCourseMe } from '../../../types/query'
import { getCourseListMe } from '../../../api/course'

const total = ref(0)
const loading = ref(false)
const tableData = ref<Attendance[]>()
const tableRef = ref<InstanceType<typeof ElTable>>()
const selection = ref<Attendance[]>([])
const activeName = ref('current')
const query: QueryAttendance = reactive({
  page: 1,
  size: 5,
  status: 0
})
const handleCurrent = (page: number) => (query.page = page)
const handleSize = (size: number) => (query.size = size)
const handleSelectionChange = (data: Attendance[]) => (selection.value = data)
const reset = () => {}
const initTableData = () => {
  loading.value = true
  delayRequest(
    () => {
      getAttendanceListByPage(query)
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
const handleClick = (tab: TabsPaneContext) =>
  (activeName.value = tab.paneName as string)
const setValue = (row: Attendance) => {
  return (
    Date.now() +
    (new Date(row.attendance_time as Date).getTime() +
      Number(row.time) * 60 * 1000 -
      Date.now())
  )
}
const handleCheckedEnd = (row: Attendance) => {
  ConfirmBox('确认结束签到吗?', '提示', () => {
    updateAttendanceStatus(row).then(({ data }) => {
      if (data.code === 200) {
        NotificationSuccess('操作成功')
        initTableData()
        return
      }
      NotificationError('操作失败,请重试!')
    })
  })
}
const updateBatch = () => {
  const ids: number[] = tableData.value
    ?.filter((i) => setValue(i) === 0)
    .map((i) => i.attendance_id) as number[]
  if (ids) {
    updateBatchAttendanceStatus(ids).then(({ data }) => {
      if (data.code === 200) {
        NotificationSuccess('操作成功')
        initTableData()
        return
      }
      NotificationError('操作失败,请重试!')
    })
  }
}
watch(
  () => query,
  () => {
    query.status = activeName.value === 'current' ? 0 : 1
    initTableData()
  },
  { deep: true }
)
watch(
  () => activeName.value,
  () => (query.status = activeName.value === 'current' ? 0 : 1),
  { deep: true }
)
onMounted(() => {
  initTableData()
  updateBatch()
})

const publish = ref(false)
const publishQuery = ref<QueryCourseMe>({
  page: 1,
  size: 5,
  username: useUserStore().getUsername
})
const publishForm = ref<Attendance>({ time: 10 })
const publishFormRef = ref<FormInstance>()
const courseData = ref<Course[]>([])
const openPublish = () => {
  publish.value = true
  getCourseListMe(publishQuery.value).then(({ data }) => {
    if (data.code === 200) courseData.value = cloneDeep(data.content.record)
  })
}
const handlePublish = async (formEl?: FormInstance) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      if (
        useUserStore().getRoles.includes('admin') ||
        useUserStore().getRoles.includes('teacher')
      )
        publishForm.value.user_id = useUserStore().getUserId
      const { value } = publishForm
      addAttendance(value).then(({ data }) => {
        if (data.code === 200) {
          initTableData()
          NotificationSuccess('发布成功')
          publish.value = false
          return
        }
        NotificationError('发布失败,请重试!')
      })
    }
  })
}

watch(
  () => publish.value,
  (value) => {
    if (!value) {
      publishForm.value = { time: 10 }
      courseData.value = []
    }
  },
  { deep: true }
)
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
        :style="{ borderRadius: '5px' }"
        @click="openPublish"
      >
        发布签到
      </el-button>
    </el-row>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="当前签到" name="current">
        <el-table
          ref="tableRef"
          v-loading="loading"
          :data="tableData"
          empty-text="暂无数据"
          @selection-change="handleSelectionChange"
        >
          <el-table-column prop="course.course_name" label="名称" />
          <el-table-column prop="status" label="状态">
            <template #default>
              <el-tag type="warning" disable-transitions>签到中</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="course.selection" label="课程人数">
            <template #default="{ row }">
              {{ row.course.selection }}人
            </template>
          </el-table-column>
          <el-table-column prop="checked_count" label="已签人数">
            <template #default="{ row }"> {{ row.checked_count }}人 </template>
          </el-table-column>
          <el-table-column label="时长">
            <template #default="{ row }">
              <el-countdown
                value-style="font-size: 14px; font-weight: 1px"
                format="mm:ss"
                :value="setValue(row)"
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="course.college.college_name"
            label="所属学院"
          />
          <el-table-column label="操作" align="center" width="220">
            <template #default="{ row }">
              <el-button
                type="warning"
                :style="{ borderRadius: '5px' }"
                @click="handleCheckedEnd(row)"
              >
                结束签到
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="历史签到" name="history">
        <el-table
          ref="tableRef"
          v-loading="loading"
          :data="tableData"
          empty-text="暂无数据"
          @selection-change="handleSelectionChange"
        >
          <el-table-column prop="course.course_name" label="名称" />
          <el-table-column prop="course.count" label="人数" align="center">
            <template #default="{ row }"> {{ row.course.count }}人</template>
          </el-table-column>
          <el-table-column prop="course.time" label="学时" align="center">
            <template #default="{ row }"> {{ row.course.time }}次</template>
          </el-table-column>
          <el-table-column label="时长">
            <template #default="{ row }"> {{ row.time }}分钟</template>
          </el-table-column>
          <el-table-column
            prop="course.college.college_name"
            label="所属学院"
            align="center"
          />
          <el-table-column label="操作" align="center" width="220">
            <template #default>
              <el-tag type="success" disable-transitions effect="dark">
                已结束
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <Pagination
      :current-page="query.page"
      :page-size="query.size"
      :total="total"
      @current-change="handleCurrent"
      @size-change="handleSize"
    />
  </el-card>
  <el-dialog
    v-model="publish"
    title="发布签到"
    width="25%"
    destroy-on-close
    :show-close="false"
    :close-on-click-modal="false"
    :style="{ borderRadius: '10px' }"
  >
    <el-form ref="publishFormRef" :model="publishForm" label-width="80">
      <el-form-item label="课程名称">
        <el-select v-model="publishForm.course_id" placeholder="请选择">
          <el-option
            v-for="item in courseData"
            :key="item.course_id"
            :value="item.course_id"
            :label="item.course_name"
          >
            <span style="float: left">{{ item.course_name }}</span>
            <span
              style="
                float: right;
                color: var(--el-text-color-secondary);
                font-size: 13px;
              "
            >
              {{ item.selection }}人
            </span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        prop="time"
        label="签到时长"
        :rules="{ required: true, message: '请输入签到时长', trigger: 'blur' }"
      >
        <el-input
          v-model="publishForm.time"
          :style="{ width: '100%' }"
          placeholder="签到时长"
          type="number"
        >
          <template #append>分钟</template>
        </el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="danger" text @click="publish = false">返回</el-button>
      <el-button type="primary" @click="handlePublish(publishFormRef)">
        确认
      </el-button>
    </template>
  </el-dialog>
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
