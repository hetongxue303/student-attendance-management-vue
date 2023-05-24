<script setup lang="ts">
import { useUserStore } from '../../store/modules/user'
import bg from '../../assets/images/bg.jpg'
</script>

<template>
  <div style="height: 100%; width: 100%">
    <span style="font-size: 22px; font-weight: 500">
      你好，
      {{ useUserStore().realName }}！
    </span>
    <el-image
      :src="bg"
      fit="cover"
      style="width: 100%; height: 640px; border-radius: 15px; margin-top: 15px"
    />
  </div>
</template>

<style scoped lang="scss"></style>
