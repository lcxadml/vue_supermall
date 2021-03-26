<template>
  <div id="app">
    <!-- 路由占位符 -->
      <router-view></router-view>
  
  </div>
</template>

<script>

import login from "./components/login.vue"
export default {
  components: { login },

  
  name: 'App'
}
</script>

<style>

</style>
