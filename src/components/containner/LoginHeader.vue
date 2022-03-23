<template>
<div class="container">
    <div class="image">
        <el-image @click="toIndex" class="img" src="../../assets/img/logo.jpeg" :onerror="errorImage"></el-image>
    </div>
</div>
</template>

<script>
   //这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
   //例如：import 《组件名称》 from '《组件路径》';

   export default {
       //import引入的组件需要注入到对象中才能使用
        name: 'LoginHeader',
        data() {
            return {
                errorImage:'this.src="' + require('../../assets/img/logo.jpeg') + '"'
            }
        },
        methods:{
             // 去首页
            toIndex(){
                this.$router.push("/mall/index")
            },
        }
   }
</script>
<style Lang='less' scoped>
    .container{
        width: 100%;
        height: 15%;
        background-color: rgb(255, 255, 255);
    }
    .image{
        position: relative;
    }
    .image:hover{
        cursor: pointer;
    }
    .img{
        position: relative;
        top: 35px;
        left: 20%;
    }
</style>