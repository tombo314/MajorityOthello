let ownX;
let ownY;
let x = 0;
let y = 0;
let wDown;
let aDown;
let sDown;
let dDown;
let own;
let ownName;
let other;
let getName;
let initXDiff;
let ownXDiff;
let socket = io();
let nodesAlly = document.getElementById("nodes-ally");
let nodesOpponent = document.getElementById("nodes-opponent");
let othelloWrapper = document.getElementById("othello-wrapper");
const RADIUS = 20;
const LOWER_BOUND_X = RADIUS+10;
const LOWER_BOUND_Y = RADIUS+10;
const UPPER_BOUND_X = 390+1;
const UPPER_BOUND_Y = 450+1;
const INIT_Y_DIFF = 20;
const ALLY_COLOR = "rgb(255, 100, 100)";
const OPPONENT_COLOR = "rgb(100, 100, 255)";
const ALLY_COLOR_FIELD = "rgb(255, 50, 50)";
const OPPONENT_COLOR_FIELD = "rgb(50, 50, 255)";

let getRandomInt=(min, max)=> {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

socket.emit("battle-start", {value: ""});
socket.on("battle-start", (data)=>{
    let users = data.value;
    // プレイヤーの円を描画
    for (let i=0; i<users.length; i++){
        let allyId = `ally${i/2}`;
        let opponentId = `opponent${parseInt(i/2)+1}`;
        let canvas = document.createElement("canvas");
        let initX;
        let initY;
        canvas.setAttribute("width", 430);
        canvas.setAttribute("height", 670);
        canvas.setAttribute("style", "position: absolute; z-index: 999;");
        let context = canvas.getContext("2d");
        initY = getRandomInt(LOWER_BOUND_Y, UPPER_BOUND_Y);
        if (i==0){
            canvas.setAttribute("id", "own");
            context.fillStyle = ALLY_COLOR;
            initX = getRandomInt(LOWER_BOUND_X, UPPER_BOUND_X);
            ownX = initX;
            ownY = initY;
            nodesAlly.appendChild(canvas);
            own = document.getElementById("own");
            own.style.zIndex = 1000;
        } else if (i%2==1){
            canvas.setAttribute("id", opponentId);
            context.fillStyle = OPPONENT_COLOR;
            initX = getRandomInt(LOWER_BOUND_X, UPPER_BOUND_X);
            nodesOpponent.appendChild(canvas);
            other = document.getElementById(opponentId);
        } else if (i%2==0){
            canvas.setAttribute("id", allyId);
            context.fillStyle = ALLY_COLOR;
            initX = getRandomInt(LOWER_BOUND_X, UPPER_BOUND_X);
            nodesAlly.appendChild(canvas);
            other = document.getElementById(allyId);
        }
        context.beginPath();
        context.arc(initX, initY, RADIUS, 0*Math.PI/180, 360*Math.PI/180, false);
        context.fill();
        context.stroke();

        // プレイヤーの名前を表示
        const DIFF_COEFF = -5.5;
        let createName = document.createElement("div");
        createName.textContent = users[i];
        createName.setAttribute("style", "position: absolute; z-index: 9; font-weight: bold;");
        if (i==0){
            createName.setAttribute("id", "own-name");
            nodesAlly.appendChild(createName);
            ownName = document.getElementById("own-name");
            ownXDiff = DIFF_COEFF*ownName.textContent.length;
            ownName.style.transform = `translate(${ownX+ownXDiff}px, ${ownY+INIT_Y_DIFF}px)`;
            ownName.style.zIndex = 10;
        } else if (i%2==1){
            createName.setAttribute("id", `${opponentId}-name`);
            nodesOpponent.appendChild(createName);
            getName = document.getElementById(`${opponentId}-name`);
            initXDiff = DIFF_COEFF*getName.textContent.length;
            getName.style.transform = `translate(${initX+initXDiff}px, ${initY+INIT_Y_DIFF}px)`;
        } else if (i%2==0){
            createName.setAttribute("id", `${allyId}-name`);
            nodesAlly.appendChild(createName);
            getName = document.getElementById(`${allyId}-name`);
            initXDiff = DIFF_COEFF*getName.textContent.length;
            getName.style.transform = `translate(${initX+initXDiff}px, ${initY+INIT_Y_DIFF}px)`;
        }
    } // for文終わり
    
});

// マス選択時に盤面の上に被せるシート
const GRID_X = 56;
const GRID_Y = 54;
const INIT_LEFT = -40;
const INIT_TOP = -65;
const DIFF_X = 5.75;
const DIFF_Y = 4;
let makeSquare=(i, j)=>{
    let sheet = document.createElement("div");
    sheet.setAttribute("id", `square${i}${j}`);
    sheet.setAttribute("style", `
        width: ${GRID_X}px;
        height: ${GRID_Y}px;
        position: absolute;
        left: ${INIT_LEFT+j*(GRID_X+DIFF_X)}px;
        top: ${INIT_TOP+i*(GRID_Y+DIFF_Y)}px;
    `);
    othelloWrapper.appendChild(sheet);
};
// シートを生成
for (let i=0; i<8; i++){
    for (let j=0; j<8; j++){
        makeSquare(i, j);
    }
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
};

// 全体に石を配置
for (let i=0; i<8; i++){
    for (let j=0; j<8; j++){
        let stone = document.createElement("canvas");
        stone.setAttribute("width", 550);
        stone.setAttribute("height", 670);
        stone.setAttribute("style", "position: absolute; transform: translate(-80px, -80px); visibility: hidden;");
        stone.setAttribute("id", `stone${i}${j}${ALLY_COLOR_FIELD}`);
        othelloWrapper.appendChild(stone);
        let context = stone.getContext("2d");
        context.beginPath();
        context.fillStyle = ALLY_COLOR_FIELD;
        context.arc(61.7*j+68, 58*i+43, RADIUS, 0*Math.PI/180, 360*Math.PI/180, false);
        context.fill();
        context.stroke();
        
        stone = document.createElement("canvas");
        stone.setAttribute("width", 550);
        stone.setAttribute("height", 670);
        stone.setAttribute("style", "position: absolute; transform: translate(-80px, -80px); visibility: hidden;");
        stone.setAttribute("id", `stone${i}${j}${OPPONENT_COLOR_FIELD}`);
        othelloWrapper.appendChild(stone);
        context = stone.getContext("2d");
        context.beginPath();
        context.fillStyle = OPPONENT_COLOR_FIELD;
        context.arc(61.7*j+68, 58*i+43, RADIUS, 0*Math.PI/180, 360*Math.PI/180, false);
        context.fill();
        context.stroke();
    }
}

// 石を表示する
let visualizeStone=(i, j, color)=>{
    let otherColor;
    if (color==ALLY_COLOR_FIELD){
        otherColor = OPPONENT_COLOR_FIELD;
    } else {
        otherColor = ALLY_COLOR_FIELD;
    }
    let elem = document.getElementById(`stone${i}${j}${otherColor}`);
    elem.style.visibility = "hidden";
    elem = document.getElementById(`stone${i}${j}${color}`);
    elem.style.visibility = "visible";
}


// 盤面を初期化
const ALLY = 1;
const OPPONENT = -1;
const EMPTY = 0;
let field = [];
for (let i=0; i<8; i++){
    let tmp = []
    for (let j=0; j<8; j++){
        tmp.push(0);
    }
    field.push(tmp)
}

field[3][3] = 1;
field[4][4] = 1;
field[3][4] = 2;
field[4][3] = 2;
visualizeStone(3, 3, ALLY_COLOR_FIELD);
visualizeStone(4, 4, ALLY_COLOR_FIELD);
visualizeStone(3, 4, OPPONENT_COLOR_FIELD);
visualizeStone(4, 3, OPPONENT_COLOR_FIELD);

// 盤面を表示
let show=(ary)=>{
    for (let i=0; i<8; i++){
        console.log(ary[i]);
    }
}

// オセロのアルゴリズム
// 石を置いてひっくり返す
// その場所には石を置くことができるとする
let othello=(p, q, oneOrTwo)=>{
    let n = oneOrTwo;
    let m;
    let color;
    if (n==1){
        m = 2;
        color = ALLY_COLOR_FIELD;
    } else {
        m = 1
        color = OPPONENT_COLOR_FIELD;
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

// オセロのアルゴリズム
// その場所に投票する
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

let paintedI;
let paintedJ;
let isAlly = true;
onkeydown=(e)=>{
    const DIFF = 10;
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
    if (wDown && ownY+y>=35){
        y -= DIFF;
    }
    if (aDown && ownX+x>=40){
        x -= DIFF;
    }
    if (sDown && ownY+y<=innerHeight-148){
        y += DIFF;
    }
    if (dDown && ownX+x<=innerWidth-430){
        x += DIFF;
    }
    own.style.transform = `translate(${x}px, ${y}px)`;
    ownName.style.transform = `translate(${ownX+x+ownXDiff}px, ${ownY+y+INIT_Y_DIFF}px)`;

    // 全員の座標を反映させる
    // socket.emit("coordinates-changed", {value: ""});
    
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
    if (430<=coordX){
        paintSquare(paintedI, paintedJ);
    }

    // そのマスに石を置く
    if (e.key=="Enter"){
        let valid;
        if (isAlly){
            valid = othello(paintedI, paintedJ, 1);
            if (valid){
                if (canPutStone(2)){
                    isAlly = false;
                }
            }
        } else {
            valid = othello(paintedI, paintedJ, 2);
            if (valid){
                if (canPutStone(1)){
                    isAlly = true;
                }
           }
        }
    }
    let turn = document.getElementById("turn");
    let turnColor;
    if (isAlly){
        turn.innerHTML = "<span id='turn-color'>赤</span>のターン";
        turnColor = document.getElementById("turn-color");
        turnColor.style.color = "rgb(255, 50, 50)";
    } else {
        turn.innerHTML = "<span id='turn-color'>青</span>のターン";
        turnColor = document.getElementById("turn-color");
        turnColor.style.color = "rgb(50, 50, 255)";
    }
}

onkeyup=(e)=>{
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


/*
・自分を赤と青でランダムに振り分ける。
・space キーを決定ボタンにする。

〇オセロを実装する。
・探索アルゴリズムを作る。

*/

// 探索アルゴリズムの右方向だけ（右上・右下は除く）が動かない