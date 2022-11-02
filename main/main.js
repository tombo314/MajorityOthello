let set;
let socket = io();
let roomForRooms = document.getElementById("room-for-rooms");
let blackSheet = document.getElementById("black-sheet");
let btnMakeRoom = document.getElementById("btn-make-room");
let btnEnterRoom = document.getElementById("btn-enter-room");
let roomMakeWindow = document.getElementById("room-make-window");
let roomNameElem = document.getElementById("room-name");
let roomUsername = document.getElementById("username");
let btnSubmit = document.getElementById("btn-submit");
let design = document.getElementById("design");

const BUTTON_ROOM_SELECT_WIDTH = 120;
const RADIUS = 20;
const CIRCLE_NUM = 10;
const COLOR_PLAYER_RED = "rgb(255, 100, 100)";
const COLOR_PLAYER_BLUE = "rgb(100, 100, 255)";
const COLOR_PLAYER_PURPLE = "rgb(240, 100, 255)";

// min 以上 max 未満の乱数を取得
let getRandomInt=(min, max)=> {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

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
                    window.location.href = "/wait";
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
                        "roomUsername": roomUsername.value
                    }});
                    sessionStorage.setItem("isHost", "true");
                    sessionStorage.setItem("username", roomUsername.value);
                    sessionStorage.setItem("roomName", roomNameElem.value);
                    sessionStorage.setItem("samePageLoaded", "false");
                    window.location.href = "/wait";
                } else {
                    alert("そのユーザー名はすでに使われています。");
                    window.location.href = "/";
                }
            });
        }
    });
}

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
    roomUsername.value = "ユーザー名を入力してください。"
    roomNameElem.style.color = "#2227";
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

// 「部屋を作る」を完了する
btnSubmit.onclick=(e)=> makeRoom(e);

// サーバーから自分のデータを削除
socket.emit("delete-user", {value:{
    "username": sessionStorage.getItem("username"),
    "roomName": sessionStorage.getItem("roomName")
}});

// キャッシュをクリア
sessionStorage.clear();

// 部屋情報を受信
socket.emit("update-rooms", {value: ""});

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
let coords = [];
for (let i=0; i<CIRCLE_NUM; i++){
    let elem = document.createElement("canvas");
    elem.setAttribute("width", 2*RADIUS);
    elem.setAttribute("height", 2*RADIUS);
    elem.setAttribute("id", `circle${i}`);
    let randX = getRandomInt(RADIUS, 1300);
    let randY = getRandomInt(RADIUS, 580);
    coords.push([randX, randY]);
    elem.setAttribute("style", `
        position: absolute;
        border-radius: 100px;
        transform: translate(${randX}px, ${randY}px);
        z-index: 20;
    `);
    design.appendChild(elem);
    let context = elem.getContext("2d");
    context.beginPath();
    let rand = getRandomInt(0, 20);
    if (rand==1){
        context.fillStyle = COLOR_PLAYER_PURPLE;
    } else if (i%2==0){
        context.fillStyle = COLOR_PLAYER_RED;
    } else {
        context.fillStyle = COLOR_PLAYER_BLUE;
    }
    context.arc(RADIUS, RADIUS, RADIUS, 0*Math.PI/180, 360*Math.PI/180, false);
    context.fill();
    context.stroke();
}
// 丸を動かして、壁にぶつかったら跳ね返るようにする
let x = new Array(CIRCLE_NUM).fill(0, 0, CIRCLE_NUM);
let y = new Array(CIRCLE_NUM).fill(0, 0, CIRCLE_NUM);
let diffX = new Array(CIRCLE_NUM).fill(0, 0, CIRCLE_NUM);
let diffY = new Array(CIRCLE_NUM).fill(0, 0, CIRCLE_NUM);
for(let i=0; i<CIRCLE_NUM; i++){
    let elem = document.getElementById(`circle${i}`);
    diffX[i] = getRandomInt(-3, 4);
    diffY[i] = getRandomInt(-3, 4);
    let threshold = 1;
    if (0<=diffX[i] && diffX[i]<threshold){
        diffX[i]++;
    } else if (-threshold<diffX[i] && diffX[i]<=0){
        diffX[i]--;
    }
    if (0<=diffY[i] && diffY[i]<threshold){
        diffY[i]++;
    } else if (threshold<diffY[i] && diffY[i]<=0){
        diffY[i]--;
    }
    set = setInterval(()=>{
        x[i] += diffX[i];
        y[i] += diffY[i];
        if (coords[i][0]+x[i]<=0 || coords[i][0]+x[i]>=innerWidth-40){
            diffX[i] *= -1;
            if (getRandomInt(0, 2)){
                diffX[i] *= 1.1;
            } else {
                diffX[i] *= 0.9;
            }
            if (diffX[i]>=6){
                diffX[i] = 3;
            } else if (diffX[i]<=-6){
                diffX[i] = -3;
            }
        }
        if (coords[i][1]+y[i]<=0 || coords[i][1]+y[i]>=innerHeight-40){
            diffY[i] *= -1;
            if (getRandomInt(0, 2)){
                diffY[i] *= 1.1;
            } else {
                diffY[i] *= 0.9;
            }
            if (diffY[i]>=8){
                diffY[i] = 4;
            } else if (diffY[i]<=-8){
                diffY[i] = -4;
            }
        }
        elem.style.transform = `translate(${coords[i][0]+x[i]}px, ${coords[i][1]+y[i]}px)`;
    }, 10);
}
