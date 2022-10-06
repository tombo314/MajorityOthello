const socket = io();

socket.emit("waiting-started", {value: ""});
socket.on("waiting-started", (data)=>{
    alert(1);
    const waitForSeconds = 3;
    const waitFor = waitForSeconds*1000;
    let now;
    const func=()=>{
        now = new Date().getTime();
        if (now-TIME>=waitFor){
            clearInterval(set);
            socket.emit("battle-ready", {value: ""});
        }
    }
    const TIME = new Date().getTime();
    let set = setInterval(func, 1000);
});

socket.on("battle-ready", (data)=>{
    alert("バトル画面に遷移します。");
    window.location.href = "/battle/battle.html";
});