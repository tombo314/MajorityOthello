const socket = io();

const nodes = document.getElementById("nodes");
socket.emit("battle-start", {value: ""});
socket.on("battle-start", (data)=>{
    let users = data.value;
    initX = 100;
    initY = 200;
    radius = 20;
    let elem = document.createElement("canvas");
    nodes.appendChild(elem);
    elem.setAttribute("id", "own");
    elem.setAttribute("class", "node");
    elem.setAttribute("width", innerWidth);
    elem.setAttribute("height", innerHeight);
    own = document.getElementById("own");
    let context = elem.getContext("2d");
    context.beginPath();
    context.arc(initX, initY, radius, 0*Math.PI/180, 360*Math.PI/180, false);
    context.fillStyle = "rgba(255, 172, 32, 1)";
    context.fill();
    context.stroke();
});

let initX;
let initY;
let radius;
let x = 0;
let y = 0;
let own;
onkeydown=(e)=>{
    if (e.key=="w"){
        if (initY+y-radius*3/2>=0){
            y -= 10;
        }
    }
    if (e.key=="a"){
        if (initX+x-radius*3/2>=0){
            x -= 10;
        }
    }
    if (e.key=="s"){
        if (initY+y-radius<=innerHeight){
            y += 10;
        }
    }
    if (e.key=="d"){
        if (initX+x-radius<=innerWidth){
            x += 10;
        }
    }
    own.style.transform = `translate(${x}px, ${y}px)`;
    // console.log(own.getBoundingClientRect().x+firstX, own.getBoundingClientRect().y+firstY);
}