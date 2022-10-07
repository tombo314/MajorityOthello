const http = require("http");
const fs = require("fs");
const socket = require("socket.io");
const server = http.createServer((req, res)=>{
    // main
    if (req.url=="/"){
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(fs.readFileSync("main/index.html"));
    } else if (req.url=="/main/main.css"){
        res.writeHead(200, {"Content-Type": "text/css"});
        res.end(fs.readFileSync("main/main.css"));
    } else if (req.url=="/main/main.js"){
        res.writeHead(200, {"Content-Type": "application/javascript"});
        res.end(fs.readFileSync("main/main.js"));
    }
    // wait
    else if(req.url=="/wait/wait.html"){
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(fs.readFileSync("wait/wait.html"));
    } else if(req.url=="/wait/wait.css"){
        res.writeHead(200, {"Content-Type": "text/css"});
        res.end(fs.readFileSync("wait/wait.css"));
    } else if(req.url=="/wait/wait.js"){
        res.writeHead(200, {"Content-Type": "application/javascript"});
        res.end(fs.readFileSync("wait/wait.js"));
    }
    // battle
    else if (req.url=="/battle/battle.html"){
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(fs.readFileSync("battle/battle.html"));
    } else if(req.url=="/battle/battle.css"){
        res.writeHead(200, {"Content-Type": "text/css"});
        res.end(fs.readFileSync("battle/battle.css"));
    } else if(req.url=="/battle/battle.js"){
        res.writeHead(200, {"Content-Type": "application/javascript"});
        res.end(fs.readFileSync("battle/battle.js"));
    }
}).listen(process.env.PORT || 8000);
const io = socket(server);

let users = ["dummy1", "dummy2", "dummy3"];
let usersNum;
let cntUsers = 0;
io.on("connection", (socket)=>{
    socket.on("need-users", (data)=>{
        io.sockets.emit("need-users", {value: users});
    });
    socket.on("name", (data)=>{
        users.push(data.value);
    });
    socket.on("waiting-started", (data)=>{
        if (users.length==1 || true){
            io.sockets.emit("waiting-started", {value: "a"});
        }
    });
    socket.on("battle-ready", (data)=>{
        io.sockets.emit("battle-ready", {value: ""});
        usersNum = users.length;
    });
    socket.on("battle-start", (data)=>{
        cntUsers++;
        if (cntUsers>=usersNum || true){
            io.sockets.emit("battle-start", {value: users});
        }
    });
});
