<script setup lang="ts">
import Pagination from '@components/pagination/index.vue'
import { onMounted, reactive, ref, watch } from 'vue'
import { ElTable, FormInstance } from 'element-plus'
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
  Classes,
  College,
  Course,
  Major,
  User,
  BOCourse
} from '../../../types/entity'
import { QueryCourse } from '../../../types/query'
import {
  addCourse,
  batchDeleteCourse,
  deleteCourse,
  getCourseListByPage,
  updateCourse
} from '../../../api/course'
import { getCollegeListAll } from '../../../api/college'
import { getMajorListByCollegeID } from '../../../api/major'
import { getClassesListByMajorID } from '../../../api/classes'
import { getTeacherListAll } from '../../../api/user'
import { useUserStore } from '../../../store/modules/user'

const total = ref(0)
const loading = ref(false)
const tableData = ref<Course[]>()
const tableRef = ref<InstanceType<typeof ElTable>>()
const selection = ref<Course[]>([])
const query: QueryCourse = reactive({ page: 1, size: 5 })
const disabled = reactive({
  add: false,
  update: true,
  delete: true,
  export: true
})
const handleCurrent = (page: number) => (query.page = page)
const handleSize = (size: number) => (query.size = size)
const handleSelectionChange = (data: Course[]) => (selection.value = data)
const reset = () => {
  query.course_name = undefined
}
const initTableData = () => {
  loading.value = true
  delayRequest(
    () => {
      getCourseListByPage(query)
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
  () => {
    disabled.update = selection.value.length !== 1
    disabled.delete = selection.value.length < 1
  },
  { immediate: true, deep: true }
)
onMounted(() => initTableData())

const dialog = ref(false)
const dialogTitle = ref('')
const dialogForm = ref<BOCourse>({ count: 1, time: 1 })
const dialogFormRef = ref<FormInstance>()
const dialogOperate = ref<string>('')
const collegeList = ref<College[]>([])
const majorList = ref<Major[]>([])
const classesList = ref<Classes[]>([])
const teacherList = ref<User[]>([])
const initTeacherList = () => {
  if (!useUserStore().getRoles.includes('student'))
    getTeacherListAll().then(
      ({ data }) => (teacherList.value = cloneDeep(data.content))
    )
}
const initCollegeData = () => {
  getCollegeListAll().then(
    ({ data }) => (collegeList.value = cloneDeep(data.content))
  )
}
const initMajorData = (college_id: number) => {
  getMajorListByCollegeID(college_id).then(
    ({ data }) => (majorList.value = cloneDeep(data.content))
  )
}
const initClassesData = (major_id: number) => {
  getClassesListByMajorID(major_id).then(
    ({ data }) => (classesList.value = cloneDeep(data.content))
  )
}
const openDialog = (operate: string, row?: Course) => {
  if (operate === 'add') {
    dialogTitle.value = '??????'
  } else {
    dialogTitle.value = '??????'
    if (row) {
      dialogForm.value = cloneDeep(row)
    } else {
      dialogForm.value = cloneDeep(selection.value[0] as Course)
    }
  }
  initCollegeData()
  if (useUserStore().getIsAdmin) initTeacherList()
  dialog.value = true
  dialogOperate.value = operate
}
const handleOperate = async (formEl?: FormInstance) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      if (!useUserStore().getIsAdmin)
        dialogForm.value.user_id = useUserStore().getUserId
      const { value } = dialogForm
      if (dialogOperate.value === 'add') {
        addCourse(value).then(({ data }) => {
          if (data.code === 200) {
            NotificationSuccess('????????????')
            dialog.value = false
            initTableData()
            return
          }
          NotificationError('????????????????????????!')
        })
      } else {
        updateCourse(value).then(({ data }) => {
          if (data.code === 200) {
            NotificationSuccess('????????????')
            dialog.value = false
            initTableData()
            return
          }
          NotificationError('????????????????????????!')
        })
      }
    }
  })
}
const handleDelete = (id: number) => {
  deleteCourse(id).then(async ({ data }) => {
    if (data.code === 200) {
      NotificationSuccess('????????????')
      initTableData()
      return
    }
    NotificationError('????????????????????????!')
  })
}
const handleBatchDelete = () => {
  ConfirmBox('???????????????????????????????', '??????', () => {
    batchDeleteCourse(
      selection.value.map((item: Course) => item.course_id) as number[]
    ).then(({ data }) => {
      if (data.code === 200) {
        NotificationSuccess('????????????')
        initTableData()
        return
      }
      NotificationError('????????????????????????!')
    })
  })
}
const handleChangeCollege = () => {
  dialogForm.value.major_id = undefined
  dialogForm.value.classes_id = undefined
  majorList.value = []
  classesList.value = []
}
watch(
  () => dialogForm.value.college_id,
  (value) => {
    if (value) initMajorData(value)
  },
  { deep: true }
)
watch(
  () => dialogForm.value.major_id,
  (value) => {
    if (value) initClassesData(value)
  },
  { deep: true }
)
watch(
  () => dialog.value,
  (value) => {
    if (!value) {
      dialogForm.value = { count: 1, time: 1 }
      dialogOperate.value = ''
      dialogForm.value.college_id = undefined
      dialogForm.value.major_id = undefined
    }
  },
  { deep: true }
)
</script>

<template>
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
      <el-button
        type="success"
        :style="{ borderRadius: '5px' }"
        @click="openDialog('add')"
      >
        ??????
      </el-button>
      <el-button
        type="danger"
        :disabled="disabled.delete"
        :style="{ borderRadius: '5px' }"
        @click="handleBatchDelete"
      >
        ??????
      </el-button>
      <el-button
        type="warning"
        :disabled="disabled.update"
        :style="{ borderRadius: '5px' }"
        @click="openDialog('update')"
      >
        ??????
      </el-button>
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
      <el-table-column
        prop="description"
        label="????????????"
        align="center"
        show-overflow-tooltip="true"
      />
      <el-table-column label="??????" align="center" width="180">
        <template #default="{ row }">
          <el-button
            type="primary"
            :style="{ borderRadius: '5px' }"
            @click="openDialog('update', row)"
          >
            ??????
          </el-button>
          <el-popconfirm
            title="??????????????????????????????"
            @confirm="handleDelete(row.course_id)"
          >
            <template #reference>
              <el-button type="danger" :style="{ borderRadius: '5px' }">
                ??????
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

  <el-dialog
    v-model="dialog"
    width="30%"
    destroy-on-close
    :title="dialogTitle"
    :show-close="false"
    :close-on-click-modal="false"
    :style="{ borderRadius: '10px' }"
  >
    <el-form ref="dialogFormRef" :model="dialogForm" label-width="80">
      <el-form-item
        prop="course_name"
        label="????????????"
        :rules="{
          required: true,
          message: '?????????????????????',
          trigger: 'blur'
        }"
      >
        <el-input v-model="dialogForm.course_name" placeholder="????????????" />
      </el-form-item>
      <el-form-item
        prop="count"
        label="????????????"
        :rules="{
          required: true,
          message: '?????????????????????',
          trigger: 'blur'
        }"
      >
        <el-input-number
          v-model="dialogForm.count"
          placeholder="????????????"
          :min="1"
          :max="200"
          controls-position="right"
          :style="{ width: '100%' }"
        />
      </el-form-item>
      <el-form-item
        prop="time"
        label="????????????"
        :rules="{
          required: true,
          message: '?????????????????????',
          trigger: 'blur'
        }"
      >
        <el-input-number
          v-model="dialogForm.time"
          placeholder="????????????"
          :min="1"
          :max="24"
          controls-position="right"
          :style="{ width: '100%' }"
        />
      </el-form-item>
      <el-form-item
        prop="college_id"
        label="????????????"
        :rules="{ required: true, message: '???????????????', trigger: 'blur' }"
      >
        <el-select
          v-model="dialogForm.college_id"
          placeholder="?????????"
          :style="{ width: '100%' }"
          @change="handleChangeCollege"
        >
          <el-option
            v-for="item in collegeList"
            :key="item.college_id"
            :label="item.college_name"
            :value="item.college_id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        prop="major_id"
        label="????????????"
        :rules="{ required: true, message: '???????????????', trigger: 'blur' }"
      >
        <el-select
          v-model="dialogForm.major_id"
          placeholder="?????????"
          :style="{ width: '100%' }"
          @change="dialogForm.classes_id = undefined"
        >
          <el-option
            v-for="item in majorList"
            :key="item.major_id"
            :label="item.major_name"
            :value="item.major_id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        prop="classes_id"
        label="????????????"
        :rules="{ required: true, message: '???????????????', trigger: 'blur' }"
      >
        <el-select
          v-model="dialogForm.classes_id"
          placeholder="?????????"
          :style="{ width: '100%' }"
        >
          <el-option
            v-for="item in classesList"
            :key="item.classes_id"
            :label="item.classes_name"
            :value="item.classes_id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-show="useUserStore().getIsAdmin"
        prop="user_id"
        label="????????????"
        :rules="{ required: true, message: '???????????????', trigger: 'blur' }"
      >
        <el-select
          v-model="dialogForm.user_id"
          placeholder="?????????"
          :style="{ width: '100%' }"
        >
          <el-option
            v-for="item in teacherList"
            :key="item.user_id"
            :label="item.real_name"
            :value="item.user_id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="????????????">
        <el-input
          v-model="dialogForm.description"
          type="textarea"
          resize="none"
          :rows="3"
          placeholder="????????????(????????????)"
        />
      </el-form-item>
      <el-form-item v-show="dialogOperate === 'update'" label="????????????">
        <span :style="{ color: '#7a8b9a', fontSize: '13px' }">
          {{ moment(dialogForm.create_time).format(DATE_TIME_FORMAT) }}
        </span>
      </el-form-item>
      <el-form-item v-show="dialogOperate === 'update'" label="????????????">
        <span :style="{ color: '#7a8b9a', fontSize: '13px' }">
          {{ moment(dialogForm.update_time).format(DATE_TIME_FORMAT) }}
        </span>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="danger" text @click="dialog = false">??????</el-button>
      <el-button type="primary" @click="handleOperate(dialogFormRef)">
        ??????
      </el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss"></style>
