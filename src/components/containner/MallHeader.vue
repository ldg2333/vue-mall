<template>
<div class="header_container">
    <div class="container">
            <!-- 导航栏左侧 -->
            <ul class="fl"> 
                <li @click="toIndex()">优购商城</li>|
                <li @click="toAdmin()" class="adminManager">后台管理系统</li>
            </ul>
            <!-- 导航栏右侧 -->
            <div v-if="this.$store.getters.getUserToken == null" class="fr">
                <li @click="toLogin()">登录</li>|
                <li @click="toRegister()" class="register">注册</li>
            </div>
            <div v-else class="frLogined">
                <el-dropdown class="dropdown">
                    <el-avatar :src="userAvatarUrl" @error="errorHandler" class="el-avatar">
                        <img :src="require('E:/Java/毕设/优购商城/you_gou_mall_vue/public/img/avatar/defaultAvatar.jpeg')" alt="默认头像"/>
                    </el-avatar>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="toIndex()">首页</el-dropdown-item>
                        <el-dropdown-item @click.native="toPersonCenter()">个人中心</el-dropdown-item>
                        <el-dropdown-item @click.native="toOrder()">我的订单</el-dropdown-item>
                        <el-dropdown-item @click.native="logout()">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>

                <div class="shopCart" @click="toShopCart()">
                    <span>购物车({{shopCartCount}})</span>
                </div>
            </div>

    </div>
</div>
</template>

<script>
   //这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
   //例如：import 《组件名称》 from '《组件路径》';

   export default {
        //import引入的组件需要注入到对象中才能使用
        name: 'MallHeader',
        data() {
            return {
                shopCartCount:0,
                To:true,
                accountNumber:'',
                isUpdate:false,
                userAvatarUrl:null,
                isUpdateUrl:false
            }
        },
        async mounted(){    
            this.getShopCartCount()
            this.bus.$on('update',(val)=>{
                this.isUpdate = val
            })
            this.bus.$on('updateUrl',(val)=>{
                this.isUpdateUrl = val
            })
           
        },
        watch:{
            isUpdate(val){
                if(val)
                    this.getShopCartCount()
                this.isUpdate = false
            },
            isUpdateUrl(val){
                if(val)
                    this.getAvatarUrl()
                this.isUpdateUrl = false
            }
        },
        methods:{
            // 图片记载失败时
            errorHandler() {
                return true
            },
            // 去登录页面
            toLogin(){
                this.$router.push("/mall/login")
            },
            // 去注册页面
            toRegister(){
                this.$router.push({path:"/mall/login",name:'LoginMall',params:{To: this.To}})
            },
            // 回首页
            toIndex(){
                this.$router.push("/mall/index")
            },
            // 去订单页
            toOrder(){
                this.$router.push("/mall/Order")
            },
            toAdmin(){
                this.$router.push("/admin/login")
            },
            clearInfo(){
                this.$message({showClose: true, message: '退出成功', duration:1000, type: 'success',});
                //调转到login界面
                this.$router.replace({path:'/mall/login'})
                this.$store.commit('setUserToken',null)
                this.$store.commit('setUser',null)
                sessionStorage.clear()
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
                    let loading = this.$loading({lock: true, text: "正在退出",background:"rgba(255,255,255,0.5)"});
                    this.clearInfo()
                    loading.close()
                }
            },
            // 跳转到购物车
            toShopCart(){
                this.$router.push("/mall/ShopCart")
            },
            async getShopCartCount(){
                if(this.$store.getters.getUser != null){
                    const result = await this.$http.get('/shopCart/shopCartAmount',{params:{userId:this.$store.getters.getUser.userId}})
                    this.shopCartCount = result.data.data
                }
            },
            // 跳转到个人中心页
            toPersonCenter(){
                this.$router.push("/mall/PersonCenter")
            },
            //这里需要把store 动态的数据放到computed里面才会同步更新 视图
            getAvatarUrl(){
                if(this.$store.state.user!=null){
                    this.userAvatarUrl = this.$store.state.user.avatarUrl
                }else{
                    this.userAvatarUrl =  "../../../public/img/avatar/defaultAvatar.jpeg"
                }
            },
        },
        created(){
            this.getAvatarUrl()
        }
   }
</script>
<style Lang='less' scoped>
    .header_container{
        width: 100%;
        height: 100%;
    }
    .container{
        width: 100%;
        height: 100%;
        background-color: rgb(51, 51, 51);
        position: relative;
        font-size: 14px;
    }
    .fl{
        margin: 0;
        padding: 0%;
        color: #b0b0b0;
        list-style: none;
        display: flex;
        position: absolute;
        left: 20%;
        top: 50%;
        transform: translate(-50%,-50%);
    }
    .fl li{ 
        margin-right: 10px;
        cursor: pointer;
    }
    .adminManager{
        margin-left:10px ;
    }
    .fr{
        color: #b0b0b0;
        display: flex;
        position: absolute;
        left: 80%;
        top: 50%;
        list-style: none;
        transform: translate(-50%,-50%);
    }
    .fr li{
        margin-right: 10px;
        cursor: pointer;
    }
    .register{
         margin-left:10px ;
    }
    .frLogined{
        width: 15%;
        height: 100%;
        display: flex;
        position: absolute;
        left: 80%;
        top: 50%;
        transform: translate(-50%,-50%);
        cursor: pointer;
    }
    .frLogined .dropdown{
        height: 35px;
        width: 35px;
        cursor:pointer;
        position: relative;
        top: 50%;
        transform: translate(0%,-50%);
    }
    .frLogined .shopCart{
        width: 30%;
        height: 100%;
        background-color: rgb(27, 174, 174);
        position: relative;
        left: 45%;
        top: 50%;
        transform: translate(-100%,-50%);
        text-align: center;
    }
    .frLogined .shopCart span{
        font-size: 14px;
        color: #fff;
        position: relative;
        top: 35%;
    }
    
</style>