<template>
<div class="product_detail">
    <!-- 商品顶部 -->
    <div class="product-box">
      <div class="nav-bar">
        <div v-if="productInfo" class="container">
          <el-image :preview-src-list="imgList" class="logo" style="width: 65px;height: 65px;margin-top: 8px;margin-right: 10px;" :src="productInfo.productUrl"></el-image>
          <div style="display: inline-block;position:absolute;top: 35px">
            <span style="font-size: 19px;font-weight: bolder">{{productInfo.productName}}</span>
            <el-divider direction="vertical"></el-divider>
            <span style="font-size: 18px;font-weight: bolder">{{productInfo.productType}}</span>
          </div>
          <el-link type="primary" @click="toReview">商品评价</el-link>
        </div>
      </div>
    </div>
    <!-- 商品信息 -->
     <div class="product-info">
      <div class="product-info-content container">
        <div class="img mainImage">
          <el-image :src="productInfo.productUrl" style="height: 85%;width: 70%;margin: 15%"></el-image>
          <!-- 鼠标层罩 -->
           <div v-show="coverLayerShow" class="coverLayerMouse" :style="coverLayerStyle"></div>
            <!-- 最顶层覆盖了整个原图空间的透明层罩 -->
            <div class="coverLayerMaskTop" @mouseenter="enterHandler" @mousemove="moveHandler" @mouseout="outHandler">
            </div>
            <!-- 放大的图片 -->
            <div v-show="coverLayerShow" class="coverLayerRight">
                <el-image :style="coverLayerImg" class="coverLayerRightImg" :src="productInfo.productUrl" fit="contain" />
            </div>
        </div>
        <div class="product-con">
          <h2>{{productInfo.productName}}</h2>
          <p class="sale-desc">{{productInfo.productDescribe}}</p>
          <div class="price-info">
            <span>{{productInfo.outPrice}} 元</span>
            <el-divider direction="vertical"></el-divider>
            <span style="color:red;" v-if="productInfo.productStock===0">暂时无货</span>
            <span v-else>商品库存 {{productInfo.productStock}}</span>
          </div>
          <div class="line"></div>
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
          <div class="option-box" v-if="this.productSpec!==null && this.productSpec.length!==0">
            <div class="title">选择规格</div>
            <el-radio-group class="option-list" v-for="(option,index) in this.productSpec" fill="#409eff" v-model="order.productSpecs" :key="index">
              <el-radio-button :label="option"></el-radio-button>
            </el-radio-group>
          </div>
          <div class="select-amount">
            <div style="font-size: 18px;">选择数量</div>
            <el-input-number :min="1" @change="calculationPrice" :max="productInfo.productStock" v-model="order.payAmount" style="margin: 16px;"></el-input-number>
          </div>
          <div class="selected-list container">
            <span>{{productInfo.productName}}</span>
            <span style="padding-left: 10px">{{order.productSpecs}}</span>
            <span style="padding-left: 10px">{{productInfo.outPrice}}元</span>
            <div>
              <div class="total-price">总计：{{totalPrice}}元</div>
              <el-button type="success" :disabled='productInfo.productStock===0' plain style="float: left;margin: 20px 40px" @click="addCart()">加入购物车</el-button>
              <el-button type="danger" :disabled='productInfo.productStock===0' plain style="float: left;margin: 20px 0" @click="buy()">立即购买</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
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
                       v-model="echoAddress.region" @change="handleChange">
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
                       v-model="addressForm.region" @change="handleChange">
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

    import {regionData, CodeToText,TextToCode} from 'element-china-area-data'
    //这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
    //例如：import 《组件名称》 from '《组件路径》';
    export default {
        //import引入的组件需要注入到对象中才能使用
        name: 'ProductDetail',
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
                coverLayerStyle: {
                    transform: ""
                },
                coverLayerImg: {},
                coverLayerShow: false,
                options:regionData, // 地址信息配置
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
                productInfo:null, // 商品信息
                productSpec:null, // 规格信息
                imgList:[], // 大图预览
                totalPrice:0, // 总价
                shopCartInfo:{},
                // 订单信息
                order:{
                    payAmount:1,// 下单数量,
                    productSpecs:null, // 下单规格
                },
                defaultAddress:null,// 默认收货地址信息
                addressinfo:null,// 收货地址信息
                addressFormVisible:false, // 切换地址框默认不显示
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
                productId:null,// 当前商品id
                orderInfo:{}, // 提交的订单信息
            }
        },
        created(){
            // 根据路由信息获取商品id
            this.productId = this.$route.query.id;
            // 创建页面时获取商品信息
            this.getProductById()
            // 创建页面时获取规格信息
            this.getAllSpeceById()
            // 创建页面时获取所有的收货地址            
            this.getAddressByUserId()
        },
        methods:{
            // 地址栏选中信息时触发
            handleChange(value){
                for(let i=0;i<value.length;i++){
                    console.log(CodeToText[value[i]]);
                }
            },
            // 进入页面时加载商品信息
            async getProductById(){
                const result = await this.$http.post('/product/findById?productId='+this.productId)
                if(result.data.code === 200){
                    this.productInfo = result.data.data
                    if(this.productInfo.isSale === 0 || this.productInfo == null){
                        this.$message.error("当前商品不存在，请浏览其他商品")
                        return this.$router.push("/mall/index")
                    }
                    this.productInfo.productUrl = this.$serve + this.productInfo.productUrl
                    this.imgList[0] = this.productInfo.productUrl
                    this.totalPrice = this.productInfo.outPrice.toFixed(2) ;
                }
            },
            // 进入页面时加载商品类别信息
            async getAllSpeceById(){
                const result = await this.$http.post('/ps/productSpecs/findAllByProId?productId='+this.productId)
                if(result.data.code === 200){
                    this.productSpec = result.data.data
                    this.order.productSpecs=this.productSpec[0]; //默认选择第一个商品规格
                }
            },
            // 数量改变时更改价格
            calculationPrice(){
                this.totalPrice =  (this.order.payAmount * this.productInfo.outPrice).toFixed(2)  //四舍五入 保留两位小数
            },
            // 去评论区页
            toReview(){

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
            // 加入购物车
            async addCart(){
               // 先弹框
                const res = await this.$confirm('确认加入购物车?', '提示', 
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
                this.shopCartInfo.userId = this.$store.getters.getUser.userId
                this.shopCartInfo.productId = this.productId
                this.shopCartInfo.payAmount = this.order.payAmount
                this.shopCartInfo.productSpecs = this.order.productSpecs
                const result = await this.$http.post('/shopCart/add',this.shopCartInfo)
                if(result.data.code === 200){
                    this.$message.success("加入购物车成功")
                    this.bus.$emit('update',true)
                }else{
                    this.$message.success("加入购物车失败")
                }
            },
            // 购买商品
            async buy(){

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
                
                // 订单名称
                this.orderInfo.orderName = this.productInfo.productType+'-'+this.productInfo.productName + '订单'
                this.orderInfo.productNo = this.productInfo.productNo
                this.orderInfo.productId = this.productInfo.productId
                this.orderInfo.productName = this.productInfo.productName
                this.orderInfo.productDescribe = this.productInfo.productDescribe
                this.orderInfo.productBrand = this.productInfo.productBrand
                this.orderInfo.inPrice = this.productInfo.inPrice
                this.orderInfo.productType = this.productInfo.productType
                this.orderInfo.productNo = this.productInfo.productNo
                this.orderInfo.productStock = this.productInfo.productStock
                this.orderInfo.productSpecs = this.order.productSpecs
                this.orderInfo.userId = this.$store.getters.getUser.userId
                this.orderInfo.payPrice = this.totalPrice
                this.orderInfo.payAmount = this.order.payAmount
                this.orderInfo.orderUrl = this.productInfo.productUrl.substring(this.productInfo.productUrl.indexOf('2')+1,this.productInfo.productUrl.length);
                this.orderInfo.provinceName = this.defaultAddress.provinceName
                this.orderInfo.cityName = this.defaultAddress.cityName
                this.orderInfo.areaName = this.defaultAddress.areaName
                this.orderInfo.addressDetail = this.defaultAddress.addressDetail
                this.orderInfo.name = this.defaultAddress.name
                this.orderInfo.phone = this.defaultAddress.phone
                this.orderInfo.zipCode = this.defaultAddress.zipCode
                let arr = [];
                arr.push(this.orderInfo)
                this.$router.push({path:'/mall/sureOrder',query:{orderInfo:(JSON.stringify(arr))}})
                // const result = await this.$http.post('/order/addOrder',this.orderInfo)
                
            },
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
            // 鼠标进入原图空间函数
      enterHandler() {
        // 层罩及放大空间的显示
        this.coverLayerShow = true;
      },
      // 鼠标移动函数
      moveHandler(event) {
        // 鼠标的坐标位置
        let x = event.offsetX;
        let y = event.offsetY;
        // 层罩的左上角坐标位置，并对其进行限制：无法超出原图区域左上角
        let topX = x - 100 < 0 ? 0 : x - 100;
        let topY = y - 100 < 0 ? 0 : y - 100;
        // 对层罩位置再一次限制，保证层罩只能在原图区域空间内
        if (topX > 229) {
          topX = 229;
        }
        if (topY > 326) {
          topY = 326;
        }
        console.log(topX);
        console.log(topY);
        // 通过 transform 进行移动控制
        this.coverLayerStyle.transform = `translate(${topX}px,${topY}px)`;
        this.coverLayerImg.transform = `translate(-${2 * topX}px,-${2 * topY}px)`;
      },
      // 鼠标移出函数
      outHandler() {
        // 控制层罩与放大空间的隐藏
        this.coverLayerShow = false;
      },
    }
    }
</script>
<style Lang='less' scoped>
    .product_detail{
        margin: 0;
        padding: 0;
        background: #F5F5F5;
        user-select: none;
        min-height: 100%;
    }
    .product_detail .product-box{
        position: relative;
        z-index: 4;
        background: #fff;
        border-top: 1px solid #e0e0e0;
        border-bottom: 1px solid #e0e0e0;
        -webkit-box-shadow: 0 5px 5px rgba(0,0,0,.07);
        box-shadow: 0 5px 5px rgba(0,0,0,.07);
    }

    .el-dialog-table{
        height: 400px;
    }

    .product_detail .product-box .nav-bar{
        position: relative;
        height: 82px;
        width: 100%;
        margin-top: 0;
        color: #616161;
        border-bottom: 1px solid #e9e9e9;
    }

    .product_detail .nav-bar .container{
        width: 80%;
        min-width: 1226px;
        margin-right: auto;
        margin-left: auto;
        text-align: left;
    }

    .product_detail .nav-bar .container h2{
        margin: 0;
        font-size: 18px;
        font-weight: 400;
        line-height: 60px;
        color: #424242;
        display: inline-block;
    }

    .product_detail .nav-bar .container .logo{
        cursor: pointer;
    }

    .isDefault{
        margin-right: 10px;
        width:98px;
        height:40px;
        text-align: center;
        vertical-align:middle
    }

    .product_detail .nav-bar .container div{
        display: inline-block;
        margin-left: 5px;
        font-size: 15px;
    }

    .product_detail .nav-bar .container .el-link{
        position: absolute;
        top: 32px;
        right: 10%;
        font-size: 15px;
    }


    .product_detail .nav-bar  div .separator{
        margin: 0 .5em;
        color: #424242;
    }
    .product_detail .product-info{
        width: 80%;
        min-width: 1325px;
        margin: 15px auto;
        min-height: 700px;
    }

    .product-info .product-info-content{
        padding-top: 32px;
        padding-bottom: 12px;
        background: #FFFFFF;
    }

    .product_detail .product-info-content .img{
        float: left;
        width: 40%;
        min-width: 540px;
        height: 560px;
    }

    .product_detail .product-info-content .product-con{
        float: left;
        width: 58%;
        min-width: 750px;
        padding-left: 8px;
        text-align: left;
        user-select: text;
    }

    .product_detail .product-con h2{
        margin: 0;
        padding:0;
        font-size: 24px;
        font-weight: 400;
        color: #212121;
    }

    .product_detail .product-con .sale-desc{
        color: #b0b0b0;
        margin: 0;
        padding: 8px 0 0;
        font: 14px/1.5 Helvetica Neue,Helvetica,Arial,Microsoft Yahei,Hiragino Sans GB,Heiti SC,WenQuanYi Micro Hei,sans-serif;
    }

    .product_detail .product-con .price-info{
        display: block;
        font-size: 18px;
        line-height: 1;
        color: #77a0b1;
        padding: 12px 0 10px;
    }

    .line{
        margin-top: 12px;
        border-bottom: 1px solid #e0e0e0;
    }

    .product_detail .product-con .address-box{
        padding: 30px 50px;
        position: relative;
        background: #fafafa;
        border: 1px solid #e0e0e0;
        margin: 20px 0;
    }

    .product_detail .address-box i{
        float: left;
        padding-top: 4px;
        padding-right: 5px;
    }
    .product_detail .address-box .address-con{
        float: left;
    }
    .product_detail .address-box .address-alter{
        float: left;
        cursor: pointer;
        color: #409eff;
        margin-left: 30px;
        font: 14px/1.5 Helvetica Neue,Helvetica,Arial,Microsoft Yahei,Hiragino Sans GB,Heiti SC,WenQuanYi Micro Hei,sans-serif;
    }

    .product_detail .option-box{
        margin-bottom: 30px;
    }

    .product_detail .option-box .title{
        font-size: 18px;
    }

    .product_detail .option-list .el-radio-button{
        margin: 6px;
    }

    .product_detail .option-box .el-radio-button__inner{
        border-left: 1px solid #DCDFE6;
        width: 250px!important;
        height: 39px!important;
    }
    .el-radio-button__inner:hover{
        color: #929934;
    }
    .product_detail .option-box .el-radio-button__inner:hover{
        border-color: #929934;
    }

    .product_detail .product-con .selected-list{
        background: #f9f9fa;
        padding: 30px;
        margin-bottom: 30px;
        font: 14px/1.5 Helvetica Neue,Helvetica,Arial,Microsoft Yahei,Hiragino Sans GB,Heiti SC,WenQuanYi Micro Hei,sans-serif;
    }

    .product_detail .product-con .total-price{
        float: left;
        color: #000;
        font-size: 24px;
        padding-top: 20px;
    }

    .product_detail .product-con .selected-list .el-button{
        padding: 10px 44px;
    }

    .product_detail .mall-footer{
        height: 130px!important;
        border-top: 1px solid #e0e0e0;
    }

    .container:after {
        clear: both;
    }
    .container:after, .container:before {
        content: " ";
        display: table;
    }

    .product_detail .address-dialog .el-dialog__body{
        padding: 30px 80px;
    }

    .product_detail .el-form-item__error{
        padding-left: 74px;
    }

    .product_detail .order-form .el-form-item__label{
        width: 88px;
    }

    .product_detail .order-form .el-input{
        width: 80%;
    }
    .product_detail .order-form .el-form-item__error{
        padding-left: 100px;
    }

    .product_detail .order-form .discount-price .el-input__inner{
        color: red;
    }

    .product_detail .delete-line .el-input__inner{
        text-decoration:line-through
    }

    .product_detail .order-form .vip-info{
        position: absolute;
        right: 16px;
        color:#F8C4A2;
        background-color:#181818;
        padding: 8px 6px;
        top: 4px;
    }

    .product_detail .order-form .vip-info:hover{
        color:#F8C4A2;
        background-color:#181818;
    }
    .mainImage {
    width: 400px;
    height: 400px;
    position: relative;
  }
 
  .mainImage .imageItem {
    border: 1px solid #DCDCDC;
    width: 400px;
    height: 400px;
    position: relative;
  }
 
  /* 放大的图片，通过定位将左上角定位到(0,0) */
  .coverLayerRightImg {
    display: inline-block;
    width: 800px;
    height: 800px;
    position: absolute;
    top: 0;
    left: 0;
  }
 
  /* 右边的区域图片放大空间 */
  .coverLayerRight {
    background-color: #FFFFFF;
    width: 400px;
    height: 400px;
    border: 1px solid #DCDCDC;
    position: relative;
    overflow: hidden;
    position: absolute;
    left: 100%;
    top: 15%;
    z-index: 1001;
  }
 
  /* 一个最高层层罩 */
  .coverLayerMaskTop {
    width: 70%;
    height: 85%;
    position: absolute;
    z-index: 1;
    margin: 15%;
    top: 0;
    left: 0;
    cursor: move;
  }
 
  /* 层罩，通过定位将左上角定位到(0,0) */
  .coverLayerMouse {
    width: 150px;
    height: 150px;
    background: rgba(0, 0, 0, 0.3);
    opacity: 0.4;
    position: absolute;
    margin: 15%;
    top: 0;
    left: 0;
  }

</style>