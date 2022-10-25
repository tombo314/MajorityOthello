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
    // index.html から部屋の情報を受け取る
    if (req.method=="POST"){
        let data = "";
        req.on("data", (value)=>{
            data += value;
        }).on("end", ()=>{
            data = data.split("&");
            let roomName = data[0].slice(10, data[0].length);
            let roomPassward = data[1].slice(14, data[1].length);
            let username = data[2].slice(9, data[2].length);
            rooms[username] = {
                "roomName":roomName,
                "roomPassward":roomPassward,
                "users":[username]
            };
            io.sockets.emit("update-rooms", {value:rooms});
        });
    }
}).listen(process.env.PORT || 8000);
let io = socket(server);

//

/*
rooms = {
    "username1": {
        "roomName": roomName1,
        "roomPassward": roomPassword1,
        "users": [username1, username2, ...]
    },
    "username3": {
        "roomName": roomName2,
        "roomPassward": roomPassword2,
        "users": [username3, username4, ...]
    }
}
*/
let rooms = {}
let cntRed = 0;
let cntBlue = 0;
let color;
io.on("connection", (socket)=>{
    socket.on("delete-user", (data)=>{
        delete rooms[data.value];
    });
    socket.on("need-users", ()=>{
        io.sockets.emit("need-users", {value:rooms});
    });
    socket.on("register-name", (data)=>{
        let username = data.value["username"];
        let roomName = data.value["roomName"];
        rooms[roomName]["users"].push(username);
    });
    socket.on("waiting-finished", (data)=>{
        io.sockets.emit("waiting-finished", {value: ""});
        cntRed = 0;
        cntBlue = 0;
    });
    socket.on("user-info-init", (data)=>{
        let userInfo = data.value;
        if (userInfo!=null){
            let username = userInfo["username"];
            let userX = userInfo["userX"];
            let userY = userInfo["userY"];
            if (cntRed<=cntBlue){
                color = "red";
                cntRed++;
            } else {
                color = "blue";
                cntBlue++;
            }
            rooms[username] = {"userX":userX, "userY":userY, "color":color};
        }
        io.sockets.emit("user-info-init", {value:users});
    });
    socket.on("coordinate-changed", (data)=>{
        io.sockets.emit("coordinate-changed", {value:data.value});
    });
    socket.on("field-changed", (data)=>{
        io.sockets.emit("field-changed", {value:data.value});
    });
    socket.on("text-color-changed", (data)=>{
        io.sockets.emit("text-color-changed", {value:data.value});
    });
    socket.on("game-finished", (data)=>{
        io.sockets.emit("game-finished", {value:data.value});
    });
});
