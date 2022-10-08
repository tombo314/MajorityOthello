let users;
let initX;
let initY;
let x = 0;
let y = 0;
let wDown;
let aDown;
let sDown;
let dDown;
let own;
let canvas;
let context;
let socket = io();
let nodesAlly = document.getElementById("nodes-ally");
let nodesOpponent = document.getElementById("nodes-opponent");
const RADIUS = 20;
const LOWER_BOUND_X_ALLY = RADIUS+10;
const UPPER_BOUND_X_ALLY = 390+1;
const LOWER_BOUND_X_OPPONENT = screen.width-UPPER_BOUND_X_ALLY;
const UPPER_BOUND_X_OPPONENT = screen.width-LOWER_BOUND_X_ALLY;
const LOWER_BOUND_Y = RADIUS+10;
const UPPER_BOUND_Y = 505+1;
const ALLY_COLOR = "rgb(255, 100, 100)";
const OPPONENT_COLOR = "rgb(100, 100, 255)";

const getRandomInt=(min, max)=> {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

socket.emit("battle-start", {value: ""});
socket.on("battle-start", (data)=>{
    // プレイヤーの円を描画
    users = data.value;
    for (let i=0; i<users.length; i++){
        canvas = document.createElement("canvas");
        canvas.setAttribute("width", 430);
        canvas.setAttribute("height", 670);
        context = canvas.getContext("2d");
        if (i==0){
            canvas.setAttribute("id", "own");
            context.fillStyle = ALLY_COLOR;
            initX = getRandomInt(LOWER_BOUND_X_ALLY, UPPER_BOUND_X_ALLY);
            nodesAlly.appendChild(canvas);
        } else if (i%2==1){
            canvas.setAttribute("id", `opponent${parseInt(i/2)+1}`);
            context.fillStyle = OPPONENT_COLOR;
            initX = getRandomInt(LOWER_BOUND_X_OPPONENT, UPPER_BOUND_X_OPPONENT);
            nodesOpponent.appendChild(canvas);
        } else if (i%2==0){
            canvas.setAttribute("id", `ally${i/2}`);
            context.fillStyle = ALLY_COLOR;
            initX = getRandomInt(LOWER_BOUND_X_ALLY, UPPER_BOUND_X_ALLY);
            nodesAlly.appendChild(canvas);
        }
        canvas.setAttribute("style", "position: absolute;");
        own = document.getElementById("own");
        context.beginPath();
        initY = getRandomInt(LOWER_BOUND_Y, UPPER_BOUND_Y);
        context.arc(initX, initY, RADIUS, 0*Math.PI/180, 360*Math.PI/180, false);
        context.fill();
        context.stroke();
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
        if (initY+y>=-55){
            y -= 10;
        }
    }
    if (aDown){
        if (initX+x>=35){
            x -= 10;
        }
    }
    if (sDown){
        if (initY+y<=innerHeight-120){
            y += 10;
        }
    }
    if (dDown){
        if (initX+x<=innerWidth-35){
            x += 10;
        }
    }
    own.style.transform = `translate(${x}px, ${y}px)`;
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
