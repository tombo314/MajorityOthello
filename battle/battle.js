let users;
let initX;
let initY;
let ownX;
let ownY;
let x = 0;
let y = 0;
let wDown;
let aDown;
let sDown;
let dDown;
let canvas;
let context;
let own;
let ownName;
let other;
let getName;
let allyId;
let opponentId;
let initXDiff;
let ownXDiff;
let socket = io();
let othello = document.getElementById("othello");
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

let getRandomInt=(min, max)=> {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

socket.emit("battle-start", {value: ""});
socket.on("battle-start", (data)=>{
    users = data.value;
    // プレイヤーの円を描画
    for (let i=0; i<users.length; i++){
        allyId = `ally${i/2}`;
        opponentId = `opponent${parseInt(i/2)+1}`;
        let canvas = document.createElement("canvas");
        canvas.setAttribute("width", 430);
        canvas.setAttribute("height", 670);
        canvas.setAttribute("style", "position: absolute; z-index: 999;");
        context = canvas.getContext("2d");
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
    let paintSquare=(i, j)=>{
        let elem = document.getElementById(`square${i}${j}`);
        elem.style.backgroundColor = "#cfca";
    }
    let unPaintSquare=(i, j)=>{
        let elem = document.getElementById(`square${i}${j}`);
        elem.style.backgroundColor = "#70ad47";
    };
    for (let i=0; i<8; i++){
        for (let j=0; j<8; j++){
            makeSquare(i, j);
        }
    }
});

onkeydown=(e)=>{
    const DIFF = 10;
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
    if (sDown && ownY+y<=innerHeight-140){
        y += DIFF;
    }
    if (dDown && ownX+x<=innerWidth-430){
        x += DIFF;
    }
    own.style.transform = `translate(${x}px, ${y}px)`;
    ownName.style.transform = `translate(${ownX+x+ownXDiff}px, ${ownY+y+INIT_Y_DIFF}px)`;
    // socket.emit("coordinates-changed", {value: ""});
};

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
};

/*
・マスの真上にきたら opacity を変更する。
・自分を赤と青でランダムに振り分ける。
・space キーを決定ボタンにする。

〇オセロを実装する。
・グリッドと石を canvas で表示する。
・探索アルゴリズムを作る。

*/