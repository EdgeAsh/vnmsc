<template>
<div>
	<nav-header></nav-header>
	<nav-bread><span> Goods </span></nav-bread>
	<div class="accessory-result-page accessory-page">
	  <div class="container">
	    <div class="filter-nav">
	      <span class="sortby">Sort by:</span>
	      <a href="javascript:void(0)" class="default cur">Default</a>
	      <a href="javascript:void(0)" class="price" @click='sortGoods()'>Price <svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"></use></svg></a>
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
	                <a href="#"><img v-lazy="'../static/'+item.productImage" alt=""></a>
	              </div>
	              <div class="main">
	                <div class="name">{{item.productName}}</div>
	                <div class="price">{{item.salePrice}}</div>
	                <div class="btn-area">
	                  <a href="javascript:;" class="btn btn--m" @click='addCart(item.productId)'>加入购物车</a>
	                </div>
	              </div>
	            </li>
	          </ul>
            <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="20" class="view-more-normal">
              <img src="/static/loading-svg/loading-spinning-bubbles.svg">
            </div>
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
				{
					startPrice:1000.00,
					endPrice:5000.00
				},
			],
			checkedPrice:'all',
			filterShow:false,
			overLayShow:false,
			sortFlag:true,
			page:1,
			pageSize:8,
      busy:false
		};
	},
	methods:{
		getGoodsList(flag){
			let param = {
				page:this.page,
				pageSize:this.pageSize,
				sort:this.sortFlag?1:-1,
				priceLevel:this.checkedPrice
			}
			axios.get('/goods/list',{params:param}).then((res)=>{
				res = res.data;
				if(res.status=='0'){
          if(flag){
            //分页
            this.goodsList = this.goodsList.concat(res.result.list);
            // 是否可以加载
            console.log(res.result.list.length);
            if(res.result.count == 0 || res.result.list.length < this.pageSize){
              this.busy = true;
            }else{
              this.busy = false;
            }
          }else{
            this.goodsList = res.result.list;
          }
        }else{
				  this.goodsList = []
        }

			}).catch((err)=>{console.log(err)})
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
			this.page = 1;
			this.getGoodsList();
			this.hideFilter();
		},
		sortGoods(){
			this.sortFlag = !this.sortFlag;
			this.page = 1;
			this.getGoodsList();
		},
    loadMore(){
      this.busy = true;
      setTimeout(() => {
        this.page++;
        this.getGoodsList(true);
      }, 1000);
    },
    addCart(productId){
    	axios.post('/goods/addCart',{
    		productId:productId
    	}).then((response)=>{
    		let res = response.data;
    		console.log(response)
    		if(res.status==0){
    			alert('加入成功');
    		}else{
    			alert('error:'+ res.msg);
    		}
    	})
    }
	},
	components:{
		NavHeader,
		NavFooter,
		NavBread
	},
	computed:{

	},
	mounted(){
		this.getGoodsList();
	}
}
</script>
