import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginMall from '../views/mall/LoginMall.vue'
import IndexMall from '../views/mall/IndexMall.vue'
import ProductMall from '../views/mall/ProductMall.vue'
import Index_Mall from '../views/container/Index_Mall.vue'
import Index_Admin from '../views/container/Index_Admin.vue'
import ProductDetail from '../views/mall/ProductDetail.vue'
import ShopCart from '../views/mall/ShopCart.vue'
import PersonCenter from '../views/mall/PersonCenter.vue'
import PersonInfo from '../views/mall/PersonInfo.vue'
import AddressManage from '../views/mall/AddressManage.vue'
import Password from '../views/mall/Password.vue'
import Order from '../views/mall/Order.vue'
import OrderDetail from '../views/mall/OrderDetail.vue'
import sureOrder from '../views/mall/sureOrder.vue'
import LoginAdmin from '../views/admin/LoginAdmin.vue'
import IndexAdmin from '../views/admin/IndexAdmin.vue'
import Product from '../views/admin/Product.vue'
import UpdateProduct from '../views/admin/UpdateProduct.vue'
import AddProduct from '../views/admin/AddProduct.vue'
import ProductType from '../views/admin/ProductType.vue'
import AddProductType from '../views/admin/AddProductType.vue'
import ProductBrand from '../views/admin/ProductBrand.vue'
import ProductSpecs from '../views/admin/ProductSpecs.vue'
import OrderAdmin from '../views/admin/Order.vue'
import OrderDetailAdmin from '../views/admin/OrderDetail.vue'
import Return from '../views/admin/Return.vue'
import Silder from '../views/admin/Silder.vue'
import NormalUser from '../views/admin/NormalUser.vue'
import AdminUser from '../views/admin/AdminUser.vue'
import Authority from '../views/admin/Authority.vue'
import errorPage from '../views/admin/401.vue'
// 配置提示
import { Notification } from 'element-ui'

Vue.use(VueRouter)

const originalPush = VueRouter.prototype.push
  VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const routes = [
  {
    path : '/',
    redirect : '/mall/index',
  },
  {path : '/mall/login',name:'LoginMall',component : LoginMall},
  {
    path: "/Index_Mall",
    component:Index_Mall,
    children:[
      {
        path:'/mall/index',
        component:IndexMall
      },
      {
        path:'/mall/productMall',
        component:ProductMall
      },
      {
        path: '/mall/productDetail',
        component: ProductDetail,
        meta:{requiresAuth:true}
      },
      { 
        path: '/mall/ShopCart',
        component: ShopCart,
        meta:{requiresAuth:true}
      },
      {
        path:'/mall/sureOrder',
        component:sureOrder,
        meta:{requiresAuth:true},
      },
      { 
        path: '/mall/PersonCenter',
        component: PersonCenter,
        meta:{requiresAuth:true},
        redirect : '/mall/PersonInfo',
        children:[
          {
            path:'/mall/PersonInfo',
            component:PersonInfo,
            meta:{requiresAuth:true},
          },
          {
            path:'/mall/AddressManage',
            component:AddressManage,
            meta:{requiresAuth:true},
          },
          {
            path:'/mall/Password',
            component:Password,
            meta:{requiresAuth:true},
          },
          {
            path:'/mall/Order',
            component:Order,
            meta:{requiresAuth:true},
          },
          {
            path:'/mall/OrderDetail',
            component:OrderDetail,
            meta:{requiresAuth:true},
          }
          
        ]
      },
    ]
  },
  {
    path : '/admin/login',name:'LoginAdmin',component : LoginAdmin
  },
  {
    path : '/admin/Index_Admin',name:'Index_Admin',component : Index_Admin,
    children:[
      {
        path : '/admin/index',
        name:'IndexAdmin',
        component : IndexAdmin, 
        meta:{requiresAuth:true},
      },
      {
        path : '/admin/product',
        name:'Product',
        component : Product, 
        meta:{requiresAuth:true,productRole:true},
      },
      {
        path : '/admin/updateProduct',
        name:'UpdateProduct',
        component : UpdateProduct, 
        meta:{requiresAuth:true,productRole:true},
      },
      {
        path : '/admin/addProduct',
        name:'AddProduct',
        component : AddProduct, 
        meta:{requiresAuth:true,productRole:true},
      },
      {
        path : '/admin/productType',
        name:'ProductType',
        component : ProductType, 
        meta:{requiresAuth:true,productRole:true},
      },
      {
        path : '/admin/addProductType',
        name:'AddProductType',
        component : AddProductType, 
        meta:{requiresAuth:true,productRole:true},
      },
      {
        path : '/admin/productBrand',
        name:'ProductBrand',
        component : ProductBrand, 
        meta:{requiresAuth:true,productRole:true},
      },
      {
        path : '/admin/productSpecs',
        name:'ProductSpecs',
        component : ProductSpecs, 
        meta:{requiresAuth:true,productRole:true},
      },
      {
        path : '/admin/order',
        name:'OrderAdmin',
        component : OrderAdmin, 
        meta:{requiresAuth:true,orderRole:true},
      },
      {
        path : '/admin/orderDetail',
        name:'OrderDetailAdmin',
        component : OrderDetailAdmin, 
        meta:{requiresAuth:true,orderRole:true},
      },
      {
        path : '/admin/return',
        name:'Return',
        component : Return, 
        meta:{requiresAuth:true,returnRole:true},
      },
      {
        path : '/admin/silder',
        name:'Silder',
        component : Silder, 
        meta:{requiresAuth:true,silderRole:true},
      },
      {
        path : '/admin/normalUser',
        name:'NormalUser',
        component : NormalUser, 
        meta:{requiresAuth:true,userManegeRole:true},
      },
      {
        path : '/admin/adminUser',
        name:'AdminUser',
        component : AdminUser, 
        meta:{requiresAuth:true,userManegeRole:true},
      },
      {
        path : '/admin/authority',
        name:'Authority',
        component : Authority, 
        meta:{requiresAuth:true,userManegeRole:true},
      },
      {
        path : '/error/401',
        name:'errorPage',
        component : errorPage, 
        meta:{requiresAuth:true},
      },
    ]
  },
  

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 路由导航守卫
router.beforeEach((to, from , next) => {

  if(window.sessionStorage.getItem('store') != null){
    const userToken = JSON.parse(window.sessionStorage.getItem('store')).userToken
    const adminToken = JSON.parse(window.sessionStorage.getItem('store')).adminToken
    const adminRole = JSON.parse(window.sessionStorage.getItem('store')).adminRole
  if(to.path.includes("/mall")){
    if (to.meta.requiresAuth) {
      console.log(userToken);
      //判断当前是否有登录的权限
      if (userToken == null) {
        Notification({title: '警告', message: '请先登录！', type: 'warning'});
        next({
          path: '/mall/login',
        })
      }else{
        next()
      }
    }else{
      next()
    }
  }else if(to.path.includes("/admin")){
    if (to.meta.requiresAuth) {
      //判断当前是否有登录的权限
      if (adminToken == null) {
        Notification({title: '警告', message: '请先登录！', type: 'warning'});
        next({
          path: '/admin/login',
        })
      }else if (adminRole.indexOf("超级管理员")!=-1) {
          next()
      } 
      else if(to.matched.some(record => record.meta.productRole)){
        //判断当前是否有登录的权限
        if (adminRole.indexOf("商品管理员")===-1) {
          next('/error/401')
        }else{
          next()
        }
      }else if(to.matched.some(record => record.meta.orderRole)){
         //判断当前是否有登录的权限
         if (adminRole.indexOf("订单管理员")===-1) {
          next('/error/401')
        }else{
          next()
        }
      }else if(to.matched.some(record => record.meta.returnRole)){
        //判断当前是否有登录的权限
        if (adminRole.indexOf("退货管理员")===-1) {
         next('/error/401')
       }else{
         next()
       }
     }else if(to.matched.some(record => record.meta.silderRole)){
      //判断当前是否有登录的权限
      if (adminRole.indexOf("商城管理员")===-1) {
       next('/error/401')
     }else{
       next()
     }
    }else if(to.matched.some(record => record.meta.userManegeRole)){
      //判断当前是否有登录的权限
      if (adminRole.indexOf("用户管理员")===-1) {
       next('/error/401')
     }else{
       next()
     }
    }else{
      next()
    }
  } 
  else{
    next()
  }
  }else{
    next()
  }
  }else{
    next()
  }
})

export default router
