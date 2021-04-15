<template>
  <div>
    <!-- 面包屑导航区 -->
      <el-breadcrumb separator="/">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item><a href="javascript:;">数据统计</a></el-breadcrumb-item>
  <el-breadcrumb-item>数据报表</el-breadcrumb-item>
</el-breadcrumb>
<!-- 卡片视图区 -->
<el-card>
   <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
    <div id="main" style="width: 800px;height:400px;"></div>
</el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import _ from 'lodash'
export default {
    data(){
          // 需要合并的数据
        return {
          option: {
            title: {
                text: '用户来源'
            },
            tooltip: {},
            xAxis: {
                data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
            },
            yAxis: {},
            series: [{
                name: '销量',
                type: 'bar',
                data: [5, 20, 36, 10, 10, 20]
            }]
        }
        }
      
       
    },
    // 此时页面上的元素已经渲染完毕了
async mounted(){
       // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main'));
    const {data:res} = await this.$http.get('reports/type/1');
    console.log(res.data);
    if(res.meta.status!==200) return this.$message.error("请求数据");
        
        // 准备数据和配置项
          const result =  _.merge(res.data,this.option);   
        // 展示数据
           // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(result);
},
created(){

}
}
</script>

<style>

</style>