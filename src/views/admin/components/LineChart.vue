<template>
<div class="statistics-layout">
      <div class="layout-title">订单统计</div>
      <el-row>
        <el-col :xs="24" :sm="24" :lg="4">
          <div style="padding: 20px">
            <div>
              <div style="color: #909399;font-size: 14px">本月订单总数</div>
              <div style="color: #606266;font-size: 24px;padding: 10px 0">{{CompareData.curMonthOrderCount}}</div>
              <div>
                <span v-if="CompareOrderCountM==0" class="color-info" style="font-size: 14px">-%</span>
                <span v-else-if="CompareOrderCountM > 0" class="color-danger" style="font-size: 14px"><i style="clolr:green;" class="el-icon-top"></i>{{CompareOrderCountM}}%</span>
                <span v-else class="color-success" style="font-size: 14px"><i style="clolr:red;" class="el-icon-bottom"></i>{{CompareOrderCountM}}%</span>
                <span style="color: #C0C4CC;font-size: 14px">同比上月</span>
              </div>
            </div>
            <div style="margin-top: 20px;">
              <div style="color: #909399;font-size: 14px">本周订单总数</div>
              <div style="color: #606266;font-size: 24px;padding: 10px 0">{{CompareData.curWeekOrderCount}}</div>
              <div>
                <span v-if="CompareOrderCountW==0" class="color-info" style="font-size: 14px">-%</span>
                <span v-else-if="CompareOrderCountW > 0" class="color-danger" style="font-size: 14px"><i style="clolr:green;" class="el-icon-top"></i>{{CompareOrderCountW}}%</span>
                <span v-else class="color-success" style="font-size: 14px"><i style="clolr:red;" class="el-icon-bottom"></i>{{CompareOrderCountW}}%</span>
                <span style="color: #C0C4CC;font-size: 14px">同比上周</span>
              </div>
            </div>
            <div style="margin-top: 20px;">
              <div style="color: #909399;font-size: 14px">本月销售总额</div>
              <div style="color: #606266;font-size: 24px;padding: 10px 0">{{CompareData.curMonthOrderMoney}}</div>
              <div>
                <span v-if="CompareOrderMoneyM==0" class="color-info" style="font-size: 14px">-%</span>
                <span v-else-if="CompareOrderMoneyM > 0" class="color-danger" style="font-size: 14px"><i style="clolr:green;" class="el-icon-top"></i>{{CompareOrderMoneyM}}%</span>
                <span v-else class="color-success" style="font-size: 14px"><i style="clolr:red;" class="el-icon-bottom"></i>{{CompareOrderMoneyM}}%</span>
                <span style="color: #C0C4CC;font-size: 14px">同比上月</span>
              </div>
            </div>
            <div style="margin-top: 20px;">
              <div style="color: #909399;font-size: 14px">本周销售总额</div>
              <div style="color: #606266;font-size: 24px;padding: 10px 0">{{CompareData.curWeekOrderMoney}}</div>
              <div>
                <span v-if="CompareOrderMoneyW==0" class="color-info" style="font-size: 14px">-%</span>
                <span v-else-if="CompareOrderMoneyW > 0" class="color-danger" style="font-size: 14px"><i style="clolr:green;" class="el-icon-top"></i>{{CompareOrderMoneyW}}%</span>
                <span v-else class="color-success" style="font-size: 14px"><i style="clolr:red;" class="el-icon-bottom"></i>{{CompareOrderMoneyW}}%</span>
                <span style="color: #C0C4CC;font-size: 14px">同比上周</span>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="20">
          <div style="padding: 10px;border-left:1px solid #DCDFE6">
            <el-date-picker
              style="float: right;z-index: 1"
              size="small"
              v-model="orderCountDate"
              type="daterange"
              value-format="yyyy-MM-dd"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="getData()"
              :picker-options="pickerOptions">
            </el-date-picker>
            <div>
              <ve-line
                :data="chartData"
                :legend-visible="false"
                :loading="loading"
                :data-empty="dataEmpty"
                :settings="chartSettings"></ve-line>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
</template>

<script>
   //这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
   //例如：import 《组件名称》 from '《组件路径》';
   import {str2Date} from '@/utils/date';
   export default {
        //import引入的组件需要注入到对象中才能使用
        name: 'LineChart',
        data() {
            return {
                orderCountDate:'',
                loading: false,
                chartData: {
                    columns:  ['date', 'orderCount','orderAmount'],
                    rows: []
                },
                dataEmpty: false,
                pickerOptions: {
                    shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', [start, end]);
                    }
                },
                    {
                    text: '最近三个月',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                    picker.$emit('pick', [start, end]);
                    }
                },
                {
                    text: '最近半年',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 180);
                    picker.$emit('pick', [start, end]);
                    }
                }]
            },
            chartSettings: {
                metrics: ['orderCount', 'orderAmount'],
                dimension: ['date'],
                area:true,
                yAxisType: ['normal', 'normal'],
                axisSite: { right: ['orderAmount']},
                yAxisName: ['订单总数', '订单金额'],
                labelMap: {'orderCount': '订单数量', 'orderAmount': '订单金额'},
            },
            CompareData:null,
            CompareOrderCountM:0,
            CompareOrderMoneyM:0,
            CompareOrderCountW:0,
            CompareOrderMoneyW:0,
            } 
        },
        created(){
            this.getCurrentMonth()
            this.getCompareData()
            this.getData()
        },
        methods: {
            // 获取数据
            async getData(){
                let startTime = this.orderCountDate[0];
                let endTime = this.orderCountDate[1];
                const result = await this.$http.post('/orderAdmin/selectOLC?startTime='+startTime+'&endTime='+endTime)
                if(result.data.code === 200){
                    this.chartData.rows = result.data.data
                }
            },
            async getCompareData(){
                const result = await this.$http.get('/orderAdmin/selectCO')
                if(result.data.code === 200){
                    this.CompareData = result.data.data
                }
                this.setCpData()
            },
            // 默认获取最近一个月的数据
            getCurrentMonth() {
                let date = new Date()
                let month = (date.getMonth())
                console.log(month);
                let day = date.getDate()
                if (month < 10)  month = '0' + month
                if (day < 10)  day = '0' + day
                let startTime = date.getFullYear() + '-' + month + '-' + day
                month = (date.getMonth()+1)
                day = date.getDate()
                if (month < 10)  month = '0' + month
                if (day < 10)  day = '0' + day
                let endTime = date.getFullYear() + '-' + month + '-' + day
                this.orderCountDate=[startTime,endTime];
            },
            setCpData(){
                // 本月销售额
                let curMOrderMoney = this.CompareData.curMonthOrderMoney
                // 上月销售额
                let lastMOrderMoney = this.CompareData.lastMonthOrderMoney
                // 本周销售额
                let curWOrderMoney = this.CompareData.curWeekOrderMoney
                // 上周销售额
                let lastWOrderMoney = this.CompareData.lastWeekOrderMoney
                // 本月订单数
                let curMOrderCount = this.CompareData.curMonthOrderCount
                // 上月订单数
                let lastMOrderCount = this.CompareData.lastMonthOrderCount
                // 本周订单数
                let curWOrderCount = this.CompareData.curWeekOrderCount
                // 上月订单数
                let lastWOrderCount = this.CompareData.lastWeekOrderCount
                // 月销售额同比
                if(curMOrderMoney===0 || lastMOrderMoney===0){
                    this.CompareOrderMoneyM = 0
                }else{
                    this.CompareOrderMoneyM = ((curMOrderMoney-lastMOrderMoney)/lastMOrderMoney*100).toFixed(2)
                }
                // 周销售额同比
                if(curWOrderMoney===0 || lastWOrderMoney===0){
                    this.CompareOrderMoneyW = 0
                }else{
                    this.CompareOrderMoneyW = ((curWOrderMoney-lastWOrderMoney)/lastWOrderMoney*100).toFixed(2)
                }
                // 月订单数同比
                if(curMOrderCount===0 || lastMOrderCount===0){
                    this.CompareOrderCountM = 0
                }else{;
                    this.CompareOrderCountM = ((curMOrderCount-lastMOrderCount)/lastMOrderCount*100).toFixed(2)
                }
                // 周订单数同比
                if(curWOrderCount===0 || lastWOrderCount===0){
                    this.CompareOrderCountW = 0
                }else{
                    this.CompareOrderCountW = ((curWOrderCount-lastWOrderCount)/lastWOrderCount*100).toFixed(2)
                }
            }
        },
   }
</script>
<style Lang='less' scoped>
    .statistics-layout {
        margin-top: 20px;
        border: 1px solid #DCDFE6;
        text-align: center;
    }
    .layout-title {
        color: #606266;
        padding: 15px 20px;
        background: #F2F6FC;
        font-weight: bold;
    }
    .color-danger {
        color: #f56c6c;
        margin-right:5px ;
    }
    .color-success {
        color: #67c23a;
        margin-right:5px ;
    }
    .color-info{
        color: rgb(176, 176, 164);
        margin-right:5px ;
    }
</style>