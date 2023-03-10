<script setup lang="ts">
withDefaults(defineProps<{ collapse: boolean }>(), { collapse: false })
</script>

<template>
  <div class="logo_content">
    <img src="https://eladmin.vip/demo/static/img/logo.381d6a3e.png" alt="" />
    <span v-show="!collapse">学生考勤管理系统</span>
  </div>
</template>

<style scoped lang="scss">
.logo_content {
  width: auto;
  height: 50px;
  background-color: #304156;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    height: 40px;
    width: 40px;
  }

  span {
    color: white;
    font-size: 18px;
    margin-left: 5px;
  }
}
</style>
