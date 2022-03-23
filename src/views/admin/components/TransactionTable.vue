<template>
  <el-table height="300px" :data="list" style="width: 100%;">
    <el-table-column label="订单编号" >
      <template slot-scope="scope">
        {{ scope.row.orderNo }}
      </template>
    </el-table-column>
    <el-table-column label="下单时间"  align="center">
      <template slot-scope="scope">
        {{ scope.row.orderCreateTime}}
      </template>
    </el-table-column>
    <el-table-column label="付款时间"  align="center">
      <template slot-scope="scope">
        {{ scope.row.orderPayTime}}
      </template>
    </el-table-column>
    <el-table-column label="付款金额"  align="center">
      <template slot-scope="scope">
        ¥{{ scope.row.totalPrice }}
      </template>
    </el-table-column>
    <el-table-column label="订单状态"  align="center">
      <template slot-scope="scope">
          <el-tag v-if="scope.row.orderState==-1" type="info">已取消</el-tag>
          <el-tag v-else-if="scope.row.orderState==0" type="warning">未支付</el-tag>
          <el-tag v-else-if="scope.row.orderState==1" type="success">待发货</el-tag>
          <el-tag v-else-if="scope.row.orderState==2" type="success">已发货</el-tag>
          <el-tag v-else-if="scope.row.orderState==3" type="success">交易成功</el-tag>
          <el-tag v-else-if="scope.row.orderState==4" type="danger">正在退货</el-tag>
          <el-tag v-else-if="scope.row.orderState==5" type="success">退货成功</el-tag>
          <el-tag v-else-if="scope.row.orderState==6" type="success">待评价</el-tag>
          <el-tag v-else-if="scope.row.orderState==7" type="success">已评价</el-tag>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>

export default {
  data() {
    return {
      list: null
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      const result = await this.$http.get('/orderAdmin/selectOrders')
      if(result.data.code === 200){
          this.list = result.data.data
          this.list.forEach(item => {
            item.orderCreateTime = new Date(item.orderCreateTime).toLocaleString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
            if(item.orderPayTime !=null)
              item.orderPayTime = new Date(item.orderPayTime).toLocaleString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
          });
      }
    }
  }
}
</script>
<style scoped>
/deep/ .el-table__body-wrapper::-webkit-scrollbar {
  width: 0;
}
/deep/ .el-table__body-wrapper::-webkit-scrollbar-thumb  {
  background-color: #fff
}
</style>
