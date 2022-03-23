import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  // 存储全局变量的数据
  state: {
    userToken:null,  // 商城用户 token 
    adminToken:null, // 管理员 token
    adminRole:null, // 管理员权限
    adminRoleInfo:null, // 管理员权限描述
    user:null, // 商城用户信息
    admin:null, // 管理员信息
  },
  // 提供用来获取state数据的方法
  getters:{
    getUserToken: state => {
      return state.userToken
    },
    getUser: state => {
      return state.user
    },
    getAdmin: state => {
      return state.admin
    },
    getAdminRole: state => {
      return state.adminRole
    },
  },
  // 提供存储设置state数据的方法
  mutations: {
    //设置vuex的userToken
    setUserToken(state,userToken){
      state.userToken=userToken
    },
    //设置vuex的adminToken
    setAdminToken(state,adminToken){
      state.adminToken=adminToken
    },
    //设置角色
    setAdminRole(state,adminRole){
      state.adminRole=adminRole
    },
    //设置角色描述
    setAdminRoleInfo(state,adminRoleInfo){
      state.adminRoleInfo=adminRoleInfo
    },
    //设置当前用户信息
    setUser(state,user){
      state.user=user
    },
    //设置当前管理员信息
    setAdmin(state,admin){
      state.admin=admin
    },
  },
  // 提供跟后台接口打交道的方法，并调用mutations提供的方法
  actions: {
  },
  // 复杂对象
  modules: {
  }
})
