const socket = io();

const nodes = document.getElementById("nodes");
socket.emit("battle-start", {value: ""});
socket.on("battle-start", (data)=>{
    let users = data.value;
    let elem = document.createElement("canvas");
    nodes.appendChild(elem);
    elem.setAttribute("id", "own");
    elem.setAttribute("class", "node");
    const own = document.getElementById("own");
    // initX = own.getBoundingClientRect().x;
    // initY = own.getBoundingClientRect().y;
    let context = elem.getContext("2d");
    context.beginPath();
    context.arc(200, 40, 20, 0*Math.PI/180, 360*Math.PI/180, false);
    context.fillStyle = "rgba(255, 172, 32, 1)";
    context.fill();
    context.stroke();
});

let initX;
let initY;
let x = 0;
let y = 0;
onkeydown=(e)=>{
    if (e.key=="w"){
        if (initY+y-10>=-10){
            y -= 10;
        }
    }
    if (e.key=="a"){
        if (x-10>=-10 || true){
            x -= 10;
        }
    }
    if (e.key=="s"){
        if (initY+y+10<=innerHeight){
            y += 10;
        }
    }
    if (e.key=="d"){
        if (initX+x+10<=innerWidth || true){
            x += 10;
        }
    }
    own.style.transform = `translate(${x}px, ${y}px)`;
    console.log(own.getBoundingClientRect().x);
}