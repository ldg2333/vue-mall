<template>
<div class="mall-product">
    <!--回到顶部-->
    <el-backtop target=".mall-product" style="height: 50px;width: 50px">
      <i class="el-icon-top"></i>
    </el-backtop>
    <!--商品信息-->
    <div class="mall-info clearfix">
      <div class="product-hd">

        <!--导航栏-->
        <div class="mall-nav">
            <el-menu :default-active="activeIndex" class="el-menu-demo" :collapse-transition="false" active-text-color="#409EFF" mode="horizontal">
                <el-menu-item index="1" style="width: 12%;margin-left:10%;position: relative">
                <router-link to="/mall/index" style="text-decoration: none;position: absolute;right: 0">
                    <el-image class="animate__animated animate__fadeIn" style="width: 220px;height: 60px;" :src="require('E://Java//毕设//优购商城//you_gou_mall_vue//src//assets//img//logo.jpeg')"></el-image>
                </router-link>
                </el-menu-item>
                <el-menu-item index="2" style="width: 50%">
                <el-input clearable placeholder="请输入搜索内容" v-model="queryProductInfo" @keyup.enter.native="queryProduct(queryProductInfo)" class="input-with-select" style="height: 45px;">
                    <el-button slot="append" icon="el-icon-search" @click="queryProduct(queryProductInfo)"></el-button>
                </el-input>
                </el-menu-item>
                <el-submenu index="3" style="width: 10%;">
                    <template slot="title">商品分类</template>
                    <vue-scroll :ops='scrollSettings' style='width: 100%;height:150px;'>
                        <el-menu-item v-for="(item,i) in productType" :index="'3-'+i" :key="'3-'+i" @click="queryProduct(item,'type')">{{item}}</el-menu-item>
                    </vue-scroll>
                </el-submenu>
                <el-submenu index="4" style="width: 10%">
                    <template slot="title">商品品牌</template>
                        <vue-scroll :ops='scrollSettings' style='width: 100%;height:150px;'>
                    <el-menu-item v-for="(item,i) in productBrand" :index="'4-'+i" :key="'4-'+i" @click="queryProduct(item,'brand')">{{item}}</el-menu-item>
                        </vue-scroll>
                </el-submenu>
            </el-menu>
        </div>
        <div class="product-box">
          <div style="position:absolute;padding: 23px;">
            <span>{{this.paramsKey}}</span>
            <span style="padding-right: 12px;">:</span>
            <span style="color:#87CEFA;cursor: pointer">{{this.keyword}}</span>
          </div>
        </div>
      </div>
      <div class="mall-container clearfix" v-if="productInfo">
        <ul v-if="productInfo.length!==0">
          <li v-for="(product,index) in this.productInfo" :key="index" @click="buy(product.productId)">
            <div style="float: left;width: 44%;height: 100%">
              <el-image :src="product.productUrl" style="width: 100%"></el-image>
            </div>
            <div class="pro-con">
              <span :title="product.productName" class="name">{{product.productName}}</span>
              <span class="desc">{{product.productDescribe}}</span>
              <span class="price">{{product.outPrice}}元</span>
              <div style="position: absolute;bottom: 30px;">
                <el-button size="small" type="danger" style="padding: 9px 29px;">
                  <span v-if="$store.state.user!=null">立即抢购</span>
                  <span v-else>登录后抢购</span>
                </el-button>
              </div>
            </div>
          </li>
        </ul>
        <div v-else class="no-product">
          <el-image style="width:400px;height:388px" src="http://localhost:8082/product/noProduct.png"></el-image>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
   //这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
   //例如：import 《组件名称》 from '《组件路径》';

   export default {
        //import引入的组件需要注入到对象中才能使用
        name: 'ProductMall',
        data() {
            return {
                keyword:null, // 通过关键字输入搜索
                params:null,   // 通过（商品名称、类型、品牌）查询
                paramsKey:null, // 查询的内容
                productInfo:null, // 商品信息
                productType: [], // 商品类型名称
                productBrand: [], // 商品品牌名称,
                queryProductInfo: '', // 需要搜索的商品信息
                select: "1",// 默认选中第一个选项,
                scrollSettings:{ // 滑动条设置
                    vuescroll:{},
                    scrollPanel:{},
                    rail:{
                        keepShow: true
                    },
                    bar:{
                        hoverStyle: true,
                        onlyShowBarOnScroll: false, // 是否只有滚动的时候才显示滚动条
                        backgrounp: 'blue', // 滚动条颜色
                        opacity: 0.5, // 滚动条透明度
                        'overflow-x':'hidden' // 隐藏横条
                    }
                },
                activeIndex:'',  //当前激活菜单的 index
            }
        },
        async created(){
            // 创建时获取根据查询条件查询的商品
            this.getProductByKey()
             // 创建时获取所有ProductTypeName
            this.getAllProductTypeName()
            // 创建时获取所有ProductTypeName
            this.getAllProductBrandName()
        },
        methods:{
             // 获取所有的品牌类型名称
            async getAllProductTypeName(){
                const result = await this.$http.post('/product/productType/findAllName')
                if(result.data.code === 200){
                    this.productType = result.data.data
                }
            },
            // 获取所有的品牌类型
            async getAllProductBrandName(){
                const result = await this.$http.post('/product/productBrand/findAllBrandName')
                if(result.data.code === 200){
                   this.productBrand = result.data.data
                }
            },
            async getProductByKey(){
                if(this.$route.query.keyword!=null){ // 关键字搜索不为空时
                    this.keyword = this.$route.query.keyword
                }
                // 通过（商品名称、类型、品牌）查询 且输入关键字
                this.paramsKey = '搜索关键字'
                const result = await this.$http.post('/product/findAllLikeKeyWord?keyWord='+this.keyword)
                if(result.data.code === 200){
                    this.productInfo = result.data.data
                }
                this.productInfo.forEach(item => {
                    item.productUrl = this.$serve + item.productUrl
                })
            },
            // 搜索商品 params为undifined时 是搜索按钮发起请求
            async queryProduct(productInfo,params){
                if(params===undefined){
                    switch (this.select){
                        case "1":
                        params = "name";
                        break;
                        case "2":
                        params = "type";
                        break;
                        case "3":
                        params = "brand";
                        break;
                    }
                }
                if(productInfo != null){
                    this.keyword = productInfo
                }
                if(params != null){ // 通过（商品名称、类型、品牌）查询
                    this.params = params
                }
                // 通过（商品名称、类型、品牌）查询 且输入关键字
                if(this.keyword!==null && this.params!=null){ 
                    if(this.params==='name'){
                        this.paramsKey = '搜索关键字'
                        const result = await this.$http.post('/product/findAllLikeName?keyWord='+this.keyword)
                        if(result.data.code === 200){
                            this.productInfo = result.data.data
                        }
                    }else if(this.params==='type'){
                        this.paramsKey = '搜索关键字'
                        const result = await this.$http.post('/product/findAllLikeType?keyWord='+this.keyword)
                        if(result.data.code === 200){
                            this.productInfo = result.data.data
                        }
                    }else if(this.params==='brand'){
                        this.paramsKey = ' 搜索关键字'
                        const result = await this.$http.post('/product/findAllLikeBrand?keyWord='+this.keyword)
                        if(result.data.code === 200){
                            this.productInfo = result.data.data
                        }
                    }
                    this.productInfo.forEach(item => {
                        item.productUrl = this.$serve + item.productUrl
                    })
                }
            },
            // 跳转到购买页
            buy(productId){
                console.log(this.$store.state.user);
                if(this.$store.state.user===null){
                    this.$notify({
                        title: '警告',
                        message: '请先登录',
                        type: 'warning'
                    });
                return this.$router.push({path:'/mall/login'});
                }
                this.$router.push({path:'/mall/productDetail',query:{id:productId}})
            }
        }
   }
</script>
<style Lang='less' scoped>
    .mall-product{
        margin: 0;
        padding: 0;
        background: #fff;
        user-select: none;
        min-height: 100%;
        overflow-x: hidden;
    }

    .mall-product .mall-info{
        width: 80%;
        min-width: 1325px;
        margin: 0 auto;
        border: 1px;
        min-height: 800px;
    }

    .mall-product .product-hd{
        height: 170px;
        position: relative;
    }

    .mall-product .product-hd .product-box{
        position: absolute;
        bottom: 0;
        height: 40%;
        width: 100%;
        text-align: left;
        background: #414141;
        color: white;
    }

    .mall-product .mall-container{
        width: 100%;
    }

    .mall-product .mall-container ul{
        width: 100%;
        margin: 0;
        padding: 0.5%;
    }

    .mall-container ul:after, .mall-container ul:before{
        content: " ";
        display: table;
    }

    .mall-product .mall-container li{
        float: left;
        list-style: none;
        background: #fff;
        width: 31%;
        height: 190px;
        margin: 16px 1% 17px;
        -webkit-transition: all .2s linear;
        transition: all .2s linear;
        position: relative;
        z-index: 2;
        cursor: pointer;
        overflow: hidden;
    }

    .mall-product .mall-container li:hover{
        z-index: 2;
        -webkit-box-shadow: 0 15px 30px rgba(0,0,0,.1);
        box-shadow: 0 15px 30px rgba(0,0,0,.1);
        -webkit-transform: translate3d(0,-2px,0);
        transform: translate3d(0,-2px,0);
    }


    .mall-product .mall-container .pro-con{
        float: left;
        padding-top: 30px;
        padding-left: 6%;
        width: 50%;
        text-align: left;
    }

    .mall-product .mall-container .pro-con .name{
        font-size: 16px;
        color: #333;
        height: 16px;
        overflow: hidden;
        _zoom: 1;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: block;
        line-height: 16px;
    }
    .mall-product .mall-container .pro-con .desc{
        color: rgba(0,0,0,.54);
        margin-top: 7px;
        font-size: 12px;
        line-height: 16px;
        height: 32px;
        width: 100%;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
    }
    .mall-product .mall-container .pro-con .price{
        font-size: 20px;
        color: #f1393a;
        line-height: 1;
        margin-top: 14px;
    }


    .mall-container .no-product{
        min-height: 630px;
        line-height: 630px;
        display: flex;
        justify-content: center;
        align-items: center;
    }


    .clearfix:after{/*伪元素是行内元素 正常浏览器清除浮动方法*/
        content: "";
        display: block;
        height: 0;
        clear:both;
        visibility: hidden;
    }
    .clearfix{
        *zoom: 1;/*ie6清除浮动的方式 *号只有IE6-IE7执行，其他浏览器不执行*/
    }

    .mall-product .mall-container{
        margin: 0;
        padding: 0;
        min-height: 600px;
        height: auto;
        background: #F5F5F5;
        user-select: none;
    }
    .mall-nav{
        position: relative;
        left: 50%;
        top: 30%;
        transform: translate(-50%,-50%);
    }
    /deep/ .mall-nav .el-input__inner{
        height: 45px;
    }
    .mall-nav .el-menu-item{
        margin: 0 1%;
        padding:0;
    }
</style>