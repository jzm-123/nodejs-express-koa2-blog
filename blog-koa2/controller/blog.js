const {exec}=require('../db/mysql');
const xss=require('xss')
const getList=async (author,keyword)=>{//处理数据
    let sql=`select * from blogs where 1=1 `//1=1占位置，以免where后面直接跟order报错
    if(author){
        sql+=`and author='${author}' `
    }
    if(keyword){
        sql+=`and title like '%${keyword}%' `
    }
    sql+=`order by createtime desc;`
    return await exec(sql);
}
const getDetail=async (id)=>{
    let sql=`select * from blogs where id='${id}'`
    const rows=await exec(sql)
    return rows[0];
}
const newBlog=async (blogData={})=>{
    // console.log('blogData:',blogData)
    const title=xss(blogData.title);
    const content=xss(blogData.content);
    const author=blogData.author;
    const createtime=Date.now();
    let sql=`insert into blogs ( title, content,createtime,author ) values ( '${title}','${content}','${createtime}','${author}' );`
    const insertData=await exec(sql);
    return {
        id:insertData.insertId
    }
}
const updateBlog=async (id,blogData={})=>{
    const title=blogData.title;
    const content=blogData.content;
    const sql=`update blogs set title='${title}',content='${content}' where id=${id}`//''表示字符串
    const updateData=await exec(sql);
    if(updateData.affectedRows>0){
        return true;
    }
    return false;
}
const deleteBlog=async (id,author)=>{
    const sql=`delete from blogs where id=${id} and author='${author}'`
    const deleteData=await exec(sql);
    if(deleteData.affectedRows>0){
        return true;
    }
    return false;
}
module.exports={
    getList,
    getDetail,
    newBlog,
    updateBlog,
    deleteBlog
}