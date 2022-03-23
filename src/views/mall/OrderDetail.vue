<template>
<div class="detail_container">
    <el-card class="box-card">
        <div class="box-hd">
            <h1 class="title">订单详情
                <small>请谨防钓鱼链接或诈骗电话，了解更多
                </small>
            </h1>
        </div>
        <div class="detail">
            <div class="address">
                <div class="address-info">收货地址: {{ orderInfo[0].province_name +' '+ orderInfo[0].city_name+' '
                    + orderInfo[0].area_name+' '+ orderInfo[0].address_detail+' '+ orderInfo[0].phone+' , '+orderInfo[0].zip_code+' , '+ orderInfo[0].name+'收'}}
                </div>
                <div class="pay-info">
                    订单状态: 
                    <el-tag v-if="orderInfo[0].order_state==-1" type="danger">已取消</el-tag>
                    <el-tag v-else-if="orderInfo[0].order_state==0" type="warning">待支付</el-tag>
                    <el-tag v-else-if="orderInfo[0].order_state==1" type="success">已支付</el-tag>
                    <el-tag v-else-if="orderInfo[0].order_state==2" type="success">已发货</el-tag>
                    <el-tag v-else-if="orderInfo[0].order_state==3" type="success">交易成功</el-tag>
                    <el-tag v-else-if="orderInfo[0].order_state==4" type="danger">退货中</el-tag>
                    <el-tag v-else-if="orderInfo[0].order_state==5" type="danger">已退货</el-tag>
                    <el-tag v-else-if="orderInfo[0].order_state==6" type="warning">待评价</el-tag>
                    <el-tag v-else-if="orderInfo[0].order_state==7" type="success">已评价</el-tag>
                    <span v-if="orderInfo[0].order_state==4 || orderInfo[0].order_state==5" style="margin-left:2%;">退款原因:{{orderInfo[0].return_reason}}</span>
                </div>
                <div v-if="orderInfo[0].order_state == 3 || orderInfo[0].order_state == 4 || orderInfo[0].order_state == 5 || orderInfo[0].order_state == 6 || orderInfo[0].order_state == 7" class="express-info">运送方式: 快递</div>
            </div>
            <div class="info">
                 <div class="order_info">
                     <span>订单编号: {{orderInfo[0].order_no}}</span>
                     <span>下单时间: {{orderInfo[0].order_create_time}}</span>
                     <span v-if="orderInfo[0].order_state!=0">付款时间: {{orderInfo[0].order_pay_time}}</span>
                 </div>
                 <div class="order_product">
                     <el-table
                        :data="orderInfo"
                        border=""
                        stripe
                        style="width: 100%">
                       <el-table-column   label="商品" width="450" align="center">
                        <template class="productInfo">
                            <router-link :to="'/mall/ProductDetail?id='+orderInfo[0].product_id" style="text-decoration:none;">
                            <div class="mesSty">
                                <el-image v-if="orderInfo"
                                style="width: 100px; height: 100px"
                                :src="orderInfo[0].order_url"/>
                                <div class="describe">
                                    <p>{{orderInfo[0].product_name+ " "+orderInfo[0].product_describe +" "+ orderInfo[0].product_specs + "*" + orderInfo[0].pay_amount}}</p>
                                </div>
                            </div>
                            </router-link>
                        </template>
                        </el-table-column>
                        <el-table-column
                            align="center"
                            label="状态"
                            width="180">
                            <template >
                            <el-tag v-if="orderInfo[0].order_state==-1" type="info">已取消</el-tag>
                            <el-tag v-else-if="orderInfo[0].order_state==0" type="warning">未支付</el-tag>
                            <el-tag v-else-if="orderInfo[0].order_state==1" type="success">待发货</el-tag>
                            <el-tag v-else-if="orderInfo[0].order_state==2" type="success">已发货</el-tag>
                            <el-tag v-else-if="orderInfo[0].order_state==3" type="success">交易成功</el-tag>
                            <el-tag v-else-if="orderInfo[0].order_state==4" type="danger">正在退货</el-tag>
                            <el-tag v-else-if="orderInfo[0].order_state==5" type="success">退货成功</el-tag>
                            <el-tag v-else-if="orderInfo[0].order_state==6" type="success">待评价</el-tag>
                            <el-tag v-else-if="orderInfo[0].order_state==7" type="success">已评价</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="pay_price" align="center"
                            label="单价">
                        </el-table-column>
                        <el-table-column
                            prop="pay_amount" align="center"
                            label="数量">
                        </el-table-column>
                        </el-table>
                 </div>
                 <div class="order_pay">
                    <span class="totalPay">商品总价:{{(orderInfo[0].pay_price * orderInfo[0].pay_amount).toFixed(2)}} 元</span>
                    <span class="truePay">实付款:<span class="pay">{{(orderInfo[0].pay_price * orderInfo[0].pay_amount).toFixed(2)}}</span> 元</span>
                 </div>
            </div>
        </div>
    </el-card>
</div>
</template>

<script>
   //这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
   //例如：import 《组件名称》 from '《组件路径》';

   export default {
        //import引入的组件需要注入到对象中才能使用
        name: 'OrderDetail',
        data() {
            return {
                orderId:null,// 订单id
                orderInfo:null,
            }
        },
        created(){
            // 根据路由信息获取商品id
            this.orderId = this.$route.query.orderId;
            this.getOrderDetail()
        },
        methods:{
            async getOrderDetail(){
                const result = await this.$http.get('/order/getOrderById',{params:{orderId:this.orderId}})
                if(result.data.code === 200){
                    this.orderInfo = result.data.data
                    this.orderInfo[0].order_url = this.$serve + this.orderInfo[0].order_url
                    this.orderInfo[0].order_create_time = new Date(this.orderInfo[0].order_create_time).toLocaleString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
                    if(this.orderInfo[0].order_pay_time != null){
                        this.orderInfo[0].order_pay_time = new Date(this.orderInfo[0].order_pay_time).toLocaleString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
                    }
                    this.orderInfo[0].pay_price = this.orderInfo[0].pay_price.toFixed(2)
                }
            }
        }
        
   }
</script>
<style Lang='less' scoped>
    .detail_container{
        width: 70%;
        height: 100%;
        position: relative;
        left: 25%;
    }
    .box-hd{
        position: relative;
        left: -25%;
    }
    .title{
        margin: 0;
        font-size: 30px;
        font-weight: 400;
        line-height: 68px;
        color: #757575;
    }
    .box-hd small {
        margin-left: 10px;
        font-size: 12px;
        line-height: 1.5;
    }
    .detail{
        border: 1px solid #757575;
    }
    .address{
        height: 120px;
        width: 96%;
        position: relative;
        left: 2%;
        border-bottom: 1px solid #757575;
    }
    .address-info{
        position: absolute;
        left: 0;
        top: 20px;
        text-align: center;
    }
    .info{
        width: 96%;
        position: relative;
        left: 2%;
        height: 350px;
    }
    .express-info{
        position: absolute;
        left: 0;
        top: 90px;
    }
    .pay-info{
        position: absolute;
        left: 0;
        top: 50px;
    }
    .order_info{
        position: absolute;
        left: 0;
        top: 30px;
    }
    .order_product{
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 50px;
    }
     .order_info span{
         margin-right: 10px;
     }
     .mesSty {
        display: flex;
        align-items: center;
    }
    .order_pay{
        position: absolute;
        right: 10px;
        bottom: 10px;
    }
    .totalPay{
        display: block;
        margin-bottom:20px ;
        position: relative;
        left: 0;
    }
    .truePay{
        display: block;
        position: relative;
        left: 0;
    }
    .pay{
        font-size: 18px;
        color: red;
        font-weight: 700;
    }
</style>