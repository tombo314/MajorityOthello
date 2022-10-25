let socket = io();
let btnStart = document.getElementById("btn-start");
let username = sessionStorage.getItem("username");

// バトル画面に遷移していない
// -> 遷移している場合は /battle/battle.html -> /main/index.html と遷移する
sessionStorage.setItem("battleAlreadyLoaded", "false");

// 自分がホストだったら、バトル画面に遷移するボタンを表示
if (sessionStorage.getItem("isHost")=="true"){
    document.getElementById("btn-start").style.visibility = "visible";
}

btnStart.onclick=()=>{
    // ホストの username （rooms のキー）を送信する
    socket.emit("waiting-finished", {value: username});
}

// いずれかの部屋のマッチングが終了した
socket.on("waiting-finished", (data)=>{
    let roomMember = data.value;
    // マッチングが完了した部屋に自分が登録されていたら遷移する
    if (roomMember.includes(username)){
        alert("バトル画面に遷移します。");
        window.location.href = "/battle/battle.html";
    }
});