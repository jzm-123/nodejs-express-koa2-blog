const {exec}=require('../db/mysql');
const xss=require('xss')
const getList=(author,keyword)=>{//处理数据
    let sql=`select * from blogs where 1=1 `//1=1占位置，以免where后面直接跟order报错
    if(author){
        sql+=`and author='${author}' `
    }
    if(keyword){
        sql+=`and title like '%${keyword}%' `
    }
    sql+=`order by createtime desc;`
    return exec(sql);
}
const getDetail=(id)=>{
    let sql=`select * from blogs where id='${id}'`
    return exec(sql).then(rows=>{
        return rows[0];
    });
}
const newBlog=(blogData={})=>{
    // console.log('blogData:',blogData)
    const title=xss(blogData.title);
    const content=xss(blogData.content);
    const author=blogData.author;
    const createtime=Date.now();
    let sql=`insert into blogs ( title, content,createtime,author ) values ( '${title}','${content}','${createtime}','${author}' );`
    return exec(sql).then(insertData=>{
        return {
            id:insertData.insertId
        }
    });
    // return {
    //     id:3,
    // }
}
const updateBlog=(id,blogData={})=>{
    const title=blogData.title;
    const content=blogData.content;
    const sql=`update blogs set title='${title}',content='${content}' where id=${id}`//''表示字符串
    return exec(sql).then(updateData=>{
        if(updateData.affectedRows>0){
            return true;
        }
        return false;
    })
}
const deleteBlog=(id,author)=>{
    const sql=`delete from blogs where id=${id} and author='${author}'`
    return exec(sql).then(deleteData=>{
        if(deleteData.affectedRows>0){
            return true;
        }
        return false;
    })
}
module.exports={
    getList,
    getDetail,
    newBlog,
    updateBlog,
    deleteBlog
}