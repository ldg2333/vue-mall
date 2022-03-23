<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" >
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="example" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            今日销售额
          </div>
          <count-to suffix=" 元" :decimals='2' :start-val="0" :end-val="orderInfo.todayOrderMoney" :duration="2600" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" >
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="money" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            昨日销售额
          </div>
          <count-to suffix=" 元" :decimals='2' :start-val="0" :end-val="orderInfo.yesterdayOrderMoney" :duration="3000" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="dashboard" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            今日待付款
          </div>
          <count-to suffix=" 元" :decimals='2' :start-val="0" :end-val="orderInfo.todayNoPayOrderMoney" :duration="3200" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-shopping">
          <svg-icon icon-class="shopping" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            订单已发货
          </div>
          <count-to suffix=" 单" :start-val="0" :end-val="orderInfo.sendGoodsCount" :duration="3600" class="card-panel-num" />
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'
export default {
  components: {
    CountTo
  },
  data() {
    return {
      orderInfo: null,
    }
  },
  created(){
    this.getOrderInfo()
  },
  methods: {
   async getOrderInfo(){
      const result = await this.$http.get('/orderAdmin/getOrderData')
      if(result.data.code === 200){
        this.orderInfo = result.data.data
        this.bus.$emit('orderInfo',this.orderInfo)
      }
    }
  }
}
</script>

<style  scoped>

.panel-group {
  margin-top: 18px;
}
.panel-group .card-panel-col {
  margin-bottom: 32px;
}
.panel-group .card-panel {
  height: 108px;
  cursor: pointer;
  font-size: 12px;
  position: relative;
  overflow: hidden;
  color: #666;
  background: #fff;
  box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
  border-color: rgba(0, 0, 0, 0.05);
}
.panel-group .card-panel:hover .card-panel-icon-wrapper {
  color: #fff;
}
.panel-group .card-panel:hover .icon-people {
  background: #40c9c6;
}
.panel-group .card-panel:hover .icon-message {
  background: #36a3f7;
}
.panel-group .card-panel:hover .icon-money {
  background: #f4516c;
}
.panel-group .card-panel:hover .icon-shopping {
  background: #34bfa3;
}
.panel-group .card-panel .icon-people {
  color: #40c9c6;
}
.panel-group .card-panel .icon-message {
  color: #36a3f7;
}
.panel-group .card-panel .icon-money {
  color: #f4516c;
}
.panel-group .card-panel .icon-shopping {
  color: #34bfa3;
}
.panel-group .card-panel .card-panel-icon-wrapper {
  float: left;
  margin: 14px 0 0 14px;
  padding: 16px;
  transition: all 0.38s ease-out;
  border-radius: 6px;
}
.panel-group .card-panel .card-panel-icon {
  float: left;
  font-size: 48px;
}
.panel-group .card-panel .card-panel-description {
  float: right;
  font-weight: bold;
  margin: 26px;
  margin-left: 0px;
}
.panel-group .card-panel .card-panel-description .card-panel-text {
  line-height: 18px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 16px;
  margin-bottom: 12px;
}
.panel-group .card-panel .card-panel-description .card-panel-num {
  font-size: 20px;
}

@media (max-width: 550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;
  }
  .card-panel-icon-wrapper .svg-icon {
    display: block;
    margin: 14px auto !important;
    float: none !important;
  }
}
</style>
