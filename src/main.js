// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueLazyLoad from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll'
import {currency} from '@/util/currency.js'
import Vuex from 'vuex'

Vue.config.productionTip = false

Vue.filter('moneyFormat',currency);

Vue.use(VueLazyLoad,{
	loading:'/static/loading-svg/loading-bars.svg',
	try:3
})

Vue.use(infiniteScroll);
Vue.use(Vuex);

const storeVuex = new Vuex.Store({
	state:{
		nickName:'',
		cartCount:0
	},
	mutations:{
		updateUserInfo(state,nickName){
			state.nickName = nickName;
		},
		updateCartCount(state,cartCount){
			state.cartCount += cartCount; 
		},
		initCartCount(state,cartCount){
			state.cartCount = cartCount; 
		}
	}
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store:storeVuex,
  router,
  template: '<App/>',
  components: { App }
})
