var express = require('express');
var router = express.Router();
let moment = require('moment');

// mysql setting //
const mysql = require('mysql2/promise');
const connInfo = require('./db/db_info').dev;
const conn = mysql.createPool(connInfo);

/* GET home page. */
router.get('/', async function(req, res) {
    let data = [];	
	let flag;
	let id = null;
	let results = await loadData(id);
	
	id = 1;
	let comments1 = [];
	let cresults1= await loadComments(id);
	
	id = 2;
	let comments2 = [];
	let cresults2= await loadComments(id);
	
	id = 3;
	let comments3 = [];
	let cresults3= await loadComments(id);
	
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
 	
	if(cresults1[0]) {
		comments1 = cresults1[1];
	}
	else {
		comments1 = [{
			'id':'',
			'name':'',
			'comment':'',
			'regdate':''
		}];
	}
	
	if(cresults2[0]) {
		comments2 = cresults2[1];
	}
	else {
		comments2 = [{
			'id':'',
			'name':'',
			'comment':'',
			'regdate':''
		}];
	}
	
	if(cresults3[0]) {
		comments3 = cresults3[1];
	}
	else {
		comments3 = [{
			'id':'',
			'name':'',
			'comment':'',
			'regdate':''
		}];
	}
	
	res.render('mypage',
		{
			'data': data,
			'flag': flag,	
			'comments1': comments1,
			'comments2': comments2,
			'comments3': comments3,
			'moment': moment 
		}
	);
	
});	

const loadData = async (id) => {	
	try {
		const connection = await conn.getConnection(async conn=>conn);
		try {
			await connection.beginTransaction();
			
			let readQuery='';
			// 전체 게시글 목록 조회
			if(id == null) 
				readQuery = "SELECT b.id, name, title, content, regdate FROM Board as b INNER JOIN LogIn_db as u WHERE b.writer = u.id";
			
			// 하나의 게시글 조회
			else 
				readQuery = "SELECT b.id, name, title, content, regdate FROM Board as b INNER JOIN LogIn_db as u WHERE b.writer = u.id AND b.id = " + id;
				
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

			readQuery = "SELECT c.id, name, comment, regdate FROM Comment as c INNER JOIN LogIn_db as u ON c.writer = u.id WHERE boardId =" + id;
			console.log(readQuery)
				
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