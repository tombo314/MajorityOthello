// 

const socket = io();
const btnStart = document.getElementById("btn-start");
const blackSheet = document.getElementById("black-sheet");
const btnMakeRoom = document.getElementById("btn-make-room");
const btnEnterRoom = document.getElementById("btn-enter-room");
const roomMakeWindow = document.getElementById("room-make-window");
const roomName = document.getElementById("room-name");
const roomPassword = document.getElementById("room-password");
const btnMakeRoomFinish = document.getElementById("btn-make-room-finish");

// キャッシュをクリア
sessionStorage.clear();

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
roomName.onkeydown=()=>{
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

let passwordOK;
// 文字が入力されたら「パスワードを～」をクリア
roomPassword.onkeydown=(e)=>{
    if (roomPassword.value=="パスワードを入力してください。"){
        roomPassword.value = "";
        roomPassword.style.color = "#222";
    }
}
// 全半角のスペースを含んでいるか
let includesSpace=(str)=>{
    if (str.includes(" ") || str.includes("　")){
        return true;
    }
    return false;
}
// value が空のとき「パスワードを～」を表示
roomPassword.onkeyup=()=>{
    if (roomPassword.value==""){
        roomPassword.value = "パスワードを入力してください。";
        roomPassword.style.color = "#2227";
    }
    if (roomPassword.value.length=="4" && !isNaN(roomPassword.value) && !includesSpace(roomPassword.value)){
        passwordOK = true;
    } else {
        passwordOK = false;
    }
}

// 「部屋を作る」を完了する
btnMakeRoomFinish.onclick=()=>{
    if (roomName.value=="部屋名を入力してください。"){
        alert("部屋名を入力してください。");
    } else if (roomPassword.value=="パスワードを入力してください。"){
        alert("パスワードを入力してください。");
    } else if (!passwordOK){
        alert("パスワードは4文字の整数で入力してください。");
    }
}