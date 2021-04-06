<template>
  <div>
   <!-- 面包屑导航区 -->
      <el-breadcrumb separator="/">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item><a href="javascript:;">权限管理</a></el-breadcrumb-item>
  <el-breadcrumb-item>权限列表</el-breadcrumb-item>
</el-breadcrumb>
<!-- 卡片视图区 -->
<el-card class="box-card">
  <!-- stripe 隔行变色效果 -->
<el-table :data="RightList" border stripe> 
  <el-table-column type="index" label='#'></el-table-column>
  <el-table-column label="权限名称" prop="authName"></el-table-column>
  <el-table-column label="路径" prop="path"></el-table-column>
  <el-table-column label="权限等级" prop="level">
    <template slot-scope="scope">
 <el-tag v-if="scope.row.level==='0'"> 一级</el-tag>
 <el-tag v-else-if="scope.row.level==='1'" type="success"> 二级</el-tag>
 <el-tag  v-else  type="warning"> 三级</el-tag>
    </template>
  </el-table-column>
</el-table>

</el-card>
  </div>
</template>

<script>
export default {
  data(){
    return {
      RightList:[]
    }
  },
created(){
  // 获取权限列表
  this.getRightList()
},
methods:{
  // 获取权限列表
  async  getRightList(){
    const {data:res} =  await this.$http.get('rights/list')
   this.RightList = res.data
    }
}
}
</script>

<style>

</style>