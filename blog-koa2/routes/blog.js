const router=require('koa-router')();
router.prefix('/api/blog')
const {getList,getDetail,newBlog,updateBlog,deleteBlog}=require('../controller/blog')
const {SuccessModel,ErrorModel}=require('../model/resModel')
const loginCheck=require('../middleware/loginCheck')
router.get('/list',async function(ctx, next) {
    let author=ctx.query.author || '';
    const keyword=ctx.query.keyword || '';
    if(ctx.query.isadmin){
        if(ctx.session.username==null){
            ctx.body=(new ErrorModel('未登录'))
            return;
        }
        author=ctx.session.username;
    }
    const listData=await getList(author,keyword);
    ctx.body=new SuccessModel(listData);
});
router.get('/detail',async function(ctx, next) {
    const detailData=await getDetail(ctx.query.id);
    ctx.body=new SuccessModel(detailData);
});
router.post('/new', loginCheck,async function(ctx, next) {
    const author=ctx.session.username;
    const body=ctx.request.body
    body.author=author
    const data=await newBlog(body)
    ctx.body=new SuccessModel(data);
});
router.post('/update',async function(ctx, next) {
    const val=await updateBlog(ctx.query.id,ctx.request.body);
    if(val){
        ctx.body=new SuccessModel();
    }
    else{
        ctx.body=new ErrorModel('update failed');
    }
});
router.post('/del', loginCheck,async function(ctx, next) {
    const author=ctx.session.username;
    const val=await deleteBlog(ctx.query.id,author);
    if(val){
        ctx.body=new SuccessModel();
    }
    else{
        ctx.body=new ErrorModel('delete failed');
    }

});
router.get('/session-test',async function(ctx, next) {
    const session=ctx.session;
    if(session.viewNum==null){
        session.viewNum=0;
    }
    session.viewNum++;
    ctx.body={
        viewNum:session.viewNum
    }
});
module.exports = router;