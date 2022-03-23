<template>
<div class="password_container">
    <el-card class="box-card">
        <div  class="text item">
            <el-form :rules="userInfoFormRules" ref="userInfoFormRef" :model="userInfoForm" label-width="80px">
                <el-form-item label="原密码" prop="password">
                    <el-input :type="pwdType" @blur.native.capture="oldPassword" v-model="userInfoForm.password">
                        <i slot="suffix" class="el-icon-view" @click="showPwd"></i>
                    </el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="newPassword">
                    <el-input :type="newPwdType" v-model="userInfoForm.newPassword">
                        <i slot="suffix" class="el-icon-view" @click="showNewPwd"></i>
                    </el-input>
                </el-form-item>
                 <el-form-item label="确认密码" prop="confirmPassword">
                    <el-input :type="confirmPwdType" v-model="userInfoForm.confirmPassword">
                        <i slot="suffix" class="el-icon-view" @click="showconfirmPwd"></i>
                    </el-input>
                </el-form-item>
                 <el-form-item>
                    <el-button class="sureModify" @click="changePassword"  type="primary" >确认修改</el-button>
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
        name: 'Password',
        data() {
            // 验证旧的密码
            const validate_oldPwd = (rule,value,cb) => {
                if(value != this.oldPwd){
                    cb(new Error('原密码错误'))
                }
                cb()
            }
            // 验证第一次输入的密码
            const validate_password = (rule,value,cb) => {
                if(this.userInfoForm.confirmPassword){
                        if(!(value == this.userInfoForm.confirmPassword)){
                        cb(new Error('两次输入的密码不一致'))
                    }else{
                        cb()
                    }
                }
            }
            
            // 验证确认密码
            const validate_confirmPassword = (rule,value,cb) =>{
                if(this.userInfoForm.newPassword){
                    if(!(value == this.userInfoForm.newPassword)){
                        cb(new Error('两次输入的密码不一致'))
                    }else{
                        cb()
                    }
                }
            }
            return {
                userInfoFormRules:{
                    // 验证旧密码
                    password:[
                        { required:true, message:'请输入原密码',trigger:'blur' },
                        {validator:validate_oldPwd,trigger:'blur'}
                    ],
                    // 验证新密码
                    newPassword:[
                        { required:true, message:'请输入新密码',trigger:'blur' },
                        { min:6, max:15, message:'长度在 6 到 15 个字符之间', trigger:'blur'},
                        {validator:validate_password,trigger:'blur'}
                    ],
                    // 确认密码验证
                    confirmPassword:[
                        { required:true, message:'请确认新密码',trigger:'blur' },
                        { min:6, max:15, message:'长度在 6 到 15 个字符之间', trigger:'blur'},
                        {validator:validate_confirmPassword,trigger:'blur'}
                    ]
                }, // 校验规则
                // 用户信息
                userInfoForm:{
                    userId:'', // 用户id
                    accountNumber:'', // 当前账户
                    password:'', // 原密码
                    newPassword:'',// 新密码
                    confirmPassword:'', // 确认密码
                },
                pwdType : 'password', // 输入框类型
                newPwdType:'password',
                confirmPwdType : 'password',
                oldPwd:'', // 原密码
            }
        },
        methods:{
            // 校验原密码
            async oldPassword(){
                this.userInfoForm.accountNumber = this.$store.getters.getUser.accountNumber
                const result = await this.$http.post('/user/testPassword',this.userInfoForm)
                if(result.data.code === 200){
                    this.oldPwd = this.userInfoForm.password
                }
            },
            clearInfo(){
                this.$message({showClose: true, message: '退出成功', duration:1000, type: 'success',});
                //调转到login界面
                this.$router.replace({path:'/mall/login'})
                this.$store.commit('setUserToken',null)
                this.$store.commit('setUser',null)
                sessionStorage.clear()
            },
            // 修改密码
            changePassword(){
                this.$refs.userInfoFormRef.validate(async valid => {
                    if(!valid) return; // 验证不通过
                    this.userInfoForm.userId = this.$store.getters.getUser.userId
                    this.userInfoForm.password = this.userInfoForm.newPassword
                    const result = await this.$http.post('/user/updateUserInfo',this.userInfoForm)
                     if(result.data.code == 200){
                        this.$message.success("修改信息成功 请重新登录!")
                        let loading = this.$loading({lock: true, text: "正在退出",background:"rgba(255,255,255,0.5)"});
                        this.clearInfo()
                        loading.close()
                    }
                })
            },
            // 显示密码
            showPwd () {
                this.pwdType === 'password' ? this.pwdType = '' : this.pwdType = 'password';
                let e = document.getElementsByClassName('el-icon-view')[0];
                this.pwdType == '' ? e.setAttribute('style', 'color: #409EFF') : e.setAttribute('style', 'color: #c0c4cc');
            },
            // 显示密码
            showNewPwd () {
                this.newPwdType === 'password' ? this.newPwdType = '' : this.newPwdType = 'password';
                let e = document.getElementsByClassName('el-icon-view')[1];
                this.newPwdType == '' ? e.setAttribute('style', 'color: #409EFF') : e.setAttribute('style', 'color: #c0c4cc');
            },
            // 显示确认密码
            showconfirmPwd(){
                this.confirmPwdType === 'password' ? this.confirmPwdType = '' : this.confirmPwdType = 'password';
                let e = document.getElementsByClassName('el-icon-view')[2];
                this.confirmPwdType == '' ? e.setAttribute('style', 'color: #409EFF') : e.setAttribute('style', 'color: #c0c4cc');
            },
        }
   }
</script>
<style Lang='less' scoped>
    .password_container{
        width: 60%;
        height: 100%;
        position: relative;
        left: 25%;
    }
    .sureModify{
        position: relative;
        left: 19%;
    }
</style>