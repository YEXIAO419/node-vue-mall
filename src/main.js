// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueLazyload from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll'
import  Vuex from  'vuex'
import axios from 'axios';

Vue.use(VueLazyload, {
  loading: 'static/loading-svg/loading-bars.svg'
})
Vue.use(infiniteScroll);
Vue.use(Vuex);

Vue.config.productionTip = false

const  store = new Vuex.Store({
  state: {
    nickName: '',
    cartCount: 0
  },
  mutations: {
    //更新用户信息
    updateUserInfo(state, nickName) {
      state.nickName = nickName;
    },

    //更新购物车数量
    updateCartCount(state, cartCount){
      if(cartCount == state.cartCount){ //相等时，则初始化获取购物车数量
        state.cartCount = cartCount;
      }else{
        state.cartCount += cartCount;
      }
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
