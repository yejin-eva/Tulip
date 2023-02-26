var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index.js');
var usersRouter = require('./routes/users.js');
var curriculumRouter = require('./routes/curriculum.js');
var mypageRouter = require('./routes/mypage.js');
var mypage2Router = require('./routes/mypage2.js');
var forumCertifyRouter = require('./routes/forumCertify.js');
var forumQnARouter = require('./routes/forumQnA.js');
var forumStudyRouter = require('./routes/forumStudy.js');
var forumQnAContentRouter = require('./routes/forumQnAContent.js');
var quizRouter = require('./routes/quiz.js');
var studyRouter = require('./routes/study.js');
var WritingRouter = require('./routes/Writing.js');
var signinRouter = require('./routes/signin.js');
var signupRouter = require('./routes/signup.js');




var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/curriculum', curriculumRouter);
app.use('/mypage', mypageRouter);
app.use('/mypage2', mypage2Router);
app.use('/forumCertify', forumCertifyRouter);
app.use('/forumQnA', forumQnARouter);
app.use('/forumStudy', forumStudyRouter);
app.use('/forumQnAContent', forumQnAContentRouter);
app.use('/quiz', quizRouter);
app.use('/study', studyRouter);
app.use('/forumWriting', WritingRouter);
app.use('/signin', signinRouter);
app.use('/signup', signupRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
