// 同じページを一度読み込んだかどうか
if (sessionStorage.getItem("samePageLoaded")=="true"){
    // window.location.href = "/";
} else {
    sessionStorage.setItem("samePageLoaded", "true");
}

// 変数の宣言・初期化
let paintedI;
let paintedJ;
let wDown;
let aDown;
let sDown;
let dDown;
let own;
let ownName;
let xDiff;
let opacity;
let set;
let x = 0;
let y = 0;
let cntStone = 4;
let keysValid = true;
let finished = false;
let isRed = true;

// 定数の宣言
const RED = 1;
const BLUE = 2;
const EMPTY = 0;
const RADIUS = 20;
const DISPLACEMENT = 10;
const LOWER_BOUND_X = RADIUS+10;
const LOWER_BOUND_Y = RADIUS+10;
const UPPER_BOUND_X = 360+1;
const UPPER_BOUND_Y = 450+1;
const INIT_Y_DIFF = 20;
const XDIFF_COEFF = -5.5;
const GRID_X = 56;
const GRID_Y = 54;
const GRID_INIT_LEFT = -40;
const GRID_INIT_TOP = -65;
const GRID_DIFF_X = 5.75;
const GRID_DIFF_Y = 4;
const STONE_LIMIT = 8;
const TURN_DUTATION_SEC = 10;
const COLOR_PLAYER_RED = "rgb(255, 100, 100)";
const COLOR_PLAYER_BLUE = "rgb(100, 100, 255)";
const COLOR_FIELD_RED = "rgb(255, 50, 50)";
const COLOR_FIELD_BLUE = "rgb(50, 50, 255)";

// 関数の宣言
let getRandomInt=(min, max)=> {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}
let start=()=>{
    keysValid = false;
    opacity += 0.01;
    startEndSheet.style.opacity = opacity;
    if (opacity>=0.6){
        clearInterval(set);
        startEndSheet.style.backgroundColor = "#2228";
        startEndSheet.style.opacity = 1;
        startEndSheet.innerHTML = `<span style='color: ${COLOR_FIELD_RED}'>赤</span>が先手です`;
        setTimeout(()=>{
            let cnt = 3;
            set = setInterval(() => {
                startEndSheet.textContent = cnt;
                if (cnt<=0){
                    clearInterval(set);
                    startEndSheet.style.opacity = 0;
                    startEndSheet.style.backgroundColor = "#222";
                    startEndSheet.textContent = "";
                    keysValid = true;
                    eachTurn(10);
                }
                cnt--;
            }, 1000);
        }, 2000);
    }
}
let makeSquare=(i, j)=>{
    let sheet = document.createElement("div");
    sheet.setAttribute("id", `square${i}${j}`);
    sheet.setAttribute("style", `
        width: ${GRID_X}px;
        height: ${GRID_Y}px;
        position: absolute;
        left: ${GRID_INIT_LEFT+j*(GRID_X+GRID_DIFF_X)}px;
        top: ${GRID_INIT_TOP+i*(GRID_Y+GRID_DIFF_Y)}px;
    `);
    othelloWrapper.appendChild(sheet);
}
let paintSquare=(i, j)=>{
    if (i<0 || j<0 || 8<=i || 8<=j){
        return false
    }
    let elem = document.getElementById(`square${i}${j}`);
    elem.style.backgroundColor = "#cfca";
}
let unPaintSquare=(i, j)=>{
    if (i<0 || j<0 || 8<=i || 8<=j){
        return false
    }
    let elem = document.getElementById(`square${i}${j}`);
    elem.style.backgroundColor = "#70ad47";
}
let makeStone=(i, j)=>{
    // 赤
    let stone = document.createElement("canvas");
    stone.setAttribute("width", 550);
    stone.setAttribute("height", 670);
    stone.setAttribute("style", `
        position: absolute;
        transform: translate(-80px, -80px);
        visibility: hidden;
    `);
    stone.setAttribute("id", `stone${i}${j}${COLOR_FIELD_RED}`);
    othelloWrapper.appendChild(stone);
    let context = stone.getContext("2d");
    context.beginPath();
    context.fillStyle = COLOR_FIELD_RED;
    context.arc(61.7*j+68, 58*i+43, RADIUS, 0*Math.PI/180, 360*Math.PI/180, false);
    context.fill();
    context.stroke();
    
    // 青
    stone = document.createElement("canvas");
    stone.setAttribute("width", 550);
    stone.setAttribute("height", 670);
    stone.setAttribute("style", `
        position: absolute;
        transform: translate(-80px, -80px);
        visibility: hidden;
    `);
    stone.setAttribute("id", `stone${i}${j}${COLOR_FIELD_BLUE}`);
    othelloWrapper.appendChild(stone);
    context = stone.getContext("2d");
    context.beginPath();
    context.fillStyle = COLOR_FIELD_BLUE;
    context.arc(61.7*j+68, 58*i+43, RADIUS, 0*Math.PI/180, 360*Math.PI/180, false);
    context.fill();
    context.stroke();
}
let playerCircleUsed = new Set();
let makePlayerCircle=(playerName, initX, initY, playerColor)=>{
    if (!playerCircleUsed.has(playerName)){
        let canvas = document.createElement("canvas");
        canvas.setAttribute("width", 1400);
        canvas.setAttribute("height", 670);
        canvas.setAttribute("style", `
            position: absolute;
            z-index: 30;
        `);
        let context = canvas.getContext("2d");
        canvas.setAttribute("id", `id-${playerName}`);
        context.fillStyle = playerColor;
        nodesAlly.appendChild(canvas);
        playerCircleUsed.add(playerName);
        let elem = document.getElementById(`id-${playerName}`);
        elem.style.zIndex = 1000;
        context.beginPath();
        context.arc(initX, initY, RADIUS, 0*Math.PI/180, 360*Math.PI/180, false);
        context.fill();
        context.stroke();
    }
}
let playerNameUsed = new Set();
let makePlayerName=(playerName, initX, initY)=>{
    if (!playerNameUsed.has(playerName)){
        let createName = document.createElement("div");
        createName.textContent = playerName;
        createName.setAttribute("style", `
            position: absolute;
            z-index: 9;
            font-weight: bold;
        `);
        createName.setAttribute("id", `id-${playerName}-name`);
        nodesAlly.appendChild(createName);
        playerNameUsed.add(playerName);
        elem = document.getElementById(`id-${playerName}-name`);
        xDiff = XDIFF_COEFF*elem.textContent.length;
        elem.style.transform = `translate(${initX+xDiff}px, ${initY+INIT_Y_DIFF}px)`;
        elem.style.zIndex = 10;
    }
}
let visualizeStone=(i, j, color)=>{
    let otherColor;
    if (color==COLOR_FIELD_RED){
        otherColor = COLOR_FIELD_BLUE;
    } else {
        otherColor = COLOR_FIELD_RED;
    }
    let elem = document.getElementById(`stone${i}${j}${otherColor}`);
    elem.style.visibility = "hidden";
    elem = document.getElementById(`stone${i}${j}${color}`);
    elem.style.visibility = "visible";
}
let othello=(p, q, oneOrTwo)=>{
    let n = oneOrTwo;
    let m;
    let color;
    if (n==1){
        m = 2;
        color = COLOR_FIELD_RED;
    } else {
        m = 1
        color = COLOR_FIELD_BLUE;
    }
    let valid = false;
    // そのマスにすでに置いてあったら置けない
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
        valid = true;
        for (let i=p-1; i>=0; i--){
            if (field[i][q]==n){
                break
            } else if (field[i][q]==0){
                ok = false;
                break;
            }
            field[i][q] = n;
            visualizeStone(i, q, color);
        }
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
        valid = true;
        for (let i=p+1; i<8; i++){
            if (field[i][q]==n){
                break
            }
            field[i][q] = n;
            visualizeStone(i, q, color);
        }
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
        valid = true;
        for (let j=q-1; j>=0; j--){
            if (field[p][j]==n){
                break
            }
            field[p][j] = n;
            visualizeStone(p, j, color);
        }
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
        valid = true;
        for (let j=q+1; j<8; j++){
            if (field[p][j]==n){
                break
            }
            field[p][j] = n;
            visualizeStone(p, j, color);
        }
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
        valid = true;
        j = q-1;
        for (let i=p-1; i>=0; i--){
            if (field[i][j]==n){
                break;
            }
            field[i][j] = n;
            visualizeStone(i, j, color);
            j--;
        }
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
        valid = true;
        j = q+1;
        for (let i=p-1; i>=0; i--){
            if (field[i][j]==n){
                break
            }
            field[i][j] = n;
            visualizeStone(i, j, color);
            j++;
        }
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
        valid = true;
        j = q-1;
        for (let i=p+1; i<8; i++){
            if (field[i][j]==n){
                break
            }
            field[i][j] = n;
            visualizeStone(i, j, color);
            j--;
        }
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
        valid = true;
        j = q+1;
        for (let i=p+1; i<8; i++){
            if (field[i][j]==n){
                break
            }
            field[i][j] = n;
            visualizeStone(i, j, color);
            j++;
        }
    }

    if (valid){
        field[p][q] = n;
        visualizeStone(p, q, color);
        return true;
    }
    return false;
}
let vote=()=>{
}
let search=(p, q, n)=>{
    let m;
    if (n==1){
        m = 2;
    } else {
        m = 1;
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
let canPutStone=(n)=>{
    for (let i=0; i<8; i++){
        for (let j=0; j<8; j++){
            if (field[i][j]!=0){
                continue;
            }
            if (search(i, j, n)){
                return true;
            }
        }
    }
    return false;
}
let eachTurn=(s)=>{
    set = setInterval(() => {
        if (s<=0){
            clearInterval(set);
            setTimeout(()=>{
                if(finished){
                    finish();
                    keysValid = false;
                } else {
                    eachTurn(10);
                }
            }, 1000);
        }
        if (finished){
            timer.textContent = "00:00";
        } else {
            timer.textContent = `00:${("00"+s).slice(-2)}`;
            s--;
        }
    }, 1000);
}
let finish=()=>{
    let cnt = 0;
    for (let i=0; i<8; i++){
        for (let j=0; j<8; j++){
            if (field[i][j]==1){
                cnt += 1;
            }
        }
    }
    let tmp = STONE_LIMIT-cnt;
    let ownColor;
    let opponentColor;
    if (COLOR_FIELD_RED=="rgb(255, 50, 50)"){
        ownColor = `<span style="color: ${COLOR_FIELD_RED}">赤</span>`;
        opponentColor = `<span style="color: ${COLOR_FIELD_BLUE}">青</span>`;
    } else {
        ownColor = `<span style="color: ${COLOR_FIELD_BLUE}">青</span>`;
        opponentColor = `<span style="color: ${COLOR_FIELD_RED}">赤</span>`;
    }
    opacity = 0;
    set = setInterval(()=>{
        opacity += 0.01;
        startEndSheet.style.opacity = opacity;
        if (opacity>=0.6){
            clearInterval(set);
            startEndSheet.style.backgroundColor = "#2228";
            startEndSheet.style.opacity = 1;
            let color;
            if (cnt!=tmp){
                if (cnt>tmp){
                    color = ownColor;
                } else if (cnt<tmp){
                    color = opponentColor;
                }
                startEndSheet.innerHTML = `${color}チームの勝利です`;
            } else {
                startEndSheet.textContent = "引き分けです";
            }
        }
    }, 20);
}

// 関数を用いた変数の初期化
let socket = io();
let username = sessionStorage.getItem("username");
let roomName = sessionStorage.getItem("roomName");
let ownX = getRandomInt(LOWER_BOUND_X, UPPER_BOUND_X);
let ownY = getRandomInt(LOWER_BOUND_Y, UPPER_BOUND_Y);
let timer = document.getElementById("timer");
let nodesAlly = document.getElementById("nodes-ally");
let nodesOpponent = document.getElementById("nodes-opponent");
let othelloWrapper = document.getElementById("othello-wrapper");
let startEndSheet = document.getElementById("start-end-sheet");

// ユーザー情報送信
if (username!=null){
    socket.emit("user-info-init", {value: {
        "username": username,
        "roomName": roomName,
        "userX": ownX,
        "userY": ownY
    }});
} else {
    socket.emit("user-info-init", {value: null});
}

// 全プレイヤーの情報を取得
socket.on("user-info-init", (data)=>{
    let rooms = data.value["rooms"];
    let users = data.value["users"];
    let roomMember = rooms[roomName]["users"];
    for (let v of roomMember){
        let playerName = v;
        let playerColorRGB;
        let initX = users[playerName]["userX"];
        let initY = users[playerName]["userY"];
        let playerColor = users[playerName]["color"];
        if (playerColor=="red"){
            playerColorRGB = COLOR_PLAYER_RED;
        } else if (playerColor=="blue"){
            playerColorRGB = COLOR_PLAYER_BLUE;
            initX = Math.min(initX, 350);
            initX = innerWidth - initX;
            if (playerName==username){
                ownX = Math.min(ownX, 350);
                ownX = innerWidth - ownX;
                color = playerColor;
            }
        }

        // 全プレイヤーの円を描画
        makePlayerCircle(playerName, initX, initY, playerColorRGB);
        
        // プレイヤーの名前を表示
        makePlayerName(playerName, initX, initY);
    }

    // 自分の情報を初期化
    own = document.getElementById(`id-${username}`);
    ownName = document.getElementById(`id-${username}-name`);
    color = users[username]["color"];
});

// マス選択時に盤面の上に被せるシートを生成
for (let i=0; i<8; i++){
    for (let j=0; j<8; j++){
        makeSquare(i, j);
    }
}

// 全体に石を配置
for (let i=0; i<8; i++){
    for (let j=0; j<8; j++){
        makeStone(i, j);
    }
}

// 盤面を初期化
let field = [];
for (let i=0; i<8; i++){
    let tmp = []
    for (let j=0; j<8; j++){
        tmp.push(0);
    }
    field.push(tmp)
}
field[3][3] = RED;
field[4][4] = RED;
field[3][4] = BLUE;
field[4][3] = BLUE;
visualizeStone(3, 3, COLOR_FIELD_RED);
visualizeStone(4, 4, COLOR_FIELD_RED);
visualizeStone(3, 4, COLOR_FIELD_BLUE);
visualizeStone(4, 3, COLOR_FIELD_BLUE);

// バトル開始時の演出
opacity = 0;
set = setInterval(start, 20);

// 盤面の変化を共有する
socket.on("field-changed", (data)=>{
    let tmp = data.value;
    let usernameOther = tmp[0];
    let paintedI = tmp[1];
    let paintedJ = tmp[2];
    let color = tmp[3];
    let isR = tmp[4];
    if (usernameOther!=username){
        othello(paintedI, paintedJ, color);
    }
    isRed = isR;
});

// 赤・青の文字の変化を共有する
socket.on("text-color-changed", (data)=>{
    let tmp = data.value;
    let usernameOther = tmp[0];
    let text = tmp[1];
    let color = tmp[2];
    if (usernameOther!=username){
        turn.innerHTML = text;
        turnColor = document.getElementById("turn-color");
        turnColor.style.color = color;
    }
});

// ゲームの終了を認識する
socket.on("game-finished", (data)=>{
    let usernameOther = data.value;
    if (usernameOther!=username){
        finished = true;
        keysValid = false;
        finish();
    }
});

// 部屋が存在しなかった場合、スタート画面に戻る
socket.on(username, (data)=>{
    if (!data.value){
        alert("部屋が存在しません。");
        window.location.href = "/";
    }
});

onkeydown=(e)=>{
    if (keysValid){
        // 上下左右に移動させる
        if (e.key=="w"){
            wDown = true;
        } else if (e.key=="a"){
            aDown = true;
        } else if (e.key=="s"){
            sDown = true;
        } else if (e.key=="d"){
            dDown = true;
        }
        // 上
        if (wDown && ownY+y>=35){
            y -= DISPLACEMENT;
        }
        // 左
        if (color=="red"){
            if (aDown && ownX+x>=40){
                x -= DISPLACEMENT;
            }
        } else if (color=="blue") {
            if (aDown && ownX+x>=430){
                x -= DISPLACEMENT;
            }
        }
        // 下
        if (sDown && ownY+y<=innerHeight-148){
            y += DISPLACEMENT;
        }
        // 右
        if (color=="red"){
            if (dDown && ownX+x<=innerWidth-430){
                x += DISPLACEMENT;
            }
        } else if (color=="blue"){
            if (dDown && ownX+x<=innerWidth-40){
                x += DISPLACEMENT;
            }
        }

        // 自分に自分の座標を反映させる
        own.style.transform = `translate(${x}px, ${y}px)`;
        ownName.style.transform = `translate(${ownX+x+xDiff}px, ${ownY+y+INIT_Y_DIFF}px)`;
    }

    // 全員に自分の座標を反映させる
    socket.emit("coordinates-changed", {value: {
        "username":username,
        "userCoord":[x, y],
        "nameCoord":[ownX+x+xDiff, ownY+y+INIT_Y_DIFF]
    }});
    socket.on("coordinates-changed", (data)=>{
        let user = data.value;
        let usernameOther = user["username"];
        let userCoord = user["userCoord"];
        let userX = userCoord[0];
        let userY = userCoord[1];
        let nameCoord = user["nameCoord"];
        let nameX = nameCoord[0];
        let nameY = nameCoord[1];
        let userElem = document.getElementById(`id-${usernameOther}`);
        let nameElem = document.getElementById(`id-${usernameOther}-name`);
        if (usernameOther!=username){
            userElem.style.transform = `translate(${userX}px, ${userY}px)`;
            nameElem.style.transform = `translate(${nameX}px, ${nameY}px)`;
        }
    });
    
    // シートをマスにかぶせる・マスから取り除く
    let coordX = ownX+x;
    let coordY = ownY+y;
    const INIT_X = 440;
    const INIT_Y = 40;
    const DIFF_X = 62;
    const DIFF_Y = 58;
    if (paintedI!=null){
        unPaintSquare(paintedI, paintedJ);
    }
    paintedI = parseInt((coordY-INIT_Y)/DIFF_Y);
    paintedJ = parseInt((coordX-INIT_X)/DIFF_X);
    if (430<=coordX && keysValid){
        paintSquare(paintedI, paintedJ);
    }

    // そのマスに石を置く
    if (e.key=="Enter"){
        let valid;
        if (isRed){
            valid = othello(paintedI, paintedJ, RED);
            if (valid){
                cntStone += 1;
                if (cntStone>=STONE_LIMIT){
                    finished = true;
                }
                if (canPutStone(BLUE)){
                    isRed = false;
                } else if (!canPutStone(RED)){
                    finished = true;
                }
                socket.emit("field-changed", {value:[username, paintedI, paintedJ, RED]});
            }
        } else {
            valid = othello(paintedI, paintedJ, BLUE);
            if (valid){
                cntStone += 1;
                if (cntStone>=STONE_LIMIT){
                    finished = true;
                }
                if (canPutStone(RED)){
                    isRed = true;
                } else if (!canPutStone(BLUE)){
                    finished = true;
                }
                socket.emit("field-changed", {value: [username, paintedI, paintedJ, BLUE, isRed]});
           }
        }
    }
    let turn = document.getElementById("turn");
    let turnColor;
    if (isRed){
        turn.innerHTML = "<span id='turn-color'>赤</span>のターン";
        turnColor = document.getElementById("turn-color");
        turnColor.style.color = COLOR_FIELD_RED;
        socket.emit("text-color-changed", {value: [username, "<span id='turn-color'>赤</span>のターン", COLOR_FIELD_RED]});
    } else {
        turn.innerHTML = "<span id='turn-color'>青</span>のターン";
        turnColor = document.getElementById("turn-color");
        turnColor.style.color = COLOR_FIELD_BLUE;
        socket.emit("text-color-changed", {value: [username, "<span id='turn-color'>青</span>のターン", COLOR_FIELD_BLUE]});
    }
}

onkeyup=(e)=>{
    if (keysValid){
        if (finished){
            finish();
            keysValid = false;
            socket.emit("game-finished", {value: username});
        }
        if (e.key=="w"){
            wDown = false;
        } else if (e.key=="a"){
            aDown = false;
        } else if (e.key=="s"){
            sDown = false;
        } else if (e.key=="d"){
            dDown = false;
        }
    }
}

/*
・投票システムを作る。
・片方のチームが操作しているとき、もう片方のチームは自陣まで下げられて、操作できないようにする。

*/
