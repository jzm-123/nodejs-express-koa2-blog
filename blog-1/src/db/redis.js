let redis = require("redis")
const {REDIS_CONF}=require('../conf/db')
let client = redis.createClient(REDIS_CONF.port,REDIS_CONF.host);
client.on("error", function (err) {
    console.log("Error " + err);
});
client.connect();
function set(key,value){
    if(typeof value==='object'){
        value=JSON.stringify(value);
    }
    client.set(key, value);
}
function get(key){
    const promise=new Promise((resolve,reject)=>{
        client.get(key).then((value,err)=>{
            if(err){
                reject(err);
                return;
            }
            if(value==null){
                resolve(null);
                return;
            }
            try{
                resolve(JSON.parse(value));
            }catch(e){
                resolve(value);
            }
            // client.quit();
        })
    })
    return promise;
}
module.exports={
    set,
    get
}