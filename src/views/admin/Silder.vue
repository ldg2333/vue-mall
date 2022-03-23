<template>
<div>
     <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/admin/index' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>轮播图设置</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
        <!-- 增删改查区域 -->
        <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="轮播图名称">
                <el-input @clear='getAllBanner' v-model="queryBannerInfo" clearable  placeholder="请输入名称"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getAllBanner">查询</el-button>
                <el-button @click="addBanner" type="success" >添加</el-button>
            </el-form-item>
        </el-form> 

        <el-table height="500"  :data="bannerList" border stripe>
            <el-table-column align="center" label="#" type="index"></el-table-column>
            <el-table-column v-if="false"  prop="bannerId"></el-table-column>
            <el-table-column align="center" prop="productName" label="轮播图名称" width="200"></el-table-column>
            <el-table-column label="轮播图" align="center" >
            <template slot-scope="scope">
                <el-image v-if="scope.row.bannerUrl"
                        :preview-src-list="[scope.row.bannerUrl]"
                        style="width: 500px; height: 200px"
                        :src="scope.row.bannerUrl"
                        fit="fit"/>
            </template>
            </el-table-column>
            <el-table-column width="200" prop="productUrl" label="对应商品链接" align="center">
            </el-table-column>
            <el-table-column align="center" width='200' label="操作" >
                <template slot-scope="scope">
                    <el-tooltip :enterable='false'  effect="dark" content="修改" placement="top">
                        <el-button @click="showModifyBanner(scope.row)"  type="primary">修改</el-button>
                    </el-tooltip>
                    <el-tooltip :enterable='false'  effect="dark" content="删除" placement="top">
                        <el-button @click="deleteBanner(scope.row.bannerId,scope.row)"  type="danger">删除</el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>

    </el-card>

    <el-dialog
    title="提示"
    top="10vh"
    :visible.sync="DialogVisible"
    width="35%"
    @close="handleClose">
    <el-form class="info-form" inline :rules="updateRules" :model="bannerInfo" ref='changeFrom'>
        <el-form-item label="轮播图名称：" prop="productName" style="width: 100%">
          <el-input size="medium" v-model="bannerInfo.productName" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="商 品 链 接：" prop="productUrl" style="width: 100%">
          <el-input size="medium" v-model="bannerInfo.productUrl" placeholder="请输入商品链接"></el-input>
        </el-form-item>
        <el-form-item prop="bannerUrl" label="轮 播 图：">
            <el-upload  style="width: 550px; height: 200px"
                class="product-upload"
                action="#"
                :limit="1"
                drag
                :show-file-list="false"
                :on-change="handleChangeBanner"
                :auto-upload="false"
                accept="image/png,image/gif,image/jpg,image/jpeg"
                ref="bannerUpload">
            <el-image v-if="bannerInfo.bannerUrl"
                        style="width:100%;height:100%;"
                        :src="bannerInfo.bannerUrl"
                        fit="fit"/>
            <i v-if="!bannerInfo.bannerUrl" class="el-icon-upload"></i>
            <div v-if="!bannerInfo.bannerUrl" class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            </el-upload>
        </el-form-item>
      </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="DialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitBanner">确 定</el-button>
    </span>
    </el-dialog>
</div>
</template>

<script>
   //这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
   //例如：import 《组件名称》 from '《组件路径》';

   export default {
        //import引入的组件需要注入到对象中才能使用
        name: 'Silder',
        data() {
            return {
                queryBannerInfo:'',
                bannerList:null,
                bannerInfo:{
                    bannerId:null,
                    productName:'',
                    bannerUrl:null,
                    productUrl:null,
                },
                DialogVisible:false,
                updateRules:{
                    productName: [{ required: true, message: '请输入商品名称', trigger: 'blur' },
                    { min: 1, max: 30, message: '名称长度不允许超过 30 个字符', trigger: 'blur' }],
                    productUrl: [{ required: true, message: '请输入商品购买页面链接', trigger: 'blur' },
                    { min: 1, max: 100, message: '商品链接长度不允许超过 100 个字符', trigger: 'blur' }],
                    bannerUrl: [{ required: true, message: '请上传宣传图', trigger: 'blur' }],
                },
                preBannerUrl:null,
                bannerFileList:[],
            }
        },
        created(){
            this.getAllBanner()
        },
        methods:{
             async getAllBanner(){
                const result = await this.$http.get('/bannerAdmin/findAll?bannerName='+this.queryBannerInfo)
                if(result.data.code === 200){
                    this.bannerList = result.data.data
                    this.bannerList.forEach(item => {
                        item.bannerUrl = this.$serve + item.bannerUrl
                    });
                }
            },
            submitBanner(){
                // 预校验
                this.$refs.changeFrom.validate(async valid => {
                    if(!valid) return; // 验证不通过

                    if(this.bannerInfo.bannerId == null){
                        // 新增
                        let fd = new FormData()
                        fd.append("file",this.bannerFileList[0].raw)
                        fd.append("banner",JSON.stringify(this.bannerInfo))
                        const result = await this.$http.post('/bannerAdmin/addBanner',fd)
                        if(result.data.code == 200){
                            this.$message.success("添加成功!")
                            this.DialogVisible = false
                            this.getAllBanner()
                        }
                    }else{
                        // 修改
                        if(this.preBannerUrl == null){
                            this.bannerInfo.bannerUrl = null
                            const result = await this.$http.post('/bannerAdmin/updateBanner',this.bannerInfo)
                            if(result.data.code == 200){
                                this.$message.success("修改信息成功!")
                                this.DialogVisible = false
                                this.getAllBanner()
                            }
                        }else{
                            let fd = new FormData()
                            fd.append("file",this.bannerFileList[0].raw)
                            fd.append("banner",JSON.stringify(this.bannerInfo))

                            // 删除图片
                            if(this.preBannerUrl != null){
                                const result = await this.$http.post('/bannerAdmin/deleteBannerUrl?bannerUrl='+this.preBannerUrl)
                                this.preBannerUrl = null
                            }
                            const result = await this.$http.post('/bannerAdmin/updateBannerExistUrl',fd)
                            if(result.data.code == 200){
                                this.$message.success("修改信息成功!")
                                this.DialogVisible = false
                                this.getAllBanner()
                            }
                        }
                        
                    }
                })
                
            },
            async deleteBanner(bannerId,row){
                // 先弹框
                const res = await this.$confirm('确认删除当前轮播图, 是否继续?', '提示', 
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
                await this.$http.post('/bannerAdmin/deleteBannerUrl?bannerUrl='+row.bannerUrl)
                const result = await this.$http.post('/bannerAdmin/deleteById?bannerId='+bannerId)
                if(result.data.code === 200){
                    this.$message.success("删除成功")
                    this.getAllBanner()
                }
            },
            addBanner(){
                this.DialogVisible = true
            },
            showModifyBanner(row){
                this.bannerInfo.bannerId = row.bannerId
                this.bannerInfo.productName=row.productName
                this.bannerInfo.bannerUrl=row.bannerUrl
                this.bannerInfo.productUrl=row.productUrl
                this.DialogVisible = true
            },
            handleChangeBanner(file,fileList){
                this.preBannerUrl=this.bannerInfo.bannerUrl
                this.bannerInfo.bannerUrl=URL.createObjectURL(file.raw)
                this.bannerFileList = fileList
                this.$refs.bannerUpload.clearFiles();
            },
            handleClose(){
                this.bannerInfo.bannerId = null
                this.bannerInfo.productName = ''
                this.bannerInfo.bannerUrl = null
                this.bannerInfo.productUrl = null
            },
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