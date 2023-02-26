var express = require('express');
var router = express.Router();

// mysql setting //
const mysql = require('mysql2/promise');
const connInfo = require('./db/db_info').dev;
const conn = mysql.createPool(connInfo);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('forumQnAContent.ejs', { title: 'Express' });
});

router.post('/forumContentUpdate', async function(req,res, next) {
	let boardID = req.body.boardID;
	let comment = req.body.comment;
	// let regdate = req.body.regdate;
	let writer = req.body.writer;
	
	console.log(comment)
	// console.log(regdate)
	console.log(writer)
	
	let results = await saveData(boardID, comment, writer);

	 
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
const saveData = async (boardID, comment, writer) => {

	try{
		const connection = await conn.getConnection(async conn=>conn);	  
		
		try {
			await connection.beginTransaction();
			
			// query 생성pm2
			let insert_query = "INSERT INTO Comment (boardId, comment, writer) VALUE (" + boardID + ",'"+ comment + "','" + writer + "');"
			console.log(insert_query);
																											
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
