<template>
<div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/admin/index' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>管理员用户</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
        <!-- 增删改查区域 -->
        <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="帐户/姓名：">
                <el-input @clear='getAllAdmin' v-model="queryAdminInfo" clearable  placeholder="请输入账户/姓名"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getAllAdmin">查询</el-button>
                <el-button v-if="isSuperManager" @click="addAdmin" type="success" >添加</el-button>
            </el-form-item>
        </el-form> 

        <el-table
            :data="adminList"
            stripe
            height="500"
            border
            style="width: 100%">
            <el-table-column width="80" align="center" label="#" type="index"></el-table-column>
            <el-table-column width="150" align="center" prop="adminNumber" label="账号" >
            </el-table-column>
            <el-table-column width="150" align="center" prop="adminName" label="姓名" >
            </el-table-column>
            <el-table-column align="center" label="权限列表" >
                <template slot-scope="scope">
                    <span v-for="(item,index) in scope.row.roleList" :key='index'>
                        <el-tag style='margin-left:5px;margin-top:5px;'  type="success">{{item.roleName}}</el-tag>
                    </span>
                </template>
            </el-table-column>
            <el-table-column width="150" align="center" prop="telephone" label="电话" >
            </el-table-column>
            <el-table-column align="center" prop="createTime" width="150" label="注册时间" >
            </el-table-column>
            <el-table-column width="150" align="center" label="状态">
                <template slot-scope="scope">
                <el-switch 
                    :disabled='currentAdimdId == scope.row.adminId || !isSuperManager'
                    @change="handleStatusChange(scope.row.adminId,scope.row)"
                    v-model="scope.row.adminState"
                    :active-value="1" 
                    :inactive-value="0"
                    active-text="启用"
                    inactive-text="禁用">
                    </el-switch>
            </template>
            </el-table-column>
            <el-table-column label="操作" width="120" align="center" >
                <template slot-scope="scope">
                    <el-button :disabled='!(currentAdimdId == scope.row.adminId) &&  !isSuperManager'  @click="updateAdmin(scope.row)" type="text" size="small">编辑</el-button> 
                    <el-button  :disabled='currentAdimdId == scope.row.adminId || !isSuperManager' type="text" @click="deleteAdmin(scope.row.adminId,scope.row)" size="small">删除</el-button> 
                </template>
            </el-table-column>
        </el-table>
    </el-card>

    <el-dialog
    top="10vh"
    title="修改管理员信息"
    :visible.sync="updateDialogVisible"
    :close-on-click-modal='false'
    width="30%"
    @close="updateDialogClose">
    
    <el-form ref='updateFormRef' :model="adminInfo" :rules="updateRules" class="demo-form-inline">
        <el-form-item prop="adminNumber" label="账户：">
            <el-input disabled style="width: 50%" v-model="adminInfo.adminNumber"></el-input>
        </el-form-item> 
         <el-form-item prop="password" label="密码：">
            <el-input clearable type="password" style="width: 50%" v-model="adminInfo.password"></el-input>
        </el-form-item>
        <el-form-item prop="adminName" label="昵称：">
            <el-input clearable style="width: 50%" v-model="adminInfo.adminName"></el-input>
        </el-form-item>
        <el-form-item label="权限：" prop="roleListValue">
                <el-cascader
                    :disabled='!isSuperManager'
                    v-if="cascaderShow"
                    :options="AdminOption"
                    :props="{ expandTrigger: 'hover', multiple: true }"
                    v-model="roleListValue"
                    collapse-tags
                    clearable>
                </el-cascader>
            </el-form-item>
        <el-form-item label="性别：">
            <el-radio-group class="sexGroup"  v-model="adminInfo.sex">
                <el-radio-button  label="男">男</el-radio-button>
                <el-radio-button label="女">女</el-radio-button>
            </el-radio-group>
        </el-form-item>
         <el-form-item prop="telephone" label="电话：">
            <el-input clearable  style="width: 50%" v-model="adminInfo.telephone"></el-input>
        </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
        <el-button @click="updateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitUpdateAdmin">确 定</el-button>
    </span>
    </el-dialog>

    <el-dialog
    top="10vh"
    title="添加管理员信息"
    :visible.sync="addDialogVisible"
    :close-on-click-modal='false'
    width="30%"
    @close="addDialogClose">
    
    <el-form ref='addFormRef' :model="addAdminInfo" :rules="updateRules" class="demo-form-inline">
        <el-form-item prop="adminNumber" label="账户：">
            <el-input clearable style="width: 50%" v-model="addAdminInfo.adminNumber"></el-input>
        </el-form-item> 
        <el-form-item prop="adminName" label="昵称：">
            <el-input clearable style="width: 50%" v-model="addAdminInfo.adminName"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码：">
            <el-input clearable type="password" style="width: 50%" v-model="addAdminInfo.password"></el-input>
        </el-form-item>
        <el-form-item label="权限：" prop="addRroleListValue">
                <el-cascader
                    v-if="cascaderShow"
                    :options="AdminOption"
                    :props="{ expandTrigger: 'hover', multiple: true }"
                    v-model="addRroleListValue"
                    collapse-tags
                    clearable>
                </el-cascader>
            </el-form-item>
        <el-form-item label="性别：">
            <el-radio-group class="sexGroup"  v-model="addAdminInfo.sex">
                <el-radio-button label="男">男</el-radio-button>
                <el-radio-button label="女">女</el-radio-button>
            </el-radio-group>
        </el-form-item>
         <el-form-item prop="telephone" label="电话：">
            <el-input clearable  style="width: 50%" v-model="addAdminInfo.telephone"></el-input>
        </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAddAdmin">确 定</el-button>
    </span>
    </el-dialog>

</div>
</template>

<script>
   //这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
   //例如：import 《组件名称》 from '《组件路径》';

   export default {
        //import引入的组件需要注入到对象中才能使用
        name: 'AdminUser',
        data() {
            const checkValue = (rule, value, cb) => {
                if (this.roleListValue.length === 0) {
                    cb(new Error('至少选择一种权限'));
                } else {
                    cb();
                }
            }
            const checkaddRroleListValue = (rule, value, cb) => {
                if (this.addRroleListValue.length === 0) {
                    cb(new Error('至少选择一种权限'));
                } else {
                    cb();
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
            return {
                currentAdimdId:null,
                queryAdminInfo:'',
                adminList:[],
                updateDialogVisible:false,
                addDialogVisible:false,
                adminInfo:{
                    adminId:null,
                    adminName:'',
                    adminNumber:'',
                    password:'',
                    sex:null,
                    telephone:'',
                },
                addAdminInfo:{
                    adminId:null,
                    adminName:'',
                    adminNumber:'',
                    password:'',
                    sex:'男',
                    telephone:'',
                },
                oldPassword:'',
                oldRoleList:[],
                updateRules:{
                     // 验证密码
                    password:[
                        { required:true, message:'请输入密码',trigger:'blur' },
                        { min:6, max:50, message:'长度在 6 到 15 个字符之间', trigger:'blur'}
                    ],
                    adminNumber:[{required:true, message:'请输入正确的电话号码',trigger:'blur' },
                    { validator:checkMobile, trigger:'blur'}],
                    adminName:[
                        { required:true, message:'请输入昵称',trigger:'blur' }
                    ],
                    roleListValue: [{trigger:  'blur', validator: checkValue }],
                    addRroleListValue: [{trigger:  'blur', validator: checkaddRroleListValue }],
                    telephone:[ {required:true, message:'请输入正确的电话号码',trigger:'blur' },
                    { validator:checkMobile, trigger:'blur'}]

                },
                cascaderShow:false,
                AdminOption:[],
                roleListValue:[],
                addRroleListValue:[],
                isUpdate:true,
                curAdminRole:[],
                isSuperManager:false,
                
            }
        },
        created(){
            this.currentAdimdId = this.$store.getters.getAdmin.adminId
            this.curAdminRole = this.$store.getters.getAdminRole
            this.curAdminRole.forEach(item => {
                if(item == '超级管理员')
                    this.isSuperManager =true
            });
            this.getAllAdmin();
            this.getAllRole();
        },
        methods:{
            async getAllAdmin(){
                const result = await this.$http.get('/userAdmin/getAllByKey?key='+this.queryAdminInfo)
                if(result.data.code === 200){
                    this.adminList = result.data.data
                    for (let i = 0; i < this.adminList.length; i++) {
                        this.adminList[i].createTime = new Date(this.adminList[i].createTime).toLocaleString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
                        const res = await this.$http.get('/adminRole/getRolesById?adminId='+this.adminList[i].adminId)
                        if(res.data.code === 200){
                            // this.adminList[i].roleList = res.data.data
                            this.$set(this.adminList[i],'roleList',res.data.data)
                        }
                    }
                }
            },
            async handleStatusChange(adminId,row){
                let admin={
                    adminId:adminId,
                    adminState:row.adminState == 0 ? 0:1 
                }
                const result = await this.$http.post('/userAdmin/updateAdmin',admin)
                if(result.data.code === 200){
                    this.$message.success("修改成功");
                    this.getAllAdmin()
                }
            },
            addAdmin(){
                this.addDialogVisible = true
                this.cascaderShow = true
            },
            addDialogClose(){
                this.$refs.addFormRef.resetFields()
            },
            updateDialogClose(){
                this.adminInfo.adminId= null
                this.adminInfo.adminName= ''
                this.adminInfo.adminNumber= ''
                this.adminInfo.password= ''
                this.oldPassword = ''
                this.adminInfo.sex= null
                this.adminInfo.telephone= ''
                this.roleListValue = []
                this.oldRoleList = []
                this.$refs.updateFormRef.resetFields()
                this.updateDialogVisible = false
                this.cascaderShow = false
            },
            updateAdmin(row){
                this.adminInfo.adminId= row.adminId
                this.oldRoleList = row.roleList
                this.setRoleListValue(row.adminId)
                this.adminInfo.adminName= row.adminName
                this.adminInfo.adminNumber= row.adminNumber
                this.adminInfo.password= row.password
                this.oldPassword = this.adminInfo.password
                this.adminInfo.sex= row.sex
                this.adminInfo.telephone= row.telephone
                this.updateDialogVisible = true
            },
            // 提交修改订单
            submitUpdateAdmin(){
                this.$refs.updateFormRef.validate(async valid => {
                    if(!valid) return; // 验证不通过

                    
                    this.oldRoleList.forEach(item =>{
                        item.adminId = this.adminInfo.adminId 
                    })
                    let temp = []
                    this.roleListValue.forEach(item =>{
                        let adminRole ={adminId:this.adminInfo.adminId,roleId:null}
                        adminRole.roleId = item[0]
                        temp.push(adminRole)
                    })
                    console.log(temp);
                    // 删除旧的权限
                    await this.$http.post('/adminRole/deleteRoleByList',this.oldRoleList)
                    await this.$http.post('/adminRole/addRoleByList',temp)
                    
                    if(this.oldPassword == this.adminInfo.password){
                        this.adminInfo.password = null
                    }
                    const result = await this.$http.post('/userAdmin/updateAdmin',this.adminInfo)
                    if(result.data.code === 200){
                        if(this.adminInfo.adminId === this.currentAdimdId){
                            this.$message.success("修改成功 请重新登录")
                            this.clearInfo()
                            return this.updateDialogVisible = false
                        }
                        this.$message.success("修改成功")
                        this.getAllAdmin()
                        this.updateDialogVisible = false
                    }
                })
                
            },
            clearInfo(){
                //调转到login界面
                this.$router.replace({path:'/admin/login'})
                this.$store.commit('setAdminToken',null)
                this.$store.commit('setAdmin',null)
                this.$store.commit('setAdminRole',null)
                this.$store.commit('setAdminRoleInfo',null)
                sessionStorage.clear()
            },
            submitAddAdmin(){
                this.$refs.addFormRef.validate(async valid => {
                    if(!valid) return; // 验证不通过

                    const result = await this.$http.post('/userAdmin/register',this.addAdminInfo)
                    if(result.data.code === 200){
                        this.$message.success("新增管理员成功")
                        this.getAllAdmin()
                        this.addDialogVisible = false
                    }else{
                        this.$message.error(result.data.message)
                        this.addRroleListValue = []
                        this.addDialogClose()
                    }
                })
            },
            async getAllRole(){
                const result = await this.$http.get('/roleAdmin/getAllRole')
                if(result.data.code === 200){
                    for (let i = 0; i < result.data.data.length; i++) {
                        const element = result.data.data[i];
                        let ele = {value:null,label:null}
                        ele.value = element.roleId
                        ele.label = element.roleName
                        this.AdminOption[i] = ele
                     }
                }
               
            },
            setRoleListValue(adminId){
                for (let i = 0; i < this.adminList.length; i++) {
                    if(adminId == this.adminList[i].adminId){
                        for (let j = 0; j < this.adminList[i].roleList.length; j++) {
                            let item = []
                            item[0] = this.adminList[i].roleList[j].roleId
                            this.roleListValue.push(item)
                        }
                    }
                }
                this.cascaderShow = true
            },
            async deleteAdmin(adminId,row){
                 // 先弹框
                const res = await this.$confirm('此操作将永久删除当前管理员, 是否继续?', '提示', 
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
                if(row.avatarUrl != null){
                    await this.$http.post('/userAdmin/deleteAdminAvatar?'+row.avatarUrl)
                }
                await this.$http.delete('/adminRole/deleteRoleById/'+adminId)
                const result = await this.$http.delete('/userAdmin/deleteAdmin/'+adminId)
                if(result.data.code === 200){
                    this.getAllAdmin()
                    return this.$message.success(result.data.message)
                }
            },
        }
   }
</script>
<style Lang='less' scoped>

</style>