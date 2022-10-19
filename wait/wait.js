const socket = io();
const btnStart = document.getElementById("btn-start"); // デバッグ用
sessionStorage.setItem("battleAlreadyLoaded", "false");

socket.emit("waiting-started", {value: ""});
socket.on("waiting-started", (data)=>{
    // const waitForSeconds = 3;
    // const waitFor = waitForSeconds*1000;
    // let now;
    // const func=()=>{
    //     now = new Date().getTime();
    //     if (now-TIME>=waitFor){
    //         clearInterval(set);
    //         socket.emit("waiting-finished", {value: ""});
    //     }
    // }
    // const TIME = new Date().getTime();
    // let set = setInterval(func, 1000);

});

socket.on("waiting-finished", (data)=>{
    alert("バトル画面に遷移します。");
    window.location.href = "/battle/battle.html";
});

// デバッグ用
btnStart.onclick=()=>{
    socket.emit("waiting-finished", {value: ""});
}