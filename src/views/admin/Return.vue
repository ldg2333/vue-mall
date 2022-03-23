<template>
<div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/admin/index' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>退货原因</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
        <!-- 增删改查区域 -->
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="类型名称">
                  <el-input @clear='queryReason' v-model="queryReasonInfo" clearable  placeholder="请输入名称"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="queryReason">查询</el-button>
                  <el-button @click="addReason" type="success" >添加</el-button>
                </el-form-item>
            </el-form> 

            <el-table
            :data="reasonList"
            stripe
            height="500"
            border
            style="width: 100%">
            <el-table-column width="180" align="center" label="#" type="index"></el-table-column>
            <el-table-column align="center" prop="reasonName" label="退款原因" >
            </el-table-column>
            <el-table-column align="center" label="状态">
                <template slot-scope="scope">
                <el-switch
                    @change="handleStatusChange(scope.row.reasonId,scope.row)"
                    v-model="scope.row.status"
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
                        <el-button @click="showModifyReason(scope.row.reasonId,scope.row)"  type="primary">修改</el-button>
                    </el-tooltip>
                    <el-tooltip :enterable='false'  effect="dark" content="删除" placement="top">
                        <el-button @click="deleteReason(scope.row.reasonId)"  type="danger">删除</el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
    </el-card>

    <el-dialog
    title="提示"
    :visible.sync="DialogVisible"
    width="30%"
    @close="handleClose">
    <el-form class="info-form" inline :rules="updateRules" :model="updateReasonInfo" ref='changeFrom'>
        <el-form-item label="退货原因：" prop="reasonName" style="width: 100%">
          <el-input size="small" v-model="updateReasonInfo.reasonName" placeholder="退货原因"></el-input>
        </el-form-item>
        <el-form-item label="设置状态：">
                    <el-switch
                    v-model="updateReasonInfo.status"
                    :active-value="1" 
                    :inactive-value="0"
                    active-text="启用"
                    inactive-text="禁用">
                    </el-switch>
                </el-form-item>
      </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="DialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitReturn">确 定</el-button>
    </span>
    </el-dialog>
</div>
</template>

<script>
   //这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
   //例如：import 《组件名称》 from '《组件路径》';

   export default {
        //import引入的组件需要注入到对象中才能使用
        name: 'Return',
        data() {
            return {
                queryReasonInfo:'',
                reasonList:null,
                DialogVisible:false,
                updateReasonInfo:{
                    reasonId:null,
                    status:null,
                    reasonName:''
                },
                updateRules:{
                    reasonName: [{ required: true, message: '请输入退货原因', trigger: 'blur' },
              { min: 1, max: 30, message: '退货原因长度不允许超过 30 个字符', trigger: 'blur' }]
                }
            }
        },
        created(){
            this.getAllReason()
        },
        methods:{
            async getAllReason(){
                const result = await this.$http.get('/returnReason/getAllReasonNoWithState?reasonName='+this.queryReasonInfo)
                if(result.data.code === 200){
                    this.reasonList = result.data.data
                }
            },
            queryReason(){
                 this.getAllReason()
            },
            async handleStatusChange(reasonId,row){
                let info ={
                    reasonId:reasonId,
                    status:null
                }
                let status = row.status == 0 ? 0:1 
                info.status = status
                const result = await this.$http.post('/returnReason/updateReasonState',info)
                if(result.data.code === 200){
                    this.$message.success("修改状态成功")
                    this.getAllReason()
                }

            },
            addReason(){
                this.updateReasonInfo.reasonId = null
                this.updateReasonInfo.reasonName = ''
                this.updateReasonInfo.status = 1
                this.DialogVisible = true
            },
            showModifyReason(reasonId,row){
                this.updateReasonInfo.reasonId = reasonId
                this.updateReasonInfo.reasonName = row.reasonName
                this.updateReasonInfo.status = row.status
                this.DialogVisible = true
                console.log(this.updateReasonInfo);
            },
            async deleteReason(reasonId){
                // 先弹框
                const res = await this.$confirm('此操作将永久删除当前退款原因, 是否继续?', '提示', 
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
                const result = await this.$http.delete('/returnReason/deleteReason?reasonId='+reasonId)
                if(result.data.code === 200){
                    this.$message.success("删除成功")
                    this.getAllReason()
                }
            },
            async submitReturn(){
                if(this.updateReasonInfo.reasonId == null){
                    const result = await this.$http.post('/returnReason/addReason',this.updateReasonInfo)
                    if(result.data.code === 200){
                        this.$message.success("新增退款原因成功")
                        this.getAllReason()
                        this.DialogVisible = false
                    }
                }else{
                    const result = await this.$http.post('/returnReason/updateReasonState',this.updateReasonInfo)
                    if(result.data.code === 200){
                        this.$message.success("修改状态成功")
                        this.getAllReason()
                        this.DialogVisible = false
                    }
                }
            },
            handleClose(){  
                this.$refs.changeFrom.resetFields()
            },
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