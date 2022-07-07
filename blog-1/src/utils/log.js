const fs=require('fs')
const path=require('path')

//写日志
function writeLog(wirteStream,log){
    wirteStream.write(log+'\n');
}

//第一个桶
function createWriteStream(fileName){
    const fullFileName=path.join(__dirname,'../','logs/',fileName);
    const wirteStream=fs.createWriteStream(fullFileName,{
        flags:'a'
    })
    return wirteStream;
}

//写访问日志
const accessWriteStream=createWriteStream('access.log')
function access(log){
    writeLog(accessWriteStream,log);
}
module.exports={
    access
}