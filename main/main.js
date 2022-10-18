const socket = io();
const btnStart = document.getElementById("btn-start");
const blackSheet = document.getElementById("black");
const btnMakeRoom = document.getElementById("make-room");
const btnEnterRoom = document.getElementById("enter-room");
const roomMakeWindow = document.getElementById("room-make-window");

// ユーザー名入力
let username;
btnStart.onclick=()=>{
    username = prompt("ユーザー名を入力してください...");
    socket.emit("need-users", {value: ""});
};

// ユーザー名の重複がないか判定し、なければ登録
socket.on("need-users", (data)=>{
    let users = data.value;
    if (username==null || username==""){
        // キャンセル
    } else if (!users.includes(username)){
        socket.emit("name", {value: username});
        sessionStorage.setItem("username", username);
        window.location.href = "../wait/wait.html";
    } else {
        alert("その名前は既に使われています。");
    }
});

blackSheet.onclick=()=>{
    blackSheet.style.visibility = "hidden";
    roomMakeWindow.style.visibility = "hidden";
}

btnMakeRoom.onclick=()=>{
    blackSheet.style.visibility = "visible";
    roomMakeWindow.style.visibility = "visible";
}