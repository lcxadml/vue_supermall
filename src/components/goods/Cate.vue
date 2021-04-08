<template>
  <div>
     <!-- 面包屑导航区 -->
      <el-breadcrumb separator="/">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item><a href="javascript:;">商品管理</a></el-breadcrumb-item>
  <el-breadcrumb-item>商品分类</el-breadcrumb-item>
</el-breadcrumb>
<!-- 卡片视图区 -->
<el-card class="box-card">
  <el-row>
      <el-col>
          <el-button type="primary" @click="addCate">添加分类</el-button>
      </el-col>
  </el-row>
<!-- 表格区 -->
<tree-table
class="treeTable"
:data="cateList"
:columns="columns"
:selection-type="false"
:expand-type="false"
 show-index
 index-text="#" border>
    <!-- 是否有效模板 -->
 <template slot="isok" slot-scope="scope">
 <i v-if="scope.row.cat_deleted===false" class="el-icon-success" style="color:lightgreen"></i>
 <i v-else class="el-icon-error"  style="color:red"></i>
 </template>
    <!-- 排序 -->
 <template slot="order" slot-scope="scope">
    <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
    <el-tag size="mini" v-else-if="scope.row.cat_level===1" type="success">二级</el-tag>
    <el-tag size="mini" v-else type="warning">三级</el-tag>
 </template>
  <!-- 操作 -->
  <template slot="opt" slot-scope="scope">
      <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
      <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
  </template>
</tree-table>
<!-- 分页区 -->
 <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="querInfo.pagenum"
      :page-sizes="[3, 5, 10, 15]"
      :page-size="querInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
</el-card>
<!-- 添加分页对话框 -->
<!--   :before-close="handleClose" -->
<el-dialog
  title="提示"
  :visible.sync="addCateVisible"
  width="50%"
  @close="addCatDialogVisiable"
>
 <el-form ref="addCateFormrRef" :model="addCateForm" label-width="80px" :rules="addCateFormRules">
  <el-form-item label="分类名称" prop="cat_name">
    <el-input v-model="addCateForm.cat_name"></el-input>
  </el-form-item>
   <el-form-item label="父级分类">
       <!-- options用来指定数据源 --> 
       <!-- props用来指定配置对象 -->
  <el-cascader
    v-model="selectedKeys"
    :options="parentCateList"
    :props="{  value:'cat_pid',label:'cat_name',children:'children',expandTrigger: 'hover', checkStrictly:true}"
    clearable
    @change="parentCateChanged"></el-cascader>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addCateVisible = false">取 消</el-button>
    <el-button type="primary" @click="submitCate">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
export default {
created(){
  this.getCateList();
},
data(){
 return {
    // 商品分类的数据列表，默认为空
    cateList:[],
    // 查询条件
    querInfo:{  
        type:3,
        pagenum:1,
        pagesize:5
    },
    // 总数据条数
    total:0,
    // 为label指定列的定义
    columns:[{
        label:'分类名称',
        prop:'cat_name'
    },
    {
        label:'是否有效',
// 表示将当前列定义为模板列
    type:'template',
    // 表示当前列的模板名称
    template:'isok'
    },
    {
        label:'排序',
        // 表示当前定义为模板列
        type:'template',
        // 表示当前这一列的模板名称
        template:'order'
    },{
        label:'操作',
        // 表示当前定义为模板列
        type:'template',
        // 表示当前这一列的模板名称
        template:'opt'
    }
    ],
    // 添加分类的显示与隐藏
    addCateVisible:false,
    // 添加表单的数据对象
    addCateForm:{
        // 将要添加的分类的名称
        cat_name:'',
        // 父级分类的id
        cat_pid:0,
        // 分类的等级默认是一级分类
        cat_level:0
    },
    // 添加分类表单的验证规则对象    
    addCateFormRules:{
        cat_name:[
            {required:true, 
            message: '请输入分类的名称',trigger:'blur'}
       
        ]
    },
    // 父级分类的列表
    parentCateList:[],
    // 指定级联选择器的配置对象
    caseCadeProps:{
        value:'cat_pid',
        label:'cat_name',
        children:'children'
    },
    // 选中的父级节点的id数组
    selectedKeys:[]
    }
},
methods:{
    async getCateList(){
    const {data:res}  =  await this.$http.get('categories',{
           params:this.querInfo
       });
      if(res.meta.status!=200) return this.$message.error("获取数据失败")
      this.cateList = res.data.result;
     //   为总数据条数赋值
        this.total = res.data.total;
   
   },
// 监听pagesize改变的事件
handleSizeChange(newSize){
    this.querInfo.pagesize= newSize
    this.getCateList()
},
//监听pagenum的改变
handleCurrentChange(newPage){
    this.querInfo.pagenum = newPage
    this.getCateList() 
} ,
// 添加分类方法
addCate(){
    // 先获取父类数据的列表
    this.getParentCateList()
this.addCateVisible = true;
},
// 获取父分类的数据列表
async getParentCateList(){
 const {data:res} =   await this.$http.get('categories',{params:{
        type:2
    }})
    this.parentCateList = res.data;
    console.log(this.parentCateList);
},
// 选择项发生变化触发这个函数
parentCateChanged(){
    console.log(this.selectedKeys);
    // 如果selectedKeys 数组中的length大于0，则选择了分类
    if(this.selectedKeys.length>0){
        // 父级分类的id
      this.addCateForm.cat_pid =   this.selectedKeys[this.selectedKeys.length-1]
      this.addCateForm.cat_level = this.selectedKeys.length
      return
    }else {
        this.addCateForm.cat_level=0
        this.addCateForm.cat_pid=0 
    }

},
// 点击添加分类
submitCate(){
   this.$refs.addCateFormrRef.validate(async valid=>{
       if(!valid)return
     const {data:res} =  await this.$http.post('/categories',this.addCateForm)
       console.log(res);
   if(res.meta.status!=201) return this.$message.error('添加分类失败');
 
   this.getCateList()
   this.$message.success('添加分类成功')
   this.addCateVisible = false;
   })

},
// 监听对框的关闭事件，重置表单数据
addCatDialogVisiable(){
    this.$refs.addCateFormrRef.resetFields()
    this.selectedKeys = []
    this.addCateForm.cat_level = 0
    this.addCateForm.cat_pid = 0
}
}
}
</script>

<style>

</style>