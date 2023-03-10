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
import { College, Major } from '../../../types/entity'
import { QueryMajor } from '../../../types/query'
import {
  addMajor,
  batchDeleteMajor,
  deleteMajor,
  getMajorListByPage,
  updateMajor
} from '../../../api/major'
import { getCollegeListAll } from '../../../api/college'

const total = ref(0)
const loading = ref(false)
const tableData = ref<Major[]>()
const tableRef = ref<InstanceType<typeof ElTable>>()
const selection = ref<Major[]>([])
const query: QueryMajor = reactive({ page: 1, size: 5 })
const disabled = reactive({
  add: false,
  update: true,
  delete: true,
  export: true
})
const handleCurrent = (page: number) => (query.page = page)
const handleSize = (size: number) => (query.size = size)
const handleSelectionChange = (data: Major[]) => (selection.value = data)
const reset = () => {
  query.major_name = undefined
}
const initTableData = () => {
  loading.value = true
  delayRequest(
    () => {
      getMajorListByPage(query)
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
const dialogForm = ref<Major>({})
const dialogFormRef = ref<FormInstance>()
const dialogOperate = ref<string>('')
const collegeList = ref<College[]>([])
const initCollegeData = () => {
  getCollegeListAll().then(
    ({ data }) => (collegeList.value = cloneDeep(data.content))
  )
}
const openDialog = (operate: string, row?: Major) => {
  if (operate === 'add') {
    dialogTitle.value = '??????'
  } else {
    dialogTitle.value = '??????'
    if (row) {
      dialogForm.value = cloneDeep(row)
    } else {
      dialogForm.value = cloneDeep(selection.value[0] as Major)
    }
  }
  initCollegeData()
  dialog.value = true
  dialogOperate.value = operate
}
const handleOperate = async (formEl?: FormInstance) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      const { value } = dialogForm
      if (dialogOperate.value === 'add') {
        addMajor(value).then(({ data }) => {
          if (data.code === 200) {
            NotificationSuccess('????????????')
            dialog.value = false
            initTableData()
            return
          }
          NotificationError('????????????????????????!')
        })
      } else {
        updateMajor(value).then(({ data }) => {
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
  deleteMajor(id).then(async ({ data }) => {
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
    batchDeleteMajor(
      selection.value.map((item: Major) => item.major_id) as number[]
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
watch(
  () => dialog.value,
  (value) => {
    if (!value) {
      dialogForm.value = {}
      dialogOperate.value = ''
    }
  },
  { deep: true }
)
</script>

<template>
  <el-card>
    <el-row :gutter="10" :style="{ marginBottom: '18px' }">
      <el-col :span="4">
        <el-input v-model="query.major_name" placeholder="????????????" />
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
      <el-table-column prop="major_id" label="ID" width="50" />
      <el-table-column prop="major_name" label="????????????" align="center" />
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
      <el-table-column label="????????????" width="180" align="center">
        <template #default="{ row }">
          {{ moment(row.create_time).format(DATE_TIME_FORMAT) }}
        </template>
      </el-table-column>
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
            @confirm="handleDelete(row.major_id)"
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
        prop="major_name"
        label="????????????"
        :rules="{
          required: true,
          message: '?????????????????????',
          trigger: 'blur'
        }"
      >
        <el-input v-model="dialogForm.major_name" placeholder="????????????" />
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
        >
          <el-option
            v-for="item in collegeList"
            :key="item.college_id"
            :label="item.college_name"
            :value="item.college_id"
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
