let mongoose = require('mongoose');
let Schema = mongoose.Schema;
 
// 新建模型
let productSchema = new Schema({
	"productId": String,
	"productName": String,
	"productImage": String,
	"salePrice": Number,
	"productNum": String,
	"checked": String
});

module.exports = mongoose.model('Good',productSchema); //model层
