<template>
  <div>
     <!-- 面包屑导航区 -->
      <el-breadcrumb separator="/">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item><a href="javascript:;">商品管理</a></el-breadcrumb-item>
  <el-breadcrumb-item>参数列表</el-breadcrumb-item>
</el-breadcrumb>
<!-- 卡片视图区 -->
<el-card>
    <!-- 头部的警告区 -->
      <el-alert
    title="注意：只允许为第三级分类设置相关参数！"
    :closable="false"
    show-icon
    type="warning">
  </el-alert>
  <!-- 选择商品分类区域 -->
  <el-row class="cat_opt">
      <el-col>
          <span>选择商品分类：</span>
      </el-col>
      <!-- 选择商品分类的级联选择框 -->
       <el-cascader
    v-model="selectedCateKeys"
    :options="catelist"
    :props="{ expandTrigger: 'hover' , value:'cat_id',
                label:'cat_name',
                children:'children',}"
    @change="handleChange"></el-cascader>
  </el-row>
  <!-- tab页签区域 -->
  <el-tabs v-model="activeName" @tab-click="handletabsClick">
    <!-- 添加动态参数的面板 -->
    <el-tab-pane label="动态参数" name="many" >
        <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="adddialogVisible=true">
            添加参数
        </el-button>
        <!-- 动态参数表格 -->
        <el-table :data="manyTableData" border stripe>
            <!-- 这是展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close ="handleClose(i,scope.row)">{{item}} </el-tag>
                <!-- 新建tag按钮 -->
                <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisiable"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                    >
                    </el-input>
                    <el-button v-else class="button-new-tag" size="small"       @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column  label="#"  type="index"></el-table-column>
            <el-table-column label="参数分类" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
                <template  slot-scope="scope">
<el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteParams(scope.row.attr_id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-tab-pane>
    <!-- 添加静态属性的面板 --> 
    <el-tab-pane label="静态属性" name="only">
  <el-button type="primary" size="mini"  :disabled="isBtnDisabled" @click="adddialogVisible=true">
      添加属性
        </el-button>
           <el-table :data="OnlyTableData" border stripe>
           <!-- 这是展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close ="handleClose(i,scope.row)">{{item}} </el-tag>
                <!-- 新建tag按钮 -->
                <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisiable"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                    >
                    </el-input>
                    <el-button v-else class="button-new-tag" size="small"       @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column  label="#"  type="index"></el-table-column>
            <el-table-column label="属性分类" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
                <template  slot-scope="scope">
<el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteParams(scope.row.attr_id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-tab-pane>

  </el-tabs>
</el-card>
<!-- 添加参数的对话框 -->
<el-dialog  
  :title="'添加'+titleText"
  :visible.sync="adddialogVisible"
  width="50%"
   @close="addDialogClose"
  >
<el-form ref="addFormRef" :model="addForm" :rules="addFormRules"     label-width="80px"
>
  <el-form-item :label="titleText" prop="attr_name">
    <el-input v-model="addForm.attr_name"></el-input>
  </el-form-item></el-form>
  <span slot="footer">
    <el-button @click="adddialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addParams">确 定</el-button>
  </span>
</el-dialog>
<!-- 添加参数的对话框 -->
<el-dialog  
  :title="'修改'+titleText"
  :visible.sync="editdialogVisible"
  width="50%"
   @close="editDialogClose"
  >
<el-form ref="editFormRef" :model="editForm" :rules="editFormRules"     label-width="80px"
>
  <el-form-item :label="titleText" prop="attr_name">
    <el-input v-model="editForm.attr_name"></el-input>
  </el-form-item></el-form>
  <span slot="footer">
    <el-button @click="editdialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editParams">确 定</el-button>
  </span>
</el-dialog>
  </div>
  
</template>

<script>
export default {
    data(){
        return {
            // 商品分类列表
            catelist:[],
            // 级联选择框的配置对象、
            cateProps:{
                value:'cat_id',
                label:'cat_name',
                children:'children',
            },
            // 级联选择框的双向绑定
            selectedCateKeys:[],
        //    被激活的页签的名称
           activeName:'many',
        //    动态参数的数据
        manyTableData:[],
          //    静态参数的数据
          OnlyTableData:[],
        //   控制对话框的显示与隐藏
        adddialogVisible:false,
        // 添加参数的表单数据
        addForm:{},
        // 添加表单的验证规则对象
        addFormRules:{
            attr_name:[
                      { required: true, message: '请输入参数名称', trigger: 'blur' },
            ]
        },
        editdialogVisible:false,
        // 修改的表单的数据对象
        editForm:{},
        // 修改表单的验证规则
        editFormRules:{
            attr_name:[
                 { required: true, message: '请输入参数名称', trigger: 'blur' },    
            ]
        },
        // 新建tag和input的显示与隐藏
        inputVisible:false,
        // 文本框中输入的内容
        inputValue:''
        }
    },
    created(){
        this.getCateList()
    },
    methods: {
        // 获取所有的商品分类列表
       async getCateList(){
          const {data:res} = await this.$http.get('categories')
          if(res.meta.status !==200){
              return this.$message.error("获取参数分类失败！")
          }
          this.catelist = res.data


        },
     
        // 级联选择框中选项发生变化会触发这个函数

       async handleChange(){
             this.getParamsData()
        },
        // 获取参数的列表数据
       async getParamsData(){
            if(this.selectedCateKeys.length!==3){
                this.selectedCateKeys = []
                this.manyTableData = []
                this.OnlyTableData = []
                return  this.$message.error("只能为第三级分类设置相关参数")
            }
            // 证明是三级分类
          
            // 根据所选的id和对应的面板获取对应的参数
        
        const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{
                params:{sel:this.activeName}
            })
            
      if(res.meta.status!=200){
          return this.$message.error(res.meta.message)
      }
      res.data.forEach(item=>{
   item.attr_vals =  item.attr_vals?item.attr_vals.split(' '):[]
  //  输入框与按钮的切换，默认是按钮
   item.inputVisiable = false
  //  输入框中的内容
  item.inputValue = ''
  })
  console.log(res);
    if(this.activeName=="many"){
        this.manyTableData = res.data
    }else {
        this.OnlyTableData = res.data
    }
  
        },
        // tab页签点击事件处理函数
        handletabsClick(){
            this.$message.closeAll()
            this.getParamsData()
        },
        // 监听添加表单关闭事件
        addDialogClose(){
            this.$refs.addFormRef.resetFields()  
        },
               // 点击按钮，添加参数
        addParams(){
            this.$refs.addFormRef.validate(async(valid)=>{
                if(!valid) return 
             const {data:res} = await  this.$http.post(`categories/${this.cateId}/attributes`,{
                    attr_name:this.addForm.attr_name,
                    attr_sel:this.activeName
                })
              if(res.meta.status!=201)return this.$message.error(res.meta.msg);
                  this.adddialogVisible = false
            this.getParamsData()
            return this.$message.success(res.meta.msg)
            });
        
        },
        // 点击按钮展示修改的对话框
        async showEditDialog(attr_id){
          // 查询当前参数复制
         const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`,{
             params:{
               attr_sel:this.activeName
             }
           })
          this.editdialogVisible = true;
          if(res.meta.status!=200) return this.$message,error(res.meta.msg);
          this.editForm = res.data
          },
        // 关闭时触发的方法
        editDialogClose(){
            // 重置修改的表单
           this.$refs.editFormRef.resetFields() 
        },
        //点击按钮修改参数信息 
        editParams(){
          this.$refs.editFormRef.validate(async valid=>{
            if(!valid) return
            else{
            const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`,{
                attr_name:this.editForm.attr_name,attr_sel:this.activeName
              })
              if(res.meta.status!=200) return this.$message.error(res.meta.msg);
              this.editdialogVisible = false;
              this.getParamsData()
              return this.$message.success(res.meta.msg);
            }
          })
        },
        // 删除参数操作
        deleteParams(attr_id){
          let res=this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then( async() => {
        const {data:res} = await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`)
        this.getParamsData()
          this.$message.success('删除成功')
        }).catch(() => {
         this.$message.info('取消删除')         
        });
        },
        // 失去焦点或者按enter键触发的事件
        async handleInputConfirm(row){
          if(row.inputValue.trim().length===0){
            row.inputValue='';
              row.inputVisiable = false;
              return 
          }
          // 如果没有return证明输入的内容需要做后序的处理  
          row.attr_vals.push(row.inputValue.trim())
          row.inputValue=''
          row.inputVisiable = false
        // 需要发起请求保存参数
          this.saveAttrValues(row)
        },
        // 点击按钮展示文本框的切换
        showInput(row){
         row.inputVisiable = true;
        //  让文本框自动获得焦点
        // nextTick方法的作用，当页面的元素重新被渲染出来以后zhix
             this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
        },
        // 删除对应的参数可选项
        handleClose(i,row){
            row.attr_vals.splice(i,1);
            this.saveAttrValues(row)
        },
        // 将attr_vals保存到数据库中
      async saveAttrValues(row){
           const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name:row.attr_name,
          attr_sel:row.attr_sel ,
          attr_vals:row.attr_vals.join(' ')
        })
          if(res.meta.status!=200) return this.$message.error(res.meta.msg);
          this.$message.success(res.meta.msg)
          this.$message.closeAll()
        }
        
    },
    computed: {
        // 如果按钮需要被禁用，返回true
        isBtnDisabled(){
return this.selectedCateKeys.length!==3
        },
           // 当前选中的三级分类的ID
    cateId(){
        if(this.selectedCateKeys.length===3) {
            return this.selectedCateKeys[2];
        }
        return null
    },
    // 计算标题的文本
    titleText(){
        if(this.activeName=='only') return "静态属性";
        return "动态参数"
    }
    },
 
}
</script>

<style>
.cat_opt {
    margin: 15px 0;
}
.el-tag {
  margin: 10px;
}
.input-new-tag{
  width: 120px;
}
</style>