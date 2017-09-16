// 获取mongoose框架
var mongoose = require('mongoose');
// 建立模板
var userSchema = new mongoose.Schema({
	'userId':String,
	'userName':String,
	'userPwd':String,
	'orderList':Array,
	'cartList':[
		{
			'productImage':String,
			'productId':String,
			'productName':String,
			'productNum':{type:String,default:'1'},
			'salePrice':String,
			'checked':String
		}
	],
	'addressList':Array
});

// 导出模板
module.exports = mongoose.model('User',userSchema,"users");
