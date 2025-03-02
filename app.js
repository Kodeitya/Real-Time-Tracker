const express = require('express');
const path = require("path");
const socketio = require('socket.io'); 
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = socketio(server); 

// Set EJS as the template engine
app.set("view engine", "ejs");

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", function(socket) {  
    socket.on("sendLocation", function(data) {
        io.emit("receiveLocation", {id:socket.id,...data});
    }); 
    // console.log("New WS Connection");

    socket.on("disconnect",function(){
        io.emit("user-disconnect",socket.id);
        });
});

app.get('/', function(req, res) {
    res.render('index');
});

server.listen(3000, () => {
    console.log("Server running on port 3000");
});
