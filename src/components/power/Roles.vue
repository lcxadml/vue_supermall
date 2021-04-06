<template>
  <div>
      <!-- 面包屑导航区 -->
       <el-breadcrumb separator="/">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item><a href="javascript:;">权限管理</a></el-breadcrumb-item>
  <el-breadcrumb-item>角色列表</el-breadcrumb-item>
</el-breadcrumb>
<!-- 卡片视图区 -->
<el-card class="box-card">
    <el-row>
        <el-col>
            <el-button type="primary" @click="addRoles">添加角色</el-button>
        </el-col>
    </el-row>
    <!-- 角色列表区 -->
    <el-table :data="RolesList" border stripe>
        <!-- 展开列  -->
        <el-table-column type="expand">
            <template slot-scope="scope">
                <el-row  v-for="(item1,index) in scope.row.children" :key="item1.id">
                    <!-- 渲染一级权限 -->
                    <el-col :span="5"   :class="['vcenter','bdtop',index==scope.row.children.length?'bdbottom':'']">
                       <el-tag closable @close="removeRightById(scope.row,item1.id)" > {{item1.authName}}</el-tag>
                        <i class="el-icon-caret-right"></i>
                    </el-col>
                    <!-- 渲染二级权限 -->
                    <el-col :span="19">
                       <el-row v-for="(item2,i2) in item1.children" :key="item2.id"   :class="['bdtop',i2==scope.row.children.length?'bdbottom':'']">
                           <el-col :span="6">
                               <el-tag type="success" closable @close="removeRightById(scope.row,item2.id)" >{{item2.authName}} </el-tag>
                                  <i class="el-icon-caret-right"></i> 
                               </el-col>
                                 <el-col :span="18">
                               <el-tag type="warning" v-for="(item3) in item2.children" :key="item3.id" closable @close="removeRightById(scope.row,item3.id)">
                                   {{item2.authName}}
                               </el-tag>

                               </el-col>
                       </el-row>
                    </el-col>
                
                </el-row>
    
            </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width='300px'>
            <template  slot-scope="scope">
               <el-button type="primary" icon="el-icon-edit" size="mini" @click="editRoles(scope.row.id)">编辑</el-button>
<el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteBox(scope.row.id)">删除</el-button>
<el-button type="warning" icon="el-icon-setting"  size="mini" @click="showSetRightDialog(scope.row)">分配权限</el-button>
            </template>
        </el-table-column>
      


    </el-table>
     <!-- 添加用户的对话框 -->
       <!-- @close="addDialogClosed" -->
  <el-dialog
  title="添加用户"
  :visible.sync="addRolesVisible"
  width="50%"
  @close="addDialogClosed"
 >
 <!-- 内容主体区 -->
 <el-form :model="addForm"
  label-width="90px"
  :rules="addRolesRules" 
  ref="addRolesRef"
  >
  <el-form-item label="角色名称" prop="roleName">
    <el-input v-model="addForm.roleName">
    </el-input>
  </el-form-item>
   <el-form-item label="角色权限" prop="roleDesc">
    <el-input v-model="addForm.roleDesc">
    </el-input>
  </el-form-item>
  </el-form>
  <!-- 底部区域 -->
  <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogClosed">取 消</el-button>
    <el-button type="primary" @click="addRolesSub">确 定</el-button>
  </span>
</el-dialog>
   <!-- 修改用户的对话框 -->
    <!-- @close="addDialogClosed" -->
  <el-dialog
  title="修改用户"
  :visible.sync="editRolesVisible"
  width="50%"
 >
 <!-- 内容主体区 -->
 <el-form :model="editForm"
  label-width="90px"
  :rules="addRolesRules" 
  ref="editRolesRef"
  >
    <el-form-item label="角色ID" prop="roleName">
    <el-input v-model="editForm.roleId" disabled>
    </el-input>
  </el-form-item>
  <el-form-item label="角色名称" prop="roleName">
    <el-input v-model="editForm.roleName">
    </el-input>
  </el-form-item>
   <el-form-item label="角色权限" prop="roleDesc">
    <el-input v-model="editForm.roleDesc">
    </el-input>
  </el-form-item>
  </el-form>
  <!-- 底部区域 -->
  <span slot="footer" class="dialog-footer">
    <el-button @click="editRolesVisible=false">取 消</el-button>
    <el-button type="primary" @click="editRolesSub(editForm.roleId)">确 定</el-button>
  </span>
</el-dialog>
<!-- 分配权限对话框 -->
<el-dialog
  title="分配权限"
  :visible.sync="setRightDialogVisible"
  width="50%"
>
<!-- 树形控件 -->
<el-tree :data="RightsList" :props="treeProps" show-checkbox node-key="id" default-expand-all 
 :default-checked-keys='defKey'
 ref="treeRef">
 </el-tree>
  <span slot="footer" class="dialog-footer">
    <el-button @click="setRightDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="allotRights">确 定</el-button>
  </span>
</el-dialog>

</el-card>
  </div>
</template>

<script>
export default {
    data(){
        return {
            RolesList:[],
            addRolesVisible:false,
            addForm:{
                roleName:'',
                roleDesc:''
                
            },
            addRolesRules:{
               roleName:[
      { required: true, message: '请输入角色名称', trigger: 'blur' }
          
   ],
   roleDesc:[
      { required: true, message: '请输入角色权限', trigger: 'blur' }
   ],
            },
            editRolesVisible:false,
            editForm:{
                roleId:'',
                roleName:'',
                roleDesc:''
            },
            // 控制分配权限的对话题的显示与隐藏
            setRightDialogVisible: false,
            // 所有权限的数据
           RightsList:[],
          //  树形控件的属性绑定对象
           treeProps:{
             label:'authName',
             children:'children'
           },
          //  默认选中节点id值的数组
         defKey:[],
         roleId:''
        }
    },
    created(){
        this.getRolesList()
    },
    methods:{
       async getRolesList(){
          const {data:res} =  await this.$http.get('roles/');
          console.log(res);
            if(res.meta.status!=200) return this.$message.error("获取失败") 
            this.RolesList = res.data
      },
      addRoles(){
          this.addRolesVisible = true
      },
    //   关闭添加角色菜单
    addDialogClosed(){
     this.addRolesVisible = false
        this.$refs.addRolesRef.resetFields()
    },
    addRolesSub(){
        this.$refs.addRolesRef.validate(async(valid)=>{
            if(!valid) return
            // 可以发起网络请求
         const {data:res}  = await this.$http.post('roles',this.addForm)
            console.log(res);
         if(res.meta.status!=201) return this.$message.error("添加角色失败")
          else{
              this.addRolesVisible = false
              this.getRolesList()
              return this.$message.success('添加角色成功')
          }
        })
    
    },
          deleteBox(id) {
        this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
       const {data:res} = await this.$http.delete('roles/'+id);
        if(res.meta.status!=200) return this.$message.error('删除失败')
           this.getRolesList()
        return this.$message.success('删除成功')
    
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
     async editRoles(id){
         const {data:ref} =await this.$http.get('roles/'+id);
         this.editForm = ref.data
         console.log(this.editForm);
            this.editRolesVisible = true

      },
      eidtDialogClosed(){
          this.editRolesVisible = false
          this.$refs.editRolesRef.resetFields()
      },
     async editRolesSub(id){
      const {data:res} = await this.$http.put('roles/'+id,this.editForm);
            if(res.meta.status!=200) return this.$message.error('修改失败')
            this.editRolesVisible = false;
            this.getRolesList()
            return this.$message.success('角色修改成功')
      },
      //根据Id删除对应的权限
      removeRightById(Role,RightId){
          // 弹框提示用户是否要删除
           this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
       const {data:res} = await this.$http.delete(`roles/${Role.id}/rights/${RightId}`);
        if(res.meta.status!=200) return this.$message.error('删除失败')
          Role.children = res.data;
        return this.$message.success('删除成功')
    
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      } ,
      // 分配权限对话框
     async showSetRightDialog(row){
       this.defKey = []
       this.roleId = row.id;
        // 获取所有权限的数据
     const {data:res} =  await this.$http.get('rights/tree');
          if(res.meta.status!=200){
            return this.$message.error('获取权限失败')
          }else {
            this.RightsList = res.data;
          }
        // 递归获取三级节点
        this.getLeafKeys(row,this.defKey)
        this.setRightDialogVisible = true
      },
      // 通过递归的形式，获取用户id并保存在defKeys数组中
      getLeafKeys(node,arr){
     
        if(!node.children){
            // 如果当前node节点不包含children属性，并保存到defKeys数组中
            return arr.push(node.id)
        }
        node.children.forEach(item=>{
          this.getLeafKeys(item,arr)
        })
      },
      // 点击为角色分配权限
    async allotRights(){
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idstr = keys.join(',');
    const {data:res} =  await this.$http.post(`roles/${this.roleId}/rights`,
      {rids:idstr});
      if(res.meta.status==200){
        this.setRightDialogVisible = false;
           this.getRolesList()
        return this.$message.success("分配权限成功！");
      }
        this.setRightDialogVisible = false;
           this.getRolesList()
      return this.$message.error("分配权限失败！")
    }
  
    }
}
</script>

<style scoped>
.el-tag {
    margin: 10px 0;
}
    .bdtop {
        border-top: 1px solid #eee;
    }
    .bdbottom {
        border-bottom: 1px solid #eee;
    }
   
</style>