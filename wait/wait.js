let socket = io();
let btnStart = document.getElementById("btn-start");
let btnToTop = document.getElementById("btn-to-top");
let username = sessionStorage.getItem("username");
let roomName = sessionStorage.getItem("roomName");
let isHostStr = sessionStorage.getItem("isHostStr");

// 「トップに戻る」ボタンのレイアウト
if (isHostStr=="false"){
    btnToTop.style.transform = "translateX(400px)";
}

// 部屋が存在しない場合はスタート画面に戻る
socket.emit("confirm-room", {value: roomName});

// 自分がホストだったら、バトル画面に遷移するボタンを表示
if (sessionStorage.getItem("isHostStr")=="true"){
    document.getElementById("btn-start").style.visibility = "visible";
}

// マッチングを完了する
btnStart.onclick=()=>{
    // 部屋で待機中の人数を得る
    socket.emit("need-users-length", {value: roomName});
    socket.on("need-users-length", (data)=>{
        let roomNameTmp = data.value["roomName"];
        let usersLength = data.value["usersLength"];
        if (roomNameTmp==roomName && usersLength>=2){
            socket.emit("waiting-finished", {value: roomName});
        }
        // １人以下の場合
        else {
            alert("２人以上いないと開始できません。");
            location.href = "/wait";
        }
    });
}

// トップに戻る
btnToTop.onclick=()=>{
    alert("トップに戻ります。");
    location.href = "/";
}

// 部屋の待機人数を更新する
socket.on("update-waiting-cnt", (data)=>{
    // 工事中
});

// いずれかの部屋のマッチングが終了した
socket.on("waiting-finished", (data)=>{
    let roomMember = data.value;
    // マッチングが完了した部屋に自分が登録されていたら遷移する
    if (roomMember.includes(username)){
        alert("バトル画面に遷移します。");
        sessionStorage.setItem("samePageLoaded", "false");
        location.href = "/battle";
    }
});

// 部屋が存在しない場合
socket.on("room-not-exist", (data)=>{
    if (data.value==roomName){
        alert("部屋が存在しません。");
        location.href = "/";
    }
});