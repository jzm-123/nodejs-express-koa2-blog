var createError = require('http-errors');
var express = require('express');
var path = require('path');
const fs=require('fs')
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session=require('express-session')
const RedisStore=require('connect-redis')(session)

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
const blogRouter=require('./routes/blog')
const userRouter=require('./routes/user')
var app = express();//http请求的实例
if(process.env.NODE_ENV==='production'){
  //开发环境，测试环境
  app.use(logger('dev',{
  }));
}else{
  //线上环境
  const fileName=path.join(__dirname,'logs','access.log');
  const writeStream=fs.createWriteStream(fileName,{
    flags:'a'
  })
  app.use(logger('combined',{
    stream:writeStream
  }));
}
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
//生成（写）日志


app.use(express.json());//处理req.body post data（application/json）
app.use(express.urlencoded({ extended: false }));//处理req.body post data（x-www-form-urlencoded）
app.use(cookieParser());//解析cookie
const RedisClient=require('./db/redis')
const sessionStore=new RedisStore({
    client:RedisClient
})
app.use(session({
  secret:'WJol_8776#_2324',
  cookie:{
    // path:'/',//默认配置
    // httpOnly:true,//默认配置
    maxAge:24*60*60*1000
  },
  resave: false,
  saveUninitialized: false,
  store:sessionStore
}))
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);//路由注册,第一个参数（父path）和第二个参数拼接作为最终路径
// app.use('/users', usersRouter);
app.use('/api/blog',blogRouter);
app.use('/api/user',userRouter)
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
