const fs=require('fs')
const path=require('path')
const fileName=path.resolve(__dirname,'data.txt');
// fs.readFile(fileName,(err,data)=>{//文件太大不行
//     if(err){
//         console.error(err);
//         return;
//     }
//     console.log(data.toString());//data为二进制
// })
// const content='这是新写入的内容\n';
// const opt={
//     flag:'a'//追加写入append，覆盖w（write）
// }
// const writeName=path.resolve(__dirname,'write.txt');
// fs.writeFile(writeName,content,opt,(err)=>{
//     if(err){
//         console.error(err);
//     }
// })
