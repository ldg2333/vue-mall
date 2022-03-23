<template>
<div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/admin/index' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/admin/product' }">商品</el-breadcrumb-item>
        <el-breadcrumb-item>商品类型</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card class="box-card">
        <div class="text item">
            <!-- 增删改查区域 -->
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="类型名称">
                  <el-input @clear='queryProductType' v-model="queryProductTypeInfo" clearable  placeholder="请输入名称"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="queryProductType">查询</el-button>
                  <el-button @click="addProductType" type="success" >添加</el-button>
                </el-form-item>
            </el-form> 

            <el-table height="500"  :data="productTypeList" border stripe>
            <el-table-column align="center" label="#" type="index"></el-table-column>
            <el-table-column v-if="false"  prop="typeId"></el-table-column>
            <el-table-column align="center" prop="typeName" label="类别名称" width="100"></el-table-column>
            <el-table-column align="center" prop="typeDescribe" label="类别描述" width="200"></el-table-column>
            <el-table-column label="顶部宣传图" align="center" >
            <template slot-scope="scope">
                <el-image v-if="scope.row.typeUrlTop"
                        :preview-src-list="[scope.row.typeUrlTop]"
                        style="width: 300px; height: 200px"
                        :src="scope.row.typeUrlTop"
                        fit="fit"/>
            </template>
            </el-table-column>
            <el-table-column label="左侧宣传图" align="center">
            <template slot-scope="scope">
                <el-image v-if="scope.row.typeUrlLeft"
                        :preview-src-list="[scope.row.typeUrlLeft]"
                        style="width: 300px; height: 200px"
                        :src="scope.row.typeUrlLeft"
                        fit="fit"/>
            </template>
            </el-table-column>
            <el-table-column align="center" width='200' label="操作" >
                <template slot-scope="scope">
                    <el-tooltip :enterable='false'  effect="dark" content="修改" placement="top">
                        <el-button @click="showModifyProductType(scope.row.typeId)"  type="primary">修改</el-button>
                    </el-tooltip>
                    <el-tooltip :enterable='false'  effect="dark" content="删除" placement="top">
                        <el-button @click="deleteProductType(scope.row.typeName,scope.row.typeId)"  type="danger">删除</el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>

    </div>
    </el-card>


    <el-dialog
    title="修改商品类型"
    :visible.sync="updateDialogVisible"
    width="50%"
    @close="updateDialogClose">
    
    <el-form ref='updateFormRef' :model="productTypeInfo" :rules="updateRules" class="demo-form-inline">
        <el-form-item prop="typeUrlTop" label="顶部宣传图：">
            <el-upload
                class="product-upload"
                action="#"
                :limit="1"
                :show-file-list="false"
                :on-change="handleChangeTop"
                :auto-upload="false"
                accept="image/png,image/gif,image/jpg,image/jpeg"
                ref="topUpload">
            <el-image v-if="productTypeInfo.typeUrlTop"
                        style="width: 550px; height: 200px"
                        :src="productTypeInfo.typeUrlTop"
                        fit="fit"/>
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
        </el-form-item>
        <el-form-item prop="typeName" label="名称：">
            <el-input style="width: 50%" v-model="productTypeInfo.typeName"></el-input>
        </el-form-item>
        <el-form-item prop="typeUrlLeft" label="左侧宣传图：">
            <el-upload
                class="product-upload"
                action="#"
                :limit="1"
                :show-file-list="false"
                :on-change="handleChangeLeft"
                :auto-upload="false"
                accept="image/png,image/gif,image/jpg,image/jpeg"
                ref="leftUpload">
            <el-image v-if="productTypeInfo.typeUrlLeft"
                        style="width: 280px; height: 400px"
                        :src="productTypeInfo.typeUrlLeft"
                        fit="fit"/>
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
        </el-form-item>
        <el-form-item prop="typeDescribe"  label="描述：" >
            <el-input style="width: 50%" type="textarea" v-model="productTypeInfo.typeDescribe"></el-input>
        </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
        <el-button @click="updateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updatePrductType">确 定</el-button>
    </span>
    </el-dialog>
    
</div>
</template>

<script>
   //这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
   //例如：import 《组件名称》 from '《组件路径》';

   export default {
        //import引入的组件需要注入到对象中才能使用
        name: 'ProductType',
        data() {
            return {
                queryProductTypeInfo:'', // 查询的类型名称
                productTypeList:null, // 商品类型数据
                updateDialogVisible:false,
                productTypeInfo:{
                    typeName:'',
                    typeUrlLeft:'',
                    typeUrlTop:'',
                    typeDescribe:''
                },
                typeLeftUrl:null,
                typeTopUrl:null,
                preTypeUrlLeft:null,
                preTypeUrlTop:null,
                typeLeftUrlList:[],
                typeTopUrlList:[],
                updateRules:{
                    typeName: [{ required: true, message: '请填写类型名称', trigger: 'blur' },
                        { min: 1, max: 20, message: '名称长度不允许超过 20 个字符', trigger: 'blur' }],
                    typeDescribe: [{ required: true, message: '请填写类别介绍', trigger: 'blur' },
                        { min: 1, max: 100, message: '名称长度不允许超过 100 个字符', trigger: 'blur' }],
                    typeUrlLeft: [{ required: true, message: '请上传左侧宣传图片', trigger: 'blur' }],
                    typeUrlTop: [{ required: true, message: '请上传顶部宣传图片', trigger: 'blur' }],
                },

            }
        },
        created(){
            this.queryProductType()
        },
        methods:{
            // 查询商品类型
            async queryProductType(){
                 const result = await this.$http.get('/PTAdmin/getTypeByName?typeName='+this.queryProductTypeInfo)
                 if(result.data.code === 200){
                     this.productTypeList = result.data.data
                     this.productTypeList.forEach(item => {
                        item.typeUrlLeft = this.$serve + item.typeUrlLeft
                        item.typeUrlTop = this.$serve + item.typeUrlTop
                     });
                 }
            },
            // 添加商品类别
            addProductType(){
                this.$router.push("/admin/addProductType")
            },
            // 弹出修改框
            async showModifyProductType(id){
                this.updateDialogVisible = true
                const result = await this.$http.get('/PTAdmin/getTypeById?typeId='+id)
                if(result.data.code === 200){
                    this.productTypeInfo = result.data.data
                    this.productTypeInfo.typeUrlLeft = this.$serve + this.productTypeInfo.typeUrlLeft
                    this.productTypeInfo.typeUrlTop = this.$serve + this.productTypeInfo.typeUrlTop
                }
            },
            // 更新
            async updatePrductType(){
                 // 预校验
                this.$refs.updateFormRef.validate(async valid => {
                    if(!valid) return; // 验证不通过

                    if(this.typeLeftUrlList[0]!=null || this.typeTopUrlList[0]!=null){
                        var fd = new FormData()
                        // 删除图片Left
                        if(this.preTypeUrlLeft != null && this.typeLeftUrlList[0]!=null){
                            fd.append("file",this.typeLeftUrlList[0].raw)
                            const result = await this.$http.post('/PTAdmin/deleteProductTypeUrl?preProductTypeUrl='+this.preTypeUrlLeft)
                            this.preTypeUrlLeft = null
                            this.typeLeftUrlList[0]==null
                        }else{
                            fd.append("file",null)
                        }
                        // 删除图片Top
                        if(this.preTypeUrlTop != null && this.typeTopUrlList[0]!=null){
                            fd.append("file2",this.typeTopUrlList[0].raw)
                            const result = await this.$http.post('/PTAdmin/deleteProductTypeUrl?preProductTypeUrl='+this.preTypeUrlTop)
                            this.preTypeUrlTop = null
                            this.typeTopUrlList[0]==null
                        }else{
                            fd.append("file2",null)
                        }

                        fd.append("productType",JSON.stringify(this.productTypeInfo))
                        const result = await this.$http.post('/PTAdmin/updateProductTypeAndUrl',fd)
                        if(result.data.code === 200){
                            this.$message.success("修改信息成功!")
                            this.updateDialogVisible = false
                            this.queryProductType()
                        }
                    }else{
                        this.productTypeInfo.typeUrlLeft = null
                        this.productTypeInfo.typeUrlTop = null
                        const result = await this.$http.post('/PTAdmin/updateProductType',this.productTypeInfo)
                        if(result.data.code == 200){
                            this.$message.success("修改信息成功!")
                            this.updateDialogVisible = false
                            this.queryProductType()
                        }
                    }
                })
            },
            // 删除商品类型
            async deleteProductType(productType,typeId){
               // 先弹框
                const res = await this.$confirm('此操作将永久删除当前规格, 是否继续?', '提示', 
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
                const result = await this.$http.get('/PTAdmin/isExistProduct?productType='+productType)
                if(result.data.code === 200){
                    return this.$message.error("当前类别下存在商品 暂时无法删除")
                }
                const rs = await this.$http.delete('/PTAdmin/deleteTypeById?typeId='+typeId)
                if(rs.data.code === 200){
                    this.$message.success("删除成功")
                    this.queryProductType()
                }
            },
            updateDialogClose(){
                 this.$refs.updateFormRef.resetFields()
            },
            handleChangeLeft(file,fileList){
                if(this.productTypeInfo.typeUrlLeft != null){
                    this.preTypeUrlLeft = this.productTypeInfo.typeUrlLeft
                }
                this.productTypeInfo.typeUrlLeft=URL.createObjectURL(file.raw)
                this.typeLeftUrl = URL.createObjectURL(file.raw)
                this.typeLeftUrlList = fileList
                 this.$refs.leftUpload.clearFiles();
            },
            handleChangeTop(file,fileList){
                if(this.productTypeInfo.typeUrlTop != null){
                    this.preTypeUrlTop = this.productTypeInfo.typeUrlTop
                }
                this.productTypeInfo.typeUrlTop=URL.createObjectURL(file.raw)
                this.typeTopUrl = URL.createObjectURL(file.raw)
                this.typeTopUrlList = fileList
                this.$refs.topUpload.clearFiles();
            }
        }
   }
</script>
<style Lang='less' scoped>
    /deep/ .el-table__body-wrapper::-webkit-scrollbar {
        width: 0;
    }
    /deep/ .el-table__body-wrapper::-webkit-scrollbar-thumb  {
        background-color: #fff
    }
</style>