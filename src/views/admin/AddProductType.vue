<template>
<div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/admin/index' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/admin/productType' }">商品类别</el-breadcrumb-item>
        <el-breadcrumb-item>添加商品类型</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card style="width: 50%" class="box-card">
         <el-form ref='addFormRef' :model="productTypeInfo" :rules="addRules" class="demo-form-inline">
        <el-form-item prop="typeUrlTop" label="顶部宣传图：">
            <el-upload   style="width: 550px; height: 200px"
                class="product-upload"
                action="#"
                :limit="1"
                drag
                :show-file-list="false"
                :on-change="handleChangeTop"
                :auto-upload="false"
                accept="image/png,image/gif,image/jpg,image/jpeg"
                ref="topUpload">
            <el-image v-if="productTypeInfo.typeUrlTop"
                        style="width:100%;height:100%;"
                        :src="productTypeInfo.typeUrlTop"
                        fit="fit"/>
            <i v-if="!productTypeInfo.typeUrlTop" class="el-icon-upload"></i>
            <div v-if="!productTypeInfo.typeUrlTop" class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            </el-upload>
        </el-form-item>
        <el-form-item prop="typeName" label="类别  名称：">
            <el-input style="width: 50%" v-model="productTypeInfo.typeName"></el-input>
        </el-form-item>
        <el-form-item prop="typeUrlLeft" label="左侧宣传图：">
            <el-upload  style="width: 280px; height: 300px"
                class="product-upload"
                action="#"
                :limit="1"
                drag
                :show-file-list="false"
                :on-change="handleChangeLeft"
                :auto-upload="false"
                accept="image/png,image/gif,image/jpg,image/jpeg"
                ref="leftUpload">
                <el-image v-if="productTypeInfo.typeUrlLeft"
                        style="width:100%;height:100%;"
                        :src="productTypeInfo.typeUrlLeft"
                        fit="fit"/>
            <i v-if="!productTypeInfo.typeUrlLeft" class="el-icon-upload"></i>
            <div v-if="!productTypeInfo.typeUrlLeft" class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            </el-upload>
        </el-form-item>
        <el-form-item prop="typeDescribe"  label="类别  描述：" >
            <el-input style="width: 50%" type="textarea" v-model="productTypeInfo.typeDescribe"></el-input>
        </el-form-item>
    </el-form>

   <div class="foot">
        <el-button  style="margin: 0 20px;" @click="cancelAdd()">取 消</el-button>
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
        name: 'AddProductType',
        data() {
            return {
                productTypeInfo:{
                    typeName:'',
                    typeUrlLeft:'',
                    typeUrlTop:'',
                    typeDescribe:''
                },
                addRules:{
                    typeName: [{ required: true, message: '请填写类型名称', trigger: 'blur' },
                        { min: 1, max: 20, message: '名称长度不允许超过 20 个字符', trigger: 'blur' }],
                    typeDescribe: [{ required: true, message: '请填写类别介绍', trigger: 'blur' },
                        { min: 1, max: 100, message: '名称长度不允许超过 100 个字符', trigger: 'blur' }],
                    typeUrlLeft: [{ required: true, message: '请上传左侧宣传图片', trigger: 'blur' }],
                    typeUrlTop: [{ required: true, message: '请上传顶部宣传图片', trigger: 'blur' }],
                },
                typeLeftUrlList:[],
                typeTopUrlList:[],
            }
        },
        methods:{
            // 取消新增
            cancelAdd(){
                this.$router.push({path:'/admin/productType'})
            },
            // 确认新增
            submitAdd(){
                 // 预校验
                this.$refs.addFormRef.validate(async valid => {
                    if(!valid) return; // 验证不通过

                    let fd = new FormData()
                    fd.append("file",this.typeLeftUrlList[0].raw)
                    fd.append("file2",this.typeTopUrlList[0].raw)
                    fd.append("productType",JSON.stringify(this.productTypeInfo))
                    const result = await this.$http.post('/PTAdmin/addProductType',fd)
                    if(result.data.code === 200){
                        this.$message.success(result.data.message)
                        this.$router.push({path:'/admin/productType'})
                    }
                })
            },
            // 左侧视图
            handleChangeLeft(file,fileList){
                console.log("更改左侧图");
                this.productTypeInfo.typeUrlLeft=URL.createObjectURL(file.raw)
                this.typeLeftUrlList = fileList
                this.$refs.leftUpload.clearFiles();
            },
            // 顶部视图
            handleChangeTop(file,fileList){
                console.log("更改顶部图");
                this.productTypeInfo.typeUrlTop=URL.createObjectURL(file.raw)
                this.typeTopUrlList = fileList
                this.$refs.topUpload.clearFiles();
            },
        }
   }
</script>
<style Lang='less' scoped>
    .box-card{
        position: relative;
        left: 25%;
        top: 25%;
    }
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
    /deep/.el-upload{
         width: 100%;
      height: 100%;
    }

  .product-upload:hover {
    border-color: #409EFF;
  }
  /deep/.el-upload-dragger{
      border: none;
      width: 100%;
      height: 100%;
  }
  

</style>