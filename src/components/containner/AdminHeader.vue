<template>
<div class="header_container">
     <!-- 头部区域 -->
     <div class="title">
        <span>优购商城后台管理系统</span>
    </div>
      <div class="frLogined">
            <el-dropdown class="dropdown">
                <el-avatar :src="adminAvatarUrl" @error="errorHandler" class="el-avatar">
                    <img src="http://localhost:8082/avatar/defaultAvatar.jpeg" alt="默认头像"/>
                </el-avatar>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="toIndex()">首页</el-dropdown-item>
                    <el-dropdown-item @click.native="toPersonCenter()">个人中心</el-dropdown-item>
                    <el-dropdown-item @click.native="logout()">退出登录</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>

        <el-drawer
        title="个人中心"
        :visible.sync="drawer"
        direction="rtl"
        :before-close="handleDrawerClose">
        <div class="demo-drawer__content">
        <el-form :rules="adminInfoFormRules" ref="adminInfoFormRef" label-width="80px"  :model="adminInfo" label-position="left">
            <el-form-item  label="用户头像">
                <el-upload style="width: 70%"
                    ref="avatarUpload"
                    class="avatar-uploader"
                    autocomplete="off"
                    action="#"
                    :limit="1"
                    :show-file-list="false"
                    :on-change="handleChange"
                    :auto-upload="false"
                    accept="image/png,image/gif,image/jpg,image/jpeg">
                    <img v-if="adminInfo.avatarUrl" :src="adminInfo.avatarUrl" class="avatar">
                    <img v-else :src="require('E:/Java/毕设/优购商城/you_gou_mall_vue/public/img/avatar/defaultAvatar.jpeg')" class="avatar">
                </el-upload>
            </el-form-item>
            <el-form-item  style="width: 70%" label="账户：" >
                <el-input autocomplete="off" disabled v-model="adminInfo.adminNumber" ></el-input>
            </el-form-item>
            <el-form-item prop="adminName" style="width: 70%"  label="名称：" >
                <el-input autocomplete="off" v-model="adminInfo.adminName" ></el-input>
            </el-form-item>
            <el-form-item  style="width: 70%" label="性别：">
                <el-radio-group autocomplete="off"  class="sexGroup" v-model="adminInfo.sex">
                    <el-radio-button label="男">男</el-radio-button>
                    <el-radio-button label="女">女</el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item prop="telephone"  style="width: 70%" label="电话：" >
                <el-input autocomplete="off"  v-model="adminInfo.telephone" ></el-input>
            </el-form-item>
            </el-form>
             <div class="demo-drawer__footer">
                <el-button @click="cancelForm">取 消</el-button>
                <el-button type="primary" @click="sumitUpdate" :loading="loading">确 定</el-button>
            </div>
        </div>
        </el-drawer>
</div>
</template>

<script>
   //这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
   //例如：import 《组件名称》 from '《组件路径》';

   export default {
        //import引入的组件需要注入到对象中才能使用
        name: 'AdminHeader',
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
                 drawer: false,
                 adminInfo:{
                    adminId:null,
                    adminNumber:'',
                    adminName:'',
                    password:'',
                    sex:'男',
                    telephone:'',
                    createTime:'',
                    adminState:'',
                    avatarUrl:'',
                 },
                 avatarList:[],
                 preAvatar:null,
                 adminInfoFormRules:{
                      // 验证用户名
                    adminName:[
                        {required:true, message:'请输入昵称',trigger:'blur' },
                        { min:1, max:15, message:'昵称长度为1-15位', trigger:'blur'}
                    ],
                    // 验证用户名
                    telephone:[
                        {required:true, message:'请输入电话',trigger:'blur' },
                        { validator:checkMobile, trigger:'blur'}
                    ],
                 }
                 
            }
        },
        created() {
            this.getAvatarUrl()
        },
        methods: {
            //这里需要把store 动态的数据放到computed里面才会同步更新 视图
            getAvatarUrl(){
                if(this.$store.state.admin!=null){
                    this.adminAvatarUrl = this.$store.state.admin.avatarUrl
                }
            },
            errorHandler(){
                this.adminAvatarUrl = 'http://localhost:8082/avatar/defaultAvatar.jpeg'
            },
            clearInfo(){
                this.$message({showClose: true, message: '退出成功', duration:1000, type: 'success',});
                //调转到login界面
                this.$router.replace({path:'/admin/login'})
                this.$store.commit('setAdminToken',null)
                this.$store.commit('setAdmin',null)
                this.$store.commit('setAdminRole',null)
                this.$store.commit('setAdminRoleInfo',null)
                sessionStorage.clear()
            },
            // 系统首页
            toIndex(){
                this.$router.push({path:'/admin/index'})
            },
            // 去个人中心
            async toPersonCenter(){    
                const result = await this.$http.get('/userAdmin/getAdminById/'+this.$store.getters.getAdmin.adminId)
                if(result.data.code === 200){
                    this.adminInfo = result.data.data
                }
                console.log(this.adminInfo);
                this.drawer = true
            },
            handleDrawerClose(){
                this.drawer = false
                this.$refs.adminInfoFormRef.resetFields()
            },
            cancelForm(){
                this.drawer = false
                this.$refs.adminInfoFormRef.resetFields()
            },
            // 处理头像变化时
            handleChange(file,fileList){
                if(this.adminInfo.avatarUrl != null){
                    this.preAvatar = this.adminInfo.avatarUrl
                }
                this.adminInfo.avatarUrl=URL.createObjectURL(file.raw)
                this.avatarList = fileList
                this.$refs.avatarUpload.clearFiles();
            },
            sumitUpdate(){
                // 预校验
                this.$refs.adminInfoFormRef.validate(async valid => {
                    if(!valid) return; // 验证不通过

                    if(this.avatarList[0] != null){
                        var fd = new FormData()
                        var face = this.avatarList[0]
                        fd.append("file",this.avatarList[0].raw)
                        this.adminInfo.password = null
                        fd.append("admin",JSON.stringify(this.adminInfo))

                        if(this.preAvatar != null){
                            const result = await this.$http.delete('/userAdmin/deleteAdminAvatar?avatarUrl='+this.preAvatar)
                            this.preAvatar = null
                        }
                        
                        const result = await this.$http.post('/userAdmin/updateAdminWithUrl',fd)
                        if(result.data.code === 200){
                            this.$message.success("修改信息成功!")
                            this.adminInfo = result.data.data
                            this.$store.commit('setAdmin',this.adminInfo)
                            this.getAvatarUrl()
                        }
                    }else{
                        this.adminInfo.password = null
                        this.adminInfo.avatarUrl = null
                        const result = await this.$http.post('/userAdmin/updateAdmin',this.adminInfo)
                        if(result.data.code == 200){
                            this.$message.success("修改信息成功!")
                            this.adminInfo = result.data.data
                            console.log(this.adminInfo);
                        }
                    }
                })
            },
            // 退出登录
            async logout(){
                const res = await this.$confirm('您确定要退出吗？', '温馨提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => {
                    return err
                })
                if(res == 'confirm'){
                     await this.$http.post('/userAdmin/logout')
                    let loading = this.$loading({lock: true, text: "正在退出",background:"rgba(255,255,255,0.5)"});
                    this.clearInfo()
                    loading.close()
                }
            }

        },
   }
</script>
<style Lang='less' scoped>
    .header_container{
        height: 100%;
        background-color: rgb(51, 51, 51);
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .frLogined{
        cursor: pointer;
        margin-top: 5px;
        margin-right: 15%;
    }
    .frLogined .dropdown{
        height: 35px;
        width: 35px;
        cursor:pointer;
    }
    .title{
        justify-content: center;
        color: rgb(176, 176, 164);
        font-size: 28px;
    }
    .avatar{
        width: 100px;
        height: 100px;
        display: block;
        border-radius: 50%;
    }
    /deep/.demo-drawer__content{
        margin-left: 10%;
    }
    .demo-drawer__footer{
        position: absolute;
        right: 5%;
        bottom: 5%;
    }
</style>