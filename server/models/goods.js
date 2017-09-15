let mongoose = require('mongoose');
let Schema = mongoose.Schema;
 
// 新建模型
let productSchema = new Schema({
	"productId": String,
	"productName": String,
	"productImage": String,
	"salePrice": Number
});

module.exports = mongoose.model('Good',productSchema); //model层
