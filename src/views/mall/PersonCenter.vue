<template>
    <div class="person_center_container">
    <!-- 侧板栏 -->
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside class="aside">
          <h1>个人中心</h1>
        <!-- 侧边栏菜单区域 -->     
        <el-menu :default-active='$route.path' :router='true' 
        active-text-color="#409eef">
           <!-- 一级菜单 -->
          <el-menu-item width='100%' :index="item.path" v-for="item in menulist" :key="item.id">
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>
          <!-- 路由占位符 -->
          <router-view></router-view>
      </el-main>
    </el-container>
    </div>
</template>

<script>
   //这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
   //例如：import 《组件名称》 from '《组件路径》';

   export default {
        //import引入的组件需要注入到对象中才能使用
        name: 'PersonCenter',
        data() {
            return {
                // 左侧菜单列表
                menulist:[
                    {id:'101',authName:'个人信息',path:'/mall/PersonInfo'},
                    {id:'102',authName:'订单记录',path:'/mall/Order'},
                    {id:'103',authName:'地址管理',path:'/mall/AddressManage'},
                    {id:'104',authName:'修改密码',path:'/mall/Password'},
                ],
            }
        },
   }
</script>
<style Lang='less' scoped>
    .person_center_container{
        width: 100%;
        height: 100%;
        position: relative;
        background-color: rgb(245, 245, 245);
    }
    .aside{
        position: absolute;
        width: 100px;
        height: 600px;
        left: 5%;
        top: 20px;
        background-color: #fff;
    }
    .el-menu-item{
        font-size: 18px;
    }
    li.el-menu-item.is-active{
        background-color: rgb(236, 245, 255);
    }
</style>