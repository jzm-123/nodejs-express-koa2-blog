let redis = require("redis")
let client = redis.createClient();
client.on("error", function (err) {
    console.log("Error " + err);
});
client.connect();

client.set('key', 'value');
client.get('key',(data,err)=>{
    console.log('test')
    if(err){
        console.error(err);
        return;
    }
    console.log(data)
    client.quit();
});