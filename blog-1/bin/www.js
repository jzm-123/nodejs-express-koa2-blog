const http=require('http')
const PORT=8000
hostname='localhost'
const serverHandle=require('../app')
const server=http.createServer(serverHandle)
server.listen(PORT,()=>{
    console.log(`Server running at http://${hostname}:${PORT}/`);
})