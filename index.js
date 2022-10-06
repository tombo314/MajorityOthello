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

let users = [];
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
        if (users.length==1){
            io.sockets.emit("waiting-started", {value: "a"});
        }
    });
    socket.on("battle-ready", (data)=>{
        io.sockets.emit("battle-ready", {value: ""});
        usersNum = users.length;
    });
    socket.on("battle-start", (data)=>{
        cntUsers++;
        if (cntUsers>=usersNum){
            io.sockets.emit("battle-start", {value: ""});
        }
    });
});

/*
最初にマッチング待機状態になった人を基準として、ｎ分経過時点でゲームを開始する。ここで最初の人がサーバーに通知する。サーバーはユーザー数を確認する。バトル画面への遷移後、各ユーザーからサーバーに通知する。サーバーは、前もって確認したユーザー数と遷移後の通知数が一致していれば全ユーザーに通知する。カウントダウンが始まり、ゲームスタートとする。
*/