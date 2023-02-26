var express = require('express');
var router = express.Router();

//mysql setting
// const mysql = require('mysql2/promise');
// const connInfo = require('./db/db_info').dev;
// const conn = mysql.createPool(connInfo);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.ejs', {'data': 1000});
});



// router.post('/showContent', async function (req, res) {
// 	let data = [];
// 	let flag;
// 	let results = [];
// 	let id = null;
// 	results = await loadData();
// 	console.log(results);
	
// 	if(results[0]) {
// 		data = results[1];
// 		flag = 1;
// 	}
// 	else {
// 		data = [{
// 			'id': '',
// 			'name': '',
// 			'password': ''
// 		}];
// 		flag = 0;
// 	}
	
// 	res.json({
// 		'data': data,
// 		'flag': flag
// 	});
// });

// const loadData = async()=> {
// 	try {
// 		const connection = await conn.getConnection(async conn =>conn);
// 		try {
// 			await connection.beginTransaction();
			
// 			let select_query = '';
			
// 			select_query = "SELECT * FROM User";
			
			
// 			console.log(select_query);
			
// 			let tmp = [];
// 			[tmp] = await connection.query(select_query);
			
// 			await connection.commit();
// 			connection.release();
			
// 			console.log(tmp);
// 			console.log("loaded index success");
// 			return [true, tmp];
// 		}
// 		catch(err) {
// 			await connection.rollback();
// 			connection.release();
// 			console.log("DB output error in loadData" + err);
// 			return [false];
// 		}
		
// 	}
// 	catch(err) {
// 		console.log("DB connection error in loadData " + err);
// 		return [false];
// 	}
// }

module.exports = router;
