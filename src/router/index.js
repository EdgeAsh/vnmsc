import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import GoodsList from '@/views/GoodsList.vue'

import Title from '@/views/Title.vue'
import Image from '@/views/Image.vue'

import Cart from '@/views/Cart.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/goods',
      name: 'GoodsList',
      component: GoodsList,
      children:[
      	{
      		path: 'title',
      		name: 'title',
      		component: Title
      	},
      	{
      		path: 'img',
      		name: 'img',
      		component: Image
      	}
      ]
    },
    {
    	path:'/cart',
    	component: Cart
    }
  ]
})
