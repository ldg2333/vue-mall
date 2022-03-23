<template>
<div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/admin/index' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/admin/product' }">商品</el-breadcrumb-item>
        <el-breadcrumb-item>商品规格</el-breadcrumb-item>
    </el-breadcrumb>

     <!-- 卡片视图区域 -->
    <el-card class="box-card">
        <div class="text item">
            <!-- 增删改查区域 -->
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="规格名称">
                  <el-input @clear='queryProductSpecs' v-model="queryProductSpecsInfo" clearable  placeholder="请输入名称/规格"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="queryProductSpecs">查询</el-button>
                  <el-button @click="addProductSpecs" type="success" >添加</el-button>
                </el-form-item>
            </el-form> 
        </div>

        <el-table
            :data="productSpecsList"
            stripe
            border
            height="500"
            style="width: 100%">
            <el-table-column width="180" align="center" label="#" type="index"></el-table-column>
            <el-table-column align="center" prop="productType" label="商品类型" >
            </el-table-column>
            <el-table-column align="center" prop="specsName" label="规格类型">
            </el-table-column>
            <el-table-column align="center" width='200' label="操作" >
                <template slot-scope="scope">
                    <el-tooltip :enterable='false'  effect="dark" content="修改" placement="top">
                        <el-button @click="showModifyProductSpecs(scope.row.specsId)"  type="primary">修改</el-button>
                    </el-tooltip>
                    <el-tooltip :enterable='false'  effect="dark" content="删除" placement="top">
                        <el-button @click="deleteProductSpecs(scope.row.productType,scope.row.specsId)"  type="danger">删除</el-button>
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
    <el-form label-width="80px" :rules="addRules" ref="addFormRef" :model="specsInfo">

        <el-form-item v-if="isAdd" prop="productType" label="商品名称">
            <el-select  style="width:100%" v-model="specsInfo.productType">
                    <el-option v-for="(item,index) in typeNameList" :key="index" :value="item" :label="item"></el-option>
                </el-select>
        </el-form-item>

        <el-form-item v-if="isUpdate"  prop="productType" label="商品名称">
            <el-input disabled v-model="specsInfo.productType" ></el-input>
        </el-form-item>
        <el-form-item  prop="specsName" label="规格类型">
            <el-input v-model="specsInfo.specsName" type="textarea"></el-input>
        </el-form-item>
    </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="submitSpecs">确 定</el-button>
  </span>
</el-dialog>

</div>
</template>

<script>
   //这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
   //例如：import 《组件名称》 from '《组件路径》';

   export default {
        //import引入的组件需要注入到对象中才能使用
        name: 'ProductSpecs',
        data() {
            return {
                queryProductSpecsInfo:'',
                productSpecsList:null,
                dialogVisible:false,
                specsInfo:{
                    seecsId:null,
                    productType:'',
                    specsName:''
                },
                typeNameList:[],
                isUpdate:false,
                isAdd:false,
                addRules:{
                    productType: [{ required: true, message: '请选择商品类型', trigger: 'blur' }],
                    specsName: [{ required: true, message: '请填写品牌描述', trigger: 'blur' },
                                {  min: 1, max: 15, message: '名称长度不允许超过 15 个字符', trigger: 'blur'}],
                }
            }
        },
        created(){
            this.getAllSpecs()
        },
        methods:{
            queryProductSpecs(){
                this.getAllSpecs()
            },
            async showModifyProductSpecs(id){
                this.isUpdate = true
                this.dialogVisible = true
                const result = await this.$http.get('/specsAdmin/getSpecsById?specsId='+id)
                if(result.data.code === 200){
                    this.specsInfo = result.data.data
                }
            },
            async deleteProductSpecs(productType,specsId){
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
               const result = await this.$http.get('/specsAdmin/isExistProduct',{params:{'productType':productType,'specsId':specsId}})
               if(result.data.code === 200){
                   return this.$message.error("当前规格下存在商品 暂时无法删除")
               }
                const rs = await this.$http.delete('/specsAdmin/deleteSpecsById/'+specsId)
                if(rs.data.code === 200){
                    this.$message.success("删除成功")
                    this.getAllSpecs()
                }
            },
            async getSpecsList(){
                 
                const result = await this.$http.get('/PSAdmin/selectTypeName')
                if(result.data.code === 200){
                    this.typeNameList = result.data.data
                }
            },
            async getAllSpecs(){
                const result = await this.$http.get('/specsAdmin/getAllSpecsByKey?key='+this.queryProductSpecsInfo)
                if(result.data.code === 200){
                    this.productSpecsList = result.data.data
                }
            },
            submitSpecs(){
                // 预校验
                this.$refs.addFormRef.validate(async valid => {
                    if(!valid) return; // 验证不通过

                    const result = await this.$http.post('/specsAdmin/existSpecsName',this.specsInfo)
                    if(result.data.code === 200){
                        this.$message.error("当前规格["+this.specsInfo.productType+' : '+this.specsInfo.specsName+"]已存在 请勿重复添加")
                        return;
                    }


                    if(this.specsInfo.specsId != null){
                        const result = await this.$http.post('/specsAdmin/updateSpecsById',this.specsInfo)
                        if(result.data.code === 200){
                            this.$message.success(result.data.message)
                            this.dialogVisible = false
                            this.handleClose()
                            this.getAllSpecs()
                        }
                    }else{
                        const result = await this.$http.post('/specsAdmin/addSpecs',this.specsInfo)
                        if(result.data.code === 200){
                            this.$message.success(result.data.message)
                            this.dialogVisible = false
                            this.handleClose()
                            this.getAllSpecs()
                        }
                    }
                })
            },
            addProductSpecs(){
                this.isAdd = true
                this.getSpecsList()
                this.dialogVisible = true
                this.specsInfo = {seecsId:null,productType:'',specsName:''}


            },
            handleClose(){
                this.isUpdate = false
                this.isAdd = false
                this.$refs.addFormRef.resetFields()
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