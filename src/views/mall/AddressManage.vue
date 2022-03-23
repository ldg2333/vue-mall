<template>
<div class="address_manage_contaier">
    <el-card class="box-card">
        <div class="text item">
            <!-- 增删改查区域 -->
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item>
                    <el-tooltip :enterable='false'  effect="dark" content="添加" placement="top">
                         <el-button @click="addAddressVisible=true" type="success" >添加</el-button>
                    </el-tooltip>
                </el-form-item>
            </el-form>
        </div>

        <div  class="text item">
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
        </div>
    </el-card>

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
                    <el-cascader style="width: 487px;" size="large" :options="options" separator=" " v-model="echoAddress.region">
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
</div>
</template>

<script>
   //这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
   //例如：import 《组件名称》 from '《组件路径》';
    import {regionData, CodeToText,TextToCode} from 'element-china-area-data'
   export default {
        //import引入的组件需要注入到对象中才能使用
        name: 'AddressManage',
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
                addressinfo:null, // 收货地址信息
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
                options:regionData, // 地址信息配置
                updateAddressVisible:false,// 修改框显示
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
                addAddressVisible:false,// 新增框显示
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
            }
        },
        created(){
            // 获取所有的收货地址
            this.getAddressByUserId()
        },
        methods:{
            // 修改框关闭  清除数据
            modifyDialogClose(){
                this.$refs.updateFormRef.resetFields()
            },
            // 新增框关闭 清除数据
            addDialogClose(){
                this.$refs.addFormRef.resetFields()
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

                    console.log(this.echoAddress.region[0]);
                    console.log(this.echoAddress.region[1]);
                    console.log(this.echoAddress.region[2]);
                }
                this.updateAddressVisible = true
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
            }
        }
   }
</script>
<style Lang='less' scoped>
    .address_manage_contaier{
        width: 75%;
        height: 100%;
        position: relative;
        left: 25%;
    }
    .isDefault{
        margin-right: 10px;
        width:98px;
        height:40px;
        text-align: center;
        vertical-align:middle
    }
    .demo-form-inline{
        position: relative;
        left: -40%;
    }
    
</style>