const socket = io();
const btnStart = document.getElementById("btn-start");

// ユーザー名登録
let username;
let users;
btnStart.onclick=()=>{
    username = prompt("ユーザー名を入力してください...");
    socket.emit("need-users", {value: ""});
};
socket.on("need-users", (data)=>{
    users = data.value;
    if (username==null || username==""){
        // キャンセル
    } else if (!users.includes(username)){
        socket.emit("name", {value: username});
        window.location.href = "../wait/wait.html";
    } else {
        alert("その名前は既に使われています。");
    }
});