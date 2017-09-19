var express = require('express');
var router = express.Router();
var User = require('./../models/users.js');
require('./../utils/dateFormate.js') //时间格式化插件

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

// 获取购物车商品数量
router.get('/getCartCount',(req,res,next)=>{
	let userId = req.cookies.userId;
	if(!req.cookies && !req.cookies.userId){
		res.json({
			status:'1',
			msg:'无缓存 || 无用户ID',
			result:''
		});
		return;
	}
	User.findOne({userId:userId},(err,userDoc)=>{
		if(err){
			res.json({
				status:'1',
				msg:err.message,
				result:''
			});
		}else{
			let count = 0;
			userDoc.cartList.map(function(item){
				count += parseInt(item.productNum)
			});
			// 返回数量
			res.json({
				status:'0',
				msg:'获取购物车数量成功',
				result:count
			});
		}
	});
});

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
router.post('/cartDelet',(req,res,next)=>{
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
				msg:'删除成功',
				result:doc
			})
		}
	});
})

// 更改用户购物车商品数量,是否选中
router.post('/editCart',(req,res,next)=>{
	let userId = req.cookies.userId,
			productId = req.body.productId,
			productNum = req.body.productNum,
			checked = req.body.checked;

	User.update({
		// 查询条件
		userId:userId,'cartList.productId':productId
	},{
		// 替换的内容
		"cartList.$.productNum": productNum,
		"cartList.$.checked": checked
	},(err,doc)=>{
		if(err){
			res.json({
				status:'1',
				msg:err.message,
				result:'更改失败'
			})
		}else{
			res.json({
				status:'0',
				msg:'更改成功',
				result:doc
			})
		}
	});
})


// 全选
router.post('/cartSelectAll',(req,res,next)=>{
	let userId = req.cookies.userId,
			checkAll = req.body.checkAll?'1':'0';
	// 针对MongoDB批量修改。找到用户，遍历cartList修改checked属性,然后保存；
	User.findOne({userId:userId},(err,userDoc)=>{
		if(err){
			res.json({
				status:'1',
				msg:err.message,
				result:'获取用户失败'
			})
		}else{
			userDoc.cartList.forEach((item)=>{
				item.checked = checkAll
			});
			// 保存
			userDoc.save((err1,doc1)=>{
				if(err1){
					res.json({
						status:'1',
						msg:err1.message,
						result:'保存失败'
					})
				}else{
					res.json({
						status:'0',
						msg:'数据保存成功',
						result:doc1
					})
				}
			})
		}
	})
});

// 获取用户购物车地址列表
router.get('/addressList',(req,res,next)=>{
	let userId = req.cookies.userId;
	User.findOne({userId:userId},(err,userDoc)=>{
		if(err){
			res.json({
				status:'1',
				msg:err.message,
				result:'查询用户购物地址失败！'
			});
		}else{
			res.json({
				status:'0',
				msg:'查询用户购物地址成功',
				result:userDoc.addressList
			});
		}
	});
})

// 更改默认地址
router.post('/setDefaultAdd',(req,res,next)=>{
	let userId = req.cookies.userId,
			addressId = req.body.addressId;

	if(!addressId){
		res.json({
			status:'1003',
			msg:'地址ID有问题',
			result:''
		})
	}
	User.findOne({userId:userId},(err,userDoc)=>{
		if(err){
			res.json({
				status:'1',
				msg:err.message,
				result:'用户不存在'
			});
		}else{
			// res.json({
			// 	status:'0',
			// 	msg:'发现用户'
			// 	result:userDoc
			// });
			userDoc.addressList.forEach((item)=>{
				if(addressId == item.addressId){
					item.isDefault = true;
				}else{
					item.isDefault = false;
				}
			});
			// 保存
			userDoc.save((err1,doc1)=>{
				if(err1){
					res.json({
						status:'1',
						msg:err1.message,
						result:'设置默认地址失败'
					})
				}else{
					res.json({
						status:'0',
						msg:'设置默认地址成功',
						result:doc1
					})
				}
			})
		}
	});
})


// 删除地址
router.post('/delteAddress',(req,res,next)=>{
	let userId = req.cookies.userId, addressId = req.body.addressId;
	User.update({
		userId:userId
	},{
		$pull:{
			'addressList':{
				'addressId':addressId
			}
		}
	},(err,doc)=>{
		if(err){
			res.json({
				status:'1',
				msg:err.message,
				result:'地址删除失败'
			})
		}else{
			res.json({
				status:'0',
				msg:'',
				result:'地址删除成功'
			})
		}
	});
});

// 用户订单,获取用户，购物车中已经购买的商品，地址信息。构成成交订单
router.post('/payMent',(req,res,next)=>{
	let userId = req.cookies.userId,
			addressId = req.body.addressId,
			totalPrice = req.body.totalPrice;
	User.findOne({userId:userId},(err,userDoc)=>{
		if(err){
			res.json({
				status:'1',
				msg:err.message,
				result:"用户订单获取用户失败"
			})
		}else{
			let goodList = [],address='';
			// 获取用户购买的商品
			userDoc.cartList.forEach((item)=>{
				if(item.checked=='1'){
					goodList.push(item);
					item.checked = '0'
					// 应该将已经购买的商品从购物车中删除  TODO
				}
			});
			// 获取用户送货地址信息
			userDoc.addressList.forEach((item)=>{
				if(item.addressId == addressId){
					address = item;
				}
			});

			// 生成订单
			let plantform = 'edge'
			let r1 = Math.floor(Math.random()*10);
			let r2 = Math.floor(Math.random()*10);
			let sysDate = new Date().Format('yyyyMMddhhmmss');
			let createdDate = new Date().Format('yyyy-MM-dd hh:mm:ss');
			let orderId = plantform+r1+sysDate+r2

			let order = {
				orderId:orderId,
				goodList:goodList,
				orderTotal:totalPrice,
				address:address,
				orderStatus:'1',
				createdDate:createdDate
			}

			// 保存订单至订单列表
			userDoc.orderList.push(order);

			// 插入数据库
			userDoc.save((err,doc)=>{
				if(err){
					res.json({
						status:'1',
						msg:err.message,
						result:"用户订单获插入数据库失败"
					});
				}else{
					res.json({
						status:'0',
						msg:'用户订单获插入数据库成功',
						// result:{
						// 	orderFee:totalPrice,
						// 	orderId:order.orderId
						// }
						result:order
					});
				}
			});
		}
	});

})

// 根据订单ID查询订单信息
router.get('/orderDetail',(req,res,next)=>{
	let userId = req.cookies.userId,orderId=req.param('orderId');
	User.findOne({userId:userId},(err,userDoc)=>{
		if(err){
			res.json({
				status:'1',
				msg:'没有此用户',
				result:''
			});
		}else{
			// 查找订单
			if(userDoc.orderList.length<=0){
				res.json({
					status:'12001',
					msg:'此用户没有订单',
					result:''
				});
			}
			let order=null;
			userDoc.orderList.forEach((item)=>{
				if(item.orderId==orderId){
					order = item;
				}
			});

			if(!order && !order.orderTotal){
				res.json({
					status:'12002',
					msg:'此用户没有该订单',
					result:''
				});
			}else{
				res.json({
					status:'0',
					msg:'获取到订单',
					result:{
						orderId:order.orderId,
						orderTotal:order.orderTotal
					}
				});
			}
		}
	});
});
module.exports = router;
