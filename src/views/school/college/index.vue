<script setup lang="ts">
import Pagination from '@components/pagination/index.vue'
import { onMounted, reactive, ref, watch } from 'vue'
import { QueryCollege } from '../../../types/query'
import { College } from '../../../types/entity'
import { ElTable, FormInstance } from 'element-plus'
import { delayRequest } from '../../../utils/common'
import { clone, cloneDeep } from 'lodash'
import moment from 'moment'
import { DATE_TIME_FORMAT } from '../../../settings'
import {
  addCollege,
  batchDeleteCollege,
  deleteCollege,
  getCollegeListByPage,
  updateCollege
} from '../../../api/college'
import {
  ConfirmBox,
  NotificationError,
  NotificationSuccess
} from '../../../utils/element-plus'

const total = ref(0)
const loading = ref(false)
const tableData = ref<College[]>()
const tableRef = ref<InstanceType<typeof ElTable>>()
const selection = ref<College[]>([])
const query: QueryCollege = reactive({ page: 1, size: 5 })
const disabled = reactive({
  add: false,
  update: true,
  delete: true,
  export: true
})
const handleCurrent = (page: number) => (query.page = page)
const handleSize = (size: number) => (query.size = size)
const handleSelectionChange = (data: College[]) => (selection.value = data)
const reset = () => {
  query.college_name = undefined
}
const initTableData = () => {
  loading.value = true
  delayRequest(
    () => {
      getCollegeListByPage(query)
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
const dialogForm = ref<College>({})
const dialogFormRef = ref<FormInstance>()
const dialogOperate = ref<string>('')
const openDialog = (operate: string, row?: College) => {
  if (operate === 'add') {
    dialogTitle.value = '新增'
  } else {
    dialogTitle.value = '编辑'
    if (row) {
      dialogForm.value = cloneDeep(row)
    } else {
      dialogForm.value = cloneDeep(selection.value[0] as College)
    }
  }
  dialog.value = true
  dialogOperate.value = operate
}
const handlerOperate = async (formEl?: FormInstance) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      const { value } = dialogForm
      if (dialogOperate.value === 'add') {
        addCollege(value).then(({ data }) => {
          if (data.code === 200) {
            NotificationSuccess('添加成功')
            dialog.value = false
            initTableData()
            return
          }
          NotificationError('添加失败，请重试!')
        })
      } else {
        updateCollege(value).then(({ data }) => {
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
const handlerDelete = (id: number) => {
  deleteCollege(id).then(async ({ data }) => {
    if (data.code === 200) {
      NotificationSuccess('删除成功')
      initTableData()
      return
    }
    NotificationError('删除失败，请重试!')
  })
}
const handlerBatchDelete = () => {
  ConfirmBox('确认删除选中的数据吗?', '提示', () => {
    batchDeleteCollege(
      selection.value.map((item: College) => item.college_id) as number[]
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
        @click="handlerBatchDelete"
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
      <el-table-column type="selection" width="30" align="center" />
      <el-table-column prop="college_id" label="ID" width="50" />
      <el-table-column prop="college_name" label="学院名称" align="center" />
      <el-table-column
        prop="description"
        label="学院描述"
        align="center"
        show-overflow-tooltip="true"
      />
      <el-table-column label="创建时间" width="180" align="center">
        <template #default="{ row }">
          {{ moment(row.create_time).format(DATE_TIME_FORMAT) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="180">
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
            @confirm="handlerDelete(row.college_id)"
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
        prop="college_name"
        label="学院名称"
        :rules="{
          required: true,
          message: '请输入学院名称',
          trigger: 'blur'
        }"
      >
        <el-input v-model="dialogForm.college_name" placeholder="学院名称" />
      </el-form-item>
      <el-form-item label="学院描述">
        <el-input
          v-model="dialogForm.description"
          type="textarea"
          resize="none"
          :rows="3"
          placeholder="学院描述(默认：无)"
        />
      </el-form-item>
      <el-form-item v-show="dialogOperate === 'update'" label="创建时间">
        <span :style="{ color: '#7a8b9a', fontSize: '13px' }">
          {{ moment(dialogForm.create_time).format(DATE_TIME_FORMAT) }}
        </span>
      </el-form-item>
      <el-form-item v-show="dialogOperate === 'update'" label="更新时间">
        <span :style="{ color: '#7a8b9a', fontSize: '13px' }">
          {{ moment(dialogForm.update_time).format(DATE_TIME_FORMAT) }}
        </span>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="danger" text @click="dialog = false">返回</el-button>
      <el-button type="primary" @click="handlerOperate(dialogFormRef)">
        确认
      </el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss"></style>
