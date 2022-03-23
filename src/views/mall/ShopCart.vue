<template>
    <div class="shop-cart">
        <!-- 购物车顶部 -->
        <div class="product-box">
            <div class="nav-bar">
                <div class="container">
                <div style="display: inline-block;position:absolute;top: 15px">
                    <h2>我的购物车</h2>
                    <div class="tip">
                    <span>温馨提示：下单不减少库存，仅以付款为准，请下单后尽快付款</span>
                    </div>
                </div>
                </div>
            </div>
        </div>

        <div class="page-main" v-if="tableData">
        <div class="cart-info" v-if="tableData.length!==0">
            <el-table ref="cartTable" :data="tableData" tooltip-effect="dark" :highlight-current-row="false"
                    style="width: 100%;" @selection-change="handleSelectionChange">

            <el-table-column :selectable="selectAble" type="selection" width="100">
            </el-table-column>
                <el-table-column label="商品名称">
                <template slot-scope="scope">
                    <router-link :to="'/mall/ProductDetail?id='+scope.row.productId" style="text-decoration:none;">
                    <div class="product-name">
                        <el-image class="product-img" :src="scope.row.productUrl"></el-image>
                        <span class="name">{{scope.row.productName}}</span>
                    </div>
                    </router-link>
                </template>
                </el-table-column>
            <el-table-column prop="productSpecs" label="规格" width="150"></el-table-column>
            <el-table-column label="单价" width="150">
                <template slot-scope="scope">
                <span>{{scope.row.productPrice}}元</span>
                </template>
            </el-table-column>
            <el-table-column label="数量" width="180">
                <template slot-scope="scope">
                <el-input-number size="small" :min="1" :max="scope.row.productStock" @change="calculationPrice(scope.$index)"  v-model="scope.row.payAmount"></el-input-number>
                </template>
            </el-table-column>
            <el-table-column label="小计" width="150">
                <template slot-scope="scope">
                <span style="color: #409eff">{{scope.row.totalPrice}}元</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
                <template slot-scope="scope">
                    <el-tooltip content="从购物车删除该商品" placement="top" effect="light">
                        <el-button type="danger" icon="el-icon-close" @click="deleteProduct(scope.row.cartId)"></el-button>
                    </el-tooltip>
                </template>

            </el-table-column>
            </el-table>
            <div class="cart-bar">
            <div class="section-left">
                <router-link to="/mall/index" style="text-decoration: none">
                <span class="to-shop">
                    商城首页
                </span>
                </router-link>
                <el-divider direction="vertical"></el-divider>
                <span>
                共
                <span style="color: #409eff">{{this.tableData.length}}</span>
                件商品，已选择
                <span style="color: #409eff">{{this.selectedData.length}}</span>
                件
                </span>
            </div>
            <div class="section-right">
                <span class="total">
                合计：
                <span style="font-size: 30px">{{summation}}</span>
                元
                </span>
                <el-tooltip content="请勾选需要结算的商品" v-if="selectedData" :disabled="selectedData.length!==0" placement="top" effect="light">
                <div class="button">
                    <el-button type="primary" style="height: 100%;width: 100%" :disabled="selectedData.length===0" @click="buy" >去结算</el-button>
                </div>
                </el-tooltip>
            </div>
            </div>
        </div>
        <div v-else class="empty-cart-top">
            <h2>
            购物车为空！
            </h2>
            <el-button type="primary" @click="goIndex">去购物</el-button>
        </div>
        </div>
    </div>
</template>

<script>
   //这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
   //例如：import 《组件名称》 from '《组件路径》';

   export default {
        //import引入的组件需要注入到对象中才能使用
        name: 'ShopCart',
        data() {
            return {
                tableData:null, // 购物车数据
                selectedData:[], // 已选商品
                summation:0, // 金额
                cartInfo:{},// 需要修改的购物车对象
            }
        },
        created(){
            // 创建动画时加载数据
            this.getAllProductByUserId()
        },
        methods:{
            selectAble(row, index) {
                if (row.productStock == 0) {
                    return false;
                } else {
                    return true;
                }
            },
            // 获取购物车的所有商品
            async getAllProductByUserId(){
                // 加载动画
                let loading = this.$loading({lock: true, text: "数据加载中",background:"rgba(255,255,255,0.1)"});
                const result = await this.$http.get('/shopCart/getAllShopCart?userId='+this.$store.getters.getUser.userId)
               if(result.data.code === 200){
                    loading.close()
                    this.tableData=result.data.data;
                    this.tableData.forEach(item => {
                        item.productUrl = this.$serve + item.productUrl
                        item.totalPrice=(item.payAmount * item.productPrice).toFixed(2);
                    })
                }
                loading.close()
            },
            // 勾选购物车之后触发的方法
            handleSelectionChange(val){
                this.summation=0;
                this.selectedData = val;
                for(let i=0,len=this.selectedData.length;i<len;i++){
                    this.summation +=Number(this.selectedData[i].totalPrice);
                }
                this.summation = this.summation.toFixed(2)
            },
            // 修改购物车数量的方法
            async calculationPrice(index){
                this.tableData[index].totalPrice=(this.tableData[index].payAmount * this.tableData[index].productPrice).toFixed(2);
                this.summation=0;
                for(let i=0,len=this.selectedData.length;i<len;i++){
                    this.summation += Number(this.selectedData[i].totalPrice);
                }

                this.summation = this.summation.toFixed(2)
                this.cartInfo.cartId = this.tableData[index].cartId
                this.cartInfo.payAmount = this.tableData[index].payAmount
                const result = await this.$http.post('/shopCart/update',this.cartInfo);
            },
            // 删除购物车中的商品
            async deleteProduct(cartId){
                // 先弹框
                const res = await this.$confirm('此操作将永久删除购物车当前商品, 是否继续?', '提示', 
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => {
                    return err
                })
                // 再删除(确认删除 res = confirm 取消 res = cancel)
                if(res == 'cancel')
                    return this.$message.info('已经取消删除')
                const result = await this.$http.post('/shopCart/delete?cartId='+cartId);
                if(result.data.code === 200){
                    this.$message.success(result.data.message)
                    this.bus.$emit('update',true)
                    this.getAllProductByUserId()
                }else{
                    this.$message.error(result.data.message)
                }
            },
            // 购买的方法
            buy(){
                this.selectedData.forEach(item =>{
                    item.payPrice = item.productPrice
                    item.orderUrl = item.productUrl
                })
                console.log(this.selectedData);
                this.$router.push({path:'/mall/sureOrder',query:{orderInfo:(JSON.stringify(this.selectedData))}})
            },
            goIndex(){
                this.$router.push("/mall/index")
            }
        }
   }
</script>
<style Lang='less' scoped>
    .shop-cart{
        margin: 0;
        padding: 0;
        background: #F5F5F5;
        user-select: none;
        min-height: 100%;
        min-width: 1226px;
    }
    .shop-cart .product-box{
        position: relative;
        z-index: 4;
        background: #fff;
        border-top: 1px solid #e0e0e0;
        border-bottom: 1px solid #e0e0e0;
        -webkit-box-shadow: 0 5px 5px rgba(0,0,0,.07);
        box-shadow: 0 5px 5px rgba(0,0,0,.07);
    }

    .shop-cart .product-box .nav-bar{
        position: relative;
        height: 80px;
        width: 100%;
        margin-top: 0;
        color: #616161;
        border-bottom: 1px solid #e6e6e6;
    }

    .shop-cart .nav-bar .container{
        position: relative;
        width: 80%;
        min-width: 1226px;
        margin-right: auto;
        margin-left: auto;
        text-align: left;
    }

    .shop-cart .nav-bar .container h2{
        margin: 0;
        font-size: 28px;
        font-weight: 400;
        line-height: 60px;
        color: #424242;
        display: inline-block;
    }

    .shop-cart .nav-bar .container .tip{
        display: inline-block;
        margin-left: 20px;
        font-size: 15px;
        margin-top: 21px;
    }

    .shop-cart .nav-bar  div span{
        font-size: 12px;
        color: #757575;
    }

    .shop-cart .page-main{
        min-height: 65vh;
        padding: 30px 0;
    }

    .shop-cart .page-main .cart-info{
        margin: 0 auto;
        width: 80%;
        min-height: 65vh;
        min-width: 1170px;
    }

    /*表格属性*/
    .shop-cart .el-table-column--selection .cell{
        padding-left: 9px;
    }
    .shop-cart .el-table th.gutter{
        display: table-cell!important;
    }

    .shop-cart .el-table th{
        height: 70px;
    }


    .shop-cart .el-table th .cell{
        text-align: center;
        color: #424242;
    }

    .shop-cart .el-table__body td{
        text-align: center;
        color: #424242;
        font-size: 16px;
    }
    .shop-cart .cart-info .product-name{
        text-align: left;
        vertical-align: middle;
    }

    .shop-cart .cart-info .product-name .product-img{
        width: 80px;
        height: 80px;
        margin: 10px 10px 10px 0;
        vertical-align: middle;
    }

    .shop-cart .cart-info .product-name  .name{
        font-size: 18px;
        font-weight: 400;
        color: #424242;
        white-space:nowrap;
        overflow: hidden;
        vertical-align: middle;
        display: inline-block;
        max-width: 260px;
        overflow: hidden;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        word-break: break-all;
        text-overflow: ellipsis;
    }

    .shop-cart .cart-info .cart-bar{
        position: relative;
        margin: 20px 0;
        width: 100%;
        height: 50px;
        background-color: #fff;
        -webkit-transition: background .3s ease,top .3s ease;
        transition: background .3s ease,top .3s ease;
        line-height: 50px;
    }

    .shop-cart .cart-info .cart-bar .section-left{
        position: absolute;
        line-height: 50px;
        margin-left: 32px;
        left: 0;
    }

    .shop-cart .cart-info .cart-bar .section-left span{
        font-size: 14px;
        color: #757575
    }

    .shop-cart .cart-info .cart-bar .section-left .to-shop:hover{
        color: #409eff;
    }

    .shop-cart .cart-info .cart-bar .section-right{
        position: absolute;
        right: 0;
    }

    .shop-cart .cart-info .cart-bar .section-right .total{
        position: absolute;
        top: 0;
        right: 170px;
        height: 50px;
        width: 200px;
        text-align: right;
        margin-left: 20px;
        color: #409eff;
        font-size: 14px;
    }

    .shop-cart .cart-info .cart-bar .section-right .button{
        position: absolute;
        top: 0;
        right: 0;
        height: 50px;
        width: 150px;
    }


    .shop-cart .page-main .empty-cart-top{
        height: 273px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
        color: #b0b0b0;
        overflow: hidden;
        text-align: left;
    }

    .shop-cart .page-main .empty-cart-top h2{
        margin: 70px 0 0 0;
        font-size: 36px;
    }

    .shop-cart .page-main .empty-cart-top .el-button{
        margin: 15px 0 0;
        width: 170px;
        height: 46px;
        font-size: 18px;
    }

    .shop-cart .address-dialog .el-dialog__body{
        padding: 30px 80px;
    }

    .shop-cart .el-form-item__error{
        padding-left: 74px;
    }

    .shop-cart .order-form .el-form-item__label{
        width: 88px;
    }

    .shop-cart .order-form .el-input{
        width: 80%;
    }
    .shop-cart .order-form .el-form-item__error{
        padding-left: 100px;
    }

    .shop-cart .clear-cart{
        position: fixed;
        right: 4%;
        bottom: 6%;
        z-index: 9999;
    }

    .shop-cart .clear-cart .el-icon-delete-solid{
        font-size: 22px;
    }
</style>