const { Server } = require("socket.io");
const express = require("express");
const http = require("http");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "paytm-clone-mahir-ordexs-projects.vercel.app",
        credentials:true
    }
});

 function getReceiverSocketId(userId) {
    return userSocketMap[userId];
  }

const userSocketMap = {};

io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId) userSocketMap[userId] = socket.id;

    // Notify all clients about online users
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("A user disconnected", socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

// Corrected export statement
module.exports = { io, app, server, getReceiverSocketId};
