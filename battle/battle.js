const socket = io();

socket.emit("battle-start", {value: ""});
socket.on("battle-start", (data)=>{
    alert("OK!");
});