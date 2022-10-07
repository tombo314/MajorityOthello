const socket = io();

const nodes = document.getElementById("nodes");
socket.emit("battle-start", {value: ""});
socket.on("battle-start", (data)=>{
    let users = data.value;
    initX = 160;
    initY = 240;
    radius = 20;
    let elem = document.createElement("canvas");
    nodes.appendChild(elem);
    elem.setAttribute("id", "own");
    elem.setAttribute("class", "node");
    elem.setAttribute("width", 300);
    elem.setAttribute("height", 300);
    own = document.getElementById("own");
    let context = elem.getContext("2d");
    context.beginPath();
    context.arc(initX, initY, radius, 0*Math.PI/180, 360*Math.PI/180, false);
    context.fillStyle = "rgba(255, 172, 32, 1)";
    context.fill();
    context.stroke();
    updateStarted = true;
});

let initX;
let initY;
let radius;
let x = 0;
let y = 0;
let own;
let wDown;
let aDown;
let sDown;
let dDown;
let updateStarted;
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
