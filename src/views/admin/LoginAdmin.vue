<template>
<div  class="login_container">
        <div class="login_box">
         <!-- 登录表单区域 -->
        <el-form ref="loginFormRef" :rules="loginFromRules" 
        :model="loginForm" label-width="0px" class="login_form">
            <h1 class="title">优购商城后台管理系统</h1>
            <!-- 用户名 -->
            <el-form-item prop='adminNumber'>
                <el-input v-model="loginForm.adminNumber" prefix-icon="iconfont icon-User" placeholder="用户名"></el-input>
            </el-form-item>

            <!-- 密码 -->
            <el-form-item prop='password'>
                <el-input type='password' v-model="loginForm.password" prefix-icon="iconfont icon-mima" placeholder="密码"></el-input>
            </el-form-item>

            <!-- 按钮区域 -->
            <el-form-item class="btns">
                 <el-button @click="login" type="primary">登录</el-button>
            </el-form-item>
        </el-form>
    </div>
</div>

</template>

<script>
   //这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
   //例如：import 《组件名称》 from '《组件路径》';
   export default {
        //import引入的组件需要注入到对象中才能使用
        name: 'Login',
        data() {
            return {
                // 登录表单的数据绑定对象
                loginForm:{
                    adminNumber:'',
                    password:''
                },
                // 表单验证规则对象
                loginFromRules:{
                    // 验证用户名
                    adminNumber:[
                        {required:true, message:'请输入用户名',trigger:'blur' },
                        { min:11, max:11, message:'必须为11位数的手机号码', trigger:'blur'}
                    ],
                    // 验证密码
                    password:[
                        { required:true, message:'请输入密码',trigger:'blur' },
                       { min:6, max:15, message:'长度在 6 到 15 个字符之间', trigger:'blur'}
                    ]
                },
            }
        },
        methods: {
            login(){
                // 登录预校验
                this.$refs.loginFormRef.validate(async valid => {
                    if(!valid) return; // 验证不通过

                     console.log(this.loginForm);

                     let loading = this.$loading({lock: true, text: "登录中",background:"rgba(255,255,255,0.1)"});
                     const result = await this.$http.post('userAdmin/login',this.loginForm)
                     switch(result.data.data){
                     case 501: case 502: case 503:
                        this.$refs.loginFormRef.resetFields()
                        loading.close();
                        return this.$message.error(result.data.message); 
                     }
                     if(result.data.code == 200){
                        this.$message.success(result.data.message);
                        // 将当前用户名保存到 sessionStorage
                        // 方便后续操作
                        let token = result.data.data.token;
                        let role = result.data.data.role;
                        let admin = result.data.data.admin;
                        let roleInfo = result.data.data.roleInfo;

                        this.$store.commit('setAdminToken',token)
                        this.$store.commit('setAdminRole',role)
                        this.$store.commit('setAdmin',admin)
                        this.$store.commit('setAdminRoleInfo',roleInfo)
                        window.sessionStorage.setItem("store",JSON.stringify(this.$store.state))
                        // 通过编程式导航到首页 路由地址是 /index
                        this.$router.push('/admin/index')
                        loading.close();
                     }
                     
                  
                })
            },     
        },  
   }
</script>
<style Lang='less' scoped>
    .login_container{
        background-color: #2b4b6b;
        height: 100%;
    }

    .login_box{
        width: 450px;
        height: 300px;
        background-color: rgba(0, 0, 0, 0.1);
        border-radius: 3px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
    }

    .login_form{
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 0 20px;
        box-sizing: border-box;
    }
    .title{
        display: flex;
        justify-content: center;
        color: #fff;
    }

    .title:hover{
        animation: Glow 1.5s ease infinite alternate;
    }

    .btns{
        display: flex;
        justify-content: center;
    }

    @keyframes Glow {
    from {
        text-shadow: 0 0 10px #fff,
                     0 0 20px #fff,
                     0 0 30px #fff,
                     0 0 40px #ccc,
                     0 0 70px #ccc,
                     0 0 80px #00a67c,
                     0 0 100px #00a67c,
                     0 0 150px #00a67c;
    }
    to {
        text-shadow: 0 0 5px #fff,
                     0 0 10px #fff,
                     0 0 15px #fff,
                     0 0 20px #ccc,
                     0 0 35px #ccc,
                     0 0 40px #00a67c,
                     0 0 50px #00a67c,
                     0 0 75px #00a67c;
    }
}

</style>