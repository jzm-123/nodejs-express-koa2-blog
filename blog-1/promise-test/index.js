const fs=require('fs');
const path=require('path');
function getFileContent(fileName,callback){
    const fullFileName=path.resolve(__dirname,'files',fileName);
    fs.readFile(fullFileName,(err,data)=>{
        if(err){
            console.error(err);
            return;
        }
        callback(JSON.parse(data.toString()));
    })
}
getFileContent