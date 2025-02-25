const { Server } = require("socket.io");
const express = require("express");
const http = require("http");

const app = express();
const server = http.createServer(app);
const allowedOrigins = [
    "https://paytm-clone-mahir-ordexs-projects.vercel.app",
    "https://paytm-clone-green.vercel.app",
    "https://paytm-clone-nine-nu.vercel.app",
    "https://paytm-clone-e7ljvdrvs-mahir-ordexs-projects.vercel.app", // New deployment
    "http://localhost:5173"
];

const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        credentials: true
    }
});

const userSocketMap = {}; // Store user socket mapping

// Function to get the receiver's socket ID
function getReceiverSocketId(userId) {
    console.log("User Socket Map:", userSocketMap);
    return userSocketMap[userId] || null; // Return null if user is offline
}

// Socket connection handling
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id, "Query:", socket.handshake.query);

    const userId = socket.handshake.query.userId;
    if (!userId) {
        console.log("User ID is missing in the socket connection!");
        return;
    }

    userSocketMap[userId] = socket.id;
    console.log(`User ${userId} mapped to socket ${socket.id}`);

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});


module.exports = { io, app, server, getReceiverSocketId };
