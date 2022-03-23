<template>
<div class="person_info">
    <el-card class="box-card">
        <div  class="text item">
            <el-form :rules="userInfoFormRules" ref="userInfoFormRef" :model="userInfoForm" label-width="80px">
                <el-form-item label="用户头像">
                    <el-upload
                        class="avatar-uploader"
                        action="#"
                        :limit="1"
                        :show-file-list="false"
                        :on-change="handleChange"
                        :auto-upload="false"
                        accept="image/png,image/gif,image/jpg,image/jpeg"
                        ref="productUpload">
                        <img v-if="userInfoForm.avatarUrl" :src="userInfoForm.avatarUrl" class="avatar">
                        <img v-else :src="require('E:/Java/毕设/优购商城/you_gou_mall_vue/public/img/avatar/defaultAvatar.jpeg')" class="avatar">
                    </el-upload>
                </el-form-item>
                <el-form-item label="当前账户">
                    <el-input style="width: 50%" disabled v-model="userInfoForm.accountNumber" ></el-input>
                </el-form-item>
                <el-form-item label="昵称" prop="userName">
                    <el-input style="width: 50%" v-model="userInfoForm.userName"></el-input>
                </el-form-item>
                <el-form-item label="性别">
                    <el-radio-group class="sexGroup" v-model="userInfoForm.sex">
                        <el-radio-button label="男">男</el-radio-button>
                        <el-radio-button label="女">女</el-radio-button>
                </el-radio-group>
                </el-form-item>
                <el-form-item label="联系电话" prop="telephone">
                    <el-input style="width: 50%" v-model="userInfoForm.telephone"></el-input>
                </el-form-item>
                 <el-form-item>
                    <el-button class="sureModify" @click="changeUserInfo"  type="primary" >确认修改</el-button>
                </el-form-item>
            </el-form>
        </div>
</el-card>
</div>
</template>

<script>
   //这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
   //例如：import 《组件名称》 from '《组件路径》';

   export default {
        //import引入的组件需要注入到对象中才能使用
        name: 'PersonInfo',
        data() {
            // 验证手机号的规则
            const checkMobile = (rule,value,cb) => {
                // 验证手机号的正则表达式
                const regMobile =/^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/
                if(regMobile.test(value)){
                    return cb()
                }
                cb(new Error('请输入合法的手机号'))
            } 
            return {
                // 用户信息校验
                userInfoFormRules:{
                     // 验证用户名
                    userName:[
                        {required:true, message:'请输入昵称',trigger:'blur' },
                        { min:1, max:15, message:'昵称长度为1-15位', trigger:'blur'}
                    ],
                    // 验证用户名
                    telephone:[
                        {required:true, message:'请输入电话号码',trigger:'blur' },
                        { validator:checkMobile, trigger:'blur'}
                    ],
                },
                userInfoForm:null, // 用户信息,
                avatarUrl:null,// 临时存储头像
                acatarList:[],// 临时存储头像列表
                preAvatar:null,
                accountNumber:'',
            }
        },
        created(){
            if(this.$store.getters.getUser!=null){
                this.accountNumber =  this.$store.getters.getUser.accountNumber
            }
            this.getUserInfo()
        },
        methods:{
            // 性别变化时
            async getUserInfo(){
                const result = await this.$http.get('/user/getUserInfo?accountNumber='+this.accountNumber)
                if(result.data.code === 200){
                    this.userInfoForm = result.data.data
                }
            },
            // 修改用户信息
            async changeUserInfo(){
                // 预校验
                this.$refs.userInfoFormRef.validate(async valid => {
                    if(!valid) return; // 验证不通过
                
                if(this.acatarList[0] != null){
                    var fd = new FormData()
                    var face = this.acatarList[0]
                    fd.append("file",this.acatarList[0].raw)
                    this.userInfoForm.password = null
                    fd.append("user",JSON.stringify(this.userInfoForm))

                    if(this.preAvatar != null){
                        const result = await this.$http.post('/userUpload/deleteAvatar?preAvatar='+this.preAvatar)
                        this.preAvatar = null
                    }
                    
                    const result = await this.$http.post('/userUpload/uploadAvatar',fd)
                    if(result.data.code === 200){
                        this.$message.success("修改信息成功!")
                        this.userInfoForm = result.data.data
                        this.userInfoForm.avatarUrl = this.$serve + this.userInfoForm.avatarUrl
                        this.$store.commit('setUser',this.userInfoForm)
                        this.bus.$emit('updateUrl',true)
                    }
                }else{
                    this.userInfoForm.password = null
                    const result = await this.$http.post('/user/updateUserInfo',this.userInfoForm)
                     if(result.data.code == 200){
                        this.$message.success("修改信息成功!")
                        this.userInfoForm = result.data.data
                    }
                }
                })
            },
            // 处理头像变化时
            handleChange(file,fileList){
                if(this.userInfoForm.avatarUrl != null){
                    this.preAvatar = this.userInfoForm.avatarUrl
                }
                this.userInfoForm.avatarUrl=URL.createObjectURL(file.raw)
                this.avatarUrl = URL.createObjectURL(file.raw)
                this.acatarList = fileList
                this.$refs.productUpload.clearFiles();
            }
        }
   }
</script>
<style Lang='less' scoped>
    .person_info{
        width: 60%;
        height: 100%;
        position: relative;
        left: 25%;
    }
    .sureModify{
        position: relative;
        left: 19%;
    }
    .sexGroup{
        position: relative;
        left: -18%;
    }
    /deep/.el-form-item__error {
        left: 25% !important;
    }
    .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  
  .avatar {
    width: 100px;
    height: 100px;
    display: block;
    border-radius: 50%;
  }
</style>