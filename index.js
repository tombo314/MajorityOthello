
/*
sessionStorage で管理する変数

isHost : 自分が部屋を立てたかどうか
username : 自分のユーザー名
roomName : 自分が入っている部屋の名前
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
    } else if (req.url=="/main/main.css.map"){
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(fs.readFileSync("main/main.css.map"));
    } else if (req.url=="/main/main.js"){
        res.writeHead(200, {"Content-Type": "application/javascript"});
        res.end(fs.readFileSync("main/main.js"));
    }
    // wait
    else if(req.url=="/wait"){
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(fs.readFileSync("wait/wait.html"));
    } else if(req.url=="/wait/wait.css"){
        res.writeHead(200, {"Content-Type": "text/css"});
        res.end(fs.readFileSync("wait/wait.css"));
    } else if (req.url=="/wait/wait.css.map"){
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(fs.readFileSync("wait/wait.css.map"));
    } else if(req.url=="/wait/wait.js"){
        res.writeHead(200, {"Content-Type": "application/javascript"});
        res.end(fs.readFileSync("wait/wait.js"));
    }
    // battle
    else if (req.url=="/battle"){
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(fs.readFileSync("battle/battle.html"));
    } else if(req.url=="/battle/battle.css"){
        res.writeHead(200, {"Content-Type": "text/css"});
        res.end(fs.readFileSync("battle/battle.css"));
    } else if (req.url=="/battle/battle.css.map"){
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(fs.readFileSync("battle/battle.css.map"));
    } else if(req.url=="/battle/battle.js"){
        res.writeHead(200, {"Content-Type": "application/javascript"});
        res.end(fs.readFileSync("battle/battle.js"));
    }
    // pictures
    else if (req.url=="/pictures/othello_field.png"){
        res.writeHead(200, {"Content-Type": "img/png"});
        res.end(fs.readFileSync("pictures/othello_field.png"));
    }
    else if (req.url=="/favicon.ico"){
        res.end();
    }
}).listen(process.env.PORT || 8000);
let io = socket(server);

// 関数宣言
initVoted=(roomName)=>{
    let voted = [];
    for (let i=0; i<8; i++){
        let tmp = [];
        for (let j=0; j<8; j++){
            tmp.push(0);
        }
        voted.push(tmp);
    }
    if (Object.keys(rooms).includes(roomName)){
        rooms[roomName]["voted"] = voted;
    }
}
getRandomInt=(min, max)=> {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}
canPutStoneThere=(p, q, oneOrTwo)=>{
    let n = oneOrTwo;
    let m;
    if (n==1){
        m = 2;
    } else {
        m = 1;
    }
    
    // その場
    if (field[p][q]!=0){
        return false;
    }

    // 上
    let ok = false;
    if (p-1>=0 && field[p-1][q]==m){
        for (let i=p-1; i>=0; i--){
            if (field[i][q]==n){
                ok = true;
                break
            } else if (field[i][q]==0){
                ok = false;
                break;
            }
        }
    }
    if (ok){
        return true;
    }
    // 下
    ok = false;
    if (p+1<8 && field[p+1][q]==m){
        for (let i=p+1; i<8; i++){
            if (field[i][q]==n){
                ok = true;
                break
            } else if (field[i][q]==0){
                ok = false;
                break;
            }
        }
    }
    if (ok){
        return true;
    }
    // 左
    ok = false;
    if (q-1>=0 && field[p][q-1]==m){
        for (let j=q-1; j>=0; j--){
            if (field[p][j]==n){
                ok = true;
                break
            } else if (field[p][j]==0){
                ok = false;
                break;
            }
        }
    }
    if (ok){
        return true;
    }
    // 右
    ok = false;
    if (q+1<8 && field[p][q+1]==m){
        for (let j=q+1; j<8; j++){
            if (field[p][j]==n){
                ok = true;
                break
            } else if (field[p][j]==0){
                ok = false;
                break;
            }
        }
    }
    if (ok){
        return true;
    }
    // 左上
    ok = false;
    if (p-1>=0 && q-1>=0 && field[p-1][q-1]==m){
        j = q-1;
        for (let i=p-1; i>=0; i--){
            if (j<0){
                break;
            }
            if (field[i][j]==n){
                ok = true;
                break;
            } else if (field[i][j]==0){
                ok = false;
                break;
            }
            j--;
        }
    }
    if (ok){
        return true;
    }
    // 右上
    ok = false;
    if (p-1>=0 && q+1<8 && field[p-1][q+1]==m){
        j = q+1;
        for (let i=p-1; i>=0; i--){
            if (j>=8){
                break;
            }
            if (field[i][j]==n){
                ok = true;
                break;
            } else if (field[i][j]==0){
                ok = false;
                break;
            }
            j++;
        }
    }
    if (ok){
        return true;
    }
    // 左下
    ok = false;
    if (p+1<8 && q-1>=0 && field[p+1][q-1]==m){
        j = q-1;
        for (let i=p+1; i<8; i++){
            if (j<0){
                break;
            }
            if (field[i][j]==n){
                ok = true;
                break;
            } else if (field[i][j]==0){
                ok = false;
                break;
            }
            j--;
        }
    }
    if (ok){
        return true;
    }
    // 右下
    ok = false;
    if (p+1<8 && q+1<8 && field[p+1][q+1]==m){
        j = q+1;
        for (let i=p+1; i<8; i++){
            if (j>=8){
                break;
            }
            if (field[i][j]==n){
                ok = true;
                break;
            } else if (field[i][j]==0){
                ok = false;
                break;
            }
            j++;
        }
    }
    if (ok){
        return true;
    }

    return false;
}

/*
rooms = {
    // 部屋名をキーとする、部屋ごとの連想配列
    roomName: {
        "users": [username, username, ...],
        "cntUsers": 0,
        "cntRed": 0,
        "cntBlue": 0,
        "cntSec": 0,
        "turnOneOrTwo": 1,
        "turnDurationSec": turnDurationSec,
        "set": null,
        "voted": null
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
let rooms = {};
let users = {};
let color;
let field;
io.on("connection", (socket)=>{
    /* index.html */
    // 前回作った部屋と前回のユーザー情報を削除する
    socket.on("delete-user", (data)=>{
        let username = data.value["username"];
        let roomName = data.value["roomName"];
        delete rooms[roomName];
        delete users[username];
        io.sockets.emit("delete-room", {value: roomName});
    });
    // users を返す
    socket.on("need-users", ()=>{
        io.sockets.emit("need-users", {value: users});
    });
    // rooms に部屋の情報を登録する
    socket.on("room-make-finished", (data)=>{
        let roomInfo = data.value;
        let roomName = roomInfo["roomName"];
        let roomUsername = roomInfo["roomUsername"];
        let turnDurationSec = roomInfo["turnDurationSec"];
        // rooms 連想配列を初期化
        rooms[roomName] = {
            "users": [roomUsername],
            "cntUsers": 0,
            "cntRed": 0,
            "cntBlue": 0,
            "cntSec": 0,
            "turnOneOrTwo": 1,
            "turnDurationSec": turnDurationSec,
            "set": null,
            "voted": null
        };
        // voted 配列を初期化
        initVoted(roomName);
        users[roomUsername] = {};
        io.sockets.emit("update-rooms", {value: rooms});
    });
    // 対応する部屋の users にゲストを登録する
    socket.on("register-name", (data)=>{
        let username = data.value["username"];
        let roomName = data.value["roomName"];
        if (Object.keys(rooms).includes(roomName)){
            rooms[roomName]["users"].push(username);
            users[username] = {};
            io.sockets.emit(username, {value: true});
        } else {
            // 部屋が存在しない場合はスタート画面に戻る
            io.sockets.emit("room-not-exist", {value: roomName});
        }
    });


    /* wait.html */
    // 部屋が存在しない場合はスタート画面に戻る
    socket.on("confirm-room", (data)=>{
        let roomName = data.value;
        // 部屋が存在しない場合
        if (!Object.keys(rooms).includes(roomName)){
            io.sockets.emit("room-not-exist", {value: roomName});
        }
    });
    // 部屋で待機中の人数を返す
    socket.on("need-users-length", (data)=>{
        let roomName = data.value;
        if (Object.keys(rooms).includes(roomName)){
            io.sockets.emit("need-users-length", {value: {
                "roomName": roomName,
                "usersLength": rooms[roomName]["users"].length
            }});
        }
        // 部屋が存在しない場合
        else {
            io.sockets.emit("room-not-exist", {value: roomName});
        }
    });
    // マッチングが完了した部屋の名前を通知する
    socket.on("waiting-finished", (data)=>{
        if (Object.keys(rooms).includes(data.value)){
            io.sockets.emit("waiting-finished", {value: rooms[data.value]["users"]});
        }
    });


    /* battle.html */
    // turnDurationSec を返す
    socket.on("need-turn-duration-sec", (data)=>{
        let roomName = data.value;
        io.sockets.emit("need-turn-duration-sec", {value: {
            "roomName": roomName,
            "turnDurationSec": rooms[roomName]["turnDurationSec"]
        }});
    });
    // 全ユーザーの情報を、対応する部屋に返す
    socket.on("user-info-init", (data)=>{
        let userInfo = data.value;
        if (userInfo!=null){
            let username = userInfo["username"];
            let roomName = userInfo["roomName"];
            let userX = userInfo["userX"];
            let userY = userInfo["userY"];
            let cntRed;
            let cntBlue;
            // 部屋が見つかった場合
            if (Object.keys(rooms).includes(roomName)){
                cntRed = rooms[roomName]["cntRed"];
                cntBlue = rooms[roomName]["cntBlue"];
                rooms[roomName]["cntUsers"]++;
                if (cntRed<=cntBlue){
                    color = "red";
                    rooms[roomName]["cntRed"]++;
                } else {
                    color = "blue";
                    rooms[roomName]["cntBlue"]++;
                }
                users[username] = {
                    "userX": userX,
                    "userY": userY,
                    "color": color
                };
                // 部屋とユーザーの情報を返す
                if (rooms[roomName]["cntUsers"]>=rooms[roomName]["users"].length){
                    io.sockets.emit("user-info-init", {value: {
                        "rooms": rooms,
                        "users": users
                    }});
                }
            }
            // 部屋が見つからない場合はスタート画面に戻る
            else {
                io.sockets.emit(username, {value: false});
            }
        }
    });
    // プレイヤーの位置が変わったことを通知する
    socket.on("coordinates-changed", (data)=>{
        io.sockets.emit("coordinates-changed", {value:data.value});
    });
    // 投票を受け付ける
    socket.on("voted", (data)=>{
        let roomName = data.value["roomName"];
        let i = data.value["i"];
        let j = data.value["j"];
        if (!Object.keys(rooms).includes(roomName)){
            return false;
        }
        // 投票する
        rooms[roomName]["voted"][i][j]++;
        rooms[roomName]["turnOneOrTwo"] = data.value["turnOneOrTwo"];
    });
    // カウントダウンと投票結果の送信を管理する
    socket.on("countdown-start", (data)=>{
        let roomName = data.value["roomName"];
        field = data.value["field"];
        // 部屋が存在しない
        if (!Object.keys(rooms).includes(roomName)){
            io.sockets.emit("room-not-exist", {value: roomName});
            return false;
        }
        rooms[roomName]["cntSec"] = 0;
        rooms[roomName]["set"] = setInterval(()=>{
            // 部屋が存在しない
            if (!Object.keys(rooms).includes(roomName)){
                io.sockets.emit("room-not-exist", {value: roomName});
                return false;
            }
            // ターンが終わったとき
            if (rooms[roomName]["cntSec"]>=rooms[roomName]["turnDurationSec"]){
                clearInterval(rooms[roomName]["set"]);
                let maxI = 0;
                let maxJ = 0;
                let max = 0;
                // 投票数が最大のマスを探索
                for (let i=0; i<8; i++){
                    for (let j=0; j<8; j++){
                        if (max<rooms[roomName]["voted"][i][j]){
                            max = rooms[roomName]["voted"][i][j];
                            maxI = i;
                            maxJ = j;
                        }
                    }
                }
                // 投票数が 1 以上あったとき
                if (max>0){
                    io.sockets.emit("voted", {value: {
                        "roomName": roomName,
                        "i": maxI,
                        "j": maxJ,
                        "turnOneOrTwo": rooms[roomName]["turnOneOrTwo"]
                    }});
                }
                // 投票数が 0 の場合は置ける場所からランダムに置く
                else {
                    let candidateRandom = [];
                    for (let i=0; i<8; i++){
                        for (let j=0; j<8; j++){
                            if (canPutStoneThere(i, j, rooms[roomName]["turnOneOrTwo"])){
                                candidateRandom.push([i, j]);
                            }
                        }
                    }
                    let r = getRandomInt(0, candidateRandom.length);
                    randI = candidateRandom[r][0];
                    randJ = candidateRandom[r][1];
                    io.sockets.emit("voted", {value: {
                        "roomName": roomName,
                        "i": randI,
                        "j": randJ,
                        "turnOneOrTwo": rooms[roomName]["turnOneOrTwo"]
                    }});
                }
                // voted 配列を初期化
                initVoted(roomName);
                // debug
                // ターン終了
                console.log(1);
                // 次のターンへ
                io.sockets.emit("countdown-restart", {value: {
                    "roomName": roomName,
                    "turnDurationSec": rooms[roomName]["turnDurationSec"]
                }});
            } else {
                rooms[roomName]["cntSec"]++;
            }
        }, 1000);
    });
    // ゲームが終了したことを通知する
    socket.on("game-finished", (data)=>{ 
        io.sockets.emit("game-finished", {value:data.value});
    });
    // 公開されている部屋を更新する
    socket.on("update-rooms", (data)=>{
        io.sockets.emit("update-rooms", {value: rooms});
    });
    // rooms を返す
    socket.on("need-rooms", (data)=>{
        io.sockets.emit("need-rooms", {value: rooms});
    });
});

/*
To Do
全体
（長期）
・BGM と SE を入れる

main
（長期）
・design の丸が画面端から出てこない
・form タグを使って getElementById().onclick から name.onclick に変更する
    -> 授業が終わったら getElementById().onclick に戻す

battle
（長期）
〇投票システムを作る
    ・ターンが終わるまでは、何回でも投票できるようにする
        -> 一番最後に投票した場所が自分の投票した場所になる
    ・投票時に confirm() などで Yes or No を聞く
・visualizeStone をずらしてに呼んで、順番にひっくり返るようにする
・すべての socket.on() が部屋間で独立しているかを確認する
    -> 必要なソケット通信の箇所に roomName を付け加える
・バトルが始まる前の暗いときに、自動で１つか２つ赤が置かれる。
・paintSquareRedBlue の解除が行われていない
（短期）
・２回目の eachTurn()（１回目のon("countdown-restart")）が呼ばれていない

// 工事中 <-を参照
*/
