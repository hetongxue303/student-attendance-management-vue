<script setup lang="ts">
import Pagination from '@components/pagination/index.vue'
import { onMounted, reactive, ref, watch } from 'vue'
import { ElTable, FormInstance } from 'element-plus'
import { delayRequest } from '../../../utils/common'
import { clone, cloneDeep } from 'lodash'
import {
  ConfirmBox,
  NotificationError,
  NotificationSuccess
} from '../../../utils/element-plus'
import { Role } from '../../../types/entity'
import { QueryRole } from '../../../types/query'
import {
  addRole,
  batchDeleteRole,
  deleteRole,
  getRoleListByPage,
  updateRole
} from '../../../api/role'

const total = ref(0)
const loading = ref(false)
const switchLoading = ref(false)
const tableData = ref<Role[]>()
const tableRef = ref<InstanceType<typeof ElTable>>()
const selection = ref<Role[]>([])
const query: QueryRole = reactive({ page: 1, size: 5 })
const disabled = reactive({
  add: false,
  update: true,
  delete: true,
  export: true
})
const handleCurrent = (page: number) => (query.page = page)
const handleSize = (size: number) => (query.size = size)
const handleSelectionChange = (data: Role[]) => (selection.value = data)
const reset = () => {
  query.role_name = undefined
}
const initTableData = () => {
  loading.value = true
  delayRequest(
    () => {
      getRoleListByPage(query)
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
const handleSwitchChange = (user: Role) => {
  switchLoading.value = true
  ConfirmBox(
    `确定${user.is_status ? '启用' : '禁用'} ${user.role_name} 吗?`,
    '提示',
    () => {
      updateRole(user).then(({ data }) => {
        if (data.code === 200) {
          NotificationSuccess(`${user.is_status ? '启用' : '禁用'}成功`)
          return
        }
        NotificationError(`${user.is_status ? '启用' : '禁用'}失败,请重试!`)
      })
    },
    () => (user.is_status = !user.is_status),
    () => (switchLoading.value = false)
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
const dialogForm = ref<Role>({})
const dialogFormRef = ref<FormInstance>()
const dialogOperate = ref<string>('')
const openDialog = (operate: string, row?: Role) => {
  if (operate === 'add') {
    dialogTitle.value = '新增'
  } else {
    dialogTitle.value = '编辑'
    if (row) {
      dialogForm.value = cloneDeep(row)
    } else {
      dialogForm.value = cloneDeep(selection.value[0] as Role)
    }
  }
  dialog.value = true
  dialogOperate.value = operate
}
const handleOperate = async (formEl?: FormInstance) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      const { value } = dialogForm
      if (dialogOperate.value === 'add') {
        addRole(value).then(({ data }) => {
          if (data.code === 200) {
            NotificationSuccess('添加成功')
            dialog.value = false
            initTableData()
            return
          }
          NotificationError('添加失败，请重试!')
        })
      } else {
        updateRole(value).then(({ data }) => {
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
  deleteRole(id).then(async ({ data }) => {
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
    batchDeleteRole(
      selection.value.map((item: Role) => item.role_id) as number[]
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
        <el-input v-model="query.role_name" placeholder="角色名称" />
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
      <el-table-column type="selection" width="30" align="center" />
      <el-table-column prop="role_id" label="ID" width="50" />
      <el-table-column prop="role_name" label="角色名称" align="center" />
      <el-table-column prop="role_code" label="角色标识" align="center" />
      <el-table-column label="状态" width="180" align="center">
        <template #default="{ row }">
          <el-switch
            v-model="row.is_status"
            style="
              --el-switch-on-color: #13ce66;
              --el-switch-off-color: #ff4949;
            "
            :loading="switchLoading"
            @change="handleSwitchChange(row)"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="description"
        label="班级描述"
        align="center"
        show-overflow-tooltip="true"
      />
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
        prop="role_name"
        label="角色名称"
        :rules="{
          required: true,
          message: '请输入角色名称',
          trigger: 'blur'
        }"
      >
        <el-input v-model="dialogForm.role_name" placeholder="角色名称" />
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
