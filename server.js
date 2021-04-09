const http = require("http");
const routes = require('./router');

const server = http.createServer(routes.handler);

server.listen(3000,function(){
    console.log("Server is started on 3000");
})