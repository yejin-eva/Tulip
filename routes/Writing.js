const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const connInfo = require('./db/db_info.js').dev;

// mysql setting //
const conn = mysql.createPool(connInfo);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('forumWriting.ejs', { title: 'Express' });
});



router.post('/forumWritingUpdate', async function(req, res, next) {
	let category = req.body.category;
	let title = req.body.title;
	let content = req.body.content;
	let writer = req.body.writer;
	
	console.log(category)
	console.log(title)
	console.log(content)
	console.log(writer)
	
	let results = await saveData(category, title, content, writer);

	 
	let flag;
	if (results) flag = 1;
	else flag = 0;
	
	let data = [];
	
	res.json({
		'data' : data,
		"message": 'returned',
		"flag": flag
	});
});



// functions //
const saveData = async (category, title, content, writer) => {

	try{
		const connection = await conn.getConnection(async conn=>conn);	  
		
		try {
			await connection.beginTransaction();
			
			// query 생성pm2 
			let insert_query = "INSERT INTO Board (writer, category, title, content) VALUE (" + writer + "," + parseInt(category) + ", '" + title + "','" + content + "')";

																										
			// query를 mysql에 입력하기
			await connection.query(insert_query);
			await connection.commit();
			connection.release();

			console.log("successfully saved!")
			return true;
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