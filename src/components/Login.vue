<template>
  <div class="login_container">
      
     <div class="login_box">
         <!-- 头像区 -->
<div class="avatar_box">
          <img src="../assets/logo.png" alt="">
      </div>
      <!-- 登录表单区域 -->
      <el-form  :model="loginForm"  :rules="LoginRormRules" class="login_form" ref="LoginFromRefs">
          <!-- 用户名区域 -->
  <el-form-item  prop="username">
    <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
  </el-form-item>
  <!-- 密码区域 -->
   <el-form-item prop="password">
       <el-input type="password"  v-model="loginForm.password" prefix-icon="iconfont icon-3702mima"></el-input>
  </el-form-item>
  <!-- 按钮区域 -->
    <el-form-item class="buns">
     <el-button type="primary" @click="login">登录</el-button>
         <el-button type="info" @click="restForm">重置</el-button>
  </el-form-item>
  </el-form>
     </div>
      </div>
</template>

<script>
export default {
  name:"login",
  data(){
    return {
      // 表单绑定的数据
      loginForm:{
        username:'admin',
        password:'123456'
      },
      // 表单的验证规则
    LoginRormRules:{
      // 验证用户名是否合法
      username:[
             { required: true, message: '请输入登录名称', trigger: 'blur' },
         { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
      ],
      // 验证密码是否合法
      password:[
     { required: true, message: '请输入登录名称', trigger: 'blur' },
      { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
      ]
    }
    }
  },
  methods:{
    restForm(){
      this.$refs.LoginFromRefs.resetFields()
    },
    login(){
      this.$refs.LoginFromRefs.validate(async(valid)=>{
          if(!valid) return;
          const {data} =await this.$http.post('login',this.loginForm)
          console.log(data);
          if(data.meta.status !=200)return  this.$message.error("密码错误")
          console.log(data.data.token);
          sessionStorage.setItem("token",data.data.token)
           this.$router.push("/home")
        return   this.$message.success("登录成功")
      })
    }
  }
}
</script>

<style scoped lang="less">
.login_container {
    background: #2b4b6b;
    height: 100%;
}
.login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    .avatar_box {
        padding: 10px;
        width: 130px;
        height: 130px;
    border-radius: 50%;
    overflow: hidden;
    border: 1px solid #eee;
    background-color: #fff;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    top: 0;
    transform: translate(-50%,-50%);
    img{
        width: 100%;
    background-color: #eee;
    border-radius: 50%;
    overflow: hidden;

    }
}
.login_form {
    box-sizing: border-box;
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 10px;
}
.buns {
  display: flex;
  justify-content: flex-end;
}

}

</style>