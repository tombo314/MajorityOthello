const socket = io();
const btnStart = document.getElementById("btn-start");
sessionStorage.setItem("battleAlreadyLoaded", "false");
if (sessionStorage.getItem("isHost")=="true"){
    document.getElementById("btn-start").style.visibility = "visible";
}

socket.on("waiting-finished", (data)=>{
    let roomMember = data.value;
    // マッチングが完了した部屋に、自分が登録されていたら遷移する
    if (roomMember.includes(username)){
        alert("バトル画面に遷移します。");
        window.location.href = "/battle/battle.html";
    }
});

btnStart.onclick=()=>{
    // rooms のキーである、ホストの username を送信する
    socket.emit("waiting-finished", {value: username});
}