let socket = io();
let roomForRooms = document.getElementById("room-for-rooms");
let blackSheet = document.getElementById("black-sheet");
let btnMakeRoom = document.getElementById("btn-make-room");
let btnEnterRoom = document.getElementById("btn-enter-room");
let roomMakeWindow = document.getElementById("room-make-window");
let roomName = document.getElementById("room-name");
let roomPassword = document.getElementById("room-password");
let roomUsername = document.getElementById("username");
let btnSubmit = document.getElementById("btn-submit");

// サーバーから自分のデータを削除
socket.emit("delete-user", {value: sessionStorage.getItem("username")});
// キャッシュをクリア
sessionStorage.clear();

// ユーザー名入力
// ここを部屋の選択時のイベントにする
// let username;
// btnStart.onclick=()=>{
//     username = prompt("ユーザー名を入力してください...");
//     socket.emit("need-users", {value: ""});
// };

// ユーザー名の重複がないか判定し、なければ登録
socket.on("need-users", (data)=>{
    let users = data.value;
    if (username==null || username==""){
        // キャンセル
    } else if (!users.includes(username)){
        socket.emit("name", {value: username});
        sessionStorage.setItem("username", username);
        window.location.href = "/wait/wait.html";
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
    roomUsername.value = "ユーザー名を入力してください。"
    roomName.style.color = "#2227";
    roomPassword.style.color = "#2227";
    roomUsername.style.color = "#2227";
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
roomPassword.onkeydown=()=>{
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
    if (roomPassword.value.length=="4" && !isNaN(roomPassword.value) && !includesSpace(roomPassword.value)){
        passwordOK = true;
    } else {
        passwordOK = false;
    }
}
// 全半角のスペースを含んでいるか
let includesSpace=(str)=>{
    if (str.includes(" ") || str.includes("　")){
        return true;
    }
    return false;
}

// 文字が入力されたら「ユーザー名を～」をクリア
roomUsername.onkeydown=()=>{
    if (roomUsername.value=="ユーザー名を入力してください。"){
        roomUsername.value = "";
        roomUsername.style.color = "#222";
    }
}
// value が空のとき「ユーザー名を～」を表示
roomUsername.onkeyup=()=>{
    if (roomUsername.value==""){
        roomUsername.value = "ユーザー名を入力してください。";
        roomUsername.style.color = "#2227";
    }
}

// 「部屋を作る」を完了する
let roomCnt = 0;
btnSubmit.onclick=(e)=>{
    if (roomName.value=="部屋名を入力してください。" || roomName.value==""){
        e.preventDefault();
        alert("部屋名を入力してください。");
    }
    else if (roomPassword.value=="パスワードを入力してください。" || roomPassword.value==""){
        e.preventDefault();
        alert("パスワードを入力してください。");
    }
    else if (!passwordOK){
        e.preventDefault();
        alert("パスワードは4桁の数字で入力してください。");
    }
    else if (roomUsername.value=="ユーザー名を入力してください。" || roomUsername.value==""){
        e.preventDefault();
        alert("ユーザー名を入力してください。");
    } else {
        e.preventDefault();
        const BUTTON_ROOM_SELECT_WIDTH = 120;
        let elem = document.createElement("button");
        elem.textContent = roomName.value;
        elem.setAttribute("class", "btn-room-select");
        elem.setAttribute("style",
            `width: ${BUTTON_ROOM_SELECT_WIDTH}px;
             font-size: ${Math.min(30, BUTTON_ROOM_SELECT_WIDTH / elem.textContent.length)}px`
        );
        roomForRooms.appendChild(elem);
        roomCnt++;
        if (roomCnt%6==0){
            let br = document.createElement("br");
            roomForRooms.appendChild(br);
        }
    }
}
