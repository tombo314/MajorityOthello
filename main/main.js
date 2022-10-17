const socket = io();
const btnStart = document.getElementById("btn-start");

// ユーザー名登録
let username;
let users;
btnStart.onclick=()=>{
    username = prompt("ユーザー名を入力してください...");
    socket.emit("need-users", {value: ""});
};

let includesInDict=(d, value)=>{
    for (let v in d){
        if (v==value){
            return true;
        }
    }
    return false;
}

socket.on("need-users", (data)=>{
    users = data.value;
    if (username==null || username==""){
        // キャンセル
    } else if (!includesInDict(users, username)){
        socket.emit("name", {value: username});
        sessionStorage.setItem("username", username);
        window.location.href = "../wait/wait.html";
    } else {
        alert("その名前は既に使われています。");
    }
});