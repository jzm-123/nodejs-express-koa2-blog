let redis = require("redis")
const {REDIS_CONF}=require('../conf/db')
let RedisClient = redis.createClient(REDIS_CONF.port,REDIS_CONF.host);
RedisClient.on("error", function (err) {
    console.log("Error " + err);
});
RedisClient.on('connect', () => console.log('Connected to Redis!'));
module.exports=RedisClient
