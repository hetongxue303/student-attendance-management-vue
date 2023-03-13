<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import { ElTable, FormInstance } from 'element-plus'
import { cloneDeep } from 'lodash'
import { delayRequest } from '../../../utils/common'
import { Menu } from '../../../types/entity'
import {
  batchDeleteMenu,
  deleteMenu,
  getMenuListByTree,
  updateMenu
} from '../../../api/menu'
import moment from 'moment'
import { DATE_TIME_FORMAT } from '../../../settings'
import {
  ConfirmBox,
  NotificationError,
  NotificationSuccess
} from '../../../utils/element-plus'
import { QueryMenuTree } from '../../../types/query'

const loading = ref(false)
const expand = ref(false)
const showLoading = ref(false)
const statusLoading = ref(false)
const tableData = ref<Menu[]>()
const tableRef = ref<InstanceType<typeof ElTable>>()
const selection = ref<Menu[]>([])
const query: QueryMenuTree = reactive({})
const disabled = reactive({
  add: false,
  update: true,
  delete: true,
  export: true
})
const initTableData = () => {
  loading.value = true
  delayRequest(
    () => {
      getMenuListByTree(query)
        .then(({ data }) => {
          if (data.code === 200) tableData.value = cloneDeep(data.content)
        })
        .finally(() => (loading.value = false))
    },
    5,
    500
  )
}
// const reset = () => {}
const handleSelectionChange = (data: Menu[]) => (selection.value = data)
const handleShow = (row: Menu) => {
  showLoading.value = true
  ConfirmBox(
    `确定${row.is_show ? '显示' : '不显示'}该菜单吗?`,
    '提示',
    () => {
      updateMenu(row)
        .then(({ data }) => {
          if (data.code === 200) {
            NotificationSuccess('修改成功')
            initTableData()
            return
          }
          NotificationError('修改失败,请重试！')
        })
        .catch(() => (row.is_show = !row.is_show))
    },
    () => null,
    () => (showLoading.value = false)
  )
}
const handleStatus = (menu: Menu) => {
  statusLoading.value = true
  ConfirmBox(
    `确定${menu.is_status ? '启用' : '禁用'}该菜单吗?`,
    '提示',
    () => {
      updateMenu(menu)
        .then(({ data }) => {
          if (data.code === 200) {
            NotificationSuccess(`${menu.is_status ? '启用' : '禁用'}成功`)
            initTableData()
            return
          }
          NotificationError(`${menu.is_status ? '启用' : '禁用'}失败,请重试!`)
        })
        .catch(() => (menu.is_status = !menu.is_status))
    },
    () => null,
    () => (statusLoading.value = false)
  )
}
watch(
  () => query,
  () => initTableData(),
  { deep: true }
)
watch(
  () => selection.value,
  (value) => {
    disabled.update = value.length !== 1
    disabled.delete = value.length < 1
  },
  { immediate: true, deep: true }
)
onMounted(() => initTableData())

const dialog = ref(false)
const dialogTitle = ref('')
const dialogForm = ref<Menu>({})
const dialogFormRef = ref<FormInstance>()
const dialogOperate = ref<string>('')
const openDialog = (operate: string, row?: Menu) => {
  if (operate === 'add') {
    dialogTitle.value = '新增'
  } else {
    dialogTitle.value = '编辑'
    if (row) {
      dialogForm.value = cloneDeep(row)
    } else {
      dialogForm.value = cloneDeep(selection.value[0])
    }
  }
  dialog.value = true
  dialogOperate.value = operate
}
// const handleOperate = async (formEl?: FormInstance) => {
//   if (!formEl) return
//   await formEl.validate(async (valid) => {
//     if (valid) {
//       const { value } = dialogForm
//       if (dialogOperate.value === 'add') {
//         addRole(value).then(({ data }) => {
//           if (data.code === 200) {
//             NotificationSuccess('添加成功')
//             dialog.value = false
//             initTableData()
//             return
//           }
//           NotificationError('添加失败，请重试!')
//         })
//       } else {
//         updateRole(value).then(({ data }) => {
//           if (data.code === 200) {
//             NotificationSuccess('修改成功')
//             dialog.value = false
//             initTableData()
//             return
//           }
//           NotificationError('修改失败，请重试!')
//         })
//       }
//     }
//   })
// }
const handleDelete = (menu_id: number) => {
  ConfirmBox('确认删除这个菜单吗?', '提示', () => {
    deleteMenu(menu_id).then(async ({ data }) => {
      if (data.code === 200) {
        NotificationSuccess('删除成功')
        initTableData()
        return
      }
      NotificationError('删除失败，请重试!')
    })
  })
}
const handleBatchDelete = () => {
  ConfirmBox('确认删除选中的数据吗?', '提示', () => {
    batchDeleteMenu(
      selection.value.map((item: Menu) => item.menu_id) as number[]
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
        <el-button type="warning" :style="{ borderRadius: '5px' }">
          重置
        </el-button>
      </el-col>
    </el-row>
    <!--    <el-row :gutter="10" :style="{ marginBottom: '15px', marginLeft: '1px' }">-->
    <!--      <el-button-->
    <!--        type="success"-->
    <!--        :style="{ borderRadius: '5px' }"-->
    <!--        @click="openDialog('add')"-->
    <!--      >-->
    <!--        新增-->
    <!--      </el-button>-->
    <!--      <el-button-->
    <!--        type="danger"-->
    <!--        :disabled="disabled.delete"-->
    <!--        :style="{ borderRadius: '5px' }"-->
    <!--        @click="handlerBatchDelete"-->
    <!--      >-->
    <!--        删除-->
    <!--      </el-button>-->
    <!--      <el-button-->
    <!--        type="warning"-->
    <!--        :disabled="disabled.update"-->
    <!--        :style="{ borderRadius: '5px' }"-->
    <!--        @click="openDialog('update')"-->
    <!--      >-->
    <!--        修改-->
    <!--      </el-button>-->
    <!--    </el-row>-->
    <el-table
      ref="tableRef"
      v-loading="loading"
      border
      stripe
      :data="tableData"
      :style="{ width: '100%' }"
      table-layout="fixed"
      row-key="menu_id"
      :default-expand-all="expand"
      empty-text="暂无数据"
      header-row-class-name="table-header-row-style"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="30" align="center" />
      <el-table-column prop="menu_title" label="标题" width="150" />
      <el-table-column label="图标" align="center" width="60">
        <template #default="{ row }">
          <svg-icon :name="row.icon" :ml="10" />
        </template>
      </el-table-column>
      <el-table-column prop="router_name" label="名称" align="center" />
      <el-table-column
        prop="router_path"
        label="地址"
        align="center"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="类型" width="100" align="center">
        <template #default="{ row }">
          <el-tag
            v-if="row.menu_type === 1 && !row.is_sub"
            type="danger"
            disable-transitions
          >
            菜单选项
          </el-tag>
          <el-tag
            v-else-if="row.menu_type === 1 && row.is_sub"
            type="success"
            disable-transitions
          >
            菜单目录
          </el-tag>
          <el-tag v-else type="info" disable-transitions>页面按钮</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="显示" align="center" width="80">
        <template #default="{ row }">
          <el-switch
            v-model="row.is_show"
            :loading="showLoading"
            @change="handleShow(row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="80">
        <template #default="{ row }">
          <el-switch
            v-model="row.is_status"
            :loading="statusLoading"
            @change="handleStatus(row)"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="修改时间"
        width="180"
        align="center"
        :show-overflow-tooltip="true"
      >
        <template #default="{ row }">
          {{ moment(row.update_time).format(DATE_TIME_FORMAT) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="180">
        <template #default="{ row }">
          <el-tooltip content="拖动排序" placement="top" effect="dark">
            <el-button class="table-button" icon="Rank" type="info" />
          </el-tooltip>
          <el-tooltip content="编辑" placement="top" effect="dark">
            <el-button
              class="table-button"
              icon="EditPen"
              type="primary"
              @click="openDialog('update', row)"
            />
          </el-tooltip>
          <el-tooltip content="删除" placement="top" effect="dark">
            <el-button
              icon="Delete"
              class="table-button"
              type="danger"
              @click="handleDelete(row.menu_id)"
            />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </el-card>

  <!--  <el-dialog-->
  <!--    v-model="dialog"-->
  <!--    width="30%"-->
  <!--    destroy-on-close-->
  <!--    :title="dialogTitle"-->
  <!--    :show-close="false"-->
  <!--    :close-on-click-modal="false"-->
  <!--    :style="{ borderRadius: '10px' }"-->
  <!--  >-->
  <!--    <el-form ref="dialogFormRef" :model="dialogForm" label-width="80">-->
  <!--      <el-form-item-->
  <!--        prop="role_name"-->
  <!--        label="菜单标题"-->
  <!--        :rules="{-->
  <!--          required: true,-->
  <!--          message: '请输入菜单标题',-->
  <!--          trigger: 'blur'-->
  <!--        }"-->
  <!--      >-->
  <!--        <el-input v-model="dialogForm.menu_title" placeholder="菜单标题" />-->
  <!--      </el-form-item>-->
  <!--    </el-form>-->
  <!--    <template #footer>-->
  <!--      <el-button type="danger" text @click="dialog = false">返回</el-button>-->
  <!--      <el-button type="primary" @click="handlerOperate(dialogFormRef)">-->
  <!--        确认-->
  <!--      </el-button>-->
  <!--    </template>-->
  <!--  </el-dialog>-->
</template>

<style scoped lang="scss">
.table-style {
  font-size: 14px;
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
    Microsoft YaHei, SimSun, sans-serif;
}

:deep(.table-header-row-style) {
  font-weight: bold;
  color: black;
}

:deep(.el-button.table-button) {
  height: 25px;
  width: 25px;
  padding: 5px;
  margin-right: -2px;

  &:last-child {
    margin-right: 0;
  }
}
</style>
