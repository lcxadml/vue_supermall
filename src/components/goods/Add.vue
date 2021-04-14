<template>
  <div>
         <!-- 面包屑导航区 -->
      <el-breadcrumb separator="/">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item><a href="javascript:;">商品管理</a></el-breadcrumb-item>
  <el-breadcrumb-item>添加商品</el-breadcrumb-item>
</el-breadcrumb>
<!-- 卡片视图区 -->
<el-card>
    <!-- 提示区域 -->
      <el-alert
    title="消息提示的文案"
    type="info"
    center
    :closable="false"
    show-icon>
      </el-alert>
      <!-- 步骤条区域 -->
      <el-steps :space="200" align-center :active="activeIndex-0" finish-status="success" stretch>
  <el-step title="基本信息"></el-step>
  <el-step title="商品参数"></el-step>
  <el-step title="商品属性"></el-step>
  <el-step title="商品图片"></el-step>
  <el-step title="商品内容"></el-step>
  <el-step title="完成"></el-step>
</el-steps>
<!-- Tab栏区域 -->
<el-form :model="addForm" :rules="addFormrules" ref="addFormRefs" label-width="100px" label-position="top">
  <el-tabs :tab-position="'left'" v-model="activeIndex" :before-leave="beforeTableLeave" @tab-click="tabClicked">
    <el-tab-pane label="基本信息" name="0">
        <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="addForm.goods_name"></el-input>
        </el-form-item>
         <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="addForm.goods_price" type="number"></el-input>
        </el-form-item>
         <el-form-item label="商品重量" prop="goods_weigth">
            <el-input v-model="addForm.goods_weigth" type="number"></el-input>
        </el-form-item>
         <el-form-item label="商品数量" prop="goods_number">
            <el-input v-model="addForm.goods_number" type="number"></el-input>
        </el-form-item>
        <!-- 级联选择器区域 -->
        <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
    v-model="addForm.goods_cat"
    :options="cateList"
    :props="{ expandTrigger: 'hover', label:'cat_name',value:'cat_id',children:'children' }"
    @change="handleChange"></el-cascader>
        </el-form-item>
    </el-tab-pane>
    <el-tab-pane label="商品参数" name="1">
      <!-- 渲染表单的item项 -->
      <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
<!-- 复选框组 -->
  <el-checkbox-group v-model="item.attr_vals">
    <el-checkbox :label="cb" v-for="(cb,i) in item.attr_vals" :key="i" border></el-checkbox>
   

  </el-checkbox-group>
      </el-form-item>
    </el-tab-pane>
    <el-tab-pane label="商品属性" name="2"> 
        <el-form-item v-for="item in onlyTableData" :key="item.attr_id" :label='item.attr_name'>
<el-input v-model="item.attr_vals"></el-input>
        </el-form-item>
    </el-tab-pane>
    <el-tab-pane label="商品图片" name="3">
        <el-upload
  :action="uploadUrl"
  :on-preview="handlePreview"
  :on-remove="handleRemove"
  :headers="headerObj"
  :on-success='handleSuccess'
  list-type="picture">
  <el-button size="small" type="primary">点击上传</el-button>
  
</el-upload>
    </el-tab-pane>
    <el-tab-pane label="商品内容" name="4">
        <!-- 富文本编辑组件 -->
        <quill-editor v-model="addForm.goods_introduce" ></quill-editor>
        <el-button type="primary" class="btnadd" @click="add ">
            添加商品
        </el-button>
    </el-tab-pane>
  </el-tabs>
</el-form>
</el-card>
<!-- 图片预览 -->
<el-dialog
  title="提示"
  :visible.sync="previewVisible"
  width="50%"
 >
  <img :src="PreviewPath" alt="" class="previewImg">
  
</el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
    data(){
        return {
            activeIndex:'0',
            // 添加商品的表单数据对象
            addForm:{
                goods_name:'',
                goods_price:0,
                goods_weigth:0,
                goods_number:0,
                // 所属商品的分类数组
                goods_cat:[],
                pics:[],
                attrs:[],
            },
                // 图片上传的地址
                uploadUrl:"https://www.liulongbin.top:8888/api/private/v1/upload",
            addFormrules:{
                goods_name:[
                      { required: true, message: '请输入商品名称', trigger: 'blur' },
                ],
                 goods_price:[
                      { required: true, message: '请输入商品价格', trigger: 'blur' },
                ],
                goods_weigth:[
                      { required: true, message: '请输入商品重量', trigger: 'blur' },
                ],
                  goods_number:[
                      { required: true, message: '请输入商品数量', trigger: 'blur' },
                ],
                goods_cat:[
                      { required: true, message: '请选择商品分类', trigger: 'blur' },
                ],
            },
            // 商品分类列表
           cateList:[],
        //    动态参数列表数组
           manyTableData:[],
        //    今天属性列表
        onlyTableData:[],
        // 图片上传的请求头
        headerObj:{
            Authorization:window.sessionStorage.getItem('token'),
        },
      PreviewPath:'',
      previewVisible:false,
    //   商品描述的详情
    goods_introduce:''
        }
    },
methods:{
 // 获取参数分类数据
           async getCateList(){
               const {data:res} = await this.$http.get('categories');
                if(res.meta.status!==200) return this.$message.error(res.meta.msg);
                this.cateList = res.data;
            },
            // 级联选择器选中项发生变化
            handleChange(){
                 
                 if(this.addForm.goods_cat.length!==3){
                     this.addForm.goods_cat=[];
                     return this.$message.error('只能选择三级分类')
                 }
            },
            beforeTableLeave(activeName,oldActiveName){
                // activeNmae即将进入的tab页的名称  
                // oldActiveName即将离开的标签页的名字
                if(oldActiveName=='0'&&this.addForm.goods_cat.length!==3){
                   this.$message.closeAll(0)
                   this.$message.error('请先选择商品分类')
                    return false;
                }
            },
           async tabClicked(){
           
            // 证明是动态参数面板
            if(this.activeIndex==1){
              const {data:res} = await this.$http.get(`categories/${this.CateId}/attributes`,{
                    params:{
                        sel:'many'
                    }
                });
               if(res.meta.status!==200){
                   return this.$message.error('获取是商品参数失败');
               }
               console.log(res.data);
               res.data.forEach(item=>{
             item.attr_vals=  item.attr_vals.length===0?[]:item.attr_vals.split(' ')
               })
               this.manyTableData = res.data
            }else if(this.activeIndex==2){
                const {data:res} = await this.$http.get(`categories/${this.CateId}/attributes`,{
                    params:{
                        sel:'only'
                    }
                });
                if(res.meta.status!==200){
                    return this.$message.error('获取静态属性失败');
                    
                }
            this.onlyTableData = res.data;
            }
            },
            // 处理图片预览效果
            handlePreview(file){
                this.PreviewPath = file.response.data.url;
                this.previewVisible = true;
            },
// 处理移除图片操作
            handleRemove(file){
                // 获取要删除的图片临时路径
    const filePath = file.response.data.tmp_path;
    const i = 
        this.addForm.pics.findIndex(x=>x.pic === filePath)
        this.addForm.pics.splice(i,1);
                // 从pics数组中,找到这个图片对应的索引值
    console.log(this.addForm);
            },
              // 监听图片上传成功的事件
        handleSuccess(response){
            console.log(response);
            // 拼接得到一个图片信息对象
            const picInfo = {
                pic:response.data.tmp_path
            }
            this.addForm.pics.push(picInfo);
            console.log(this.addForm);
        },
        add(){
            this.$refs.addFormRefs.validate(async(valid)=>{
                if(!valid){
                    return this.$message.error('请填写必要的表单项')
                }
                    // 执行添加业务逻辑
                    // 深拷贝
                    // lodash cloneDeep(obj)
                   const form =  _.cloneDeep(this.addForm)
                    form.goods_cat = form.goods_cat.join(',');
                    // 处理动态参数
                this.manyTableData.forEach(item=>{
                    const newInfo = {
                        attr_id:item.attr_id,
                        attr_value:item.attr_vals.join(' '),
                    };

                    this.addForm.attrs.push(newInfo);
                })
                    // 处理静态属性
                    this.onlyTableData.forEach((item)=>{
                        const newInfo = {
                        attr_id:item.attr_id,
                        attr_value:item.attr_vals,
                    };
                      this.addForm.attrs.push(newInfo);
                    })
                    form.attrs  =this.addForm.attrs;

            console.log(form);

            // 发起请求添加商品
            // 商品的名称是唯一的
          const {data:res} = await this.$http.post('goods',form);
          if(res.meta.status!=200){
                console.log(res);
              return this.$message.error('添加失败')
          }
          console.log(res);
        this.$router.push('/goods')
            })
        }
},

created(){
    this.getCateList();
},
computed:{
    CateId(){
        if(this.addForm.goods_cat.length===3){
            return this.addForm.goods_cat[2]
        }
        return null;
    }
}
}
</script>
<style>
    .el-checkbox {
        margin: 0;
    }
    .previewImg {
        width: 100%;
    }
    .btnadd {
        margin-top: 15px;
    }
</style>
