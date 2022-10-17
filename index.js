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
    // pictures
    else if (req.url=="/pictures/othello_field.png"){
        res.writeHead(200, {"Content-Type": "img/png"});
        res.end(fs.readFileSync("pictures/othello_field.png"));
    }
}).listen(process.env.PORT || 8000);
const io = socket(server);

let includesInDict=(d, value)=>{
    for (let v in d){
        if (v==value){
            return true;
        }
    }
    return false;
}

let users = {"dummy1": [200, 200], "dummy2": [150, 180], "dummy3": [90, 240]};
let usersNum;
let cntUsers = 0;
io.on("connection", (socket)=>{
    socket.on("need-users", (data)=>{
        io.sockets.emit("need-users", {value: users});
    });
    socket.on("name", (data)=>{
        users[data.value] = "";
    });
    socket.on("waiting-started", (data)=>{
        if (Object.keys(users).length==1 || true){
            io.sockets.emit("waiting-started", {value: ""});
        }
    });
    socket.on("waiting-finished", (data)=>{
        io.sockets.emit("waiting-finished", {value: ""});
        usersNum = Object.keys(users).length;
    });
    socket.on("user-info-init", (data)=>{
        let userInfo = data.value;
        if (userInfo!=null){
            let username = userInfo[0];
            let userX = userInfo[1];
            let userY = userInfo[2];
            cntUsers++;
            users[username] = [userX, userY];
        }
        console.log(users);
        if (cntUsers>=usersNum || true){
            io.sockets.emit("user-info-init", {value: users});
        }
    });
    socket.on("coordinates-changed", (data)=>{
        // 全員の座標を全員に送信する
    });
});
