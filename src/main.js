import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css'
// v-charts图
import VCharts from 'v-charts'
// 配置 axios
import axios from 'axios'
Vue.prototype.$http = axios
axios.defaults.baseURL='http://127.0.0.1:8082/'
// 配置全局变量
import G from './global/global.js'
Vue.use(G)
// 配置滚动条
import vuescroll from 'vuescroll'
import 'vuescroll/dist/vuescroll.css'
import './icons' // icon
// 配置提示
import { Notification } from 'element-ui'
Vue.use(vuescroll)
Vue.use(VCharts)

// 进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 在 request 拦截器中 展示进度条 NProgress.start(); NProgress.done();
axios.interceptors.request.use(config => {
  NProgress.start();
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

// 在 response 拦截器中 隐藏进度条
axios.interceptors.response.use(config => {
  NProgress.done();
  return config
})

// 使用echarts自定义主题
import echarts from 'echarts'   
import 'echarts/theme/macarons.js'
// 组件通信总线
var bus = new Vue();
Vue.prototype.bus = bus;

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

// 加载动画配置
NProgress.configure({
  easing: 'ease',  // 动画方式
  speed: 500,  // 递增进度条的速度
  showSpinner: false, // 是否显示加载ico
  trickleSpeed: 200, // 自动递增间隔
  minimum: 0.3 // 初始化时的最小百分比
})



