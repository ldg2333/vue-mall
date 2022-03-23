<template>
<div>
     <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/admin/index' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/admin/product' }">商品</el-breadcrumb-item>
        <el-breadcrumb-item>编辑商品</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
        <el-form :inline="true" class="el-form" :rules="alterRules" :model="productInfo" ref='changeFrom'>
        <el-row>
            <el-col :xs="24" :sm="24" :lg="12">
                <el-form-item label="商品名称：" prop="productName">
                    <el-input :rows="3" type="textarea"  v-model="productInfo.productName" placeholder="商品名称"></el-input>
                </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :lg="12">
                <el-form-item label="商品分类：" prop="value">
                <el-cascader
                    v-if="cascaderShow"
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
            <el-form-item label="商品描述：" prop="productDescribe">
                <el-input  :rows="5" type="textarea" v-model="productInfo.productDescribe" placeholder="商品描述"></el-input>
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
                <el-image :src="productInfo.productUrl" style="height: 200px;width: 200px"></el-image>
            </el-upload>
            </el-form-item>
             </el-col>
        </el-row>
        </el-form>
      <div class="foot">
        <el-button  style="margin: 0 20px;" @click="cancelChange()">取 消</el-button>
        <el-button type="primary"  @click="submitChange()">确 定</el-button>
      </div>
    </el-card>
</div>
</template>

<script>
   //这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
   //例如：import 《组件名称》 from '《组件路径》';

   export default {
        //import引入的组件需要注入到对象中才能使用
        name: 'UpdateProduct',
        data() {
            const checkValue = (rule, value, cb) => {
                if (this.value.length === 0) {
                    cb(new Error('请选择商品分类/规格'));
                } else {
                    cb();
                }
            }
            return {
                productId:'', //商品id
                productInfo:null, // 商品信息
                alterRules:{
                    productName: [{ required: true, message: '请输入商品名称', trigger: 'blur' },
                                    { min: 1, max: 30, message: '名称长度不允许超过 30 个字符', trigger: 'blur' }],
                    value: [{trigger:  'blur', validator: checkValue }],
                    outPrice:[{ required: true, message: '请输入商品售价', trigger: 'blur' }],
                    inPrice:[{ required: true, message: '请输入商品进价', trigger: 'blur' }],
                    productDescribe: [{ required: true, message: '请输入商品描述', trigger: 'blur' },
                        { min: 1, max: 100, message: '描述信息长度不允许超过 100 个字符', trigger: 'blur' }]
                },// 修改信息校验
                productType:null, // 商品分类
                productBrand:null, // 商品品牌
                proUrl:null,// 临时存储商品图片
                proList:[],// 临时存储头像列表
                preProUrl:null,
                value: [],
                tempValue:[], // 临时存放数组
                shareScopeEnd: [],
                productTypeOption:[],
                cascaderShow:false
            }
        },
        created(){
             // 根据路由信息获取商品id
            this.productId = this.$route.query.productId;
            this.getProductById()
            this.getAllProductBrandName()
            this.getAllProductType()
            this.getAllProductSpecs()
            // 回显数据
            this.setValue(this.productId)
        },
        methods:{
            
            // 进入页面时加载商品信息
            async getProductById(){
                const result = await this.$http.post('/product/findById?productId='+this.productId)
                if(result.data.code === 200){
                    this.productInfo = result.data.data
                    this.productInfo.productUrl = this.$serve + this.productInfo.productUrl
                }
            },
            // 确认修改
            submitChange(){
                // 预校验
                this.$refs.changeFrom.validate(async valid => {
                    if(!valid) return; // 验证不通过

                    let productSpecsListTemp = [] // 删除的 规格
                    for (let i = 0; i < this.tempValue.length; i++) {
                        let productSpecsItem={specsId:null,productId:null}
                        productSpecsItem.specsId = this.tempValue[i][1]
                        productSpecsItem.productId = this.productId
                        productSpecsListTemp[i] = productSpecsItem
                    }
                    if(productSpecsListTemp.length > 0){
                        await this.$http.post('/PSAdmin/deletePSList',productSpecsListTemp)
                    }
                    
                    let productSpecsList = [] // 新增的规格
                    for (let i = 0; i < this.value.length; i++) {
                        let productSpecsItem={specsId:null,productId:null}
                        productSpecsItem.specsId = this.value[i][1]
                        productSpecsItem.productId = this.productId
                        productSpecsList[i] = productSpecsItem
                    }
                    if(productSpecsList.length >0){
                        await this.$http.post('/PSAdmin/addPSList',productSpecsList)
                    }
                     this.productInfo.productType = this.value[0][0]
                    
                    if(this.proList[0] != null){

                       
                        var fd = new FormData()
                        fd.append("file",this.proList[0].raw)
                        fd.append("product",JSON.stringify(this.productInfo))

                        // 删除图片
                        // if(this.preProUrl != null){
                        //     const result = await this.$http.post('/productAdmin/deleteProductUrl?preProductUrl='+this.preProUrl)
                        //     this.preProUrl = null
                        // }

                        const result = await this.$http.post('/productAdmin/updateProductAndUrl',fd)
                        if(result.data.code === 200){
                            this.$message.success("修改信息成功!")
                            this.$router.push({path:'/admin/product'})
                        }
                    }else{
                        this.productInfo.productUrl = null
                        const result = await this.$http.post('/productAdmin/updateProduct',this.productInfo)
                        if(result.data.code == 200){
                            this.$message.success("修改信息成功!")
                            this.$router.push({path:'/admin/product'})
                        }
                    }
                })
            },
            // 取消修改
            cancelChange(){
                this.$router.push({path:'/admin/product'})
            },
            // 图片更改时触发
            handleChange(file,fileList){
                if(this.productInfo.productUrl != null){
                    this.preProUrl = this.productInfo.productUrl
                }
                this.productInfo.productUrl=URL.createObjectURL(file.raw)
                this.proUrl = URL.createObjectURL(file.raw)
                this.proList = fileList
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
            async setValue(productId){
                const result = await this.$http.get('/PSAdmin/selectTAndSByPId?productId='+productId)
                if(result.data.code === 200){
                    for (let i = 0; i < result.data.data.length; i++) {
                        let item = []
                        item[0] = result.data.data[i].productType
                        item[1] = result.data.data[i].specsId
                        this.value.push(item)
                    }
                    this.tempValue = this.value
                }
                setTimeout(()=>{
                    this.cascaderShow = true
                },200)
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
        justify-content: flex-end
    }
</style>