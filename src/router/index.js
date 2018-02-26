import Vue from 'vue'
import Router from 'vue-router'
const GoodsList = () => import('@/views/GoodsList');
const Cart = () => import('@/views/Cart');
const Address = () => import('@/views/Address');
const OrderConfirm = () => import('@/views/OrderConfirm');
const OrderSuccess = () => import('@/views/OrderSuccess');

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: GoodsList
    },{
      path: '/goodsList',
      name: 'GoodsList',
      component: GoodsList
    },{
      path: '/cart',
      name: 'Cart',
      component: Cart
    },{
      path: '/address',
      name: 'Address',
      component: Address
    },{
      path: '/orderConfirm',
      name: 'OrderConfirm',
      component: OrderConfirm
    },{
      path: '/orderSuccess',
      name: 'OrderSuccess',
      component: OrderSuccess
    }
  ]
})
