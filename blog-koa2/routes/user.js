const router=require('koa-router')();
router.prefix('/api/user')
const {login}=require('../controller/user')
const {get,set}=require('../db/redis')
const {SuccessModel,ErrorModel}=require('../model/resModel')

/* GET home page. */
router.post('/login', async function(ctx, next) {
    const {username,password}=ctx.request.body;
    const data=await login(username,password);
    if(data.username){
        // 设置session
        ctx.session.username=data.username
        ctx.session.realname=data.realname
        ctx.body=new SuccessModel();
        return;
    }
    ctx.body=new ErrorModel('login failed');
});
router.get('/session-test',async function(ctx, next) {
    const session=ctx.session;
    if(session.username){
        ctx.body={
            errno:0,
            msg:'登录成功'
        }
        return;
    }
    ctx.body={
        errno:-1,
        msg:'未登录'
    }
});
module.exports = router;