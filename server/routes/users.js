var express = require('express');
var router = express.Router();
var User = require('./../models/users.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/login',(req,res,next)=>{
	let param = {
		userName: req.body.userName,
		userPwd: req.body.userPwd
	}
	// 查询
	User.findOne(param,(err,doc)=>{
		if(err){
			res.json({
				status:'1',
				msg:err.message
			})
		}else{
			// 存储
			res.cookie('userId',doc.userId,{
				path:'/',
				maxAge: 1000*60*60
			});
			// res.session.user = doc;
			res.cookie('userName',doc.userName,{
				path:'/',
				maxAge: 1000*60*60
			});

			res.json({
				status:'0',
				msg:'',
				result:{
					userName:doc.userName
				}
			})
		}
	})
})

// 登出接口
router.post('/logout',(req,res,next)=>{
	res.cookie('userId','',{
		path:'/',
		maxAge:-1
	});
	res.json({
		status:'0',
		msg:'登出成功',
		result:''
	})
})

// 登录检验
router.get('/chekLogin',(req,res,next)=>{
	if(req.cookies.userId){
		res.json({
			status:'0',
			msg:'',
			result:req.cookies.userName || ''
		});
	}else{
		res.json({
			status:'1',
			msg:'未登录',
			result:''
		});
	}
})

// 查询当前用户购物车数据
router.get('/cartList',(req,res,next)=>{
	let userId = req.cookies.userId;
	User.findOne({'userId': userId},(err,doc)=>{
		if(err){
			res.json({
				status:'1',
				msg:err.message,
				result:''
			});
		}else{
			res.json({
				status:'0',
				msg:'查询成功',
				result:doc.cartList
			});
		}
	})
})

// 删除当前用户购物车数据
router.post('cart/delet',(req,res,next)=>{
	let userId = req.cookies.userId,productId = req.body.productId;
	// 删除特定用户下carList(数组)中productId值为productId的物品
	User.update({
		userId:userId
	},{
		$pull:{
			'cartList':{
				'productId':productId
			}
		}
	},(err,doc)=>{
		if(err){
			res.json({
				status:'1',
				msg:err.message,
				result:'删除失败'
			})
		}else{
			res.json({
				status:'0',
				msg:'',
				result:'删除成功'
			})
		}
	});
})

module.exports = router;
