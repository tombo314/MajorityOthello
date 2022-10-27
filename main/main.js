let socket = io();
let roomForRooms = document.getElementById("room-for-rooms");
let blackSheet = document.getElementById("black-sheet");
let btnMakeRoom = document.getElementById("btn-make-room");
let btnEnterRoom = document.getElementById("btn-enter-room");
let roomMakeWindow = document.getElementById("room-make-window");
let roomNameElem = document.getElementById("room-name");
let roomPassword = document.getElementById("room-password");
let roomUsername = document.getElementById("username");
let btnSubmit = document.getElementById("btn-submit");
let design = document.getElementById("design");

const BUTTON_ROOM_SELECT_WIDTH = 120;
const RADIUS = 20;

// ゲストが部屋に入るときにユーザーを登録する
let registerUser=(roomName)=>{
    let username = prompt("ユーザー名を入力してください...");
    socket.emit("need-users", {value: ""});
    socket.on("need-users", (data)=>{
        let users = data.value;
        if (username==null || username==""){
            // キャンセル
        } else if (!Object.keys(users).includes(username)){
            socket.emit("register-name", {value: {
                "username": username,
                "roomName": roomName
            }});
            socket.on(username, (data)=>{
                if (data.value){
                    sessionStorage.setItem("isHost", "false");
                    sessionStorage.setItem("username", username);
                    sessionStorage.setItem("roomName", roomName);
                    sessionStorage.setItem("samePageLoaded", "false");
                    window.location.href = "/wait/wait.html";
                } else {
                    alert("部屋が存在しません。");
                }
            });
        } else {
            alert("そのユーザー名はすでに使われています。");
            window.location.href = "/";
        }
    });
}

// min 以上 max 未満の乱数を取得
let getRandomInt=(min, max)=> {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

// sleep(ms)
let sleep=(ms)=>{
    // let elapsed
    setInterval(() => {}, ms);
}

// サーバーから自分のデータを削除
socket.emit("delete-user", {value:{
    "username": sessionStorage.getItem("username"),
    "roomName": sessionStorage.getItem("roomName")
}});

// キャッシュをクリア
sessionStorage.clear();

// 部屋情報を受信
socket.emit("update-rooms", {value: ""});

// 周りの暗いところをクリックしてキャンセル
blackSheet.onclick=()=>{
    blackSheet.style.visibility = "hidden";
    roomMakeWindow.style.visibility = "hidden";
}

// 「部屋を作る」を押してフォームを表示
btnMakeRoom.onclick=()=>{
    blackSheet.style.visibility = "visible";
    roomMakeWindow.style.visibility = "visible";
    roomNameElem.value = "部屋名を入力してください。";
    roomPassword.value = "パスワードを入力してください。";
    roomUsername.value = "ユーザー名を入力してください。"
    roomNameElem.style.color = "#2227";
    roomPassword.style.color = "#2227";
    roomUsername.style.color = "#2227";
    roomNameElem.focus();
}

// 文字が入力されたら「部屋名を～」をクリア
roomNameElem.onkeydown=(e)=>{
    if (e.key!="Enter"){
        if (roomNameElem.value=="部屋名を入力してください。"){
            roomNameElem.value = "";
            roomNameElem.style.color = "#222";
        }
    } else if (e.key=="Enter"){
        makeRoom(e);
    }
}
// value が空のとき「部屋名を～」を表示
roomNameElem.onkeyup=()=>{
    if (roomNameElem.value==""){
        roomNameElem.value = "部屋名を入力してください。";
        roomNameElem.style.color = "#2227";
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

// ホストが部屋の作成を完了するとき
let makeRoom=(e)=>{
    // 部屋名の重複を避ける
    socket.emit("need-rooms", {value: ""});
    socket.on("need-rooms", (data)=>{
        let rooms = data.value;
        // 部屋名がすでに使われている
        if (Object.keys(rooms).includes(roomNameElem.value)){
            alert("その部屋名はすでに使われています。");
            window.location.href = "/";
        }
        // 部屋名が空白
        else if (roomNameElem.value=="部屋名を入力してください。" || roomNameElem.value==""){
            e.preventDefault();
            alert("部屋名を入力してください。");
            window.location.href = "/";
        }
        // パスワードが空白
        else if (roomPassword.value=="パスワードを入力してください。" || roomPassword.value==""){
            e.preventDefault();
            alert("パスワードを入力してください。");
            window.location.href = "/";
        }
        // パスワードが４桁の数字でない
        else if (!passwordOK){
            e.preventDefault();
            alert("パスワードは4桁の数字で入力してください。");
            window.location.href = "/";
        }
        // ユーザー名が空白
        else if (roomUsername.value=="ユーザー名を入力してください。" || roomUsername.value==""){
            e.preventDefault();
            alert("ユーザー名を入力してください。");
            window.location.href = "/";
        }
        // 何もなければ /wait/wait.html に遷移
        else {
            socket.emit("need-users", {value: ""});
            socket.on("need-users", (data)=>{
                let username = roomUsername.value;
                let users = data.value;
                if (username==null || username==""){
                    // キャンセル
                } else if (!Object.keys(users).includes(username)){
                    socket.emit("room-make-finished", {value: {
                        "roomName": roomNameElem.value,
                        "roomPassword": roomPassword.value,
                        "roomUsername": roomUsername.value
                    }});
                    sessionStorage.setItem("isHost", "true");
                    sessionStorage.setItem("username", roomUsername.value);
                    sessionStorage.setItem("roomName", roomNameElem.value);
                    sessionStorage.setItem("samePageLoaded", "false");
                    window.location.href = "/wait/wait.html";
                } else {
                    alert("そのユーザー名はすでに使われています。");
                    window.location.href = "/";
                }
            });
        }
    });
}

// 「部屋を作る」を完了する
btnSubmit.onclick=(e)=> makeRoom(e);

// 公開されている部屋の情報を更新する
socket.on("update-rooms", (data)=>{
    let roomCnt = 0;
    let rooms = data.value;
    for (let v in rooms){
        let elem = document.createElement("button");
        elem.textContent = v;
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

// 初期画面のデザイン
// for (let i=0; i<1; i++){
//     let elem = document.createElement("canvas");
//     elem.setAttribute("width", 1400);
//     elem.setAttribute("height", 670);
//     elem.setAttribute("id", `circle${i}`);
//     let randX = getRandomInt(RADIUS+10, 1340);
//     let randY = getRandomInt(RADIUS+10, 600);
//     elem.setAttribute("style", `
//         position: absolute;
//         background-color: red;
//         z-index: 20;
//     `);
//     design.appendChild(elem);
//     let context = elem.getContext("2d");
//     context.beginPath();
//     context.fillStyle = "rgb(255, 100, 100)";
//     context.arc(randX, randY, RADIUS, 0*Math.PI/180, 360*Math.PI/180, false);
//     context.fill();
//     context.stroke();
// }
let x = 0;
let y = 0;
let diffX = 2;
let diffY = -1;
// let elem = document.getElementById("circle0");
// x += diffX;
// y += diffY;
// elem.style.transform = `translate(${x}px, ${y}px)`;