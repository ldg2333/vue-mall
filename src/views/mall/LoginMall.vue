<template>
  <div style="height:80%">
    <LoginHeader></LoginHeader>
    <div class="login_container">
        <div class="login_box">
            <!-- 用户名 -->
            <el-form ref="loginFormRef"  :rules="loginFromRules"
        :model="loginForm" class="login_form">
                <el-form-item prop='accountNumber'>
                    <el-input v-model="loginForm.accountNumber" prefix-icon="iconfont icon-User" placeholder="用户名"></el-input>
                </el-form-item>

                <!-- 密码 -->
                <el-form-item prop='password'>
                    <el-input type='password' v-model="loginForm.password" prefix-icon="iconfont icon-mima" placeholder="密码"></el-input>
                </el-form-item>
                 <el-form-item prop="status">  
                    <SilderVerify :key="timer" @success="handleSuccess" @failed="handleError"></SilderVerify >
                </el-form-item>
                <!-- 按钮区域 -->
                <el-form-item class="btn">
                    <el-button style="width:100%" @click="login" type="primary">登录</el-button>
                </el-form-item>
                <ul class="operate">
                    <li @click="registerDialogVisible=true">免费注册</li>
                    <li>忘记密码</li>
                </ul>
            </el-form>
        </div>
        <!-- 注册区域 -->
        <el-dialog
        title="用户注册"
        :visible.sync="registerDialogVisible"
        width="30%"
        @close="registerDialogClose">
        <el-form :rules="registerFormRules" ref="registerFormRef" :model="registerForm" label-width="80px">
                <el-form-item label="电话号码" prop="accountNumber">
                    <el-input v-model="registerForm.accountNumber"></el-input>
                </el-form-item>
                <el-form-item label="密    码" prop="password">
                    <el-input :type="pwdType" v-model="registerForm.password">
                        <i slot="suffix" class="el-icon-view" @click="showPwd"></i>
                    </el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="confirmPassword">
                    <el-input :type="confirmPwdType" v-model="registerForm.confirmPassword">
                        <i slot="suffix" class="el-icon-view" @click="showconfirmPwd"></i>
                    </el-input>
                </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="registerDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="register">注 册</el-button>
        </span>
        </el-dialog>
    </div>
    <LoginFoot></LoginFoot>
  </div>
</template>

<script>
import LoginHeader from '../../components/containner/LoginHeader.vue'
import LoginFoot from '../../components/containner/LoginFoot.vue'
import SilderVerify from '../../components/SilderVerify/Index.vue'
export default {
  //import引入的组件需要注入到对象中才能使用
  name: "Login", // 商城登录页
  components:{
      LoginHeader,
      LoginFoot,
      SilderVerify
  },
  data() {
    // 验证滑条 
    const validatestatus = (rule, value, cb)=> {
        if (!value) {
            cb(new Error('请拖动滑块完成验证'))
        } else {
            cb()
        }
    }
    // 验证手机号的规则
    const checkMobile = (rule,value,cb) => {
        // 验证手机号的正则表达式
        const regMobile = /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/
        if(regMobile.test(value)){
            return cb()
        }
        cb(new Error('请输入合法的手机号'))
    } 
    // 验证第一次输入的密码
    const validate_password = (rule,value,cb) => {
        if(this.registerForm.confirmPassword){
            if(!(value == this.registerForm.confirmPassword)){
                cb(new Error('两次输入的密码不一致'))
            }else{
                cb()
            }
        }
    }
    // 验证确认密码
    const validate_confirmPassword = (rule,value,cb) =>{
        if(this.registerForm.password){
            if(!(value == this.registerForm.password)){
                cb(new Error('两次输入的密码不一致'))
            }else{
                cb()
            }
        }
    }
    return {
        // 登录表单
        loginForm:{
            status:false,
            accountNumber:'',
            password:''
        },
        // 注册表单
        registerForm:{
            accountNumber:'',
            password:'',
            confirmPassword : ''
        },
        // 登录校验规则
        loginFromRules:{
            // 验证滑条状态
            status: [{ validator: validatestatus, trigger: "change" }],
             // 验证用户名
            accountNumber:[
                {required:true, message:'请输入用户名',trigger:'blur' },
                { min:11, max:11, message:'必须为11位数的手机号码', trigger:'blur'}
            ],
            // 验证密码
            password:[
                { required:true, message:'请输入密码',trigger:'blur' },
                { min:6, max:15, message:'长度在 6 到 15 个字符之间', trigger:'blur'}
            ]
        },
        registerFormRules:{
            // 验证用户名
            accountNumber:[
                {required:true, message:'请输入正确的电话号码',trigger:'blur' },
                { validator:checkMobile, trigger:'blur'}
            ],
            // 验证密码
            password:[
                { required:true, message:'请输入密码',trigger:'blur' },
                { min:6, max:15, message:'长度在 6 到 15 个字符之间', trigger:'blur'},
                {validator:validate_password,trigger:'blur'}
            ],
            // 确认密码验证
            confirmPassword:[
                { required:true, message:'请确认密码',trigger:'blur' },
                { min:6, max:15, message:'长度在 6 到 15 个字符之间', trigger:'blur'},
                {validator:validate_confirmPassword,trigger:'blur'}
            ]
        },
        timer: '', // 用时间戳重新加载子组件
        registerDialogVisible: false, // 注册框默认不可见,
        pwdType : 'password', // 输入框类型
        confirmPwdType : 'password'
    };
  },
  mounted(){
      this.registerDialogVisible = this.$route.params.To
  },
  methods: {
    // 商城用户登录
    login(){
        this.$refs.loginFormRef.validate(async valid => {
            if(!valid) 
                return; // 验证不通过
            let loading = this.$loading({lock: true, text: "登录中",background:"rgba(255,255,255,0.1)"});
            const result = await this.$http.post('user/login',this.loginForm)
            if(result.data.code === 200){
                let token = result.data.data.token;
                let user = result.data.data.user;
                loading.close()
                this.$store.commit('setUserToken',token)
                this.$store.commit('setUser',user)
                sessionStorage.setItem("store",JSON.stringify(this.$store.state))
                this.$router.push('/mall/index')
                return this.$message.success("登录成功"); 
                
            }
            switch(result.data.data){
                case 501: case 502: case 503:
                    this.$refs.loginFormRef.resetFields()
                    this.timer = new Date().getTime()
                    loading.close();
                    return this.$message.error(result.data.message); 
            }
            // this.$router.push('/IndexMall')  
        })
    },
    // 滑动验证成功
    handleSuccess(){
    this.loginForm.status = true
    this.$refs.loginFormRef.validateField("status")
    },
    // 滑动校验失败
    handleError(){
    return new Error('请拖动滑块完成验证')
    },
    // 重置注册框
    registerDialogClose(){
        this.$refs.registerFormRef.resetFields()
    },
    // 显示密码
    showPwd () {
        this.pwdType === 'password' ? this.pwdType = '' : this.pwdType = 'password';
        let e = document.getElementsByClassName('el-icon-view')[0];
        this.pwdType == '' ? e.setAttribute('style', 'color: #409EFF') : e.setAttribute('style', 'color: #c0c4cc');
    },
    // 显示确认密码
    showconfirmPwd(){
        this.confirmPwdType === 'password' ? this.confirmPwdType = '' : this.confirmPwdType = 'password';
        let e = document.getElementsByClassName('el-icon-view')[1];
        this.confirmPwdType == '' ? e.setAttribute('style', 'color: #409EFF') : e.setAttribute('style', 'color: #c0c4cc');
    },
    // 用户注册
    register(){
        this.$refs.registerFormRef.validate(async valid => {
            if(!valid)
                return; // 验证不通过
            let loading = this.$loading({lock: true, text: "正在注册",background:"rgba(255,255,255,0.1)"});
            const result = await this.$http.post('user/register',this.registerForm)
            if(result.data.code === 500){
                this.$refs.registerFormRef.resetFields()
                loading.close();
                return this.$message.error(result.data.message); 
            }else if(result.data.code === 200){
                loading.close();
                this.registerDialogVisible = false
                this.$message.success(result.data.message);
            }
        })
    }
  },
};
</script>
<style Lang='less' scoped>
    .login_container{
        height:85%;
        width: 100%;
        background: url("../../assets/img/login_backgrounp.jpg");
    }
    .login_box{
        width: 450px;
        height: 340px;
         background-color: rgba(255, 255, 255, 0.7);
        border-radius: 3px;
         position: absolute;
        left: 70%;
        top: 25%;
    }
     .login_form{
        position: absolute;
        top: 15%;
        width: 100%;
        padding: 0 20px;
        box-sizing: border-box;
    }
    .btn{
       text-align: center;
    }
    .operateBtn{
        height: 20px;
    }
    .operate{
        list-style:none;
        display: flex;
        justify-content: end;
        font-size:14px;
    }
    .operate li{
        margin-left: 7px;  
    }
    .operate li:hover{
        cursor:pointer
    }
    .el-icon-view:hover{
        cursor:pointer
    }
    
    
</style>