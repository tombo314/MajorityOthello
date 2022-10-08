let users;
let initX;
let initY;
let radius;
let x = 0;
let y = 0;
let wDown;
let aDown;
let sDown;
let dDown;
let own;
let elem;
let context;
let upperBoundX;
let upperBoundY;
const socket = io();
const nodesAlly = document.getElementById("nodes-ally");
const nodesEnemy = document.getElementById("nodes-enemy");


const getRandomInt=(min, max)=> {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
    }

socket.emit("battle-start", {value: ""});
socket.on("battle-start", (data)=>{
    users = data.value;
    radius = 20;
    // プレイヤーの円を描画
    // const lowerBoundX = radius+5;
    // const lowerBoundY = radius+5;
        // const lowerBoundX = 400;
        // const lowerBoundY = 515;
        // const upperBoundX = 400+1;
        // const upperBoundY = 515+1;
    for (let i=0; i<users.length; i++){
        if (i==0){
            lowerBoundX = 390;
            lowerBoundY = 500;
            upperBoundX = lowerBoundX+1;
            upperBoundY = lowerBoundY+1;
        } else {
            lowerBoundX = radius+5;
            lowerBoundY = radius+5;
            upperBoundX = radius+5+1;
            upperBoundY = radius+5+1;
        }
        initX = getRandomInt(lowerBoundX, upperBoundX);
        initY = getRandomInt(lowerBoundY, upperBoundY);
        elem = document.createElement("canvas");
        if (i==0){
            elem.setAttribute("width", 430);
            elem.setAttribute("height", 670);
            context = elem.getContext("2d");
        }
        elem.setAttribute("style", "position: absolute;");
        elem.setAttribute("id", "own");
        nodesAlly.appendChild(elem);
        own = document.getElementById("own");
        context.beginPath();
        context.fillStyle = "rgb(255, 172, 32)";
        context.arc(initX, initY, radius, 0*Math.PI/180, 360*Math.PI/180, false);
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
