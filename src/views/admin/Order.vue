<template>
<div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/admin/index' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
        <div class="text item">
            <!-- 增删改查区域 -->
            <el-form ref="orderInfoRef" :inline="true" :model="selectOrderInfo" class="demo-form-inline">
                <el-form-item label="订单编号">
                    <el-input @clear='queryOrderInfo' clearable v-model="selectOrderInfo.orderNo" placeholder="请输入编号"></el-input>
                </el-form-item>
                
                <el-form-item label="收货信息">
                    <el-input @clear='queryOrderInfo' clearable v-model="selectOrderInfo.addressInfo" placeholder="省/市/区"></el-input>
                </el-form-item>
                <el-form-item label="付款时间">
                    <el-date-picker
                    style="float: right;z-index: 1"
                    size="small"
                    v-model="payTime"
                    type="daterange"
                    value-format="yyyy-MM-dd"
                    align="right"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change="getData()"
                    :picker-options="pickerOptions">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="订单状态">
                    <el-select clearable @change="queryOrderInfo" v-model="selectOrderInfo.orderState">
                        <el-option
                            v-for="(item,index) in operates"
                            :key="index"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="商品名称">
                    <el-input @clear='queryOrderInfo' clearable v-model="selectOrderInfo.productName" placeholder="请输入商品名称"></el-input>
                </el-form-item>
                 <el-form-item label="收货人">
                    <el-input @clear='queryOrderInfo' clearable v-model="selectOrderInfo.Name" placeholder="请输入姓名/电话"></el-input>
                </el-form-item>
                <el-form-item style="margin-left:5%;">
                    <el-tooltip :enterable='false'  effect="dark" content="重置" placement="top">
                        <el-button type="info" @click="resetOrderInfo()">重置</el-button>
                    </el-tooltip>
                    <el-tooltip :enterable='false'  effect="dark" content="查询" placement="top">
                        <el-button style="margin-left:10px;" type="primary" @click="queryOrderInfo">查询</el-button>
                    </el-tooltip>
                </el-form-item>
            </el-form> 
            </div>
            <el-table
                :data="orderList"
                stripe
                height="600"
                border
                @selection-change="handleSelectionChange"
                style="width: 100%">
                <el-table-column label="#" type="index" width="100" align="center">
                </el-table-column>
                <el-table-column
                    width="180"
                    label="订单图片"
                    align="center">
                    <template slot-scope="scope">
                        <el-image :preview-src-list="[scope.row.orderUrl]" style="width: 150px; height: 150px" :src="scope.row.orderUrl"/>
                    </template>
                </el-table-column>
                <el-table-column
                    label="订单/商品编号" align="center"
                    width="200">
                     <template  slot-scope="scope">
                        <p>订单编号:{{scope.row.orderNo}}</p>
                        <p>商品编号:{{scope.row.productNo}}</p>
                        <p>品牌:{{scope.row.productBrand}}</p>
                    </template>
                </el-table-column>
                <el-table-column prop="orderPayTime" label="支付时间" align="center" width="180"></el-table-column>
                <el-table-column align="center"
                    label="收件人信息">
                    <template  slot-scope="scope">
                        <p>地址:{{scope.row.provinceName+' '+scope.row.cityName+' '+scope.row.areaName+' '+scope.row.addressDetail}}</p>
                        <p>电话:{{scope.row.phone}}</p>
                        <p>收件人:{{scope.row.name}}</p>
                    </template>
                </el-table-column>
                <el-table-column align="center" width="150"
                    label="付款金额">
                    <template slot-scope="scope">
                        <p>单价:{{scope.row.payPrice}}</p>
                        <p>数量:{{scope.row.payAmount}}</p>
                        <p style="color:red;">总价:{{scope.row.totalPrice}}</p>
                    </template>
                </el-table-column>
                <el-table-column  width="100" label="订单状态"  align="center">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.orderState==-1" type="info">已取消</el-tag>
                        <el-tag v-else-if="scope.row.orderState==0" type="warning">未支付</el-tag>
                        <el-tag v-else-if="scope.row.orderState==1" type="success">待发货</el-tag>
                        <el-tag v-else-if="scope.row.orderState==2" type="success">已发货</el-tag>
                        <el-tag v-else-if="scope.row.orderState==3" type="success">交易成功</el-tag>
                        <el-tag v-else-if="scope.row.orderState==4" type="danger">正在退货</el-tag>
                        <el-tag v-else-if="scope.row.orderState==5" type="success">退货成功</el-tag>
                        <el-tag v-else-if="scope.row.orderState==6" type="success">待评价</el-tag>
                        <el-tag v-else-if="scope.row.orderState==7" type="success">已评价</el-tag>
                    </template>
                    </el-table-column>
                    <el-table-column label="操作" width="120" align="center" >
                    <template slot-scope="scope">
                        <el-button @click="toDetail(scope.row.orderId)" type="text" size="small">订单详情</el-button>
                        <el-button v-if="scope.row.orderState==1" @click="sendGood(scope.row.orderId)" type="text" size="small">确认发货</el-button>
                        <el-button v-if="scope.row.orderState==4" @click="refund(scope.row.orderNo,scope.row.totalPrice)" type="text" size="small">确认退款</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <div class="pagination-container">
            <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                layout="total, sizes,prev, pager, next,jumper"
                :page-size="selectOrderInfo.pageSize"
                :page-sizes="[5,10,15]"
                :current-page.sync="selectOrderInfo.pageNum"
                :total="total">
            </el-pagination>
            </div>
    </el-card>
</div>
</template>

<script>
   //这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
   //例如：import 《组件名称》 from '《组件路径》';
    const defaultSelectOrderInfo={
        orderNo:'',
        addressInfo:'',
        orderState:null,
        pageNum: 1,
        pageSize: 5,
        startTime:null,
        endTime:null,
        productName:'',
        Name:''
    }
   export default {
        //import引入的组件需要注入到对象中才能使用
        name: 'Order',
        data() {
            return {
                selectOrderInfo:{ // 查询条件
                    orderNo:'',
                    addressInfo:'',
                    orderState:null,
                    pageNum: 1,
                    pageSize: 5,
                    startTime:null,
                    endTime:null,
                    productName:'',
                    Name:''
                },
                payTime:[],
                pickerOptions: {
                    shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', [start, end]);
                    }
                },
                    {
                    text: '最近三个月',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                    picker.$emit('pick', [start, end]);
                    }
                },
                {
                    text: '最近半年',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 180);
                    picker.$emit('pick', [start, end]);
                    }
                }]
                },
                operates:[
                    {label:'已经取消',value:-1},
                    {label:'等待付款',value:0},
                    {label:'等待发货',value:1},
                    {label:'已经发货',value:2},
                    {label:'交易成功',value:3},
                    {label:'正在退款',value:4},
                    {label:'退款成功',value:5},
                    {label:'等待评价',value:6},
                    {label:'已经评价',value:7},
                ],
                orderList:null,
                multipleSelection:[], // 已勾选的订单
                total:null, // 订单总数
            }
        },
        created(){
            this.getAllOrder()
        },
        methods:{
            // 处理分页
            handleSizeChange(val) {
                this.selectOrderInfo.pageNum = 1;
                this.selectOrderInfo.pageSize = val;
                this.getAllOrder();
            },
             handleCurrentChange(val) {
                this.selectOrderInfo.pageNum = val;
                this.getAllOrder();
            },
            queryOrderInfo(){
                this.getAllOrder()
            },
            resetOrderInfo(){
                this.payTime = []
                this.selectOrderInfo = Object.assign({}, defaultSelectOrderInfo);
            },
            // 勾选商品信息
            handleSelectionChange(val){
                this.multipleSelection = val
            },
            async getAllOrder(){
                const result = await this.$http.post('/orderAdmin/selectByMap',this.selectOrderInfo)
                if(result.data.code === 200){
                    this.orderList = result.data.data.orders
                    this.orderList.forEach(item => {
                        item.orderPayTime = new Date(item.orderCreateTime).toLocaleString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
                        item.orderUrl = this.$serve + item.orderUrl
                    });
                    this.total = result.data.data.orderCount
                }
            },
            getData(){
                if(this.payTime != null){
                    this.selectOrderInfo.startTime = this.payTime[0];
                    this.selectOrderInfo.endTime = this.payTime[1];
                    this.getAllOrder()
                }else{
                    this.selectOrderInfo.startTime = null
                    this.selectOrderInfo.endTime = null
                    this.getAllOrder()
                }
            },
            toDetail(orderId){
                this.$router.push({path:'/admin/orderDetail',query:{orderId:orderId}})
            },
            async sendGood(orderId){
                // 先弹框
                const res = await this.$confirm('确认发货, 是否继续?', '提示', 
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
                let order={
                    orderId:orderId,
                    orderState:2
                }
                const result = await this.$http.post('/order/updateOrderById',order)
                if(result.data.code === 200){
                    this.$message.success("订单发货成功")
                    this.getAllOrder()
                }
                
            },
            async refund(orderNo,totalPrice){
                // 先弹框
                const res = await this.$confirm('确认退款, 是否继续?', '提示', 
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
                const result = await this.$http.post('/alipay/refund?orderNo='+orderNo+'&payPrice='+totalPrice)
                if(result.data.code === 200){
                    this.$message.success("退款成功")
                    let info={
                        orderNo:orderNo,
                        orderState:5
                    }
                   await this.$http.post('/order/updateOrderByNo',info)
                   this.getAllOrder()
                }
            }
        }
   }
</script>
<style Lang='less' scoped>
    .el-button+.el-button{
        margin: 0;
    }
    /deep/ .el-table__body-wrapper::-webkit-scrollbar {
        width: 0;
    }
    /deep/ .el-table__body-wrapper::-webkit-scrollbar-thumb  {
        background-color: #fff
    }
</style>