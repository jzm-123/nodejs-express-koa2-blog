//加密
const crypto=require('crypto')

//密钥
const SEC_KEY='WJol_8776#';

//md5
function md5(content){
    let md5=crypto.createHash('md5');
    return md5.update(content).digest('hex');
}

//加密函数
function genPassword(password){
    const str=`password=${password}&key=${SEC_KEY}`;
    return md5(str);
}
// console.log(genPassword('123'))
module.exports={genPassword}