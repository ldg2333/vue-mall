<template>
<div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/admin/index' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/admin/order' }">订单</el-breadcrumb-item>
        <el-breadcrumb-item>订单详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="elStep">
      <el-steps :active="formatStepStatus(orderInfo[0].order_state)" finish-status="success" align-center>
        <el-step title="提交订单" ></el-step>
        <el-step title="支付订单" ></el-step>
        <el-step title="平台发货" ></el-step>
        <el-step title="确认收货" ></el-step>
        <el-step title="完成评价" ></el-step>
      </el-steps>
    </div>

    <el-card class="box-card">
        <div class="operate-container">
        <i class="el-icon-warning color-danger" style="margin-left: 20px"></i>
        <span class="color-danger">当前订单状态：{{orderInfo[0].order_state | formatStatus}}</span>
        <span v-if="orderInfo[0].order_state==4 || orderInfo[0].order_state==5" style="color:red;margin-left:2%;">退款原因:{{orderInfo[0].return_reason}}</span>
        <div class="operate-button-container" >
          <el-button v-show="orderInfo[0].order_state!=-1 && orderInfo[0].order_state!=2 && orderInfo[0].order_state!=3 && orderInfo[0].order_state!= 4 && orderInfo[0].order_state!=5 && orderInfo[0].order_state!=6 && orderInfo[0].order_state!=7" size="mini" @click="showUpdateReceiverDialog">修改收货人信息</el-button>
          <el-button v-show="orderInfo[0].order_state===0 &&orderInfo[0].order_state!=1 &&orderInfo[0].order_state!=2  " size="mini" @click="showCloseOrderDialog">关闭订单</el-button>
        </div>
        </div>

        <div style="margin-top: 20px">
        <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
        <span class="font-small">基本信息</span>
      </div>
      <div class="table-layout">
        <el-row>
          <el-col :span="4" class="table-cell-title">订单编号</el-col>
          <el-col :span="4" class="table-cell-title">商品编号</el-col>
          <el-col :span="4" class="table-cell-title">用户账号</el-col>
          <el-col :span="4" class="table-cell-title">支付方式</el-col>
          <el-col :span="4" class="table-cell-title">购买数量</el-col>
          <el-col :span="4" class="table-cell-title">商品单价</el-col>
        </el-row>
        <el-row>
          <el-col :span="4" class="table-cell">{{orderInfo[0].order_no}}</el-col>
          <el-col :span="4" class="table-cell">{{orderInfo[0].product_no}}</el-col>
          <el-col :span="4" class="table-cell">{{orderInfo[0].user_id}}</el-col>
          <el-col :span="4" class="table-cell">支付宝</el-col>
          <el-col :span="4" class="table-cell">{{orderInfo[0].pay_amount}}</el-col>
          <el-col :span="4" class="table-cell">{{orderInfo[0].pay_price}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4" class="table-cell-title">订单总价</el-col>
          <el-col :span="4" class="table-cell-title">下单时间</el-col>
          <el-col :span="4" class="table-cell-title">付款时间</el-col>
          <el-col :span="4" class="table-cell-title">商品名称</el-col>
          <el-col :span="4" class="table-cell-title">商品品牌</el-col>
          <el-col :span="4" class="table-cell-title">商品规格</el-col>
        </el-row>
        <el-row>
          <el-col :span="4" class="table-cell">{{orderInfo[0].total_price}}</el-col>
          <el-col :span="4" class="table-cell">{{orderInfo[0].order_create_time}}</el-col>
          <el-col :span="4" class="table-cell">{{orderInfo[0].order_pay_time}}</el-col>
          <el-col :span="4" class="table-cell">{{orderInfo[0].product_name}}</el-col>
          <el-col :span="4" class="table-cell">{{orderInfo[0].product_brand}}</el-col>
          <el-col :span="4" class="table-cell">{{orderInfo[0].product_specs}}</el-col>
        </el-row>
      </div>
      <div style="margin-top: 20px">
        <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
        <span class="font-small">收货人信息</span>
      </div>
      <div class="table-layout">
        <el-row>
          <el-col :span="6" class="table-cell-title">收货人</el-col>
          <el-col :span="6" class="table-cell-title">手机号码</el-col>
          <el-col :span="6" class="table-cell-title">邮政编码</el-col>
          <el-col :span="6" class="table-cell-title">收货地址</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell">{{orderInfo[0].name}}</el-col>
          <el-col :span="6" class="table-cell">{{orderInfo[0].phone}}</el-col>
          <el-col :span="6" class="table-cell">{{orderInfo[0].zip_code}}</el-col>
          <el-col :span="6" class="table-cell">{{orderInfo[0] | formatAddress}}</el-col>
        </el-row>
      </div>

      <div style="margin-top: 20px">
        <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
        <span class="font-small">商品信息</span>
      </div>
      <el-table
        ref="orderItemTable"
        :data="orderInfo"
        style="width: 100%;margin-top: 20px" border>
        <el-table-column label="商品图片" width="200" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.order_url" style="width: 150px; height: 150px">
          </template>
        </el-table-column>
        <el-table-column label="商品名称" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.product_name}}</p>
            <p>品牌：{{scope.row.product_brand}}</p>
            <p>{{scope.row.product_describe}}</p>
          </template>
        </el-table-column>
        <el-table-column label="价格/货号" width="200" align="center">
          <template slot-scope="scope">
            <p>价格：￥{{scope.row.pay_price}}</p>
            <p>货号：{{scope.row.product_no}}</p>
          </template>
        </el-table-column>
        <el-table-column label="属性" width="120" align="center">
          <template slot-scope="scope">
            {{scope.row.product_specs}}
          </template>
        </el-table-column>
        <el-table-column label="数量" width="120" align="center">
          <template slot-scope="scope">
            {{scope.row.pay_amount}}
          </template>
        </el-table-column>
        <el-table-column label="小计" width="120" align="center">
          <template slot-scope="scope">
            ￥{{scope.row.pay_price*scope.row.pay_amount}}
          </template>
        </el-table-column>
      </el-table>
      <div style="float: right;margin: 20px">
        合计：<span class="color-danger">￥{{orderInfo[0].total_price}}</span>
      </div>
    </el-card>


    <el-dialog
        title="修改地址"
        :visible.sync="updateAddressDialogVisible"
        width="40%"
        @close="handleClose">
        <el-form :rules="uppdateFormRules" ref="updateFormRef" :model="echoAddress" label-width="80px">
                <el-form-item label="省市区" prop="region">
                    <el-cascader style="width: 487px;" size="large" :options="options" separator=" "
                       v-model="echoAddress.region" >
                    </el-cascader>
                </el-form-item>
                <el-form-item label="详细地址" prop="addressDetail">
                    <el-input type="textarea"  v-model="echoAddress.addressDetail" ></el-input>
                </el-form-item>
                <el-form-item  label="手机号" prop="phone">
                    <el-input v-model="echoAddress.phone" ></el-input>
                </el-form-item>
                 <el-form-item  label="邮编" prop="zipCode">
                    <el-input v-model="echoAddress.zipCode" ></el-input>
                </el-form-item>
                 <el-form-item  label="收件人" prop="name">
                    <el-input  v-model="echoAddress.name" ></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="updateAddressDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="modifyAddress">修 改</el-button>
            </span>
    </el-dialog>
</div>
</template>

<script>
   //这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
   //例如：import 《组件名称》 from '《组件路径》';
   import {regionData, CodeToText,TextToCode} from 'element-china-area-data'
   export default {
        //import引入的组件需要注入到对象中才能使用
        name: 'OrderDetail',
        data() {
            // 省市区校验
            let validateOption = (rule, value, callback) => {
                if (value === null || value.length===0) {
                callback(new Error('请选择收货地址'));
                } else {
                callback();
                }
            };
            // 详细地址校验
            let validateAddress = (rule, value, callback) => {
                if (value === null || value.trim().length===0) {
                callback(new Error('请填写详细地址'));
                } else {
                callback();
                }
            };
            // 验证手机号的规则
            let checkMobile = (rule,value,cb) => {
                // 验证手机号的正则表达式
                const regMobile = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
                if(regMobile.test(value)){
                    return cb()
                }
                cb(new Error('请输入合法的手机号'))
            };
            let checkZipCode = (rule,value,cb) => {
                // 验证手机号的正则表达式
                const regZipCode = /^[0-9]{6}$/
                if(regZipCode.test(value)){
                    return cb()
                }
                cb(new Error('请输入合法的邮编格式'))
            }
            return {
                options:regionData, // 地址信息配置
                orderInfo:null,
                orderId:null,
                updateAddressDialogVisible:false,
                echoAddress:{
                    region:[], // 省市区
                    provinceName:'', // 省名称
                    cityName:'', // 市名称
                    areaName:'', // 地区名称
                    addressDetail:'', // 详细地址
                    phone:'', // 电话
                    zipCode:'', // 邮编
                    name:'',// 收件人
                },
                // 修改地址校验规则
                uppdateFormRules:{
                    region:[{ validator: validateOption, trigger: 'blur' }],
                    addressDetail:[
                        { validator: validateAddress, trigger: 'blur' },
                        { min:1, max:50, message:'长度在 6 到 15 个字符之间', trigger:'blur'},
                    ],
                    phone:[
                        {required:true, message:'请输入正确的电话号码',trigger:'blur' },
                        { validator:checkMobile, trigger:'blur'}
                    ],
                    name:[
                        {required:true, message:'请输入收件人姓名',trigger:'blur' },
                        { min:1, max:10, message:'长度在 1 到 10 个字符之间', trigger:'blur'},
                    ],
                    zipCode:[
                        {required:true, message:'请输入邮编',trigger:'blur' },
                        { validator:checkZipCode, trigger:'blur'}
                    ],
                },
            }
        },
        created(){
            this.orderId = this.$route.query.orderId;
            this.getOrderDetail()
        },
        filters: {
            formatAddress(order){
               return order.province_name+' '+order.city_name+' '
                +order.area_name+' '
                +order.address_detail
            },
            formatStatus(value) {
                if(value === 0){
                    return '等待付款';
                }else if (value === 1) {
                    return '等待发货';
                } else if (value === 2) {
                    return '已经发货';
                } else if (value === 3) {
                    return '交易成功';
                } else if (value === 4) {
                    return '正在退款';
                } else if (value === 5) {
                    return '退款成功';
                }else if (value === 6) {
                    return '等待评价';
                } else if (value === 7) {
                    return '评价成功';
                } else {
                    return '交易关闭';
                }
            },
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
            },
            // 确认修改
            async modifyAddress(){
                this.$refs.updateFormRef.validate(async valid => {
                    if(!valid) return; // 验证不通过
                    this.orderInfo[0].orderId = this.orderInfo[0].order_id
                    this.orderInfo[0].provinceName = CodeToText[this.echoAddress.region[0]]
                    this.orderInfo[0].cityName= CodeToText[this.echoAddress.region[1]]
                    this.orderInfo[0].areaName = CodeToText[this.echoAddress.region[2]]
                    this.orderInfo[0].addressDetail = this.echoAddress.addressDetail
                    this.orderInfo[0].phone =  this.echoAddress.phone
                    this.orderInfo[0].name =  this.echoAddress.name
                    this.orderInfo[0].zipCode =  this.echoAddress.zipCode
                    const result = await this.$http.post('/order/updateOrderById',this.orderInfo[0])
                    if(result.data.code === 200){
                        this.$message.success("修改地址成功")
                        this.updateAddressDialogVisible = false
                        this.orderInfo = null
                        this.getOrderDetail()
                    }
                })
               
            },
            // 修改收货信息
            showUpdateReceiverDialog(){
                this.echoAddress.region = [TextToCode[this.orderInfo[0].province_name].code,TextToCode[this.orderInfo[0].province_name][this.orderInfo[0].city_name].code,TextToCode[this.orderInfo[0].province_name][this.orderInfo[0].city_name][this.orderInfo[0].area_name].code] 
                this.echoAddress.addressDetail = this.orderInfo[0].address_detail
                this.echoAddress.phone = this.orderInfo[0].phone
                this.echoAddress.zipCode = this.orderInfo[0].zip_code
                this.echoAddress.name = this.orderInfo[0].name
                this.updateAddressDialogVisible = true
            },
            // 关闭订单
            async showCloseOrderDialog(){
                // 先弹框
                const res = await this.$confirm('确认取消当前订单, 是否继续?', '提示', 
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
                this.orderInfo[0].orderId = this.orderInfo[0].order_id
                this.orderInfo[0].orderState = -1
                const result = await this.$http.post('/order/updateOrderById',this.orderInfo[0])
                if(result.data.code === 200){
                    this.$message.success("订单已关闭")
                    this.updateAddressDialogVisible = false
                    this.orderInfo = null
                    this.getOrderDetail()
                }
            },
            handleClose(){
                this.$refs.updateFormRef.resetFields()
            },
            formatStepStatus(value) {
                if (value === 1) {
                    //待发货
                return 2;
                } else if (value === 2) {
                    //已发货
                return 3;
                } else if (value === 3) {
                    //已完成
                return 4;
                }else if (value === 7) {
                    //已完成
                return 5;
                }else {
                    //待付款、已关闭、无限订单
                    return 1;
                }
            },
            
        }
   }
</script>
<style Lang='less' scoped>
     .operate-container {
    background: #F2F6FC;
    height: 80px;
    margin: -20px -20px 0;
    line-height: 80px;
  }
  .operate-button-container {
    float: right;
    margin-right: 20px
  }
  .elStep{
      margin-bottom: 10px;
  }
  .color-danger {
    color: #f56c6c;
}
.table-layout {
    margin-top: 20px;
    border-left: 1px solid #DCDFE6;
    border-top: 1px solid #DCDFE6;
  }
   .table-cell {
    height: 60px;
    line-height: 40px;
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    padding: 10px;
    font-size: 14px;
    color: #606266;
    text-align: center;
    overflow: hidden;
  }

  .table-cell-title {
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    padding: 10px;
    background: #F2F6FC;
    text-align: center;
    font-size: 14px;
    color: #303133;
  }
</style>