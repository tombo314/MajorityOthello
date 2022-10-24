const socket = io();
const btnStart = document.getElementById("btn-start");
sessionStorage.setItem("battleAlreadyLoaded", "false");
if (sessionStorage.getItem("isHost")=="true"){
    document.getElementById("btn-start").style.visibility = "visible";
}

socket.on("waiting-finished", (data)=>{
    alert("バトル画面に遷移します。");
    window.location.href = "/battle/battle.html";
});

btnStart.onclick=()=>{
    socket.emit("waiting-finished", {value: ""});
}