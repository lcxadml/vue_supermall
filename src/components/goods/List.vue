<template>
  <div>
          <!-- 面包屑导航区 -->
      <el-breadcrumb separator="/">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item><a href="javascript:;">商品管理</a></el-breadcrumb-item>
  <el-breadcrumb-item>商品列表</el-breadcrumb-item>
</el-breadcrumb>
<!-- 卡片视图区 -->
<el-card>
    <el-row>
        <el-col :span="8">
 <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodList">
    <el-button slot="append" icon="el-icon-search" @click="getGoodList"></el-button>
  </el-input>
        </el-col>
         <el-col :span="4">
             <el-button type="primary" @click="goAddPage"> 添加商品</el-button>
        </el-col>
    </el-row>
</el-card>
<!-- table表格区 -->
<el-table :data="goodList" border stripe>
    <el-table-column type="index" label="#"></el-table-column>

        <el-table-column  label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column  label="商品价格(元)" prop="goods_price" width='95px'></el-table-column>
        <el-table-column  label="商品重量" prop="goods_weight" width='80px'></el-table-column>
        <el-table-column  label="创建时间" prop="goods_time" width='140px'>
            <template slot-scope="scope">
                {{scope.row.add_time | dateFormat}}
            </template>
        </el-table-column>
        <el-table-column  label="操作" width='130px'>
            <template slot-scope="scope"> 
                <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                <el-button icon="el-icon-edit"  type="danger" size="mini" @click="removeById(scope.row.goods_id)">删除</el-button>
            </template>
        </el-table-column>
        
</el-table>
<!-- 分页区域 -->
 <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[5,10,15,20]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
export default {
data(){
    return {
        // 查询参数对象
        queryInfo:{
            query:'',
            pagenum:1,
            pagesize:10,
        },
        //商品列表
        goodList:[],
        // 总数据条数
        total:0, 
        
    }
},
methods:{
  // 根据分页获取对应的参数列表
  async getGoodList(){
   let {data:res} = await this.$http.get('goods',{
          params:this.queryInfo
      })
      if(res.meta.status!=200) return this.$message.error(res.meta.msg)
      this.$message.success('获取参数成功')
        this.goodList = res.data.goods;
        this.total = res.data.total;

  },
  handleSizeChange(newSize){
      this.queryInfo.pagesize = newSize;
      this.getGoodList()
  },
  handleCurrentChange(newPage){
      this.queryInfo.pagenum = newPage;
      this.getGoodList()
  },
//   根据id删除商品
   async removeById(id){
   const confirmResult =  await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(error=>error);
        if(confirmResult!=='confirm')
        return this.$message.info('取消了删除');
       const {data:res} = await this.$http.delete(`goods/${id}`);
       if(res.meta.status!=200)return this.$message.error('删除失败');
       return this.$message.success('删除成功')
  },
  goAddPage(){
      this.$router.push('/goods/add');
  }
},
created(){
this.getGoodList()
}
}
</script>

<style scoped>
.el-button {
    margin-left:15px;
}
</style>