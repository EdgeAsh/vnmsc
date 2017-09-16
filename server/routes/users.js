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


module.exports = router;
