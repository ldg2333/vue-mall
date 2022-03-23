<template>
    <div class="MallIndex_containner">
        <div class="container">
            <!--回到顶部-->
            <el-backtop target=".container" style="height: 50px;width: 50px">
                <div
                style="{
                    height: 100%;
                    width: 100%;
                    background-color: #f2f5f6;
                    box-shadow: 0 0 6px rgba(0,0,0, .12);
                    text-align: center;
                    line-height: 40px;
                    color: #1989fa;
                }"
                >
                回到顶部
                </div>
            </el-backtop>
            <!--导航栏-->
            <div class="mall-nav">
                <el-menu :default-active="activeIndex" class="el-menu-demo" :collapse-transition="false" active-text-color="#409EFF" mode="horizontal">
                    <el-menu-item index="1" style="width: 12%;margin-left:10%;position: relative">
                    <router-link to="/mall/index" style="text-decoration: none;position: absolute;right: 0">
                        <el-image class="animate__animated animate__fadeIn" style="width: 220px;height: 60px;" :src="require('E://Java//毕设//优购商城//you_gou_mall_vue//src//assets//img//logo.jpeg')"></el-image>
                    </router-link>
                    </el-menu-item>
                    <el-menu-item index="2" style="width: 50%;border-radius: 50%;">
                    <el-input placeholder="请输入查找内容" v-model="queryProductInfo" @keyup.enter.native="queryProduct(queryProductInfo)" class="input-with-select" style="height: 45px;">
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
            <!--轮播图-->
            <div class="slideshow" v-if="this.bannerInfo">
                <el-carousel height="480px">
                    <el-carousel-item  v-for="banner in bannerInfo" :key="banner.bannerId">
                    <router-link :to="banner.productUrl" style="width: 100%;height: 100%">
                        <el-image fit="cover" :src="banner.bannerUrl" style="height: 100%;width: 100%"></el-image>
                    </router-link>
                    </el-carousel-item>
                </el-carousel>
            </div>
            <div class="slideshow" v-else>
                <el-carousel height="480px">
                    <el-carousel-item  v-for="image in carouselImage" :key="image">
                        <el-link href="/mall/index" style="width: 100%;height: 100%">
                        <el-image fit="cover" :src="image" style="height: 100%;width: 100%"></el-image>
                        </el-link>
                    </el-carousel-item>
                </el-carousel>        
            </div>
            <!--商品信息-->
            <div v-if="productsInfo != null" class="product clearfix">
                <div class="product-info" v-for="(value, key) in this.productsInfo" :key="key">
                    <el-image lazy scroll-container=".MallIndex_containner" style="height: 200px;margin: 30px 0 0;width: 98.5%;min-width:1325px" :src="value[0]['urlTop']"></el-image>
                    <div class="box-hd">
                    <h2 class="product-type-title">
                        {{value[0]['typename']}}
                    </h2>
                    <div class="more" @click="queryProduct(value[0]['typename'],'type')">
                        查看更多
                        <i class="el-icon-video-play"></i>
                    </div>
                    </div>
                    
                    <ul class="product-item" v-if="value[1].length!==0">
                    <li v-for="(product,index) in value[1]" :key="index" @click="buy(product.productId)">
                        <a>
                        <el-image lazy scroll-container=".MallIndex_containner" :src="product.productUrl"></el-image>
                        <h3 class="title">
                            <el-tag type="warning" v-if="product.isNew" size="mini" style="margin-right: 3px">新品</el-tag>
                            {{product.productName}}</h3>
                        <p class="desc">{{product.productDescribe}}</p>
                        <p class="price">
                            <span class="num">{{product.outPrice}}</span>元<span>起</span>
                        </p>
                        </a>
                    </li>
                    </ul>
                    <div class="clearfix" v-else style="float:left;display:flex;justify-content:center;align-items: center; width:83%;height: 75%;background-color: #FFF">
                        <el-image  el-image style="width: 410px" src="http://localhost:8082/product/noProduct.png"></el-image>
                    </div>
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
        name: 'IndexMall',
        data() {
            return {
                activeIndex:'',  //当前激活菜单的 index
                queryProductInfo: '', // 需要搜索的商品信息
                select: "1",// 默认选中第一个选项
                productType: [], // 商品类型名称
                productBrand: [], // 商品品牌名称
                carouselImage:[ // 当数据库不存在轮播图时 使用默认的轮播图
                    "http://localhost:8082/banner/banner1.png",
                    "http://localhost:8082/banner/banner2.png",
                    "http://localhost:8082/banner/banner3.png",
                    "http://localhost:8082/banner/banner4.png",
                ],
                bannerInfo:null, // 需要展示的轮播图,
                productsInfo:null, // 商品信息,
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
                newProduct:[], // 新品信息
                productTypeInfo:[], // 商品类型信息,
                productsInfo:null, // 所有的在售商品
            }
        },
        created(){
            // 创建时获取所有banner
            this.getAllBanner()
            // 创建时获取所有ProductTypeName
            this.getAllProductTypeName()
            // 创建时获取所有ProductTypeName
            this.getAllProductBrandName()
            // 创建时获取所有的类型内容
            this.getAllProductType()
            // 创建时获取所有新品
            this.getAllProducyNew()
            // 创建时获取所有的商品
            this.getAllProduct()
        },
        methods:{
            // 搜索商品 params为undifined时 是搜索按钮发起请求
            queryProduct(productInfo){
                // 跳转到商品页 并传递参数
                this.$router.push({path:'/mall/productMall',query:{keyword:productInfo}})
            },
            // 获取所有的banner
            async getAllBanner(){
                const result = await this.$http.post('banner/findAll')
                if(result.data.code === 200 )
                result.data.data.forEach(item => {
                    item.bannerUrl = this.$serve + item.bannerUrl
                })
                this.bannerInfo = result.data.data
            },
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
            // 获取所有类型的内容
            async getAllProductType(){
                 const result = await this.$http.post('/product/findAllByType')
                 if(result.data.code === 200){
                     this.productTypeInfo = result.data.data
                     this.productTypeInfo.forEach(item => {
                        item.type_url_left = this.$serve + item.type_url_left
                        item.type_url_top = this.$serve + item.type_url_top
                    })
                 }
            },
            // 获取新品商品
            async getAllProducyNew(){
                const result = await this.$http.post('/product/findAllNew')
                if(result.data.code === 200){
                    this.newProduct = result.data.data
                    this.newProduct.forEach(item => {
                        item.productUrl = this.$serve + item.productUrl
                    })
                }
            },
            // 获取所有的商品
            async getAllProduct(){
                const result = await this.$http.post('/product/findAllSale')
                let productsInfoTemp = null;
                if(result.data.code === 200){
                    productsInfoTemp = result.data.data
                    productsInfoTemp.forEach(item => {
                    item.productUrl = this.$serve + item.productUrl
                })
                }
                this.productsInfo = new Map()
                for(let i=0,len1=productsInfoTemp.length;i<len1;i++){
                    let list = [];
                    let typeInfo = {};
                    typeInfo['typename']=this.productTypeInfo[i]['product_type'];
                    typeInfo['urlLeft']=this.productTypeInfo[i]['type_url_left'];
                    typeInfo['urlTop']=this.productTypeInfo[i]['type_url_top'];
                    for(let j=0,len=productsInfoTemp.length; j < len; j++){
                        if(productsInfoTemp[j]['productType']===typeInfo['typename']){
                            list.push(productsInfoTemp[j]);
                        }
                    }
                    this.productsInfo.set(typeInfo,list);
                }
            },
            // 商品详情页
            buy(productId){
                this.$router.push({path:'/mall/productDetail',query:{id:productId}})
            }
        }
   }
</script>
<style Lang='less' scoped>
    .MallIndex_containner{
        height: 100%;
        width: 100%;
        overflow-x: hidden;
        overflow-y: scroll;
    }
    .container{
        width: 100%;
        height: 100%;
    }
    /deep/ .mall-nav .el-input__inner{
        height: 45px;
    }
    .mall-nav .el-menu-item{
        margin: 0 1%;
        padding:0;
    }

    .slideshow{
    margin: 0 auto;
    height: 480px;
    width: 90%;
    min-width: 1325px;
    }

    .slideshow .el-link--inner{
        width: 100%;
        height: 100%;
    }

    .product{
    width: 90%;
    min-width: 1325px;
    margin: 0 auto;
    background: #fff;
    }
    .product .product-type-title{
        margin: 0;
        text-align: left;
        font-size: 22px;
        font-weight: 200;
        line-height: 58px;
        color: #333;
    }
    .product .product-info{
        height: 820px;
        overflow: hidden;
        text-align: left;
        margin: 0 0 20px;
        padding: 0;
    }

    /*商品类别标头*/
    .product .box-hd{
        position: relative;
        height: 58px;
        -webkit-font-smoothing: antialiased;
    }
    .product .box-hd .more{
        position: absolute;
        top: 0;
        right: 70px;
        line-height: 58px;
        cursor: pointer;
    }
    .product .box-hd .more:hover{
        color: #EA875E;
    }
    /*商品类别广告*/
    .product .product-type-promo{
        margin: 0;
        padding: 0;
        max-width: 234px;
        min-width: 210px;
        width: 15%;
        height: 614px;
        float: left;
    }
    .product .product-type-promo li{
        list-style-type:none;
        height: 100%;
        cursor: pointer;
        transition: all .2s linear; /*过渡动画*/
    }
    /*商品信息*/
    .product .product-item{
        float: left;
        height: 614px;
        width: 84%;
        margin: 0;
        padding: 0;
        text-align: center;
    }

    .product .product-item li{
        list-style-type:none;
        height: 260px;
        padding: 20px 0;
        position: relative;
        z-index: 1;
        float: left;
        width: 17%;
        margin-left: 2.85%;
        margin-bottom: 14px;
        border-radius: 8px;
        background: #fff;
        -webkit-transition: all .2s linear;
        cursor: pointer;
        transition: all .2s linear; /*过渡动画*/
    }
    .product-type-promo li:hover,.product-item li:hover{
        z-index: 2;
        -webkit-box-shadow: 0 15px 30px rgba(0,0,0,.1);
        box-shadow: 0 15px 30px rgba(0,0,0,.1);
        -webkit-transform: translate3d(0,-2px,0);
        transform: translate3d(0,-2px,0);
    }
    .product-item .el-image{
        width: 160px;
        height: 160px;
        margin: 0 auto 18px;
    }
    .product-item .title {
        margin: 0 10px 5px;
        height: 18px;
        font-size: 14px;
        font-weight: 400;
        overflow: hidden;
        color: #333;
    }
    .product-item .desc {
        margin: 0 10px 5px;
        height: 18px;
        font-size: 12px;
        color: #b0b0b0;
        overflow: hidden;
    }
    .product-item .price {
        margin: 0 10px 10px;
        text-align: center;
        color: #ff6700;
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
</style>