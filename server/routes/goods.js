// 二级路由
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Goods = require('../models/goods.js');

// 连接MongoDB数据库
mongoose.connect('mongodb://127.0.0.1:27017/db_demo')
// 监听状态
mongoose.connection.on('connected',()=>{
	console.log('MongoDB connected success!')
})

mongoose.connection.on('error',()=>{
	console.log('MongoDB connected error!')
})

mongoose.connection.on('disconnected',()=>{
	console.log('MongoDB connected disconnected!')
})

router.get('/',(req,res,next)=>{
	// 实现排序，分页
	let sort = req.param('sort');
	let page = req.param('page');
	let pageSize = parseInt(req.param('pageSize'));
	let params = {};//查询条件

	var priceGt,priceLte; // 价格区间

	// 价格阶梯
	let priceLevel = req.param('priceLevel');
	if(priceLevel != 'all'){
		switch(priceLevel){
			case '0': priceGt=0;priceLte=100; break;
			case '1': priceGt=100;priceLte=500; break;
			case '2': priceGt=500;priceLte=1000; break;
			case '3': priceGt=1000;priceLte=5000; break;
		}
    params = {
      salePrice:{
        $gt:priceGt,
        $lte:priceLte
      }
    }
	}

	let skip = (page-1)*pageSize;

	// 分页，mongoDB
	let goodsModel = Goods.find(params).skip(skip).limit(pageSize);//limit参数必须为数值型

	goodsModel.sort({'salePrice':sort});

	goodsModel.exec((err,doc)=>{
		if(err){
			res.json({
				status:'1',
				msg:err.message
			})
		}else{
			res.json({
				status:'0',
				msg:'',
				result:{
					count:doc.length,
					list:doc
				}
			})
		}
	})
})

// 加入购物车
router.post('/addCart',(req,res,next)=>{
	var userId = "100000077",productId=req.body.productId;//post方式取参方式
	var User = require('../models/users.js');

	// 获取用户
	User.findOne({userId:userId},(err,userDoc)=>{
		if(err){
			res.json({
				status:"1",
				msg:err.message
			})
		}else{
			console.log('userDoc:'+ userDoc);
			if(userDoc){
				Goods.findOne({productId:productId},(err1,doc1)=>{
					if(err1){
						res.json({
							status:"1",
							msg:err1.message
						})
					}else{
						if(doc1){
							doc1.productNum = 1,
							doc1.checked = 1,
							userDoc.cartList.push(doc1);
							userDoc.save((err2,doc2)=>{
								if(err2){
									res.json({
										status:'1',
										msg:err2.message
									})
								}else{
									res.json({
										status:'0',
										msg:'',
										result:'success! edge'
									})
								}
							})
						}
					}
				})
			}
		}
	})
})


module.exports = router;
