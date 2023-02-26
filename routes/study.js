var express = require('express');
var router = express.Router();
let moment = require('moment');

//mysql setting
const mysql = require('mysql2/promise');
const connInfo = require('./db/db_info').dev;
const conn = mysql.createPool(connInfo);

/* GET home page. */

router.get('/', function(req, res, next) {
  res.render('study');
});


router.get('/showStudyContent/:article_id', async function (req, res) {
	let data = [];
	let checkedData = [];
	let flag;
	let checkedFlag;
	
	let results = [];
	let checkedResults = [];
	let id = req.params.article_id;
	
	let userId = 1;
	results = await loadData(id);
	//console.log(results);
	checkedResults = await loadChekedData(id, userId);
	
	
	if(results[0]) { //if true
		data = results[1];
		flag = 1;
	}
	else { //if false 
		data = [{
			'id': '',
			'chapterid': '',
			'title': '',
			'content': '',
			'youtubeid': '',
			'regdate': '',
			'previousbtn': '',
			'nextbtn': '',
			'prevbtnlink': '',
			'nextbtnlink': ''		
		}];
		flag = 0;
	}

	
	if(checkedResults[0]) {
		// 데이터가 없는 경우
		if(checkedResults[1].length == 0) {
			checkedData = [{
				'id': '',
				'userId': '',
				'subChapterId': '',
				'regdate': ''
			}];
			checkedFlag = 0;
		}
		else {
			checkedData = checkedResults[1];
			checkedFlag = 1;
		}
	}
	else {
		checkedData = [{
			'id': '',
			'userId': '',
			'subChapterId': '',
			'regdate': ''
		}];
		checkedFlag = 0;
	}
	console.log(checkedData);
	
	//받은 데이터 ajax통해 font-end로 보내기
	//console.log(data);
	res.render('study.ejs', //원래: dataContent
		{
			'data': data,
			'checkedData': checkedData,
			'flag': flag,
			'checkedFlag': checkedFlag,
			moment: moment 
		});

});

router.post('/checked', async function(req, res, next) {
	let subChapterId = req.body.subChapterId;
	let userId = req.body.userId;
	
	console.log(subChapterId);
	console.log(userId);

	let results = await saveData(subChapterId, userId);

	 
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


//function
const loadData = async (id) => { 
	try {
		const connection = await conn.getConnection(async conn=>conn);
		try {
			await connection.beginTransaction();
			
			//query 생성
			let select_query = "SELECT id, title, content, youtubeid, previousbtn, nextbtn, prevbtnlink, nextbtnlink FROM SubChapter WHERE id =" + id;
			
			console.log(select_query);
			
			//query를 mysql에 입력하기
			let tmp = [];
			[tmp] = await connection.query(select_query);
			
			//trying to create spaces in query
			
			
			await connection.commit();
			connection.release();
			
			//console.log(tmp);
			
			console.log("successfully loaded study contents!");
			return [true, tmp];
		}
		catch(err) {
			await connection.rollback();
			connection.release();
			console.log("[DB output error in <loadData> function] " + err);
			return [false];
		}
	}
	catch(err) {
		console.log("[DB connection error in <loadData> function] " + err);
		return [false];
	}
}


// functions: 사용자가 다음 study로 이동할때마다 학습 내역 저장
const saveData = async (subChapterId, userId) => {

	try{
		const connection = await conn.getConnection(async conn=>conn);	  
		
		try {
			await connection.beginTransaction();
			
			// query 생성
			let insert_query = "INSERT INTO StudyCheck (userId, subChapterId) VALUE (" +userId + ", " + subChapterId + ");"

																											
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

const loadChekedData = async (subChapterId, userId) => { 
	try {
		const connection = await conn.getConnection(async conn=>conn);
		try {
			await connection.beginTransaction();
			
			//query 생성
			let select_query = "SELECT * FROM StudyCheck WHERE userId = " + userId + " AND subChapterId = " + subChapterId + ";";
			
			console.log(select_query);
			
			//query를 mysql에 입력하기
			let tmp = [];
			[tmp] = await connection.query(select_query);
			
			//trying to create spaces in query
			
			
			await connection.commit();
			connection.release();
			
			//console.log(tmp);
			
			console.log("successfully loaded studyCheck contents!");
			return [true, tmp];
		}
		catch(err) {
			await connection.rollback();
			connection.release();
			console.log("[DB output error in <loadChekedData> function] " + err);
			return [false];
		}
	}
	catch(err) {
		console.log("[DB connection error in <loadData> function] " + err);
		return [false];
	}
}



module.exports = router;
