const {getList,getDetail,newBlog,updateBlog,deleteBlog}=require('../controller/blog')
const {SuccessModel,ErrorModel}=require('../model/resModel')

//统一的登陆验证中间件
const loginCheck=(req)=>{
    if(!req.session.username){
        return Promise.resolve(
            new ErrorModel('尚未登陆')
            );
    }
}

const handleBlogRouter=(req,res)=>{
    const method=req.method;
    const id=req.query.id || '';
    const url=req.url;
    const path=url.split('?')[0];
    //获取博客列表
    if(method==='GET' && path==='/api/blog/list'){
        let author=req.query.author || '';
        const keyword=req.query.keyword || '';
        if(req.query.isadmin){
            const loginCheckResult=loginCheck(req);
            if(loginCheckResult){
                return loginCheckResult;
            }
            author=req.session.username;
        }
        const result=getList(author,keyword);
        return result.then(listData=>{
            return new SuccessModel(listData);
        })
        // const listData=getList(author,keyword);
        // return new SuccessModel(listData)
        // return {
        //     msg:'这是获取博客列表的接口'
        // }
    }
    //获取博客详情
    if(method==='GET' && path==='/api/blog/detail'){
        const result=getDetail(id);
        return result.then(detailData=>{
            return new SuccessModel(detailData);
            })
    }
    //新建一篇博客
    if(method==='POST' && path==='/api/blog/new'){
        const loginCheckResult=loginCheck(req);
        if(loginCheckResult){
            return loginCheckResult;
        }
        const author=req.session.username;
        req.body.author=author
        const result=newBlog(req.body)
        return result.then(data=>{
            return new SuccessModel(data)
        })
        // return {
        //     msg:'这是新建博客的接口'
        // }
    }
    //更新一篇博客
    if(method==='POST' && path==='/api/blog/update'){
        const loginCheckResult=loginCheck(req);
        if(loginCheckResult){
            return loginCheckResult;
        }
        const result=updateBlog(id,req.body);
        return result.then(val=>{
            if(val){
                return new SuccessModel()
            }
            else{
                return new ErrorModel('update failed')
            }
        })
        // return {
        //     msg:'这是更新博客的接口'
        // }
    }
    //删除一篇博客
    if(method==='POST' && path==='/api/blog/del'){
        const loginCheckResult=loginCheck(req);
        if(loginCheckResult){
            return loginCheckResult;
        }
        const author=req.session.username;
        const result=deleteBlog(id,author);
        return result.then(val=>{
            if(val){
                return new SuccessModel()
            }
            else{
                return new ErrorModel('delete failed')
            }
        })
    }
}
module.exports=handleBlogRouter