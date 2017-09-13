<template>
<div>
	<nav-header></nav-header>
	<nav-bread><span> Goods </span></nav-bread>
	<div class="accessory-result-page accessory-page">
	  <div class="container">
	    <div class="filter-nav">
	      <span class="sortby">Sort by:</span>
	      <a href="javascript:void(0)" class="default cur">Default</a>
	      <a href="javascript:void(0)" class="price">Price <svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"></use></svg></a>
	      <a href="javascript:void(0)" class="filterby stopPop" @click='showFilter'>Filter by</a>
	    </div>
	    <div class="accessory-result">
	      <!-- filter -->
	      <div class="filter stopPop" id="filter" :class="{'filterby-show':filterShow}">
	        <dl class="filter-price">
	          <dt>Price:</dt>
	          <dd><a href="javascript:void(0)" @click="setPrice('all')" :class="{'cur':checkedPrice=='all'}">All</a></dd>
	          <dd v-for='(price,index) in priceFilter'>
	            <a href="javascript:void(0)"  @click='setPrice(index)' :class="{'cur':checkedPrice==index}">{{price.startPrice}} - {{price.endPrice}}</a>
	          </dd>
	        </dl>
	      </div>

	      <!-- search result accessories list -->
	      <div class="accessory-list-wrap">
	        <div class="accessory-list col-4">
	          <ul>
	            <li v-for='item in goodsList'>
	              <div class="pic">
	                <a href="#"><img v-lazy="'/static/'+item.prodcutImg" alt=""></a>
	              </div>
	              <div class="main">
	                <div class="name">{{item.productName}}</div>
	                <div class="price">{{item.prodcutPrice}}</div>
	                <div class="btn-area">
	                  <a href="javascript:;" class="btn btn--m">加入购物车</a>
	                </div>
	              </div>
	            </li>
	          </ul>
	        </div>
	      </div>
	    </div>
	  </div>
	</div>
	<div class="md-overlay" v-show='overLayShow' @click='hideFilter'></div>
	<nav-footer></nav-footer>
</div>
</template>

<script>
	/*
	*==========================
	* @Author: Edge
	* @Version: 1.0
	*==========================
	*/
import './../assets/css/base.css'
import './../assets/css/product.css'

import NavHeader from '@/components/Header.vue'
import NavFooter from '@/components/Footer.vue'
import NavBread from '@/components/Bread.vue'

import axios from 'axios'

export default{
	props:{

	},
	data(){
		return{
			goodsList:[],
			priceFilter:[
				{
					startPrice:0.00,
					endPrice:100.00
				},
				{
					startPrice:100.00,
					endPrice:500.00
				},
				{
					startPrice:500.00,
					endPrice:1000.00
				},
			],
			checkedPrice:'all',
			filterShow:false,
			overLayShow:false
		};
	},
	methods:{
		getGoodsList(){
			axios.get('/goods').then((res)=>{
				res = res.data;
				this.goodsList = res.result
			})
		},
		showFilter(){
			this.filterShow=true,
			this.overLayShow=true
		},
		hideFilter(){
			this.filterShow=false;
			this.overLayShow=false;
		},
		setPrice(index){
			this.checkedPrice=index;
			this.hideFilter();
		}
	},
	components:{
		NavHeader,
		NavFooter,
		NavBread
	},
	computed:{

	},
	mounted:function(){
		this.getGoodsList();
	}
}
</script>