<template>
<div class="order_container">
        <el-card class="box-card">
            <div class="box-hd">
                <h1 class="title">我的订单
                    <small>请谨防钓鱼链接或诈骗电话，了解更多
                    </small>
                </h1>
            </div>

            <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
                <el-menu-item index="1">所有订单</el-menu-item>
                <el-menu-item index="2">待付款</el-menu-item>
                <el-menu-item index="3">待发货</el-menu-item>
                <el-menu-item index="4">已发货</el-menu-item>
                <el-menu-item index="5">交易成功</el-menu-item>
                <el-menu-item index="6">退货中</el-menu-item>
                <el-menu-item index="7">退货成功</el-menu-item>
                <el-menu-item index="8">待评价</el-menu-item>
                <el-menu-item index="9">已评价</el-menu-item>
                <el-menu-item index="10">已取消</el-menu-item>
            </el-menu>

            <div  class="text item">
            <el-table class="el-dialog-table"
            :data="orderInfo"
            stripe
            border
            height="480"
            style="width: 100%"
            :cell-style="cellStayle">
            <el-table-column width="1">
                <template slot-scope="scope">
                <div class="orderNo">
                    <span style="margin-left:2%">下单时间: {{orderInfo[scope.$index].orderCreateTime}}  订单编号：{{orderInfo[scope.$index].orderNo }}</span>
                </div>
                </template>
            </el-table-column>
            <el-table-column v-if="false"  prop="orderId"></el-table-column>
            <el-table-column  label="商品" width="300" align="center">
              <template slot-scope="scope" class="productInfo">
                <router-link :to="'/mall/ProductDetail?id='+orderInfo[scope.$index].productId" style="text-decoration:none;">
                <div class="mesSty">
                    <el-image v-if="orderInfo[scope.$index]"
                    style="width: 100px; height: 100px"
                    :src="orderInfo[scope.$index].orderUrl"/>
                    <div class="describe">
                        <p>{{orderInfo[scope.$index].productName+ " "+orderInfo[scope.$index].productDescribe +" "+ orderInfo[scope.$index].productSpecs + "*" + orderInfo[scope.$index].payAmount}}</p>
                    </div>
                </div>
                </router-link>
              </template>
            </el-table-column>
                <el-table-column
                    prop="payPrice"
                    label="单价"  align="center"
                   >
                </el-table-column>
                <el-table-column
                    prop="payAmount"  align="center"
                    label="数量" > 
                </el-table-column>
                <el-table-column
                    prop="totalPrice"  align="center" 
                    label="实付款" >
                </el-table-column>
                <el-table-column align="center"
                    prop="orderState"  
                    label="订单状态">
                     <template slot-scope="scope" >
                    <el-tag v-if="orderInfo[scope.$index].orderState==-1" type="info">已取消</el-tag>
                    <el-tag v-else-if="orderInfo[scope.$index].orderState==0" type="warning">未支付</el-tag>
                    <el-tag v-else-if="orderInfo[scope.$index].orderState==1" type="success">待发货</el-tag>
                    <el-tag v-else-if="orderInfo[scope.$index].orderState==2" type="success">已发货</el-tag>
                    <el-tag v-else-if="orderInfo[scope.$index].orderState==3" type="success">交易成功</el-tag>
                    <el-tag v-else-if="orderInfo[scope.$index].orderState==4" type="danger">正在退货</el-tag>
                    <el-tag v-else-if="orderInfo[scope.$index].orderState==5" type="success">退货成功</el-tag>
                    <el-tag v-else-if="orderInfo[scope.$index].orderState==6" type="success">待评价</el-tag>
                    <el-tag v-else-if="orderInfo[scope.$index].orderState==7" type="success">已评价</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="120" align="center" >
                <template slot-scope="scope">
                    <el-button v-if="orderInfo[scope.$index].orderState==6" type="text" size="small" @click='submitReview(orderInfo[scope.$index].orderId)'>评价商品</el-button>
                        <el-button v-if="orderInfo[scope.$index].orderState!=5 && orderInfo[scope.$index].orderState!=3 && orderInfo[scope.$index].orderState!=6&& orderInfo[scope.$index].orderState!=7 && orderInfo[scope.$index].orderState!=0  && orderInfo[scope.$index].orderState!=1 && orderInfo[scope.$index].orderState!=-1" type="text" size="small" @click="gotGood(orderInfo[scope.$index].orderId)">确认收货</el-button>
                        <el-button @click="buy(orderInfo[scope.$index].orderNo,orderInfo[scope.$index].productName,orderInfo[scope.$index].payPrice,orderInfo[scope.$index].productType)" v-if="orderInfo[scope.$index].orderState==0" type="text" size="small">前去付款</el-button>
                        <el-button v-if="orderInfo[scope.$index].orderState==1 || orderInfo[scope.$index].orderState==2" type="text" size="small" @click='applyReturn(orderInfo[scope.$index].orderId)'>申请退款</el-button>
                        <el-button @click="toDetail(orderInfo[scope.$index].orderId)" type="text" size="small">订单详情</el-button>
                        <el-button v-if="orderInfo[scope.$index].orderState != 0" @click="delteOrder(orderInfo[scope.$index].orderId,orderInfo[scope.$index].orderState)" type="text" size="small">删除订单</el-button>
                        <el-button v-else @click="cancelOrder(orderInfo[scope.$index].orderId)" type="text" size="small">取消订单</el-button> 
                </template>
            </el-table-column>
            </el-table>
        </div>
    
    </el-card>

    <el-dialog
    title="选择退款原因"
    :visible.sync="returnDialogVisible"
    width="30%"
    @close='handleClose'>
    <el-form :model="returnFrom" :rules="returnRules" ref="returnFrom">
        <el-form-item label="退货原因"  prop="returnReason">
          <el-select v-model="returnReason" placeholder="请选择退货原因">
            <el-option v-for="(item,index) in returnReasonList" :key="index" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button style="margin-right:10px;" @click="returnDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitReturn">确 定</el-button>
    </span>
    </el-dialog>

</div>
</template>

<script>
   //这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
   //例如：import 《组件名称》 from '《组件路径》';

   export default {
        //import引入的组件需要注入到对象中才能使用
        name: 'Order',
        data() {
            const checkValue = (rule, value, cb) => {
                if (this.returnReason == null) {
                    cb(new Error('请选择退货原因'));
                } else {
                    cb();
                }
            }
            return {
                orderInfo:null, // 订单信息
                returnDialogVisible:false,
                returnReason:null, // 退款原因
                returnReasonList:null, // 退款原因
                returnRules:{
                    returnReason: [{trigger:  'blur', validator: checkValue }]
                },
                returnFrom:{
                    orderId:null,
                    returnReason:null
                },
                activeIndex: '1',
                userId:null,

            }
        },
        created(){
            // 创建时获取所有的订单
            this.userId = this.$store.getters.getUser.userId
            this.getAllOrder(this.userId,null)
        },
        methods:{
            // 获取所有的订单
            async getAllOrder(userId,key){
                let loading = this.$loading({lock: true, text: "数据加载中",background:"rgba(255,255,255,0.1)"});
                const result = await this.$http.get('/order/getAllOrderByKey',{params:{userId:userId,key:key}})
                if(result.data.code === 200){
                    loading.close()
                    this.orderInfo = result.data.data
                    this.orderInfo.forEach(item => {
                        item.orderUrl = this.$serve + item.orderUrl
                        item.orderCreateTime = new Date(item.orderCreateTime).toLocaleString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
                        item.payPrice = item.payPrice.toFixed(2)
                        item.totalPrice=(item.payAmount * item.payPrice).toFixed(2);
                    })
                }
                loading.close()
            },
            async getReturnReasonName(){
                const result = await this.$http.get('/returnReason/getAllReason')
                if(result.data.code === 200){
                    this.returnReasonList = result.data.data
                }
            },
            // 设置表格样式
            cellStayle({row,columnIndex,column}){
                if (column.label == '单价' || columnIndex === 3|| columnIndex === 4|| columnIndex === 5|| columnIndex === 6){
                    return 'padding-top: 50px; '
                }
            },
            // 去订单详情
            toDetail(orderId){
                this.$router.push({path:'/mall/OrderDetail',query:{orderId:orderId}})
            },
            // 提交订单
            async buy(orderNo,productName,payPrice,productType){
                let orderNoList = []
                orderNoList.push(orderNo)
                await this.$http.post('/alipay/setOrderList',orderNoList)
                let orderName = productType+'-'+productName+'支付订单';
                let loading = this.$loading({lock: true, text: "正在跳转支付页面",background:"rgba(255,255,255,0.1)"});
                const result = await this.$http.post('/alipay/create?orderNo='+orderNo+'&orderName='+orderName+'&payPrice='+payPrice)
                console.log(result);
                if(result.status === 200){
                    loading.close();
                    const div = document.createElement('div');
                    div.innerHTML = result.data;
                    document.body.appendChild(div);
                    document.forms[document.forms.length-1].submit();
                }
                loading.close();
            },
            // 删除订单
            async delteOrder(orderId,orderState){
                // 先弹框
                const res = await this.$confirm('此操作将永久删除当前订单, 是否继续?', '提示', 
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => {
                    return err
                })
                // 再删除(确认删除 res = confirm 取消 res = cancel)
                if(res == 'cancel')
                    return;
                if(orderState === 1 ||orderState === 2 || orderState === 4){
                    return this.$message.error("订单正在处理中,暂时无法删除!")
                }
                const result = await this.$http.post('/order/deleteOrderById?orderId='+orderId)
                if(result.data.code === 200){
                    this.getAllOrder()
                    return this.$message.success("删除订单成功")
                }

            },
            // 取消订单
            async cancelOrder(orderId){
                // 先弹框
                const res = await this.$confirm('此操作将永久取消当前订单, 是否继续?', '提示', 
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => {
                    return err
                })
                if(res == 'cancel')
                    return;
                let order={'orderId':orderId,orderState:-1}
                const result = await this.$http.post('/order/updateOrderById',order)
                if(result.data.code === 200){
                    this.getAllOrder(this.userId,null)
                    return this.$message.success("订单已取消")
                }
            },
            applyReturn(orderId){
                this.returnFrom.orderId = orderId
                this.getReturnReasonName()
                this.returnDialogVisible = true
            },
            // 确认申请退款
            submitReturn(){
                // 预校验
                this.$refs.returnFrom.validate(async valid => {
                    if(!valid) return; // 验证不通过

                    // 先弹框
                    const res = await this.$confirm('确认申请退款, 是否继续?', '提示', 
                    {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).catch(err => {
                        return err
                    })
                    // 再删除(确认删除 res = confirm 取消 res = cancel)
                    if(res == 'cancel')
                        return;
                    
                    this.returnFrom.returnReason = this.returnReason
                    this.returnFrom.orderState = 4
                    const result = await this.$http.post('/order/updateOrderById',this.returnFrom)
                    if(result.data.code === 200){
                        this.$message.success("申请退款成功")
                        this.returnDialogVisible = false
                        this.getAllOrder(this.userId,null)
                    }
                })
                
            },
            async gotGood(orderId){
                // 先弹框
                const res = await this.$confirm('确认收到货物?', '提示', 
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => {
                    return err
                })
                // 再删除(确认删除 res = confirm 取消 res = cancel)
                if(res == 'cancel')
                    return;
                let info={
                    orderId:orderId,
                    returnReason:'',
                    orderState:3
                }
                const result = await this.$http.post('/order/updateOrderById',info)
                if(result.data.code === 200){
                    this.$message.success("确认收货成功")
                    this.returnDialogVisible = false
                    this.getAllOrder(this.userId,3)
                }
                    
            },
            handleClose(){
                this.returnReason = null
                this.$refs.returnFrom.resetFields()
            },
            handleSelect(key){
                if(key == 1){
                    this.getAllOrder(this.userId,null)
                }else if(key == 2){
                    this.getAllOrder(this.userId,0)
                }else if(key == 3){
                    this.getAllOrder(this.userId,1)
                }else if(key == 4){
                    this.getAllOrder(this.userId,2)
                }else if(key == 5){
                    this.getAllOrder(this.userId,3)
                }else if(key == 6){
                    this.getAllOrder(this.userId,4)
                }else if(key == 7){
                    this.getAllOrder(this.userId,5)
                }else if(key == 8){
                    this.getAllOrder(this.userId,6)
                }else if(key == 9){
                    this.getAllOrder(this.userId,7)
                }else if(key == 10){
                    this.getAllOrder(this.userId,-1)
                }
            },
        }
   }
</script>
<style Lang='less' scoped>
    .order_container{
        width: 70%;
        height: 100%;
        position: relative;
        left: 25%;
    }
    .mesSty {
        display: flex;
        align-items: center;
        border-bottom: 1px solid #ebeef5;
        margin-top: 50px; 
    }
    .orderNo {
        width: 100vw;
        background: #f1f1f1;
        position: absolute;
        display: block;
        top: 0;
        left: 0;
        z-index: 1;
        height: 50px;
        line-height: 50px;
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
    .describe{
        height: 100px;
        width: 180px;
        margin-left:5px ;
    }
    .el-button+.el-button{
        margin: 0;
    }

    .el-table__row>.el-table_1_column_3>div{
        margin-top:50px;
    }

    /deep/ .el-table__body-wrapper::-webkit-scrollbar {
        width: 0;
    }
    /deep/ .el-table__body-wrapper::-webkit-scrollbar-thumb  {
        background-color: #fff
    }

</style>