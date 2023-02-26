var express = require('express');
var router = express.Router();
var moment = require('moment');

// mysql setting //
const mysql = require('mysql2/promise');
const connInfo = require('./db/db_info').dev;
const conn = mysql.createPool(connInfo);

console.log(conn);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('forumQnA.ejs', { title: 'Express' });
});

router.get('/readForumQnA/:id', async function(req, res) {
    let data = [];
	let id = req.params.id;
	
	let comments = [];
	let cresults= await loadComments(id);
	console.log(cresults);
	
	let results = await loadData(id);
	console.log(results);
				
	if(results[0]) {
		data = results[1];
		flag = 1;
	}
	else {
		data = [{
			'id':'',
			'name':'',
			'title':'',
			'content':'',
			'regdate':''	
		}];
	}
	
	if(cresults[0]) {
		comments = cresults[1];
	}
	else {
		comments = [{
			'id':'',
			'name':'',
			'comment':'',
			'regdate':''
		}];
	}
 		
	res.render('forumQnAContent',
		{
			'data': data,
			'comments': comments,
			'flag': flag,	
			moment: moment 
		}
	);
	
});	
	

router.post('/readForumQnA', async function(req, res) {
  	let data = [];
	let flag;
		
	let id = null;
	let results = await loadData(id);
	
	if(results[0]) {
		data = results[1];
		flag = 1;
	}
	else {
		data = [{
			'id':'',
			'name':'',
			'title':'',
			'content':'',
			'regdate':''	
		}];
	}
	
	res.json({
		'data': data,
		'flag': flag,		
	});
	
});

const loadData = async (id) => {	
	try {
		const connection = await conn.getConnection(async conn=>conn);
		try {
			await connection.beginTransaction();
			
			let readQuery='';
			// 전체 게시글 목록 조회
			if(id == null) 
				readQuery = "SELECT b.id, name, title, content, regdate FROM Board as b INNER JOIN LogIn_db as L WHERE b.writer = L.id";
			
			// 하나의 게시글 조회
			else 
				readQuery = "SELECT b.id, name, title, content, regdate FROM Board as b INNER JOIN LogIn_db as L WHERE b.writer = L.id AND b.id = " + id;
				
			let tmp = [];
			
			[tmp] = await connection.query(readQuery);
			
			await connection.commit();
			
			connection.release();
			
			console.log(tmp);

			console.log("successfully loaded!")
			return [true, tmp];
		}
		catch(err) {
			await connection.rollback();
			connection.release();
			console.log("[DB output error in <readData> function] " + err);
			return false;
		}
		return true;
	}
	catch(err) {
		console.log("[DB connection error in <readData> function] " + err);
		return false;
	}
}
const loadComments = async (id) => {	
	try {
		const connection = await conn.getConnection(async conn=>conn);
		try {
			await connection.beginTransaction();
			
			let readQuery='';

			readQuery = "SELECT c.id, name, comment, regdate FROM Comment as c INNER JOIN LogIn_db as L ON c.writer = L.id WHERE boardId =" + id;
				
			let tmp = [];
			
			[tmp] = await connection.query(readQuery);
			
			await connection.commit();
			
			connection.release();
			
			console.log(tmp);

			console.log("successfully loaded!")
			return [true, tmp];
		}
		catch(err) {
			await connection.rollback();
			connection.release();
			console.log("[DB output error in <loadComments> function] " + err);
			return false;
		}
		return true;
	}
	catch(err) {
		console.log("[DB connection error in <loadComments> function] " + err);
		return false;
	}
}

module.exports = router;
