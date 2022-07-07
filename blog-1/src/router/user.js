const {login}=require('../controller/user')
const {get,set}=require('../db/redis')
const {SuccessModel,ErrorModel}=require('../model/resModel')
const handleUserRouter=(req,res)=>{
    const method=req.method;
    const url=req.url;
    const path=url.split('?')[0];
    //登录
    if(method==='POST' && path==='/api/user/login'){ //POST
        const {username,password}=req.body; //req.body
        const result=login(username,password);
        return result.then(data=>{
            if(data.username){
                // 设置session
                req.session.username=data.username
                req.session.realname=data.realname
                // console.log('req.session:',req.session)
                set(req.sessionId,req.session);
                // res.setHeader('Set-Cookie',`username=${data.username};path=/; httpOnly`)//只能服务器端改cookie
                return new SuccessModel();   
            }
            return new ErrorModel('login failed')
        })
    }

    //登陆验证的测试
    // if(method==='GET' && req.path==='/api/user/login-test'){
    //     if(req.session.username){
    //         return Promise.resolve(new SuccessModel({session:req.session}));
    //     }
    //     return Promise.resolve(new ErrorModel('尚未登陆'));
    // }
}
module.exports=handleUserRouter