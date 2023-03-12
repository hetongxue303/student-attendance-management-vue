<script setup lang="ts">
import Sidebar from '@layout/sidebar/index.vue'
import Header from '@layout/header/index.vue'
import Footer from '@layout/footer/index.vue'
import { computed } from 'vue'
import { useAppStore } from '../store/modules/app'

const appStore = useAppStore()
const collapse = computed((): boolean => appStore.getCollapse)
</script>

<template>
  <el-container>
    <el-aside>
      <Sidebar v-model:is-collapse="collapse" />
    </el-aside>
    <el-container>
      <el-header>
        <Header />
      </el-header>
      <el-main>
        <router-view />
      </el-main>
      <el-footer>
        <Footer />
      </el-footer>
    </el-container>
  </el-container>
</template>

<style scoped lang="scss">
:deep(.el-container) {
  height: 100vh;
  width: 100vw;
  background-color: white;
}

:deep(.el-aside) {
  height: 100vh;
  width: auto;
}

:deep(.el-header) {
  padding: 0;
  margin: 0;
  width: auto;
  height: 50px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

:deep(.el-main) {
  height: 100%;
  width: 100%;
}

:deep(.el-footer) {
  height: 30px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}
</style>
