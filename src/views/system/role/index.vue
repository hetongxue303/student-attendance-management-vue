<script setup lang="ts">
import Pagination from '@components/pagination/index.vue'
import { onMounted, reactive, ref, watch } from 'vue'
import { ElTable, ElTree, FormInstance } from 'element-plus'
import { delayRequest } from '../../../utils/common'
import { clone, cloneDeep } from 'lodash'
import {
  ConfirmBox,
  MessageWarning,
  NotificationError,
  NotificationSuccess
} from '../../../utils/element-plus'
import { Menu, Role } from '../../../types/entity'
import { QueryRole } from '../../../types/query'
import {
  addRole,
  batchDeleteRole,
  deleteRole,
  getRoleListByPage,
  updateRole,
  updateRoleStatus
} from '../../../api/role'
import { useUserStore } from '../../../store/modules/user'
import { filterMenuKey, filterMenuTree, Tree } from '../../../filter/menu'
import {
  getMenuListAll,
  getMenuListByTree,
  getMenuTreeListByRoleId
} from '../../../api/menu'

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
const handleSwitchChange = (role: Role) => {
  switchLoading.value = true
  ConfirmBox(
    `确定${role.is_status ? '启用' : '禁用'} ${role.role_name} 吗?`,
    '提示',
    () => {
      updateRoleStatus(role).then(({ data }) => {
        if (data.code === 200) {
          NotificationSuccess(`${role.is_status ? '启用' : '禁用'}成功`)
          return
        }
        NotificationError(`${role.is_status ? '启用' : '禁用'}失败,请重试!`)
      })
    },
    () => (role.is_status = !role.is_status),
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

const menuTree = ref<Tree[]>([])
const treeRef = ref<InstanceType<typeof ElTree>>()
const roleMenuTreeList = ref<Menu[]>([])
const menuListAll = ref<Menu[]>([])
const checkedMenuKeys = ref<number[]>([])
const getMenuTree = () => {
  getMenuListByTree().then(
    ({ data }) =>
      (menuTree.value =
        data.code === 200 ? filterMenuTree(data.content, 0) : [])
  )
}
const getMyMenuTree = (role_id: number) => {
  roleMenuTreeList.value = []
  checkedMenuKeys.value = []
  getMenuTreeListByRoleId(role_id).then(({ data }) => {
    if (data.code === 200) {
      roleMenuTreeList.value = cloneDeep(data.content)
      checkedMenuKeys.value = filterMenuKey(roleMenuTreeList.value)
    }
  })
}
const getMenuList = () => {
  getMenuListAll().then(({ data }) => {
    menuListAll.value = data.code === 200 ? cloneDeep(data.content) : []
  })
}
onMounted(() => {
  getMenuTree()
  getMenuList()
})

const dialog = ref(false)
const dialogTitle = ref('')
const dialogForm = ref<Role>({ is_status: false })
const dialogFormRef = ref<FormInstance>()
const dialogOperate = ref<string>('')
const openDialog = (operate: string, row?: Role) => {
  if (operate === 'add') {
    dialogTitle.value = '新增'
  } else {
    dialogTitle.value = '编辑'
    getMyMenuTree(row?.role_id as number)
    dialogForm.value = row ? cloneDeep(row) : cloneDeep(selection.value[0])
  }
  dialog.value = true
  dialogOperate.value = operate
}
const handleOperate = async (formEl?: FormInstance) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      const { value } = dialogForm
      const ids = (treeRef.value?.getCheckedKeys() as number[]).concat(
        treeRef.value?.getHalfCheckedKeys() as number[]
      )
      if (dialogOperate.value === 'add') {
        addRole({ role: value, menu_ids: ids })
          .then(({ data }) => {
            if (data.code === 200) {
              NotificationSuccess('添加成功')
              dialog.value = false
              initTableData()
              return
            }
            NotificationError('添加失败，请重试!')
          })
          .catch(({ response }) => MessageWarning(response.data.message))
      } else {
        updateRole({ role: value, menu_ids: ids })
          .then(({ data }) => {
            if (data.code === 200) {
              NotificationSuccess('修改成功')
              dialog.value = false
              initTableData()
              return
            }
            NotificationError('修改失败，请重试!')
          })
          .catch(({ response }) => MessageWarning(response.data.message))
      }
    }
  })
}
const handleDelete = (id: number) => {
  deleteRole(id)
    .then(async ({ data }) => {
      if (data.code === 200) {
        NotificationSuccess('删除成功')
        initTableData()
        return
      }
      NotificationError('删除失败，请重试!')
    })
    .catch(({ response }) => MessageWarning(response.data.message))
}
const handleBatchDelete = () => {
  ConfirmBox('确认删除选中的数据吗?', '提示', () => {
    batchDeleteRole(
      selection.value.map((item: Role) => item.role_id) as number[]
    )
      .then(({ data }) => {
        if (data.code === 200) {
          NotificationSuccess('删除成功')
          initTableData()
          return
        }
        NotificationError('删除失败，请重试!')
      })
      .catch(({ response }) => MessageWarning(response.data.message))
  })
}
watch(
  () => dialog.value,
  (value) => {
    if (!value) {
      dialogForm.value = { is_status: false }
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
            :disabled="useUserStore().getRoles.includes(row.role_code)"
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
            @confirm="handleDelete(row.role_id)"
          >
            <template #reference>
              <el-button
                :disabled="useUserStore().getRoles.includes(row.role_code)"
                type="danger"
                :style="{ borderRadius: '5px' }"
              >
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
    <el-form ref="dialogFormRef" :model="dialogForm" label-width="50">
      <el-form-item
        prop="role_name"
        label="名称"
        :rules="{
          required: true,
          message: '请输入角色名称',
          trigger: 'blur'
        }"
      >
        <el-input v-model="dialogForm.role_name" placeholder="角色名称" />
      </el-form-item>
      <el-form-item
        prop="role_name"
        label="标识"
        :rules="{
          required: true,
          message: '请输入角色标识',
          trigger: 'blur'
        }"
      >
        <el-input v-model="dialogForm.role_code" placeholder="角色标识" />
      </el-form-item>
      <el-form-item
        v-show="dialogOperate === 'add'"
        prop="is_status"
        label="状态"
        :rules="{
          required: true,
          message: '请选择状态',
          trigger: 'blur'
        }"
      >
        <el-radio-group v-model="dialogForm.is_status">
          <el-radio-button :label="true">启用</el-radio-button>
          <el-radio-button :label="false">禁用</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="权限" :rules="{ required: true, trigger: 'blur' }">
        <el-tree
          ref="treeRef"
          :data="menuTree"
          node-key="id"
          :default-checked-keys="checkedMenuKeys"
          highlight-current
          show-checkbox
          :props="{
            label: 'label',
            children: 'children'
          }"
        />
      </el-form-item>
      <el-form-item label="描述">
        <el-input
          v-model="dialogForm.description"
          type="textarea"
          resize="none"
          :rows="3"
          placeholder="描述(默认：无)"
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
