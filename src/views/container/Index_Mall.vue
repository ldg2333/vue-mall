<!--商城中间主界面组件-->
<template>
<div class="index">
      <!-- 头部栏 -->
      <el-header class="el-header">
         <MallHeader></MallHeader>
      </el-header>
      <!--主面板-->
      <el-main class="el-main">
         <router-view></router-view>
      </el-main>
      <!-- 底部 -->
      <el-footer class="el-footer">
         <MallFoot></MallFoot>
      </el-footer>
</div>
</template>

<script>
   import MallHeader from "../../components/containner/MallHeader.vue";
   import MallFoot from "../../components/containner/MallFoot.vue";
   //这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
   //例如：import 《组件名称》 from '《组件路径》';
   export default {
        //import引入的组件需要注入到对象中才能使用
        name: 'Index_Mall',
        components:{
            MallHeader,
            MallFoot
        }
   }
</script>
<style Lang='less' scoped>
   .index{
      height: 100%;
   }
   .index .el-header{
      height: 6% !important;
      padding: 0;
      background-color:rgb(51, 51, 51);
      color: #b0b0b0;
      text-align: center;
      position: sticky;
   }

   .index .el-main {
      background-color: #FFF;
      color: #333;
      text-align: center;
      padding: 0;
      margin: 0;
      height: 88% !important;
   }
   .index .el-footer{
      padding: 0;
      color: #b0b0b0;
      background: rgb(51, 51, 51);
      height: 6% !important;
  }
</style>