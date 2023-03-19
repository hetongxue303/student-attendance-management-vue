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
import { Classes, College, Major } from '../../../types/entity'
import { QueryClasses } from '../../../types/query'
import {
  addClasses,
  batchDeleteClasses,
  deleteClasses,
  getClassesListByPage,
  updateClasses
} from '../../../api/classes'
import { getCollegeListAll } from '../../../api/college'
import { getMajorListByCollegeID } from '../../../api/major'

const total = ref(0)
const loading = ref(false)
const tableData = ref<Classes[]>()
const tableRef = ref<InstanceType<typeof ElTable>>()
const selection = ref<Classes[]>([])
const query: QueryClasses = reactive({ page: 1, size: 5 })
const disabled = reactive({
  add: false,
  update: true,
  delete: true,
  export: true
})
const handleCurrent = (page: number) => (query.page = page)
const handleSize = (size: number) => (query.size = size)
const handleSelectionChange = (data: Classes[]) => (selection.value = data)
const reset = () => {
  query.classes_name = undefined
}
const initTableData = () => {
  loading.value = true
  delayRequest(
    () => {
      getClassesListByPage(query)
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
const dialogForm = ref<Classes>({})
const dialogFormRef = ref<FormInstance>()
const dialogOperate = ref<string>('')
const collegeList = ref<College[]>([])
const majorList = ref<Major[]>([])
const tempCollege = ref<number | undefined>(undefined)
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
const openDialog = (operate: string, row?: Classes) => {
  if (operate === 'add') {
    dialogTitle.value = '新增'
  } else {
    dialogTitle.value = '编辑'
    if (row) {
      dialogForm.value = cloneDeep(row)
    } else {
      dialogForm.value = cloneDeep(selection.value[0] as Classes)
    }
  }
  initCollegeData()
  tempCollege.value = dialogForm.value.major?.college_id
  dialog.value = true
  dialogOperate.value = operate
}
const handleOperate = async (formEl?: FormInstance) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      const { value } = dialogForm
      if (dialogOperate.value === 'add') {
        addClasses(value).then(({ data }) => {
          if (data.code === 200) {
            NotificationSuccess('添加成功')
            dialog.value = false
            initTableData()
            return
          }
          NotificationError('添加失败，请重试!')
        })
      } else {
        updateClasses(value).then(({ data }) => {
          if (data.code === 200) {
            NotificationSuccess('修改成功')
            dialog.value = false
            initTableData()
            return
          }
          NotificationError('修改失败，请重试!')
        })
      }
    }
  })
}
const handleDelete = (id: number) => {
  deleteClasses(id).then(async ({ data }) => {
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
    batchDeleteClasses(
      selection.value.map((item: Classes) => item.major_id) as number[]
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
watch(
  () => tempCollege.value,
  (value) => {
    if (value) initMajorData(value)
  },
  { deep: true }
)
watch(
  () => dialog.value,
  (value) => {
    if (!value) {
      dialogForm.value = {}
      dialogOperate.value = ''
      tempCollege.value = undefined
    }
  },
  { deep: true }
)
</script>

<template>
  <el-card>
    <el-row :gutter="10" :style="{ marginBottom: '18px' }">
      <el-col :span="4">
        <el-input v-model="query.classes_name" placeholder="班级名称" />
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
    <el-row
      v-role="['admin']"
      :gutter="10"
      :style="{ marginBottom: '15px', marginLeft: '1px' }"
    >
      <el-button
        type="success"
        :style="{ borderRadius: '5px' }"
        @click="openDialog('add')"
      >
        新增
      </el-button>
      <el-button
        type="danger"
        :disabled="disabled.delete"
        :style="{ borderRadius: '5px' }"
        @click="handleBatchDelete"
      >
        删除
      </el-button>
      <el-button
        type="warning"
        :disabled="disabled.update"
        :style="{ borderRadius: '5px' }"
        @click="openDialog('update')"
      >
        修改
      </el-button>
    </el-row>
    <el-table
      ref="tableRef"
      v-loading="loading"
      :data="tableData"
      empty-text="暂无数据"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        v-role="['admin']"
        type="selection"
        width="30"
        align="center"
      />
      <el-table-column prop="classes_id" label="ID" width="50" />
      <el-table-column prop="classes_name" label="班级名称" align="center" />
      <el-table-column
        prop="major.major_name"
        label="所属专业"
        align="center"
      />
      <el-table-column
        prop="major.college.college_name"
        label="所属学院"
        align="center"
      />
      <el-table-column
        prop="description"
        label="班级描述"
        align="center"
        show-overflow-tooltip="true"
      />
      <el-table-column label="创建时间" width="180" align="center">
        <template #default="{ row }">
          {{ moment(row.create_time).format(DATE_TIME_FORMAT) }}
        </template>
      </el-table-column>
      <el-table-column
        v-role="['admin']"
        label="操作"
        align="center"
        width="180"
      >
        <template #default="{ row }">
          <el-button
            type="primary"
            :style="{ borderRadius: '5px' }"
            @click="openDialog('update', row)"
          >
            编辑
          </el-button>
          <el-popconfirm
            title="确定删除本条数据吗？"
            @confirm="handleDelete(row.classes_id)"
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
        prop="classes_name"
        label="班级名称"
        :rules="{
          required: true,
          message: '请输入班级名称',
          trigger: 'blur'
        }"
      >
        <el-input v-model="dialogForm.classes_name" placeholder="班级名称" />
      </el-form-item>
      <el-form-item
        label="所属学院"
        :rules="{ required: true, message: '请选择学院', trigger: 'blur' }"
      >
        <el-select
          v-model="tempCollege"
          placeholder="请选择"
          :style="{ width: '100%' }"
          @change="dialogForm.major_id = undefined"
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
        label="所属专业"
        :rules="{ required: true, message: '请选择专业', trigger: 'blur' }"
      >
        <el-select
          v-model="dialogForm.major_id"
          placeholder="请选择"
          :style="{ width: '100%' }"
        >
          <el-option
            v-for="item in majorList"
            :key="item.major_id"
            :label="item.major_name"
            :value="item.major_id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="班级描述">
        <el-input
          v-model="dialogForm.description"
          type="textarea"
          resize="none"
          :rows="3"
          placeholder="班级描述(默认：无)"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="danger" text @click="dialog = false">返回</el-button>
      <el-button type="primary" @click="handleOperate(dialogFormRef)">
        确认
      </el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss"></style>
