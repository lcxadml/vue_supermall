<template>

  <el-container class="home-container">
      <!-- 头部区域 -->
  <el-header>
      <div class="headbox">
          <img src="../assets/heima.png" alt="">
          <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
  </el-header>
  <el-container>
      <!-- 侧边栏 -->
    <el-aside :width="isCollapse?'64px' : '200px'" ref="aside">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区域 -->
        <el-menu
      background-color="#333744"
      text-color="#fff"
      unique-opened
      :collapse="isCollapse"
      :collapse-transition="false"
      router
      :default-active="activePath"
      active-text-color="#409EFF">
      
       <!-- 一级菜单 -->
      <el-submenu :index="index+''" v-for="(item,index) in menuList" :key="item.id">
           <!-- 一级菜单的模板 -->
        <template slot="title">
            <!-- 图标 -->
          <i :class="iconsObj[index]"></i>
          <!-- 文本 -->
          <span>{{item.authName}}</span>
        </template>
        <!-- 二级菜单 -->
         <el-menu-item :index="'/'+i.path+''" v-for="i in item.children" :key="i.id" @click="changeActive('/'+i.path+'')">
                 <!-- 一级菜单的模板 -->
        <template slot="title">
            <!-- 图标 -->
          <i class="el-icon-menu"></i>
          <!-- 文本 -->
          <span>{{i.authName}}</span>
        </template>
         </el-menu-item>
      </el-submenu>
     
    
    </el-menu>
    </el-aside>
    <!-- 右侧 主体区域 -->
    <el-main><router-view></router-view></el-main>
  </el-container>
</el-container>
</template>

<script>
export default {
   data(){
       return {
        //    左侧菜单数据
           menuList:[],
           iconsObj:{
               '0':"iconfont icon-user",
               '1':"iconfont icon-tijikongjian",
               '2':"iconfont icon-shangpin",
               '3':"iconfont icon-danju",
               '4':"iconfont icon-baobiao"
           },
           menuIndex:'',
        //    是否折叠
           isCollapse:false,
        //    被激活的连接地址  
           activePath:'/users'
       }

   },
  methods: {
    //   保存连接的激活状态
      changeActive(activePath){
          sessionStorage.setItem('activePath',activePath)
        this.activePath = activePath
      },
    logout() {
      sessionStorage.clear()
      this.$router.push("/login")
    },
   async getMeunList(){
      const {data:res} = await this.$http.get('menus');
      if(res.meta.status!==200) return this.$message.error(res.meta.msg);
      this.menuList = res.data
    
    },
    // 点击按钮切换菜单的折叠与展开
    toggleCollapse(){
        this.isCollapse = !this.isCollapse
    }
  },
   created(){
       this.activePath = window.sessionStorage.getItem('activePath')
        this.getMeunList()
    }
}
</script>

<style lang='less' scoped>
.el-header {
    display: flex;
    justify-content: space-between;
    background-color: #373d41;
    padding-left: 0;
    align-items: center;
}
.el-aside {
    background-color: #333744;
}
.el-main {
    background-color: #eaedf1;
}
.home-container {
    height: 100%;
}
.headbox {
    display: flex;
    color: #fff;
    font-size: 20px;
    margin-bottom: 10px;
    align-items: center;
   span{
       margin-left: 15px;
    }
}
.iconfont {
    margin-right: 10px;
}
.el-menu {
    border-right: 0px;
}
.toggle-button {
    text-align: center;
    line-height: 24px;
    height: 24px;
    color: #fff;
    background-color: #4A5064;
    cursor: pointer;
    letter-spacing: 3px;
    font-size: 10px;
}
</style>