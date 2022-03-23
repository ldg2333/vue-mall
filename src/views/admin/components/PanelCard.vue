<template>
<div class="panelCard_container">
    <div class="un-handle-layout">
      <div class="layout-title">待处理事务</div>
      <div class="un-handle-content">
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">待付款订单</span>
              <span style="float: right" class="color-danger">({{orderInfo.noPayCount}})</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">已完成订单</span>
              <span style="float: right" class="color-danger">({{orderInfo.finishOrderCount}})</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">待确认收货订单</span>
              <span style="float: right" class="color-danger">({{orderInfo.sendGoodsCount}})</span>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">待发货订单</span>
              <span style="float: right" class="color-danger">({{orderInfo.noSendGoodsCount}})</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">待处理退款申请</span>
              <span style="float: right" class="color-danger">({{orderInfo.noDealCount}})</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">已取消订单</span>
              <span style="float: right" class="color-danger">({{orderInfo.cancelCount}})</span>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">待评价订单</span>
              <span style="float: right" class="color-danger">({{orderInfo.waitEvaluateCount}})</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">已评价订单</span>
              <span style="float: right" class="color-danger">({{orderInfo.evaluateCount}})</span>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="overview-layout">
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="out-border">
            <div class="layout-title">商品总览</div>
            <div style="padding: 40px">
              <el-row>
                <el-col :span="6" class="color-danger overview-item-value">{{productInfo.noSale}}</el-col>
                <el-col :span="6" class="color-danger overview-item-value">{{productInfo.isSale}}</el-col>
                <el-col :span="6" class="color-danger overview-item-value">{{productInfo.newProduct}}</el-col>
                <el-col :span="6" class="color-danger overview-item-value">{{productInfo.allProduct}}</el-col>
              </el-row>
              <el-row class="font-medium">
                <el-col :span="6" class="overview-item-title">已下架</el-col>
                <el-col :span="6" class="overview-item-title">已上架</el-col>
                <el-col :span="6" class="overview-item-title">新品商品</el-col>
                <el-col :span="6" class="overview-item-title">全部商品</el-col>
              </el-row>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="out-border">
            <div class="layout-title">用户总览</div>
            <div style="padding: 40px">
              <el-row>
                <el-col :span="6" class="color-danger overview-item-value">{{userInfo.todayUser}}</el-col>
                <el-col :span="6" class="color-danger overview-item-value">{{userInfo.yesterdayUser}}</el-col>
                <el-col :span="6" class="color-danger overview-item-value">{{userInfo.monthUser}}</el-col>
                <el-col :span="6" class="color-danger overview-item-value">{{userInfo.allUser}}</el-col>
              </el-row>
              <el-row class="font-medium">
                <el-col :span="6" class="overview-item-title">今日新增</el-col>
                <el-col :span="6" class="overview-item-title">昨日新增</el-col>
                <el-col :span="6" class="overview-item-title">本月新增</el-col>
                <el-col :span="6" class="overview-item-title">会员总数</el-col>
              </el-row>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
</div>
</template>

<script>
   //这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
   //例如：import 《组件名称》 from '《组件路径》';

   export default {
        //import引入的组件需要注入到对象中才能使用
        name: 'PanelCart',
        data() {
            return {
                orderInfo:null,
                productInfo:null,
                userInfo:null,
            }
        },
        created(){
            this.bus.$on('orderInfo',(val)=>{
                this.orderInfo = val
            })
            this.getProductInfo()
            this.getUserInfo()
        },
        methods:{
            async getProductInfo(){
                const result = await this.$http.get('/productAdmin/getProductInfo')
                if(result.data.code === 200){
                    this.productInfo = result.data.data
                }
            },
            async getUserInfo(){
                const result = await this.$http.get('/userMall/getUserInfo')
                if(result.data.code === 200){
                    this.userInfo = result.data.data
                }
            }
        }
   }
</script>
<style Lang='less' scoped>
.panelCard_container{
  text-align: center;
}
.color-danger {
    color: #f56c6c;
}
  .un-handle-layout {
    margin-top: 20px;
    border: 1px solid #DCDFE6;
  }

  .layout-title {
    color: #606266;
    padding: 15px 20px;
    background: #F2F6FC;
    font-weight: bold;
  }

  .un-handle-content {
    padding: 20px 40px;
  }

  .un-handle-item {
    border-bottom: 1px solid #EBEEF5;
    padding: 10px;
  }

  .overview-layout {
    margin-top: 20px;
  }

  .overview-item-value {
    font-size: 24px;
    text-align: center;
  }

  .overview-item-title {
    margin-top: 10px;
    text-align: center;
  }

  .out-border {
    border: 1px solid #DCDFE6;
  }
 
</style>