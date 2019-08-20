import Vue from 'vue'
import Router from 'vue-router'
import store from './store'

// PAGE
import Login from '@/views/Login'
import notfound from '@/views/PageNotFound'
import Dashboard from '@/views/Dashboard'
// import Request from '@/views/Request'
// import Approve from '@/views/Approve'

//MANAGE
import BarangMasuk from '@/views/BarangMasuk'
import BarangKeluar from '@/views/BarangKeluar'
import Stock from '@/views/Stock'
import StockDetail from '@/views/StockDetail'
import Opname from '@/views/Opname'
import Master from '@/views/Master'
import RoleSetting from '@/components/Master/RoleSetting'
import Brand from '@/components/Master/Brand'
import Color from '@/components/Master/Color'
import Size from '@/components/Master/Size'
import Type from '@/components/Master/Type'
import Model from '@/components/Master/TypeModel'

Vue.use(Router)
const guard = function(to, from, next) {
  if(Vue.session.get('SESSION_ID') != null || Vue.session.get('SESSION_ID') != undefined){
    store.commit('toggle',true);
    next();
  } else {
    store.commit('toggle',false);
    next('/');
  }
}

export default new Router({
  mode: 'history',
  // base: process.env.BASE_URL,
  base: "/InventoryMASManage",
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/Dashboard',
      name: 'dashboard',
      component: Dashboard,
      beforeEnter: (to, from, next) => { guard(to, from, next) }
    },

    // MANAGE
    {
      path: '/mypo',
      name: 'barangmasuk',
      component: BarangMasuk,
      beforeEnter: (to, from, next) => { guard(to, from, next) }
    },
    {
      path: '/managerequest',
      name: 'barangkeluar',
      component: BarangKeluar,
      beforeEnter: (to, from, next) => { guard(to, from, next) }
    },
    {
      path: '/stock',
      name: 'stock',
      component: Stock,
      beforeEnter: (to, from, next) => { guard(to, from, next) }
    },
    {
      path: '/stock/:id',
      name: 'stock',
      component: StockDetail,
      beforeEnter: (to, from, next) => { guard(to, from, next) }
    },
    {
      path: '/opname',
      name: 'opname',
      component: Opname,
      beforeEnter: (to, from, next) => { guard(to, from, next) }
    },
    {
      path: '/master',
      name: 'master',
      component: Master,
      beforeEnter: (to, from, next) => { guard(to, from, next) }
    },
    {
      path: '/setting',
      name: 'role-setting',
      component: RoleSetting,
      beforeEnter: (to, from, next) => { guard(to, from, next) }
    },
    {
      path: '/masterbrand',
      name: 'brand',
      component: Brand,
      beforeEnter: (to, from, next) => { guard(to, from, next) }
    },
    {
      path: '/mastercolor',
      name: 'color',
      component: Color,
      beforeEnter: (to, from, next) => { guard(to, from, next) }
    },
    {
      path: '/mastersize',
      name: 'size',
      component: Size,
      beforeEnter: (to, from, next) => { guard(to, from, next) }
    },
    {
      path: '/mastertype',
      name: 'color',
      component: Type,
      beforeEnter: (to, from, next) => { guard(to, from, next) }
    },
    {
      path: '/mastertypemodel',
      name: 'size',
      component: Model,
      beforeEnter: (to, from, next) => { guard(to, from, next) }
    },
    // MISC
    { 
      path: "*", 
      component: notfound,
      beforeEnter: (to, from, next) => { guard(to, from, next) }
    },
  ]
})
