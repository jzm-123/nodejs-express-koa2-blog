const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')

//session
const session=require('koa-generic-session');
const redisStore=require('koa-redis')
const {REDIS_CONF}=require('./conf/db')
const fs=require('fs')
const morgan=require('koa-morgan')
const path=require('path')

const index = require('./routes/index')
const users = require('./routes/users')
const blog = require('./routes/blog')
const user = require('./routes/user')
// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger，记录请求所耗费的时间
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})
//session 配置
app.keys=['WJol_8776#_23223424']
app.use(session({
  cookie:{
    path:'/',//默认配置
    httpOnly:true,//默认配置
    maxAge:24*60*60*1000
  },
  store:redisStore({
    all:`${REDIS_CONF.host}:${REDIS_CONF.port}`
  })
}))

if(process.env.NODE_ENV==='production'){
  //开发环境，测试环境
  app.use(morgan('dev',{
  }));
}else{
  //线上环境
  const fileName=path.join(__dirname,'logs','access.log');
  const writeStream=fs.createWriteStream(fileName,{
    flags:'a'
  })
  app.use(morgan('combined',{
    stream:writeStream
  }));
}

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(blog.routes(), blog.allowedMethods())
app.use(user.routes(), user.allowedMethods())
// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
