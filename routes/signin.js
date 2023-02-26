const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const connInfo = require('./db/db_info.js').dev;
const cookieParser = require('cookie-parser')

// mysql setting //
const conn = mysql.createPool(connInfo);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('signin.ejs', { title: 'Express' });
});


// 데이터 sql에 넣기
router.post('/signinUpdate', async function(req,res, next) {
	let name = req.body.name;
	let pw = req.body.pw;
	
	console.log(name);
	console.log(pw);
	
	let results = await compareData(name, pw);
	 
	let flag;
	if (results[0]) {
		let gotten_pw = results[1];
		if (gotten_pw.length == 0) {
			res.json({
				"message": 'no id',
				"errorflag": 1
			});
		}
		else if (gotten_pw[0].pw == pw) {
			res.json({
				"message": 'succeeded',
				"errorflag": 0,
				"id": gotten_pw[0].id,
			});
		}
		else {
			res.json({
				"message": 'wrong password',
				"errorflag": 2
			});
		}
	}
	else {
		res.json({
			"message": 'error',
			"flag": 3
		});
	}
	
	
});
	


// functions //
const compareData = async (name, pw) => {

	try{
		const connection = await conn.getConnection(async conn=>conn);	  
		
		// query 생성pm2
		let select_query = "SELECT id, pw FROM LogIn_db WHERE name='" + name + "'";
		console.log(select_query);
		
		try {
			await connection.beginTransaction();
																										
			// query를 mysql에 입력하기
			let tmp = [];
			[tmp] = await connection.query(select_query);
			await connection.commit();
			connection.release();

			console.log("query passed")
			return [true, tmp];
		}
		catch(err) {
			await connection.rollback();
			connection.release();
			console.log('[DB input error in <saveData> function] ' + err)
			return false;
		}
		
	}
	catch(err) {
		console.log('[DB connection error in <saveData> function] ' + err)
		return false;
	}
}


module.exports = router;