<template>
<div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/admin/index' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
        <!-- 增删改查区域 -->
        <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="角色：">
                <el-input @clear='getAllRole' v-model="queryRoleInfo" clearable  placeholder="请输入角色"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getAllRole">查询</el-button>
                <el-button v-if="isSuperManager" @click="addRole" type="success" >添加</el-button>
            </el-form-item>
        </el-form> 

        <el-table
            :data="roleList"
            stripe
            height="500"
            border
            style="width: 100%">
            <el-table-column width="180" align="center" label="#" type="index"></el-table-column>
            <el-table-column align="center" prop="roleName" label="角色" >
            </el-table-column>
             <el-table-column align="center" label="状态">
                <template slot-scope="scope">
                <el-switch :disabled='scope.row.roleName == "超级管理员"'
                    @change="handleStatusChange(scope.row.roleId,scope.row)"
                    v-model="scope.row.roleState"
                    :active-value="1" 
                    :inactive-value="0"
                    active-text="启用"
                    inactive-text="禁用">
                    </el-switch>
            </template>
            </el-table-column>
            <el-table-column align="center" width='200' label="操作" >
                <template slot-scope="scope">
                    <el-tooltip :enterable='false'  effect="dark" content="修改" placement="top">
                        <el-button :disabled='scope.row.roleName == "超级管理员"' @click="showModifyRole(scope.row)"  type="primary">修改</el-button>
                    </el-tooltip>
                    <el-tooltip :enterable='false'  effect="dark" content="删除" placement="top">
                        <el-button :disabled='scope.row.roleName == "超级管理员"' @click="deleteProductBrand(scope.row.roleId)"  type="danger">删除</el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
    </el-card>

    <el-dialog
        title="编辑"
        :visible.sync="dialogVisible"
        width="30%"
        @close="handleClose">
       <el-form label-width="80px" :rules="addFormRules"  ref="addFormRef" :model="roleInfo">
        <el-form-item prop="roleName"  label="角色：">
            <el-input v-model="roleInfo.roleName" ></el-input>
        </el-form-item>
        <el-form-item label="状态：">
                    <el-switch
                    v-model="roleInfo.roleState"
                    :active-value="1" 
                    :inactive-value="0"
                    active-text="启用"
                    inactive-text="禁用">
                    </el-switch>
                </el-form-item>
    </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="submitRole">确 定</el-button>
  </span>
</el-dialog>

</div>
</template>

<script>
   //这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
   //例如：import 《组件名称》 from '《组件路径》';

   export default {
        //import引入的组件需要注入到对象中才能使用
        name: 'Authority',
        data() {
            return {
                isSuperManager:false,
                queryRoleInfo:"",
                roleList:null,
                dialogVisible:false,
                roleInfo:{
                    roleId:null,
                    roleName:'',
                    roleState:1
                },
                addFormRules:{
                    roleName:[{ required: true, message: '请填写角色', trigger: 'blur' }]
                },
            }
        },
        created(){
            let curAdminRole = this.$store.getters.getAdminRole
            curAdminRole.forEach(item => {
                if(item == '超级管理员')
                    this.isSuperManager =true
            });
            this.getAllRole()
        },
        methods:{
            async getAllRole(){
                const result = await this.$http.get('/roleAdmin/getAllRoleByName?roleName='+this.queryRoleInfo)
                if(result.data.code === 200){
                    this.roleList = result.data.data
                }
            },
            submitRole(){
                // 预校验
                this.$refs.addFormRef.validate(async valid => {
                    if(!valid) return; // 验证不通过

                    if(this.roleInfo.roleId == null){
                        const result = await this.$http.post('/roleAdmin/addRole',this.roleInfo)
                        if(result.data.code === 200){
                            this.$message.success("添加信息成功")
                            this.dialogVisible = false
                            this.handleClose()
                            this.getAllRole()
                        }
                    }else{
                        const result = await this.$http.put('/roleAdmin/updateRole',this.roleInfo)
                        if(result.data.code === 200){
                            this.$message.success("修改信息成功")
                            this.dialogVisible = false
                            this.handleClose()
                            this.getAllRole()
                        }
                    }
                })
            },
            async deleteProductBrand(roleId){
                // 先弹框
                const res = await this.$confirm('此操作将永久删除权限, 是否继续?', '提示', 
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => {
                    return err
                })
                // 再删除(确认删除 res = confirm 取消 res = cancel)
                if(res == 'cancel')
                    return;
                const result = await this.$http.delete('/roleAdmin/deleteRole?roleId='+roleId)
                 if(result.data.code === 200){
                        this.$message.success("删除成功")
                        this.getAllRole()
                    }
            },
            handleClose(){
                this.$refs.addFormRef.resetFields()
            },
            addRole(){
                this.roleInfo.roleId = null
                this.roleInfo.roleName = ''
                this.roleInfo.roleState = 1
                this.dialogVisible = true
            },
            showModifyRole(row){
                this.roleInfo = row
                this.dialogVisible = true
            },
            async handleStatusChange(roleId,row){
                let role={
                    roleId:roleId,
                    roleState:row.roleState == 0 ? 0:1 
                }
                const result = await this.$http.put('/roleAdmin/updateRole',role)
                if(result.data.code === 200){
                    this.$message.success("修改状态成功")
                    this.getAllRole()
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