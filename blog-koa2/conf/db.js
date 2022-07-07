// const env=process.env
// console.log(env)
let MYSQL_CONF
// if(env==='dev'){
//     MYSQL_CONF={
//         host:'localhost',
//         user:'root',
//         password:'123456',
//         port:'3306',
//         database:'myblog'
//     }
// }
// if(env==='production'){
//     MYSQL_CONF={
//         host:'localhost',
//         user:'root',
//         password:'123456',
//         port:'3306',
//         database:'myblog'
//     }
// }
MYSQL_CONF={
    host:'localhost',
    user:'root',
    password:'123456',
    port:'3306',
    database:'myblog'
}
REDIS_CONF={
    port:6379,
    host:'127.0.0.1'
}
module.exports={
    MYSQL_CONF,
    REDIS_CONF
}