<script setup lang="ts">
import Pagination from '@components/pagination/index.vue'
import { onMounted, reactive, ref, watch } from 'vue'
import { ElTable } from 'element-plus'
import { delayRequest } from '../../../utils/common'
import { clone, cloneDeep } from 'lodash'
import { MyCourse } from '../../../types/entity'
import { QueryCourseMe } from '../../../types/query'
import { getCourseListMe } from '../../../api/course'
import { useUserStore } from '../../../store/modules/user'

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
const disabled = reactive({
  add: false,
  update: true,
  delete: true,
  export: true
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
    </el-row>
    <el-table
      ref="tableRef"
      v-loading="loading"
      :data="tableData"
      empty-text="暂无数据"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="30" align="center" />
      <el-table-column prop="course_id" label="ID" width="50" />
      <el-table-column prop="course_name" label="名称" align="center" />
      <el-table-column prop="count" label="人数" align="center">
        <template #default="{ row }">
          <el-tag type="success" disable-transitions>
            {{ row.count }}人
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="time" label="学时" align="center">
        <template #default="{ row }">
          <el-tag type="warning" disable-transitions> {{ row.time }}次</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="college.college_name"
        label="所属学院"
        align="center"
      />
      <el-table-column
        prop="description"
        label="课程描述"
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
            @confirm="handleDelete(row.course_id)"
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
</template>

<style scoped lang="scss"></style>
