<template>
	<div>
		这是商品列表
		<span>{{$route.params.goodsId}}</span>
		<span>{{$route.params.name}}</span>

		<router-link to="/goods/title">显示标婷</router-link>
		<router-link to="/goods/img">显示图片</router-link>
		<div>
			<router-view></router-view>
		</div>
		<router-link :to="{name:'user',params:{userId:123 }}">去购物车</router-link>
		<button @click='jump'>去购物车</button>
	</div>
</template>

<script>
	/*
	*==========================
	* @Author: Edge
	* @Version: 1.0
	*==========================
	*/
export default{
	props:{

	},
	data(){
		return{
			msg:'hello vue'
		};
	},
	methods:{
		jump(){
			// this.$router.push({path:"/cart?id=12"})
			this.$router.go(-2);
		}
	},
	components:{

	},
	computed:{

	}
}
</script>

<style>

</style>