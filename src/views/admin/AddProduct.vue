<template>
<div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/admin/index' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/admin/product' }">商品</el-breadcrumb-item>
        <el-breadcrumb-item>新增商品</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
        <el-form :inline="true" class="el-form" :rules="addRules" :model="productInfo" ref='addFrom'>
        <el-row>
            <el-col :xs="24" :sm="24" :lg="12">
                <el-form-item label="商品名称：" prop="productName">
                    <el-input  v-model="productInfo.productName" placeholder="商品名称"></el-input>
                </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :lg="12">
                <el-form-item label="商品分类/规格：" prop="value">
                <el-cascader
                    :options="productTypeOption"
                    :props="{ expandTrigger: 'hover', multiple: true }"
                    @change="changeLabel"
                    v-model="value"
                    collapse-tags
                    clearable>
                </el-cascader>
            </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :xs="24" :sm="24" :lg="12">
            <el-form-item label="商品进价：" prop="inPrice">
            <el-input-number :min="0" v-model="productInfo.inPrice" placeholder="商品进价"></el-input-number>
            </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :lg="12">
            <el-form-item label="商品品牌：" prop="productBrand">
            <el-select v-model="productInfo.productBrand" filterable placeholder="请选择品牌">
                <el-option v-for="(item,index) in productBrand" :key="index" :label="item" :value="item"></el-option>
            </el-select>
            </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :xs="24" :sm="24" :lg="12">
            <el-form-item label="商品售价：" prop="outPrice">
                <el-input-number :min='0' v-model="productInfo.outPrice" placeholder="商品售价"></el-input-number>
            </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :lg="12">
            <el-form-item label="商品库存：" prop="lowestStock">
                <el-input-number  size="medium" v-model="productInfo.productStock" :min='0' placeholder="库存"></el-input-number>
            </el-form-item>
            </el-col>
        </el-row>

        <el-row>
            <el-col :xs="24" :sm="24" :lg="12">
                <el-form-item label="商品状态：">
                    <el-switch
                    v-model="productInfo.isSale"
                    :active-value="1" 
                    :inactive-value="0"
                    active-text="上架"
                    inactive-text="下架">
                    </el-switch>
                </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :lg="12">
                <el-form-item label="商品状态："> 
                    <el-switch
                        v-model="productInfo.isNew"
                        :active-value="1" 
                        :inactive-value="0"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                        active-text="新品"
                        inactive-text="非新品">
                        </el-switch>
                </el-form-item>
            </el-col>
        </el-row>
         <el-row>
            <el-col :xs="24" :sm="24" :lg="12">
            <el-form-item label="商品描述：" prop="productDescribe">
                <el-input  :rows="8" type="textarea" v-model="productInfo.productDescribe" placeholder="商品描述"></el-input>
            </el-form-item>
            </el-col>
             <el-col :xs="24" :sm="24" :lg="12">
            <el-form-item label="商品图片：" prop="productUrl">
            <el-upload
                class="product-upload"
                action="#"
                :limit="1"
                :show-file-list="false"
                :on-change="handleChange"
                :auto-upload="false"
                accept="image/png,image/gif,image/jpg,image/jpeg"
                ref="productUpload">
                <el-image v-if="productInfo.productUrl" :src="productInfo.productUrl" style="height: 200px;width: 200px"></el-image>
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            </el-form-item>
             </el-col>
        </el-row>
        </el-form>
      <div class="foot">
        <el-button  style="margin: 0 20px;" @click="cancelChange()">取 消</el-button>
        <el-button type="primary"  @click="submitAdd()">确 定</el-button>
      </div>
    </el-card>
</div>
</template>

<script>
   //这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
   //例如：import 《组件名称》 from '《组件路径》';

   export default {
        //import引入的组件需要注入到对象中才能使用
        name: 'AddProduct',
        data() {
            const checkValue = (rule, value, cb) => {
                if (this.value.length === 0) {
                    cb(new Error('请选择商品分类/规格'));
                } else {
                    cb();
                }
            }
            return {
                // 新增商品信息
                productInfo:{
                    productNo:null,
                    productName:null,
                    productType:null,
                    productDescribe:null,
                    productBrand:null,
                    inPrice:0,
                    outPrice:0,
                    productStock:0,
                    isNew:1,
                    isSale:1,
                    productUrl:null,
                    saleStock:0
                },
                // 新增商品校验规则
                addRules:{
                    productName: [{ required: true, message: '请填写商品名称', trigger: 'blur' },
                        { min: 1, max: 30, message: '名称长度不允许超过 30 个字符', trigger: 'blur' }],
                    productBrand: [{ required: true, message: '请选择商品品牌', trigger: 'blur' }],
                    value: [{trigger:  'blur', validator: checkValue }],
                    productDescribe: [{ required: true, message: '请填写商品介绍', trigger: 'blur' },
                        { min: 1, max: 100, message: '名称长度不允许超过 100 个字符', trigger: 'blur' }],
                    productUrl: [{ required: true, message: '请上传商品图片', trigger: 'blur' }],
                },
                productBrand:null,
                productType:null,
                productTypeOption:[],
                proFileList:null,
                productSpecs:null,
                value: [],
                shareScopeEnd: [],
            }
        },
        created(){
            // 创建时获取所有ProductTypeName
            this.getAllProductBrandName()
            // 创建时获取所有的类型内容
            this.getAllProductType()
            // 创建时获取所有的规格
            this.getAllProductSpecs()
        },
        methods:{
            // 获取所有的品牌类型
            async getAllProductBrandName(){
                const result = await this.$http.get('/product/productBrand/findAllBrandName')
                if(result.data.code === 200){
                   this.productBrand = result.data.data
                }
            },
            // 获取所有类型的内容
            async getAllProductType(){
                 const result = await this.$http.get('/PTAdmin/getAllType')
                 if(result.data.code === 200){
                     this.productType = result.data.data
                     for (let index = 0; index < this.productType.length; index++) {
                         const element = this.productType[index];
                         let ele = {value:null,label:null,children:[]}
                         ele.value = element.typeName
                         ele.label = element.typeName
                         this.productTypeOption.push(ele)
                     }
                 }
            },
            // 获取所有的规格
            async getAllProductSpecs(){
                const result = await this.$http.get('/specsAdmin/getAllSpecs')
                if(result.data.code === 200){
                    this.productSpecs = result.data.data
                    for (let index = 0; index < this.productSpecs.length; index++) {
                        const element = this.productSpecs[index];
                        let child={label:null,value:null,}
                        child.label = element.specsName
                        child.value = element.specsId
                        for (let i = 0; i < this.productTypeOption.length; i++) {
                            if(this.productTypeOption[i].value == element.productType){
                            this.productTypeOption[i].children.push(child)
                        }   
                        }
                    }
                }
            },
            submitAdd(){
                
                // 预校验
                this.$refs.addFrom.validate(async valid => {
                    if(!valid) return; // 验证不通过
                    let productSpecsList = []
                    for (let i = 0; i < this.value.length; i++) {
                        let productSpecsItem={specsId:null,productId:null}
                        productSpecsItem.specsId = this.value[i][1]
                        productSpecsList[i] = productSpecsItem
                    }
                    this.getProductNo()
                    let tempProductNo = this.productInfo.productNo
                    let fd = new FormData()
                    this.productInfo.productType = this.value[0][0]
                    fd.append("file",this.proFileList[0].raw)
                    fd.append("product",JSON.stringify(this.productInfo))
                    
                     const result = await this.$http.post('/productAdmin/addProduct',fd)
                     if(result.data.code === 200){
                        const res = await this.$http.get('/product/findByProductNo?productNo='+tempProductNo)
                        if(res.data.code === 200){
                            let productId = res.data.data.productId
                            productSpecsList.forEach(item=>{
                                item.productId = productId
                            })
                            console.log(productSpecsList);
                            const r = await this.$http.post('/PSAdmin/addPSList',productSpecsList)
                            if(r.data.code === 200){
                                this.$message.success(r.data.message)
                                this.$router.push({path:'/admin/product'})
                            }
                        }
                     }
                })
            },
            // 生成订单编号
            getProductNo(){
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
                this.productInfo.productNo = year + mouth + day + hours + seconds + random
            },
            // 取消修改
            cancelChange(){
                this.$router.push({path:'/admin/product'})
            },
            // 处理图片上传
            handleChange(file,fileList){
                this.productInfo.productUrl=URL.createObjectURL(file.raw)
                this.proFileList = fileList
                this.$refs.productUpload.clearFiles();
            },
            changeLabel(val) {
                let changeFlag = false
                let changeItem = null
                if (this.shareScopeEnd.length == 0) {
                    this.value = val
                } else {
                    // 与原数组比对
                    this.value.forEach((item) => {
                    if (item[0] !== this.shareScopeEnd[0][0]) { // 一级标签不同
                        changeFlag = true
                        changeItem = item
                    }else if ((!item[1] && this.shareScopeEnd[0][1]) || (item[1] && !this.shareScopeEnd[0][1])) {
                        changeFlag = true
                        changeItem = item
                    }
                    })
                }
                if (changeFlag) {
                    this.value = []
                    this.value.push(changeItem)
                }
                this.shareScopeEnd = this.value
                
            }
        }    
    }
</script>
<style Lang='less' scoped>
    .foot{
        display: flex;
        justify-content: center;
    }
    .product-upload{
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

  .product-upload:hover {
    border-color: #409EFF;
  }

  .product-upload .el-upload:hover .avatar-uploader-icon {
    color: #409EFF;
  }

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}
</style>