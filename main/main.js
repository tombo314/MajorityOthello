const socket = io();
const btnStart = document.getElementById("btn-start");
const blackSheet = document.getElementById("black");
const btnMakeRoom = document.getElementById("make-room");
const btnEnterRoom = document.getElementById("enter-room");
const roomMakeWindow = document.getElementById("room-make-window");
const roomName = document.getElementById("room-name");
const roomPassword = document.getElementById("room-password");

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

// 周りの暗いところをクリックしてキャンセル
blackSheet.onclick=()=>{
    blackSheet.style.visibility = "hidden";
    roomMakeWindow.style.visibility = "hidden";
    roomName.value = "";
}

// 「部屋を作る」を押してフォームを表示
btnMakeRoom.onclick=()=>{
    blackSheet.style.visibility = "visible";
    roomMakeWindow.style.visibility = "visible";
    roomName.value = "部屋名を入力してください。";
    roomPassword.value = "パスワードを入力してください。";
    roomName.style.color = "#2227";
    roomPassword.style.color = "#2227";
    roomName.focus();
}

// 文字が入力されたら「部屋名を～」をクリア
roomName.onkeydown=(e)=>{
    if (roomName.value=="部屋名を入力してください。"){
        roomName.value = "";
        roomName.style.color = "#222";
    }
}
// value が空のとき「部屋名を～」を表示
roomName.onkeyup=()=>{
    if (roomName.value==""){
        roomName.value = "部屋名を入力してください。";
        roomName.style.color = "#2227";
    }
}

// 文字が入力されたら「パスワードを～」をクリア
roomPassword.onkeydown=(e)=>{
    if (roomPassword.value=="パスワードを入力してください。"){
        roomPassword.value = "";
        roomPassword.style.color = "#222";
    }
}
// value が空のとき「パスワードを～」を表示
roomPassword.onkeyup=()=>{
    if (roomPassword.value==""){
        roomPassword.value = "パスワードを入力してください。";
        roomPassword.style.color = "#2227";
    }
}