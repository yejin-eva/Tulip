var express = require('express');
var router = express.Router();
let moment = require('moment');
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('/');

// mysql setting //
const mysql = require('mysql2/promise');
const connInfo = require('./db/db_info').dev;
const conn = mysql.createPool(connInfo);
/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('mypage2.ejs', { title: 'Express' });
// });

router.get('/:id', async function(req, res) {
    let data = [];
	let results = [];
	
	let userId = req.params.id;
	
	//let userId = localStorage.getItem("userID");
	console.log(userId);
	
	results = await loadData(userId);
	
	// console.log(results);
				
	if(results[0]) {
		data = results[1];
		flag = 1;
	}
	
	else {
		data = [{
			'id':'',
			'subChapterId':'',
			'userId':'',
			'title':'',
			'regdate':''	
		}];
	}
	
	res.render('mypage2',
		{
			'data': data,
			'flag': flag,	
			moment: moment 
		}
	);
});

const loadData = async (userId) => {	
	try {
		const connection = await conn.getConnection(async conn=>conn);
		try {
			await connection.beginTransaction();
			
			let readQuery='';
			// 전체 게시글 목록 조회
			
			readQuery = "SELECT s.id, s.subChapterId, s.userId, c.title, s.regdate FROM (Tulip.StudyCheck as s INNER JOIN Tulip.SubChapter as c ON s.subChapterId = c.id) WHERE userId = " + userId;
				
			let tmp = [];
			
			[tmp] = await connection.query(readQuery);
			
			await connection.commit();
			
			connection.release();
			
			// console.log(tmp);

			console.log("successfully loaded!")
			return [true, tmp];
		}
		catch(err) {
			await connection.rollback();
			connection.release();
			console.log("[DB output error in <loadData> function] " + err);
			return false;
		}
		return true;
	}
	catch(err) {
		console.log("[DB connection error in <loadData> function] " + err);
		return false;
	}
}

module.exports = router;