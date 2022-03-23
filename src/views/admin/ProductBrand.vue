<template>
<div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/admin/index' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/admin/product' }">商品</el-breadcrumb-item>
        <el-breadcrumb-item>商品品牌</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
        <!-- 增删改查区域 -->
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="品牌名称">
                  <el-input @clear='queryProductBrandInfo' v-model="queryProductBrandName" clearable  placeholder="请输入名称"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="queryProductBrandInfo">查询</el-button>
                  <el-button @click="addProductBrand" type="success" >添加</el-button>
                </el-form-item>
            </el-form> 

            <el-table
            :data="productBrandList"
            stripe
            height="500"
            border
            style="width: 100%">
            <el-table-column width="180" align="center" label="#" type="index"></el-table-column>
            <el-table-column align="center" prop="brandName" label="品牌名称" >
            </el-table-column>
            <el-table-column align="center" prop="brandDescribe" label="品牌描述">
            </el-table-column>
            <el-table-column align="center" width='200' label="操作" >
                <template slot-scope="scope">
                    <el-tooltip :enterable='false'  effect="dark" content="修改" placement="top">
                        <el-button @click="showModifyProductBrand(scope.row.brandId)"  type="primary">修改</el-button>
                    </el-tooltip>
                    <el-tooltip :enterable='false'  effect="dark" content="删除" placement="top">
                        <el-button @click="deleteProductBrand(scope.row.brandName,scope.row.brandId)"  type="danger">删除</el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
    </el-card>

    <el-dialog
    title="提示"
    :visible.sync="dialogVisible"
    width="30%"
    @close="handleClose">
    <el-form label-width="80px" :rules="addRules" ref="addFormRef" :model="ProductBrandInfo">
        <el-form-item  prop="brandName" label="名称">
            <el-input v-model="ProductBrandInfo.brandName" ></el-input>
        </el-form-item>
        <el-form-item  prop="brandDescribe" label="描述">
            <el-input v-model="ProductBrandInfo.brandDescribe" type="textarea"></el-input>
        </el-form-item>
    </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="submitBrand">确 定</el-button>
  </span>
</el-dialog>

</div>
</template>

<script>
   //这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
   //例如：import 《组件名称》 from '《组件路径》';

   export default {
        //import引入的组件需要注入到对象中才能使用
        name: 'ProductBrand',
        data() {
            return {
                queryProductBrandName:"",
                ProductBrandInfo:{
                    brandId:null,
                    brandName:'',
                    brandDescribe:''
                },
                productBrandList:null,
                dialogVisible:false,
                 // 新增商品校验规则
                addRules:{
                    brandName: [{ required: true, message: '请填写品牌名称', trigger: 'blur' },
                        { min: 1, max: 30, message: '名称长度不允许超过 15 个字符', trigger: 'blur' }],
                    brandDescribe: [{ required: true, message: '请填写品牌描述', trigger: 'blur' },
                                {  min: 1, max: 30, message: '名称长度不允许超过 30 个字符', trigger: 'blur'}],
                },

            }
        },
        created(){
            this.getAllBrand()
        },
        methods:{
            queryProductBrandInfo(){
                this.getAllBrand()
            },
            addProductBrand(){
                this.ProductBrandInfo = {brandName:'',brandDescribe:''}
                this.dialogVisible = true
            },
            handleClose(){
                this.$refs.addFormRef.resetFields()
            },
            async showModifyProductBrand(id){
                const result = await this.$http.get('/PBAdmin/getBrandById?brandId='+id)
                if(result.data.code === 200){
                    this.dialogVisible= true
                    this.ProductBrandInfo = result.data.data
                }
                
            },
            async deleteProductBrand(brandName,brandId){
                // 先弹框
                const res = await this.$confirm('此操作将永久删除当前品牌, 是否继续?', '提示', 
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
                const result = await this.$http.get('/PBAdmin/existsBrand?productBrand='+brandName)
                if(result.data.code === 200){
                    return this.$message.error(result.data.message)
                }

                const r = await this.$http.delete('/PBAdmin/deleteBrand?brandId='+brandId)
                if(r.data.code === 200){
                    this.$message.success(r.data.message)
                    this.getAllBrand()
                }
            },
            async getAllBrand(){
                const result = await this.$http.get('/PBAdmin/getAllBrand?brandName='+this.queryProductBrandName)
                if(result.data.code === 200){
                    this.productBrandList = result.data.data
                }
            },
            // 确认增加或修改
            async submitBrand(){
                if(this.ProductBrandInfo.brandId != null){
                    const result = await this.$http.post('/PBAdmin/updateBrand',this.ProductBrandInfo)
                    if(result.data.code === 200){
                        this.$message.success(result.data.message)
                        this.dialogVisible = false
                        this.getAllBrand()
                    }
                }else{
                    const result = await this.$http.post('/PBAdmin/addBrand',this.ProductBrandInfo)
                    if(result.data.code === 200){
                        this.$message.success(result.data.message)
                        this.dialogVisible = false
                        this.getAllBrand()
                    }
                }
            }
        }
   }
</script>
<style Lang='less' scoped>

</style>