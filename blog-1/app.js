const querystringify=require('querystringify')
const handleBlogRouter=require('./src/router/blog')
const handleUserRouter=require('./src/router/user')
const {access}=require('./src/utils/log')
//session 数据
const SESSION_DATA={}

// 获取 cookie 的过期时间
const getCookieExpires = () => {
    const d = new Date()
    d.setTime(d.getTime() + (24 * 60 * 60 * 1000))
    // console.log('d.toGMTString() is ', d.toGMTString())
    return d.toGMTString()
}

const getPostData=(req)=>{
    const promise=new Promise((resolve,reject)=>{
        if(req.method!=='POST'){
            resolve({});
            return;
        }
        if(req.headers['content-type']!=='application/json'){
            resolve({});
            return;
        }
        let postData="";
        req.on('data',chunk=>{//监听数据流
            postData+=chunk.toString()
        })
        req.on('end',()=>{//数据接收结束后触发
            if(!postData){
                resolve({});
                return;
            }
            resolve(JSON.parse(postData));
        })
    })
    return promise;
}
const serverHandle=(req,res)=>{
    //记录access log
    access(`${req.method} -- ${req.url} -- ${req.headers['user-agent' ]} -- ${Date.now()}`)
    res.setHeader('Content-type','application/json');
    //处理blog路由
    const url=req.url;
    req.path=url.split('?')[0]

    req.query=querystringify.parse(url.split('?')[1])
    
    //解析cookie
    req.cookie={};
    const cookieStr=req.headers.cookie || ''//k1=v1;k2=v2
    cookieStr.split(';').forEach(item=>{
        if(!item){
            return
        }
        const arr=item.split('=');
        const key=arr[0].trim();
        const value=arr[1];
        req.cookie[key]=value;
    })
    // console.log(req.cookie)

    //解析session
    // 解析 session
    let needSetCookie = false
    let userId = req.cookie.userid
    if (userId) {
        if (!SESSION_DATA[userId]) {
            SESSION_DATA[userId] = {}
        }
    } else {
        needSetCookie = true
        userId =  `${Date.now()}_${Math.random()}`
        SESSION_DATA[userId] = {}
    }
    req.session = SESSION_DATA[userId]

    //处理post 数据
    getPostData(req).then(postData=>{
        req.body=postData;
        const blogResult=handleBlogRouter(req,res);
        if(blogResult){
            if(needSetCookie){
                res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
            }
            blogResult.then(blogData=>{
                res.end(JSON.stringify(blogData));
                
            })
            return;
        }
        // const blogData=handleBlogRouter(req,res);
        // if(blogData){
        //     res.end(JSON.stringify(blogData));
        //     return;
        // }

        const userResult=handleUserRouter(req,res);
        if(userResult){
            if(needSetCookie){
                res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
            }
            userResult.then(userData=>{
                res.end(JSON.stringify(userData));
            })
            return;
        }
        //未命中路由
        res.writeHead(404,{"Content-type":"text/plain"})//纯文本
        res.write("404 Not Found\n");
        res.end();
    })
}
module.exports=serverHandle
//process.env.NODE_ENV