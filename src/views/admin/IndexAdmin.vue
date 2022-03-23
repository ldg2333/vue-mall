<template>
<div class="index_container">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/admin/index' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>系统首页</el-breadcrumb-item>
    </el-breadcrumb>
    <PanelGroup></PanelGroup>   
    <PanelCart></PanelCart>

    <div class="overview-layout">
      <el-row :gutter="32">
        <el-col :xs="24" :sm="24" :lg="8">
          <div class="out-border chart-wrapper">
            <div class="layout-title">订单分类</div>
                <PieChart></PieChart>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="16">
          <div class="out-border chart-wrapper">
            <div class="layout-title">订单信息</div>
                <TransactionTable></TransactionTable>
          </div>
        </el-col>
      </el-row>
    </div>
    <LineChart></LineChart>
</div>
</template>

<script>
   //这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
   //例如：import 《组件名称》 from '《组件路径》';
    import PanelGroup from './components/PanelGroup.vue'
    import PanelCart from './components/PanelCard.vue'
    import PieChart from './components/PieChart.vue'
    import TransactionTable from './components/TransactionTable.vue'
    import LineChart from './components/LineChart.vue'
   export default {
       //import引入的组件需要注入到对象中才能使用
        name: 'IndexAdmin',
        components: {
            PanelGroup,
            PanelCart,
            PieChart,
            TransactionTable,
            LineChart
        },
        data() {
            return {
                
            }
        },
        methods:{
        
        }
   }
</script>
<style Lang='less' scoped>
    .index_container{
        min-height: 100%;
    }
    .chart-wrapper {
        background: #fff;
        margin: 16px 0 16px 0;
        margin-bottom: 32px;
    }

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
  .out-border {
    border: 1px solid #DCDFE6;
  }
   .layout-title {
    color: #606266;
    padding: 15px 20px;
    background: #F2F6FC;
    font-weight: bold;
    margin-bottom:15px ;
  }
</style>