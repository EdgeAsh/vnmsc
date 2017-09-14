// 二级路由
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Goods = require('../models/goods.js');

// 连接MongoDB数据库
mongoose.connect('mongodb://127.0.0.1:27017/db_demo')

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
	Goods.find({},(err,doc)=>{
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


module.exports = router;