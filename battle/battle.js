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
let own;
let ownName;
let canvas;
let context;
let playerName;
let socket = io();
let nodesAlly = document.getElementById("nodes-ally");
let nodesOpponent = document.getElementById("nodes-opponent");
const RADIUS = 20;
const LOWER_BOUND_X = RADIUS+10;
const LOWER_BOUND_Y = RADIUS+10;
const UPPER_BOUND_X = 390+1;
const UPPER_BOUND_Y = 450+1;
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
        canvas = document.createElement("canvas");
        canvas.setAttribute("width", 430);
        canvas.setAttribute("height", 670);
        canvas.setAttribute("style", "position: absolute;");
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
        } else if (i%2==1){
            canvas.setAttribute("id", `opponent${parseInt(i/2)+1}`);
            context.fillStyle = OPPONENT_COLOR;
            initX = getRandomInt(LOWER_BOUND_X, UPPER_BOUND_X);
            nodesOpponent.appendChild(canvas);
        } else if (i%2==0){
            canvas.setAttribute("id", `ally${i/2}`);
            context.fillStyle = ALLY_COLOR;
            initX = getRandomInt(LOWER_BOUND_X, UPPER_BOUND_X);
            nodesAlly.appendChild(canvas);
        }
        context.beginPath();
        context.arc(initX, initY, RADIUS, 0*Math.PI/180, 360*Math.PI/180, false);
        context.fill();
        context.stroke();

        // プレイヤーの名前を表示
        playerName = document.createElement("div");
        playerName.textContent = users[i];
        if (i==0){
            playerName.setAttribute("id", "own-name");
            nodesAlly.appendChild(playerName);
            ownName = document.getElementById("own-name");
            ownName.style.transform = `translate(${ownX-210}px, ${ownY+20}px)`;
            ownName.style.textAlign = "center";
        } else if (i%2==1){
            playerName.setAttribute("id", `opponent${parseInt(i/2)+1}-name`);
            nodesOpponent.appendChild(playerName);
        } else if (i%2==0){
            playerName.setAttribute("id", `ally${i/2}-name`);
            nodesAlly.appendChild(playerName);
        }
    }
});

onkeydown=(e)=>{
    if (e.key=="w"){
        wDown = true;
    } else if (e.key=="a"){
        aDown = true;
    } else if (e.key=="s"){
        sDown = true;
    } else if (e.key=="d"){
        dDown = true;
    }
    if (wDown){
        if (ownY+y>=35){
            y -= 10;
        }
    }
    if (aDown){
        if (ownX+x>=45){
            x -= 10;
        }
    }
    if (sDown){
        if (ownY+y<=innerHeight-140){
            y += 10;
        }
    }
    if (dDown){
        if (ownX+x<=innerWidth-470){
            x += 10;
        }
    }
    const WIDTH_DIFF_FOR_SCHOOL_PC = 420;
    own.style.transform = `translate(${x}px, ${y}px)`;
    ownName.style.transform = `translate(${ownX+x-WIDTH_DIFF_FOR_SCHOOL_PC}px, ${ownY+y+20}px)`;
    socket.emit("coordinates-changed", {value: ""});
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
・users に入っている名前をそれぞれの ● に対応させて表示する。
・自分を赤と青でランダムに振り分ける。
・space キーを決定ボタンにする。

〇オセロを実装する。
・グリッドと石を canvas で表示する。
・探索アルゴリズムを作る。

*/