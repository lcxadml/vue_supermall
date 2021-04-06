<template>
  <div>
   <!-- 面包屑导航区 -->
      <el-breadcrumb separator="/">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item><a href="javascript:;">用户管理</a></el-breadcrumb-item>
  <el-breadcrumb-item>用户列表</el-breadcrumb-item>

</el-breadcrumb>
<!-- 卡片视图区 -->
<el-card class="box-card">
<!-- 输入框区域 搜索与添加区域 -->
<el-row   :gutter="20">
  <el-col :span="7">
      <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
    <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
  </el-input>
  </el-col>
  <el-col :span="4">
    <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
  </el-col>
</el-row>

  <!-- 用户列表区 -->
   <el-table :data="userList" border stripe>
          <el-table-column type="index" label="#"> </el-table-column>
     <el-table-column label="姓名" prop="username"> </el-table-column>
     <el-table-column label="邮箱" prop="email"> </el-table-column>
     <el-table-column label="电话" prop="mobile"> </el-table-column>
     <el-table-column label="角色" prop="role_name"> </el-table-column>
     <el-table-column label="状态" > 
       <template slot-scope="scope">
       <el-switch @change="userStatusChanged(scope.row)"
  v-model="scope.row.mg_state">
</el-switch>
       </template>
     </el-table-column>
     <el-table-column label="操作" width="190px">
       <template slot-scope="scope">
         <!-- 修改按钮 -->
          
      <el-button type="primary" icon="el-icon-edit" size='mini' @click="showEditDialog(scope.row.id)"></el-button>

         <!-- 删除按钮 -->
      
   <el-button type="danger" icon="el-icon-delete" size='mini' @click="removeUserById(scope.row.id)"></el-button>
   
         <!-- 分配权限 -->
            <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
    <el-button type="warning" icon="el-icon-s-tools" size='mini'  @click="setRole(scope.row)"></el-button>
    </el-tooltip>
       </template>
     </el-table-column>
   </el-table>
<!-- 分页区域 -->
 <div class="block">
  
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :disabled = "false"
      :total="total">
    </el-pagination>
  </div>
  <!-- 添加用户的对话框 -->
  <el-dialog
  title="添加用户"
  :visible.sync="addDialogVisible"
  width="50%"
  @close="addDialogClosed"
 >
 <!-- 内容主体区 -->
 <el-form :model="addForm"
  label-width="70px"
  :rules="addFormRules" 
  ref="addFormRef"
  >
  <el-form-item label="用户名" prop="username">
    <el-input v-model="addForm.username">
    </el-input>
  </el-form-item>
   <el-form-item label="密码" prop="password">
    <el-input v-model="addForm.password">
    </el-input>
  </el-form-item>
   <el-form-item label="邮箱" prop="email">
    <el-input v-model="addForm.email">
    </el-input>
  </el-form-item>
   <el-form-item label="手机" prop="mobile">
    <el-input v-model="addForm.mobile">
    </el-input>
  </el-form-item>
  </el-form>
  <!-- 底部区域 -->
  <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
  </span>
</el-dialog>
<!--修改用户的对话框 -->
<el-dialog
  title="提示"
  :visible.sync="isshowEditDialog"
  width="50%"
  @close="editDialogClosed"
  >
  <el-form ref="editFormRef" :model="editForm" label-width="70px" :rules="addFormRules">
  <el-form-item label="用户名">
    <el-input v-model="editForm.username" disabled></el-input>
  </el-form-item>
   <el-form-item label="邮箱" prop="email">
    <el-input v-model="editForm.email" ></el-input>
  </el-form-item>
   <el-form-item label="手机">
    <el-input v-model="editForm.mobile" prop="mobile"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="isshowEditDialog = false">取 消</el-button>
    <el-button type="primary" @click="editUserInfo">确 定</el-button>
  </span>
</el-dialog>
<!-- 删除用户对话框 -->
<!-- 分配角色的对话框 -->
<el-dialog
  title="提示"
  :visible.sync="setRoleDialogVisible"
  width="50%"
  @close = "editDialogClosed"
  >
  <div>
    <p>当前的用户：{{userInfo.username}}</p>
    <p>当前的角色：{{userInfo.role_name}}</p>
    <p>分配新角色：
  <el-select v-model="selectedRoleId" placeholder="请选择">
    <el-option
      v-for="item in rolesList"
      :key="item.id"
      :label="item.roleName"
      :value="item.id">
    </el-option>
  </el-select>

    </p>
  </div>
  <span slot="footer" class="dialog-footer">
    <el-button @click="setRoleDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
  </span>
</el-dialog>
</el-card>
  </div>
</template>

<script>
export default {
data(){
  // 验证邮箱的校验规则
  var checkEmail = (rule,value,cb)=>{
    var regemail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
    // console.log(regemail.test(value))
    if(!regemail.test(value)){
    return  cb(new Error('请输入合法的邮箱'))
    }
       cb()

  }
  // 验证手机的校验规则
  var checkMobile = (rule,value,cb)=>{
    var regmobile = /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
    if(regmobile.test(value)){
      return cb()
    }
    cb(new Error('请输入合法的手机号码'))
  }
  return {
    // 获取用户列表的参数对象
  queryInfo:{
      query:'',
    pagenum:1,
    pagesize:2
 },
 userList:[],
 total:0,
//  控制对话框的显示和隐藏
 addDialogVisible:false,
//  添加用户的表单数据
 addForm:{
   username:'',
   password:'',
   email:'',
   mobile:''
 },
//  添加表单的验证规则对象
 addFormRules:{
   username:[
      { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
   ],
   password:[
     { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 15, message: '长度在 6 到 10 个字符', trigger: 'blur' }
   ],
   email:[
       { required: true, message: '请输入邮箱', trigger: 'blur' },
       {validator:checkEmail,trigger:'blur'}
   ],
   mobile:[
      { required: true, message: '请输入手机号码', trigger: 'blur' },
      {validator:checkMobile,trigger:'blur'}
            
   ]
 
 
 },
   // 控制修改用户对话框的显示与隐藏
isshowEditDialog:false,
// 查询到的用户信息对象
editForm:{},
// 编辑表单校验规则
editFormRules:{
   email:[
       { required: true, message: '请输入邮箱', trigger: 'blur' },
       {validator:checkEmail,trigger:'blur'}
   ],
   mobile:[
      { required: true, message: '请输入手机号码', trigger: 'blur' },
      {validator:checkMobile,trigger:'blur'}
            
   ]
},
// 控制分配权限窗口的显示与隐藏
setRoleDialogVisible:false,
userInfo:{},
// 所有角色的数据列表
rolesList:[],
selectedRoleId:''
  }

},
methods:{
async getUserList(){
const {data:res} =  await  this.$http.get('users',{params:this.queryInfo})
if(res.meta.status!==200) return this.$message.error("获取用户列表失败");
this.total = res.data.total
this.userList = res.data.users
},
// 监听pagesize改变的事件
handleSizeChange(newSize){

this.queryInfo.pagesize = newSize
this.getUserList()
},
handleCurrentChange(newPage){
  this.queryInfo.pagenum = newPage
 
  this.getUserList()
},
async userStatusChanged(userinfo){
 const {data:res} = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
if(res.meta.status !==200) {
userinfo.mg_state = !userinfo.mg_state
  return this.$message.error('更新用户状态失败');
}
this.$message.closeAll()
this.$message.success('更新用户状态成功')
},
// 监听添加用户对话框的关闭
addDialogClosed(){
this.$refs.addFormRef.resetFields()
},
//点击按钮添加用户
addUser(){
this.$refs.addFormRef.validate(async(valid)=>{
if(!valid) return 
// 可以发起网络请求
const {data:res}=await this.$http.post('users',this.addForm )
if(res.meta.status!=201){
  this.$message.error('添加用户失败')
}else{
  this.$message.success('添加用户成功')
  this.addDialogVisible =false
  this.getUserList()
}
})
},
// 展示编辑用户的对话框 
async showEditDialog(id){
// const {data:res} =  await this.$http.get('user/'+id)
const { data:res} = await this.$http.get('users/' + id)
//  console.log(res);
  if(res.meta.status !=200){
    return this.$message.error('查询数据失败')
  }
  this.editForm =res.data
this.isshowEditDialog = true
},
// 监听修改用户对话框的关闭事件
editDialogClosed(){
  this.$refs.editFormRef.resetFields()
},
// 修改用户信息并且提交
editUserInfo(){
  this.$refs.editFormRef.validate(
   async (valid)=>{
      if(!valid) return 
      // 发起修改用户表单的用户请求
   const {data:res} =  await this.$http.put('users/' +this.editForm.id,{
        email:this.editForm.email,mobile:this.editForm.mobile
      })
      if(res.meta.status==200){
        this.$message.success("更新成功")
        this.isshowEditDialog = false
        this.getUserList()
      }else {
        this.$message.error("更新失败")
        this.isshowEditDialog = false
      }
    }
  )
},
   removeUserById(id) {
    //  弹窗询问用户是否删除数据
      let res =   this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
        const {data:res} = await this.$http.delete('users/'+id)
      
            if(res.meta.status!=200) {
              this.$message.error(res.meta.msg)
            }else {
              this.$message.success("用户删除成功")
              this.getUserList()
            }
          
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });    
             
        }); 
      },
      // 分配角色方法
      async setRole(role){
        this.setRoleDialogVisible = true;

        // 在展示对话框之前，获取所有角色的列表
     const {data:res} =  await  this.$http.get('roles')
      if(res.meta.status!=200) return this.$message.error('获取权限失败')
    this.rolesList = res.data;
    console.log(res);
   this.userInfo = role;
      },
      async saveRoleInfo(){
          if(!this.selectedRoleId){
            return this.$message.error('请选择角色');
          } 
        const {data:res}  = await this.$http.put(`users/${this.userInfo.id}/role`,
          {rid:this.selectedRoleId})
          console.log(this.selectedRoleId);
          if(res.meta.status!=200){
            return this.$message.error(res.meta.msg);
          }
          this.setRoleDialogVisible = false;
          this.getUserList()
          return this.$message.success('分配角色成功！')
      },
      // 监听分配角色的对话框的关闭事件
      editDialogClosed(){
        this.selectedRoleId = ""
        this.userInfo = {}
      }
},
created(){
    this.getUserList()
}
}
</script>

<style>

</style>