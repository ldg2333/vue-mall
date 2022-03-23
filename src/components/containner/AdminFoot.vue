<template>
<div>
    <div class="footer"><span>Copyright&nbsp;©&nbsp;2020&nbsp;-&nbsp;{{new Date().getFullYear()}}&nbsp;&nbsp;优购商城&nbsp;版权所有</span></div>
</div>
</template>

<script>
   //这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
   //例如：import 《组件名称》 from '《组件路径》';

   export default {
       //import引入的组件需要注入到对象中才能使用
        name: 'AdminFoot'
   }
</script>
<style Lang='less' scoped>
    .footer{
    text-align: center;
    width: auto;
    height: 100%;
    color: rgb(176, 176, 164);
    line-height: 50px;
    font-size: 14px;
    user-select: none;
  }
</style>