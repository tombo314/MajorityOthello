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
let othello = document.getElementById("othello");
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

    // オセロの盤面と石を描画
    context = othello.getContext("2d");
    context.beginPath();
    const ROW_NUM = 8;//行の数
    const COL_NUM = 8;//列の数
    const GRID_SIZE_X = 38;
    const GRID_SIZE_Y = 15;
    const CIRCLE_RADIUS = 6;
    const STONE_TOP = 20;
    const STONE_LEFT = 20;
        
    let drawCanvas=()=>{
        //コンテキストを取得する。この場合のコンテキストはスケッチブックと
        //絵筆に相当する。2dは2次元の意味。3dは2013年8月時点でなし。
        for(let i=0; i<ROW_NUM; i++){
            for(let j=0; j<COL_NUM; j++){
                drawGrid(context, j, i);
            }
        }
        drawStone(context, 'white', STONE_LEFT, STONE_TOP);
        drawStone(context, 'white', STONE_LEFT+GRID_SIZE_X, STONE_TOP+GRID_SIZE_Y);
        drawStone(context, 'black', STONE_LEFT+GRID_SIZE_X, STONE_TOP);
        drawStone(context, 'black', STONE_LEFT, STONE_TOP+GRID_SIZE_Y);
    }

    let drawGrid=(context, x, y)=>{
        context.clearRect(x * GRID_SIZE_X, y * GRID_SIZE_Y, GRID_SIZE_X, GRID_SIZE_Y);
        context.fillStyle = 'rgb(20, 172, 20)';
        context.strokeStyle = 'black';
        context.fillRect(x * GRID_SIZE_X, y * GRID_SIZE_Y, GRID_SIZE_X, GRID_SIZE_Y);
        context.strokeRect(x * GRID_SIZE_X, y * GRID_SIZE_Y, GRID_SIZE_X, GRID_SIZE_Y);
    }

    let drawStone=(context, color, x, y)=>{
        context.beginPath();//円を描くためのパスを一度リセットする。
        context.arc(x, y, CIRCLE_RADIUS, 0, 2 * Math.PI, false);
        context.fillStyle = color;
        context.fill();
        context.lineWidth = 1;
        context.strokeStyle = 'black';
        context.stroke();
    }
    drawCanvas();
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
    own.style.transform = `translate(${x}px, ${y}px)`;
    ownName.style.transform = `translate(${ownX+x-210}px, ${ownY+y+20}px)`;
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