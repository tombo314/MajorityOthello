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
const BUTTON_ROOM_SELECT_WIDTH = 120;

// 部屋に入るときにユーザーを登録する
let registerUser=(hostUsername)=>{
    let username = prompt("ユーザー名を入力してください...");
    socket.emit("need-users", {value: ""});
    socket.on("need-users", (data)=>{
        let users = new Set();
        for (let v in data.value){
            users.add(v);
        }
        if (username==null || username==""){
            // キャンセル
        } else if (!users.has(username)){
            socket.emit("register-name", {value: {"username":username, "hostUsername":hostUsername}});
            sessionStorage.setItem("isHost", "false");
            sessionStorage.setItem("username", username);
            window.location.href = "/wait/wait.html";
        } else {
            // 名前の重複判定が機能していない
            alert("そのユーザー名はすでに使われています。");
        }
    });
}

// サーバーから自分のデータを削除
socket.emit("delete-user", {value: sessionStorage.getItem("username")});

// キャッシュをクリア
sessionStorage.clear();

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
roomName.onkeydown=(e)=>{
    if (e.key!="Enter"){
        if (roomName.value=="部屋名を入力してください。"){
            roomName.value = "";
            roomName.style.color = "#222";
        }
    } else if (e.key=="Enter"){
        makeRoom(e);
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
let passwordOK;
roomPassword.onkeydown=(e)=>{
    if (e.key!="Enter"){
        if (roomPassword.value=="パスワードを入力してください。"){
            roomPassword.value = "";
            roomPassword.style.color = "#222";
        }
    } else if (e.key=="Enter"){
        makeRoom(e);
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
roomUsername.onkeydown=(e)=>{
    if (e.key!="Enter"){
        if (roomUsername.value=="ユーザー名を入力してください。"){
            roomUsername.value = "";
            roomUsername.style.color = "#222";
        }
    } else if (e.key=="Enter"){
        makeRoom(e);
    }
}
// value が空のとき「ユーザー名を～」を表示
roomUsername.onkeyup=()=>{
    if (roomUsername.value==""){
        roomUsername.value = "ユーザー名を入力してください。";
        roomUsername.style.color = "#2227";
    }
}

// 部屋の作成を完了する
let makeRoom=(e)=>{
    // 部屋名が空白
    if (roomName.value=="部屋名を入力してください。" || roomName.value==""){
        e.preventDefault();
        alert("部屋名を入力してください。");
    }
    // パスワードが空白
    else if (roomPassword.value=="パスワードを入力してください。" || roomPassword.value==""){
        e.preventDefault();
        alert("パスワードを入力してください。");
    }
    // パスワードが４桁の数字でない
    else if (!passwordOK){
        e.preventDefault();
        alert("パスワードは4桁の数字で入力してください。");
    }
    // ユーザー名が空白
    else if (roomUsername.value=="ユーザー名を入力してください。" || roomUsername.value==""){
        e.preventDefault();
        alert("ユーザー名を入力してください。");
    }
    // 何もなければ /wait/wait.html に遷移
    else {
        sessionStorage.setItem("isHost", "true");
        sessionStorage.setItem("username", roomUsername.value);
        socket.emit("room-make-finished", {value: {
            "roomName":roomUsername.value,
            "roomPassword":roomPassword.value,
            "username":roomUsername.value}
        });
        window.location.href = "/wait/wait.html";
    }
}

// 「部屋を作る」を完了する
btnSubmit.onclick=(e)=> makeRoom(e);

// 公開されている部屋の情報を更新する
socket.on("update-rooms", (data)=>{
    let roomCnt = 0;
    let rooms = data.value;
    for (let v in rooms){
        let elem = document.createElement("button");
        elem.textContent = rooms[v]["roomName"];
        elem.setAttribute("class", "btn-room-select");
        elem.setAttribute("style",
            `width: ${BUTTON_ROOM_SELECT_WIDTH}px;
             font-size: ${Math.min(30, BUTTON_ROOM_SELECT_WIDTH / elem.textContent.length)}px`
        );
        elem.setAttribute("onclick", `registerUser('${v}')`);
        roomForRooms.appendChild(elem);
        roomCnt++;
        if (roomCnt%6==0){
            let br = document.createElement("br");
            roomForRooms.appendChild(br);
        }
    }
});

