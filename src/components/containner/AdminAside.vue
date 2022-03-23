<template>
<div class="aside_container">
    <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '175px'">
          <div @click="toggleCollapse"  class="toggle-button"
          >|||</div>
        <!-- 侧边栏菜单区域 -->     
        <el-menu
        class="el-menu-vertical-demo"
        :collapse="isCollapse"
        :collapse-transition='false'
        background-color="#333"
        :unique-opened='true'
        text-color="#fff"
        :default-active='$route.path' 
        :router='true' 
        active-text-color="#ffd04b"
        >
        <el-menu-item index="/admin/index">
            <i class="el-icon-s-home"></i>
            <span slot="title">系统首页</span>
        </el-menu-item>

        <el-submenu v-for="(item,index) in menulist" :key="item.id"   :index="String(index)">
        <template slot="title">
          <i :class="iconsObj[item.id]"></i>
          <span>{{item.authName}}</span>
        </template>
        
        <el-menu-item :key="menuitem.id"  v-for="menuitem in item.children" :index="menuitem.path">
            <template slot="title">
            <i :class="iconsObj[menuitem.id]"></i>
          <span>{{menuitem.authName}}</span>
          </template>
        </el-menu-item>
        </el-submenu>
    </el-menu>
      </el-aside>
</div>
</template>

<script>
   //这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
   //例如：import 《组件名称》 from '《组件路径》';

   export default {
        //import引入的组件需要注入到对象中才能使用
        name: 'AdminAside',
        data() {
            return {
                // 左侧菜单列表
            menulist:[
                {id:'101',authName:'商品管理',children:[
                    {id:'103',authName:'商品管理',path:'/admin/product'},
                    {id:'104',authName:'新增商品',path:'/admin/addProduct'},
                    {id:'106',authName:'商品类型',path:'/admin/productType'},
                    {id:'107',authName:'商品品牌',path:'/admin/productBrand'},
                    {id:'108',authName:'商品规格',path:'/admin/productSpecs'},
                ]},
                {id:'102',authName:'订单管理',children:[
                    {id:'109',authName:'订单管理',path:'/admin/order'}
                ]},
                {id:'103',authName:'退货管理',children:[
                    {id:'110',authName:'退货原因',path:'/admin/return'}
                ]},
                {id:'104',authName:'商城管理',children:[
                    {id:'111',authName:'商城轮播',path:'/admin/silder'}
                ]},
                {id:'105',authName:'用户管理',children:[
                    {id:'112',authName:'商城用户',path:'/admin/normalUser'},
                    {id:'113',authName:'管理用户',path:'/admin/adminUser'},
                     {id:'114',authName:'权限管理',path:'/admin/authority'},
                ]}
            ],
            iconsObj:{
                    '101' : 'iconfont icon-guanli',
                    '102' : 'iconfont icon-shouye',
                    '103' : 'iconfont icon-zhexiantu',
                    '104' : 'iconfont icon-tubiaobingtu',
                    '105' : 'iconfont icon-User',
                    '106' : 'iconfont icon-zhexiantu',
                    '107' : 'iconfont icon-tubiaobingtu',
                    '108' : 'iconfont icon-tubiaobingtu',
                    '109' : 'iconfont icon-tubiaobingtu',
                    '110' : 'iconfont icon-tubiaobingtu',
                    '111' : 'iconfont icon-tubiaobingtu',
                    '112' : 'iconfont icon-tubiaobingtu',
                    '113' : 'iconfont icon-tubiaobingtu',
                    '114' : 'iconfont icon-User',
                },
            isCollapse : false, // 默认为展开
            }
        },
        methods:{
            // 点击折叠展开侧边栏
            toggleCollapse(){
                this.isCollapse = !this.isCollapse
            },
        }
   }
</script>
<style Lang='less' scoped>
    .aside_container{
        height: 100%;
    }
    .aside_container .el-menu-vertical-demo{
    height: 100%!important;
    user-select: none;
    overflow-x: hidden;
    background-color: rgb(51,51,51);
  }
    .toggle-button {
    background-color:#333;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
    padding-top: 60px;
    }
    .el-menu{
        border-width: 0;
    }

</style>