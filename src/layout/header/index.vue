<script setup lang="ts">
import Collapse from './components/collapse.vue'
import FullScreen from './components/fullScreen.vue'
import Center from './components/center.vue'
</script>

<template>
  <div class="header-parent">
    <div class="left">
      <Collapse />
    </div>
    <div class="right">
      <full-screen class="components-space" />
      <Center />
    </div>
  </div>
</template>

<style scoped lang="scss">
.header-parent {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;

  .left {
    width: 50%;
    display: flex;
    justify-content: start;
    align-items: center;
  }

  .right {
    width: 50%;
    display: flex;
    justify-content: end;

    .components-space {
      margin-right: 5px;
    }
  }
}
</style>
