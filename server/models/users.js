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
			'productNum':String,
			'salePrice':String,
			'checked':String
		}
	],
	'addressList':[
		{
      "addressId" : String,
      "userName" : String,
      "streetName" : String,
      "postCode" : String,
      "tel" : String,
      "isDefault" : Boolean
    }
	]
});

// 导出模板
module.exports = mongoose.model('User',userSchema,"users");
