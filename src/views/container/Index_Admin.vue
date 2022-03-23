<template>
    <div class="home">
    <el-container class="el-container">
      <!--导航栏-->
      <el-container class="el-container">
        <!--侧边栏-->
      <el-aside width="auto" class="el-aside">
        <AdminAside></AdminAside>
      </el-aside>
      <el-container class="el-container">
         <!-- 头部 -->
      <el-header class="el-header">
          <AdminHeader></AdminHeader>
      </el-header>
        <!--主面板-->
        <el-main class="el-main">
          <router-view></router-view>
        </el-main>
        <!--底部-->
        <el-footer class="el-footer">
          <AdminFoot></AdminFoot>
        </el-footer>
      </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script>
   //这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
   //例如：import 《组件名称》 from '《组件路径》';
    import AdminHeader from '../../components/containner/AdminHeader.vue'
    import AdminAside from '../../components/containner/AdminAside.vue'
    import AdminFoot from '../../components/containner/AdminFoot.vue'
   export default {
        //import引入的组件需要注入到对象中才能使用
        name: 'Index_Admin',
        components:{
          AdminHeader,
          AdminAside,
          AdminFoot
        }
   }
</script>
<style Lang='less' scoped>
    .home{
    height: 100%;
  }

  .home .el-container{
    height: 100%;
  }

  .home .el-header{
    padding: 0;
    background-color: #FFF;
    color: #333;
    text-align: center;
  }
  .home .el-footer{
    padding: 0;
    color: #333;
    height: 50px!important;
    background: rgb(51, 51, 51);
    line-height: 50px;
  }

  .home .el-aside {
    text-align: center;
    background-color: #333;
  }

  .home .el-main {
    background-color: #FFF;
    border-top: 1px solid #C1C1C1;
    color: #333;
    padding: 20px;
    margin: 0;
  }

  .home .el-main::-webkit-scrollbar {/*滚动条整体样式*/
    width: 0;     /*高宽分别对应横竖滚动条的尺寸*/
  }

</style>