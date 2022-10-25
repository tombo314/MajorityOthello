/*
sessionStorage で管理する変数

isHost : 自分が部屋を立てたかどうか
username : 自分のユーザー名
roomName : 自分が入っている部屋（ホストのユーザー名）
samePageLoaded : 同じページを一度読み込んだかどうか
*/

let http = require("http");
let fs = require("fs");
let socket = require("socket.io");
let server = http.createServer((req, res)=>{
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
let io = socket(server);

/*
ユーザー情報を管理する連想配列

rooms = {
    // ホストのユーザー名をキーとする、部屋ごとの連想配列
    username: {
        "roomName": roomName,
        "roomPassword": roomPassword,
        "users": [username, username, ...],
        "cntRed": 0,
        "cntBlue": 0,
        "cntStone": 4,
        "isRed": true,
        "finished": false,
        "keysValid": true
    },
    ...
}
users = {
    // 各ユーザーのユーザー名をキーとする、ユーザー単位の連想配列
    username: {
        "ownX": ownX,
        "ownY": ownY,
        "color": "red",
    },
    ...
}
*/
let rooms = {}
let users = {}
let color;
io.on("connection", (socket)=>{
    // 前回作った部屋と前回のユーザー情報を削除する
    socket.on("delete-user", (data)=>{
        delete rooms[data.value];
        delete users[data.value];
    });
    // user の情報を返す
    socket.on("need-users", ()=>{
        io.sockets.emit("need-users", {value:users});
    });
    // rooms に部屋の情報を登録する
    socket.on("room-make-finished", (data)=>{
        let roomInfo = data.value;
        let roomName = roomInfo["roomName"];
        let roomPassword = roomInfo["roomPassword"];
        let roomUsername = roomInfo["roomUsername"];
        rooms[roomUsername] = {
            "roomName":roomName,
            "roomPassword":roomPassword,
            "users":[roomUsername],
            "cntRed": 0,
            "cntBlue": 0,
            "cntStone": 4,
            "isRed": true,
            "finished": false,
            "keysValid": true
        };
        users[roomUsername] = {};
        io.sockets.emit("update-rooms", {value: rooms});
    });
    // 対応する部屋の users にゲストを登録する
    socket.on("register-name", (data)=>{
        let username = data.value["username"];
        let hostUsername = data.value["hostUsername"];
        rooms[hostUsername]["users"].push(username);
    });
    // マッチングが完了した部屋の名前を通知する
    socket.on("waiting-finished", (data)=>{
        io.sockets.emit("waiting-finished", {value: rooms[data.value]["users"]});
    });
    // 全ユーザーの情報を、対応する部屋に返す
    socket.on("user-info-init", (data)=>{
        let userInfo = data.value;
        if (userInfo!=null){
            let username = userInfo["username"];
            let roomName = userInfo["roomName"];
            let userX = userInfo["userX"];
            let userY = userInfo["userY"];
            let cntRed = rooms[roomName]["cntRed"];
            let cntBlue = rooms[roomName]["cntBlue"];
            if (cntRed<=cntBlue){
                color = "red";
                rooms[roomName]["cntRed"]++;
            } else {
                color = "blue";
                rooms[roomName]["cntBlue"]++;
            }
            users[username] = {"userX":userX, "userY":userY, "color":color};
        }
        io.sockets.emit("user-info-init", {value:users});
    });
    // プレイヤーの位置が変わったことを通知する
    socket.on("coordinate-changed", (data)=>{
        io.sockets.emit("coordinate-changed", {value:data.value});
    });
    // オセロの盤面が変わったことを通知する
    socket.on("field-changed", (data)=>{
        io.sockets.emit("field-changed", {value:data.value});
    });
    // 「赤（青）のターン」の、赤（青）の文字の色が変わったことを通知する
    socket.on("text-color-changed", (data)=>{
        io.sockets.emit("text-color-changed", {value:data.value});
    });
    // ゲームが終了したことを通知する
    socket.on("game-finished", (data)=>{
        io.sockets.emit("game-finished", {value:data.value});
    });
    // rooms の情報を返す
    socket.on("need-rooms", (data)=>{
        io.sockets.emit("need-rooms", {value:rooms});
    });
});
