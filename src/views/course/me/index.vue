<script setup lang="ts">
import Pagination from '@components/pagination/index.vue'
import { onMounted, reactive, ref, watch } from 'vue'
import { ElTable } from 'element-plus'
import { delayRequest } from '../../../utils/common'
import { clone, cloneDeep } from 'lodash'
import { MyCourse, User } from '../../../types/entity'
import { QueryCourseMe } from '../../../types/query'
import { getCourseListMe } from '../../../api/course'
import { useUserStore } from '../../../store/modules/user'
import { getUserListByPageCourseById } from '../../../api/user'

const total = ref(0)
const loading = ref(false)
const tableData = ref<MyCourse[]>()
const tableRef = ref<InstanceType<typeof ElTable>>()
const query: QueryCourseMe = reactive({
  page: 1,
  size: 5,
  username: useUserStore().getUsername
})
const handleCurrent = (page: number) => (query.page = page)
const handleSize = (size: number) => (query.size = size)
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

const detailDialog = ref(false)
const detailTotal = ref(0)
const detailData = ref<User[]>([])
const detailRef = ref<InstanceType<typeof ElTable>>()
const detailQuery: QueryCourseMe = reactive({
  page: 1,
  size: 5
})
const openDetailDialog = (row: MyCourse) => {
  detailDialog.value = true
  detailQuery.course_id = row.course_id
  getUserListByPageCourseById(detailQuery).then(({ data }) => {
    if (data.code === 200) {
      detailTotal.value = clone(data.content.total)
      detailData.value = cloneDeep(data.content.record)
    }
  })
}
</script>

<template>
  <el-dialog
    v-model="detailDialog"
    :style="{ borderRadius: '10PX' }"
    title="查看详情"
    width="50%"
    destroy-on-close
    :show-close="false"
    :close-on-click-modal="false"
  >
    <el-table ref="detailRef" :data="detailData" empty-text="暂无数据">
      <el-table-column prop="real_name" label="姓名" />
    </el-table>
    <template #footer>
      <el-button text type="danger" @click="detailDialog = false">
        返回
      </el-button>
      <el-button type="primary">确定</el-button>
    </template>
  </el-dialog>
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
    >
      <el-table-column prop="course_name" label="名称" />
      <el-table-column prop="teacher_name" label="教师" />
      <el-table-column prop="time" label="学时">
        <template #default="{ row }"> {{ row.time }}次</template>
      </el-table-column>
      <el-table-column prop="count" label="人数">
        <template #default="{ row }"> {{ row.count }}人</template>
      </el-table-column>
      <el-table-column v-role="['student']" prop="checked_in" label="签到次数">
        <template #default="{ row }">
          {{
            row.status === -1 || row.status === 2 ? '无记录' : row.checked_in
          }}
        </template>
      </el-table-column>
      <el-table-column v-role="['student']" prop="status" label="状态">
        <template #default="{ row }">
          <el-tag v-if="row.status === -1" type="warning" disable-transitions>
            未处理
          </el-tag>
          <el-tag
            v-else-if="row.status === 1"
            type="success"
            disable-transitions
          >
            已同意
          </el-tag>
          <el-tag v-else type="danger" disable-transitions> 已拒绝</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="180">
        <template #default="{ row }">
          <el-button
            type="primary"
            :style="{ borderRadius: '5px' }"
            @click="openDetailDialog(row)"
          >
            查看详情
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

<style scoped lang="scss"></style>
