var express = require('express');
var router = express.Router();
const {login}=require('../controller/user')
const {get,set}=require('../db/redis')
const {SuccessModel,ErrorModel}=require('../model/resModel')

/* GET home page. */
router.post('/login', function(req, res, next) {
    const {username,password}=req.body;
    const result=login(username,password);
    return result.then(data=>{
        if(data.username){
            // 设置session
            req.session.username=data.username
            req.session.realname=data.realname
            res.json(new SuccessModel());
            return;   
        }
        res.json(new ErrorModel('login failed'));
    })
});
router.get('/login-test', function(req, res, next) {
    const session=req.session;
    if(session.username){
        res.json({
            errno:0,
            msg:'登录成功'
        })
        return;
    }
    res.json({
        errno:-1,
        msg:'未登录'
    })
});
module.exports = router;
