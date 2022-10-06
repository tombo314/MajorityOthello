const socket = io();

socket.emit("battle-ready", {value: ""});
