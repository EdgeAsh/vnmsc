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
				msg:'',
				result:'删除成功'
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
						status:'1003',
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

module.exports = router;
