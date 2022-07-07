const http=require('http');
const slice=Array.prototype.slice;
class LikeExpress{
    constructor(){
        //存放中间件的列表
        this.routes={
            //use中间件
            all:[],         
            get:[],
            post:[],
        }
    }
    //注册中间件
    register(path){
        const info={};
        if(typeof path=='string'){
            info.path=path;
            //从第二个参数开始,转换为数组,存入stack
            info.stack=slice.call(arguments,1);
        }else{
            info.path='/';
            //从第一个参数开始,转换为数组,存入stack
            info.stack=slice.call(arguments,0);
        }
        return info;
    }
    use(){
        const info=this.register.apply(this,arguments);
        this.routes.all.push(info);
    }
    get(){
        const info=this.register.apply(this,arguments);
        this.routes.get.push(info);
    }
    post(){
        const info=this.register.apply(this,arguments);
        this.routes.post.push(info);
    }
    match(method,url){
        let stack=[];
        if(url==='/favicon.ico'){
            return stack;
        }
        const curRoutes=[];
        curRoutes=curRoutes.concat(this.routes.all);
        curRoutes=curRoutes.concat(this.routes[method]);
        curRoutes.forEach(routeInfo=>{
            if(url.indexOf(routeInfo.path)!==-1){
                // url === '/api/get-cookie' 且 routeInfo.path=='/'
                // url === '/api/get-cookie' 且 routeInfo.path=='/api'
                // url === '/api/get-cookie' 且 routeInfo.path=='/api/get-cookie'
                stack=stack.concat(routeInfo.stack);
            }
        })
        return stack;
    }
    //核心的next机制
    handle(req,res,stack){
        const next=()=>{
            //拿到第一个匹配的中间件
            const middleware=stack.shift();
            if(middleware){
                //执行中间件函数
                middleware(req,res,next);
            }
        }
        next();
    }
    callback(){
        return (req,res)=>{
            res.json=(data)=>{
                res.setHeader('Content-type','application/json');
                res.end(JSON.stringify(data));
            }
            const url=req.url;
            const method=req.method.toLowerCase();
            //区分哪些需要访问，哪些不需要访问
            const resultList=this.match(method,url);
            this.handle(req,res,resultList);
        }
    }
    listen(...args){
        const server=http.createServer(this.callback());
        server.listen(...args);
    }
}
module.exports=()=>{
    return new LikeExpress()
}