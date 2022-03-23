<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import  * as echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    }
  },
  data() {
    return {
      chart: null,
      legendList:[],
      dataList:[]
    }
  },
  created(){
    
  },
  mounted() {

    this.getProductAndType()

    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {

    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        tooltip: {
          trigger: 'item',
          textStyle:{
            color: '#fff',
            fontStyle: 'normal',
            fontWeight: 'normal',
            fontFamily: 'sans-serif',
            fontSize: 14,
          },
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: []
        },
        series: [
          {
            name: '订单分类数据',
            type: 'pie',
            roseType: 'radius',
            radius: [15, 95],
            center: ['50%', '38%'],
            data: [],
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      })
    },
    async getProductAndType(){
        const result = await this.$http.get('/orderAdmin/selectPAndT')
        if(result.data.code === 200){
          for (const index in result.data.data) {
            let idx = parseInt(index)
            let v ={
              value:0,
              name:''
            }
            v.value = result.data.data[idx].productCount
            v.name = result.data.data[idx].productType
            this.dataList[idx] = v
            this.legendList[idx]= result.data.data[idx].productType

            //然后再给饼状图赋值
					this.chart.setOption({
						legend: {
							data: this.legendList,
						},
						series:[{
								data: this.dataList,
							}]
					});

          }
          
        }
    }
  }
}
</script>
