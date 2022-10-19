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

let users = {
    // "dummy1": {
    //     "userX":200,
    //     "userY":400,
    //     "color":"red"
    // },
    // "dummy2":{
    //     "userX":150,
    //     "userY":80,
    //     "color":"blue"
    // },
    // "dummy3": {
    //     "userX":310,
    //     "userY":240,
    //     "color":"blue"
    // }
};
let waiting = [];
let usersNum;
let cntUsers = 0;
let cntRed = 0;
let cntBlue = 0;
let color;
io.on("connection", (socket)=>{
    socket.on("need-users", (data)=>{
        io.sockets.emit("need-users", {value: waiting});
    });
    socket.on("name", (data)=>{
        waiting.push(data.value);
    });
    socket.on("waiting-started", (data)=>{
        if (waiting.length==1){
            io.sockets.emit("waiting-started", {value: ""});
        }
    });
    socket.on("waiting-finished", (data)=>{
        io.sockets.emit("waiting-finished", {value: ""});
        usersNum = waiting.length;
        waiting = [];
    });
    socket.on("user-info-init", (data)=>{
        let userInfo = data.value;
        if (userInfo!=null){
            let username = userInfo["username"];
            let userX = userInfo["userX"];
            let userY = userInfo["userY"];
            cntUsers++;
            if (cntRed<=cntBlue){
                color = "red";
                cntRed++;
            } else {
                color = "blue";
                cntBlue++;
            }
            users[username] = {"userX": userX, "userY":userY, "color":color};
        }
        if (cntUsers>=usersNum){
            io.sockets.emit("user-info-init", {value: users});
        }
    });
    socket.on("coordinate-changed", (data)=>{
        io.sockets.emit("coordinate-changed", {value: data.value});
    });
});
