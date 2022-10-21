const socket = io();
const btnStart = document.getElementById("btn-start"); // デバッグ用
sessionStorage.setItem("battleAlreadyLoaded", "false");

socket.on("waiting-finished", (data)=>{
    alert("バトル画面に遷移します。");
    window.location.href = "/battle/battle.html";
});

btnStart.onclick=()=>{
    socket.emit("waiting-finished", {value: ""});
}