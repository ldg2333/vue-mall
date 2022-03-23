<template>
    <div class="MallFoot_container">
        <div class="container">
            <div class="footer-copyright">
                <div class="copyright">优购商城版权所有 ©2022-{{new Date().getFullYear()}}</div>
            </div>
        </div>    
      </div>
</template>

<script>
   //这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
   //例如：import 《组件名称》 from '《组件路径》';

   export default {
        //import引入的组件需要注入到对象中才能使用
        name: 'MallFoot',
   }
</script>
<style Lang='less' scoped>
    .MallFoot_container{
        height:100% !important;
        background-color: rgb(51, 51, 51);
    }

  .MallFoot_container .container{
    width: 80%;
    height: 100%;
    margin: 0 auto;
  }

  .MallFoot_container .footer-copyright .copyright{
    color: #b0b0b0;
    padding-top: 1%;
    margin-left:40% ;
  }
</style>