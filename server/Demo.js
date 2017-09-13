let user = require('./User.js')
user.say();
console.log(`name:${user.userName},email:${user.email}`);


// 创建一个服务器
let http = require('http');
let url = require('url');
let util = require('util');

let server = http.createServer((req,res)=>{
	res.statusCode = 200;

	res.setHeader("Content-Type","text/plain; charset=utf-8");

	// 拿不到完整url,但是express框架可以
	console.log(`url:${req.url}`);

	let urlParse = url.parse(req.url);
	// console.log(`parse:${urlParse}`);

	let inspect = util.inspect(url.parse(req.url));
	// console.log(`inspect:${inspect}`);

	res.end(`Hello> url:${req.url},parse:${urlParse},inspect:${inspect}`);
})

server.listen(3000,'127.0.0.1',()=>{
	console.log('服务器已打开，访问http://127.0.0.1:3000')
});