let socket = io();
let btnStart = document.getElementById("btn-start");
let username = sessionStorage.getItem("username");
let roomName = sessionStorage.getItem("roomName");

// 同じ画面が一度読み込まれたか
// -> 読み込まれていた場合はスタート画面に戻る
if (sessionStorage.getItem("samePageLoaded")=="true"){
    window.location.href = "/";
}
sessionStorage.setItem("samePageLoaded", "true");

// 部屋が存在しない場合はスタート画面に戻る
socket.emit("confirm-room", {value: roomName});

// 自分がホストだったら、バトル画面に遷移するボタンを表示
if (sessionStorage.getItem("isHostStr")=="true"){
    document.getElementById("btn-start").style.visibility = "visible";
}

btnStart.onclick=()=>{
    // 自分が立てた部屋の名前を送信する
    socket.emit("waiting-finished", {value: roomName});
}

// いずれかの部屋のマッチングが終了した
socket.on("waiting-finished", (data)=>{
    let roomMember = data.value;
    // マッチングが完了した部屋に自分が登録されていたら遷移する
    if (roomMember.includes(username)){
        alert("バトル画面に遷移します。");
        sessionStorage.setItem("samePageLoaded", "false");
        window.location.href = "/battle";
    }
});

// 部屋が存在しない場合
socket.on("room-not-exist", (data)=>{
    if (data.value==roomName){
        alert("部屋が存在しません。");
        window.location.href = "/";
    }
});