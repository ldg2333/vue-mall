<template>
<div class="sure_order_container">
    <div class="address-box container">
        <i class="el-icon-location-outline"></i>
        <div class="address-con">
            <div class="address-info" v-bind="defaultAddress" v-if="defaultAddress">{{defaultAddress.provinceName +' '+defaultAddress.cityName+' '
                        +defaultAddress.areaName+' '+defaultAddress.addressDetail+' '+defaultAddress.phone+' '+defaultAddress.name+'收'}}</div>
            <div class="address-info" v-else>未设置</div>
        </div>
        <div class="address-alter" v-if="defaultAddress" @click="addressFormVisible=true">切换地址</div>
        <div class="address-alter" v-else @click="addressFormVisible=true">设置地址</div>
    </div>
    <el-card class="box-card">
        <div class="info">
        <div class="order_product">
            <el-table
            :data="orderInfo"
            border=""
            style="width: 100%">
            <el-table-column   label="商品" width="450" align="center">
            <template class="productInfo" slot-scope="scope">
                <router-link :to="'/mall/ProductDetail?id='+orderInfo[scope.$index].productId" style="text-decoration:none;">
                <div class="mesSty">
                    <el-image v-if="orderInfo"
                    style="width: 100px; height: 100px"
                    :src="orderInfo[scope.$index].orderUrl"/>
                    <div class="describe">
                        <p>{{orderInfo[scope.$index].productName+ " "+orderInfo[scope.$index].productDescribe}}</p>
                    </div>
                </div>
                </router-link>
            </template>
            </el-table-column>
            <el-table-column
                prop="productSpecs" align="center"
                label="商品属性">
            </el-table-column>
            <el-table-column
                prop="payPrice" align="center"
                label="单价">
            </el-table-column>
            <el-table-column
                align="center"
                label="数量">
                <template slot-scope="scope">
                <el-input-number size="small" :min="1" :max="orderInfo[scope.$index].productStock" @change="(currentValue, oldValue,)=>{calculationPrice(currentValue, oldValue,scope.$index)}"  v-model="orderInfo[scope.$index].payAmount"></el-input-number>
                </template>
            </el-table-column>
            </el-table>
        </div>
        <div class="order_pay">
                <span class="totalPay">商品总价:{{totalPrice}} 元</span>
                <span class="truePay">需付款:<span class="pay">{{totalPrice}}</span> 元</span>
                <el-button @click="submitOrder" class="submitOrder" style="width:100%;"  type="primary" plain>提交订单</el-button>
        </div>
        </div>
    </el-card>

    <!-- 收货地址信息 -->
    <el-dialog
        title="收货地址信息"
        :visible.sync="addressFormVisible"
        width="70%"
        height='50%'
        :close-on-click-modal='false'
        >
            <!-- 修改地址框 -->
            <el-dialog
            width="40%"
            title="修改地址信息"
            :visible.sync="updateAddressVisible"
            append-to-body
            @close="modifyDialogClose"
            :close-on-click-modal='false'>

            <el-form :rules="uppdateFormRules" ref="updateFormRef" :model="echoAddress" label-width="80px">
                <el-form-item label="省市区" prop="region">
                    <el-cascader style="width: 487px;" size="large" :options="options" separator=" "
                       v-model="echoAddress.region">
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
                <el-button @click="updateAddressVisible = false">取 消</el-button>
                <el-button type="primary" @click="modifyAddress">修 改</el-button>
            </span>


            </el-dialog>
            <!-- 新增地址框 -->
            <el-dialog
            width="40%"
            title="添加地址信息"
            :visible.sync="addAddressVisible"
            append-to-body
            @close="addDialogClose"
            :close-on-click-modal='false'>

            <el-form :rules="uppdateFormRules" ref="addFormRef" :model="addressForm" label-width="80px">
                <el-form-item label="省市区" prop="region">
                    <el-cascader style="width: 487px;" size="large" :options="options" separator=" "
                       v-model="addressForm.region">
                    </el-cascader>
                </el-form-item>
                <el-form-item label="详细地址" prop="addressDetail">
                    <el-input type="textarea"  v-model="addressForm.addressDetail" ></el-input>
                </el-form-item>
                <el-form-item  label="手机号" prop="phone">
                    <el-input v-model="addressForm.phone" ></el-input>
                </el-form-item>
                 <el-form-item  label="邮编" prop="zipCode">
                    <el-input v-model="addressForm.zipCode" ></el-input>
                </el-form-item>
                 <el-form-item  label="收件人" prop="name">
                    <el-input  v-model="addressForm.name" ></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addAddressVisible = false">取 消</el-button>
                <el-button type="primary" @click="addAddress">添 加</el-button>
            </span>


            </el-dialog>

            <!-- 收货地址信息管理 -->
            <el-table class="el-dialog-table"
            :data="addressinfo"
            stripe
            style="width: 100%">
            <el-table-column v-if="false"  prop="addressId"></el-table-column>
                <el-table-column
                    prop="provinceName"
                    label="省份"
                    >
                </el-table-column>
                <el-table-column
                    prop="cityName"
                    label="城市"
                   >
                </el-table-column>
                <el-table-column
                    prop="areaName"
                    label="区/县">
                </el-table-column>
                <el-table-column
                    prop="addressDetail"
                    label="详细地址">
                </el-table-column>
                <el-table-column
                    prop="phone"
                    label="手机号">
                </el-table-column>
                <el-table-column
                    prop="zipCode"
                    label="邮编">
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="收货人">
                </el-table-column>
                <el-table-column prop='isDefault' width="280" label="操作">
                <template slot-scope="scope">
                        <el-button v-if="!scope.row.isDefault" @click="setDefault(scope.row.addressId)" type="success">设为默认</el-button>
                        <el-tag v-else type="warning" class="isDefault">默认地址</el-tag>
                        <el-button @click="updateAddress(scope.row.addressId)" type="primary">修改</el-button>
                        <el-button v-if="!scope.row.isDefault" @click="deleteAddress(scope.row.addressId)" type="danger">删除</el-button>
                </template>
            </el-table-column>
            </el-table>

            <span slot="footer" class="dialog-footer">
            <el-button @click="addAddressVisible=true" type="success">新 增</el-button>
            <el-button @click="addressFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="addressFormVisible = false">确 定</el-button>
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
        name: 'sureOrder',
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
                defaultAddress:null,// 默认地址
                addressinfo:null, // 收货地址信息
                orderInfo:[], // 订单信息
                totalPrice:0, // 总价
                orderList:null, // 订单列表
                // 新增地址信息
                addressForm:{
                    region: [], // 选择的地区
                    userId:'', // 插入当前用户的收货地址
                    provinceName:'', // 省名称
                    cityName:'', // 市名称
                    areaName:'', // 地区名称
                    addressDetail:'', //详细地址
                    phone:'', //电话
                    zipCode:'',// 邮编
                    name:'', // 收件人
                },
                echoAddress:{
                    addressId:'',
                    region:[], // 省市区
                    provinceName:'', // 省名称
                    cityName:'', // 市名称
                    areaName:'', // 地区名称
                    addressDetail:'', // 详细地址
                    phone:'', // 电话
                    zipCode:'', // 邮编
                    name:'',// 收件人
                },
                addressFormVisible:false, // 切换地址框默认不显示
                updateAddressVisible:false, // 修改地址框
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
                addAddressVisible:false, // 新增地址框
                options:regionData, // 地址信息配置
                from:'', // 从哪个组件跳转
                orderNoList:[], // 订单编号数组
            }
        },
        created(){
            let reg = 'http://localhost:8082';
            this.getAddressByUserId()
            // 根据路由信息获取商品id
            this.orderList = JSON.parse(this.$route.query.orderInfo)
            for(let i=0;i<this.orderList.length;i++){
                this.orderInfo[i] = this.orderList[i]
                if(!this.orderInfo[i].orderUrl.includes(reg)){
                    this.orderInfo[i].orderUrl = this.$serve + this.orderInfo[i].orderUrl
                }
                this.orderInfo[i].payPrice = this.orderInfo[i].payPrice / this.orderInfo[i].payAmount
                this.orderInfo[i].totalPrice = (this.orderInfo[i].payPrice * this.orderInfo[i].payAmount).toFixed(2)
                this.totalPrice =this.totalPrice+Number(this.orderInfo[i].totalPrice)
            }
            this.totalPrice = this.totalPrice.toFixed(2)
        },
        methods:{
            // 获取所有的收货地址
            async getAddressByUserId(){
                let user_id = this.$store.state.user.userId
                let infoTemp = null;
                const result = await this.$http.get('/address/getAllAddress',{params:{userId:user_id}})
                if(result.data.code === 200){
                    infoTemp = result.data.data
                    this.addressinfo = result.data.data
                }
                for (let i = 0; i < infoTemp.length; i++) {
                    if(infoTemp[i].isDefault){
                        this.defaultAddress = infoTemp[i]
                    }
                }
            },
            // 计算数量
            async calculationPrice(currentValue, oldValue,index){
                this.orderInfo[index].totalPrice = (this.orderInfo[index].payPrice * this.orderInfo[index].payAmount).toFixed(2)
                this.totalPrice =(Number(this.totalPrice) + Number(this.orderInfo[index].payPrice * (currentValue-oldValue))).toFixed(2)
                // const result = await this.$http.post('/shopCart/update',this.cartInfo);
            },
            // 修改框关闭  清除数据
            modifyDialogClose(){
                this.$refs.updateFormRef.resetFields()
            },
            // 新增框关闭 清除数据
            addDialogClose(){
                this.$refs.addFormRef.resetFields()
            },
            // 新增地址信息
            addAddress(){ 
               this.$refs.addFormRef.validate(async valid => {
                    if(!valid) return; // 验证不通过
                    this.addressForm.provinceName = CodeToText[this.addressForm.region[0]]
                    this.addressForm.cityName= CodeToText[this.addressForm.region[1]]
                    this.addressForm.areaName = CodeToText[this.addressForm.region[2]]
                    this.addressForm.userId = this.$store.getters.getUser.userId
                    const result = await this.$http.post('/address/addAddress',this.addressForm)
                    if(result.data.code === 200){
                        this.$message.success(result.data.message)
                        this.addAddressVisible = false
                        this.getAddressByUserId()
                    }else{
                        this.$message.success(result.data.message)
                    }
                })
            },
            // 打开修改地址框
            async updateAddress(addressId){
                const result = await this.$http.get('/address/getAddressById',{params:{id:addressId}})
                if(result.data.code === 200){
                    this.echoAddress.region = [TextToCode[result.data.data.provinceName].code,TextToCode[result.data.data.provinceName][result.data.data.cityName].code,TextToCode[result.data.data.provinceName][result.data.data.cityName][result.data.data.areaName].code] 
                    this.echoAddress.addressDetail = result.data.data.addressDetail
                    this.echoAddress.phone = result.data.data.phone
                    this.echoAddress.zipCode = result.data.data.zipCode
                    this.echoAddress.name = result.data.data.name
                    this.echoAddress.addressId = result.data.data.addressId
                    this.updateAddressVisible = true
                }
            },
            // 设为默认地址
            async setDefault(addressId){
                const result = await this.$http.get('/address/setDefault',{params:{addressId:addressId,userId:this.$store.state.user.userId}})
                if(result.data.code === 200){
                    this.$message.success('设为默认地址成功!')
                    this.addressinfo = result.data.data
                    for (let i = 0; i < this.addressinfo.length; i++) {
                    if(this.addressinfo[i].isDefault){
                        this.defaultAddress = this.addressinfo[i]
                    }
                }
                }
            },
            // 修改地址信息
            modifyAddress(){
                this.$refs.updateFormRef.validate(async valid => {
                    if(!valid) return; // 验证不通过
                    this.echoAddress.provinceName = CodeToText[this.echoAddress.region[0]]
                    this.echoAddress.cityName= CodeToText[this.echoAddress.region[1]]
                    this.echoAddress.areaName = CodeToText[this.echoAddress.region[2]]
                    const result = await this.$http.post('/address/updateAddress',this.echoAddress)
                    if(result.data.code === 200){
                        this.$message.success(result.data.message)
                        this.updateAddressVisible = false
                        this.getAddressByUserId()
                    }else{
                        this.$message.success(result.data.message)
                    }
                })
                
            },
            // 删除地址
            async deleteAddress(addressId){
                // 先弹框
                const res = await this.$confirm('确认删除地址信息?', '提示', 
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => {
                    return err
                })
                // 再删除(确认删除 res = confirm 取消 res = cancel)
                if(res == 'cancel')
                    return this.$message.info('已取消')
                 const result = await this.$http.post('/address/deleteAddress?addressId='+addressId)
                 if(result.data.code === 200){
                     this.$message.success(result.data.message)
                     this.getAddressByUserId()
                 }
            },
            // 提交订单
            async submitOrder(){

                if(this.defaultAddress == null){
                    this.$message.error("请设置收货地址")
                    setTimeout(()=>{
                        this.addressFormVisible = true
                    },100)
                     setTimeout(()=>{
                         this.addAddressVisible = true
                    },100)
                    return;
                }

                this.addAddressToOrder()
                // 生成订单号
                for(let i=0;i<this.orderInfo.length;i++){
                    if(this.orderInfo[i].orderNo == null){
                        this.getOrderNo(i)
                        this.orderNoList.push(this.orderInfo[i].orderNo)
                    }
                }
                await this.$http.post('/alipay/setOrderList',this.orderNoList)
                const result = await this.$http.post('/order/addOrder',this.orderInfo)
                if(result.data.code === 200){
                    for(let i=0;i<this.orderInfo.length;i++){
                        if(this.orderInfo[i].hasOwnProperty('cartId')){
                            await this.$http.post('/shopCart/delete?cartId='+this.orderInfo[i].cartId)
                            this.bus.$emit('update',true)
                        }
                    }
                    let orderNo = result.data.data.order_no
                    let orderName = result.data.data.product_describe + result.data.data.product_name + '订单'
                    let payPrice = this.totalPrice;
                    let loading = this.$loading({lock: true, text: "正在跳转支付页面",background:"rgba(255,255,255,0.1)"});
                    const res = await this.$http.post('/alipay/create?orderNo='+orderNo+'&orderName='+orderName+'&payPrice='+payPrice)
                    if(res.status === 200){
                        loading.close();
                        const div = document.createElement('div');
                        div.innerHTML = res.data;
                        document.body.appendChild(div);
                        document.forms[document.forms.length-1].submit();
                    }
                    loading.close();
                }
            },
            addAddressToOrder(){
                this.orderInfo.forEach(item => {
                    item.provinceName = this.defaultAddress.provinceName
                    item.cityName = this.defaultAddress.cityName
                    item.areaName = this.defaultAddress.areaName
                    item.addressDetail = this.defaultAddress.addressDetail
                    item.name = this.defaultAddress.name
                    item.phone = this.defaultAddress.phone
                    item.zipCode = this.defaultAddress.zipCode
                })
            },
            getOrderNo(index){
                let time = new Date(); // 时间戳
                let year= String(time.getFullYear()); // 年
                year = year.substring(2);
                let mouth= String(time.getMonth() + 1); // 月
                let day= String(time.getDate()); // 日
                let hours= String(time.getHours()); // 时
                if(hours.length<2){
                hours='0' + hours
                }
                let seconds= String(time.getSeconds()); // 秒
                if(seconds.length<2) {
                seconds='0' + seconds
                }
                let max=9000;
                let min=1000;
                let random = Math.floor((Math.random()*max+min)+1) //随机数
                this.orderInfo[index].orderNo = year + mouth + day + hours + seconds + random
            }
        }
   }
</script>
<style Lang='less' scoped>
    .sure_order_container{
        width: 100%;
        height: 100%;
    }
    .address-box{
        position: relative;
        background: #fafafa;
        border: 1px solid #e0e0e0;
        margin: 20px 0;
        text-align: center;
        width: 80%;
        height: 10%;
        position: absolute;
        left: 10%;
        display: flex;
    }
    .address-box .address-con{
        left: 20%;
        position: relative;
        top: 40%;
    }
    .isDefault{
        margin-right: 10px;
        width:98px;
        height:40px;
        text-align: center;
        vertical-align:middle
    }
    .address-box i{
       position: relative;
       left: 20%;
       top: 44%;
    }
    .address-box .address-alter{
        position: relative;
        top: 40%;
        left: 20%;
        cursor: pointer;
        color: #409eff;
        margin-left: 30px;
        font: 14px/1.5 Helvetica Neue,Helvetica,Arial,Microsoft Yahei,Hiragino Sans GB,Heiti SC,WenQuanYi Micro Hei,sans-serif;
    }
    .info{
        position: relative;
    }
    .order_product{
        margin-bottom:20px ;
    }
    .box-card{
        width: 81%;
        position: relative;
        left: 10%;
        top: 30%;
        background: #fafafa;
    }
    .mesSty {
        display: flex;
        align-items: center;
    }
    .order_pay{
        position: relative;
        display: inline-block;
        right: -500px;
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
        margin-bottom:20px ;
    }
    .pay{
        font-size: 18px;
        color: red;
        font-weight: 700;
    }
    .submitOrder{
        position: relative;
    }
</style>