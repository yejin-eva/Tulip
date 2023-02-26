const express = require('express');
const router = express.Router();

// mysql setting //
const mysql = require('mysql2/promise');
const connInfo = require('./db/db_info').dev;
const conn = mysql.createPool(connInfo);


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('signup.ejs', {title: 'Express'});
});

router.post('/signupUpdate', async function(req, res) {
	let name = req.body.name;
	let pw = req.body.pw;
	
	
	// 변수를 MySQL에 저장
	// 저장된 결과가 성공적이면 flag 변수에 1을 넣고
	// MySQL에 저장 실패하면 flag에 0을 넣음
	let results = await saveData(name, pw);
	
	let flag;
	if (results) flag = 1;
	else flag = 0;
	
	let data = [];
	
	res.json({
		'data': data,
		"message": "returned",
		"flag": flag
	})
});

// functions //
const saveData = async (name, pw) => {
	try {
		const connection = await conn.getConnection(async conn=>conn);
		try {
			await connection.beginTransaction();
			
			//query 생성
			let insert_query = "INSERT INTO LogIn_db (name, pw) VALUE ('" + name + "', '" + pw + "')";
			
			//query를 mysal에 입력하기
			await connection.query(insert_query);
			
			await connection.commit();
			
			connection.release();
			
			console.log("succesfully saved!")
			return true;
		}
		catch(err){
			await connection.rollback();
			connection.release();
			console.log("[DB input error in <saveData> function]" + err);
			return false;
		}
	}
	catch(err) {
		console.log("[DB connection error in <saveData> function]" + err);
		return false;
	}
}

module.exports = router;