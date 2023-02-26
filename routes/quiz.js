var express = require('express');
var router = express.Router();

//mysql setting
const mysql = require('mysql2/promise');
const connInfo = require('./db/db_info').dev;
const conn = mysql.createPool(connInfo);

/* GET home page. */

router.get('/', function(req, res, next) {
  res.render('quiz');
});


router.get('/showQuizContent/:article_id', async function (req, res) {
	let data = [];
	let flag;
	
	let results = [];
	let id = req.params.article_id;
	results = await loadData(id);
	console.log(results);	
	
	if(results[0]) { //if true
		data = results[1];
		flag = 1;
	}
	else { //if false 
		data = [{
			'id': '',
			'subchapterid': '',
			'title': '',
			'question1': '',
			'question2': '',
			'question3': '',
			'answer1': '',
			'answer2': '',
			'answer3': '',
			'previousbtn': '',
			'prevbtnlink': '',
			'nextbtn': '',
			'nextbtnlink': ''
		}];
		flag = 0;
	}
	
	//받은 데이터 ajax통해 font-end로 보내기
	console.log(data);
	res.render('quiz.ejs',
		{
		'data': data,
		'flag': flag
		});
	 //	res.json({
	 //	'data': data,
	 //	'flag': flag,		
	// });
	console.log(data);
});
	

//function
const loadData = async (id) => { 
	try {
		const connection = await conn.getConnection(async conn=>conn);
		try {
			await connection.beginTransaction();
			
			//query 생성
			let select_query = "SELECT id, title, question1, question2, question3, answer1, answer2, answer3, previousbtn, prevbtnlink, nextbtn, nextbtnlink FROM Quiz WHERE id =" + id;
			
			console.log(select_query);
			
			//query를 mysql에 입력하기
			let tmp = [];
			[tmp] = await connection.query(select_query);
			
			await connection.commit();
			connection.release();
			
			console.log(tmp);
			
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

module.exports = router;


/* GET home page.   
router.get('/', function(req, res, next) {
  res.render('quiz', { title: "Part 1 HTML basics and layout", question1: "What does HTML stand for?", answer1: "HTML stands for Hyper Text Markup Language.", 
						  question2: "What is the correct HTML element for inserting a line break?", answer2: "It is br inside brackets.", 
						  question3: "I ran out of questions", answer3: "I need to find a way to insert brackets normally.", 
						  previousbtn: "Back to Study", nextbtn: "Next Section →", prevbtnlink: "/study", nextbtnlink: "/quiz/2"});
});

router.get('/2', function(req, res, next) {
  res.render('quiz', { title: "Part 2 Inserting Content", question1: "What does HTML not stand for?", answer1: "Anything but Hyper Text Markup Language.", 
						  question2: "How do you solve this question?", answer2: "No answer.", 
						  question3: "I ran out of questions again", answer3: "Stay chill.", 
					      previousbtn: "<- Previous", nextbtn: "Next Section →", prevbtnlink: "/quiz", nextbtnlink: "/quiz/3"});
});

router.get('/3', function(req, res, next) {
  res.render('quiz', { title: "Part 3 Decoration", question1: "What component is used for changing the background?", answer1: "background-color", 
						  question2: "What component is used to change the font size? ", answer2: "font-size", 
						  question3: "Last question here we go", answer3: "I forgot what to write", 
					      previousbtn: "<- Previous", nextbtn: "Back to Study", prevbtnlink: "/quiz/2", nextbtnlink: "/study"});
});
 */


