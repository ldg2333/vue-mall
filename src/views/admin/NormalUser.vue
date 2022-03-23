<template>
<div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/admin/index' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商城用户</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
        <!-- 增删改查区域 -->
        <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="帐户/姓名：">
                <el-input @clear='getAllUser' v-model="queryUserInfo" clearable  placeholder="请输入账户/姓名"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getAllUser">查询</el-button>
            </el-form-item>
        </el-form> 

        <el-table
            :data="userList"
            stripe
            height="500"
            border
            style="width: 100%">
            <el-table-column width="180" align="center" label="#" type="index"></el-table-column>
            <el-table-column label="头像"  align="center">
                <template slot-scope="scope">
                    <el-image v-if="scope.row.avatarUrl" :preview-src-list="[scope.row.avatarUrl]" style="width: 150px; height: 150px" :src="scope.row.avatarUrl"/>
                </template>
                </el-table-column>
            <el-table-column align="center" prop="accountNumber" label="账号" >
            </el-table-column>
            <el-table-column align="center" prop="userName" label="姓名" >
            </el-table-column>
            <el-table-column align="center" prop="sex" label="性别" >
            </el-table-column>
            <el-table-column align="center" prop="telephone" label="电话" >
            </el-table-column>
            <el-table-column align="center" prop="createTime" width="200" label="注册时间" >
            </el-table-column>
            <el-table-column align="center" label="状态">
                <template slot-scope="scope">
                <el-switch
                    @change="handleStatusChange(scope.row.userId,scope.row)"
                    v-model="scope.row.userState"
                    :active-value="1" 
                    :inactive-value="0"
                    active-text="启用"
                    inactive-text="禁用">
                    </el-switch>
            </template>
            </el-table-column>
        </el-table>
    </el-card>
</div>
</template>

<script>
   //这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
   //例如：import 《组件名称》 from '《组件路径》';

   export default {
        //import引入的组件需要注入到对象中才能使用
        name: 'MallUser',
        data() {
            return {
                queryUserInfo:'',
                userList:null,
            }
        },
        created(){
            this.getAllUser()
        },
        methods:{
            async getAllUser(){
                const result = await this.$http.get('/userMall/getAllUser?key='+this.queryUserInfo)
                if(result.data.code === 200){
                    this.userList = result.data.data
                    this.userList.forEach(item => {
                        item.avatarUrl = this.$serve + item.avatarUrl
                        item.createTime = new Date(item.createTime).toLocaleString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
                    });
                }
            },
            async handleStatusChange(userId,row){
                let user={
                    userId:userId,
                    userState:row.userState == 0 ? 0:1 
                }
                console.log(user);
                const result = await this.$http.post('/userMall/updateUserById',user)
                if(result.data.code === 200){
                    this.$message.success("修改成功");
                    this.getAllUser()
                }
            }
        }

   }
</script>
<style Lang='less' scoped>
      /deep/ .el-table__body-wrapper::-webkit-scrollbar {
        width: 0;
    }
    /deep/ .el-table__body-wrapper::-webkit-scrollbar-thumb  {
        background-color: #fff
    }
</style>