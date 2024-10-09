import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",  // Update if the frontend is served elsewhere
    methods: ["GET", "POST"]
  }
});

let lastMessage = { matchData: "No available" };  // Variable to store the last message

io.on("connection", (socket) => {
  console.log("A user connected");

  // Send the last message to the newly connected client
  socket.emit("bdminton", lastMessage);

  // Listen for chat messages
  socket.on("bdminton", (payload) => {
    lastMessage = payload; // Store the last message
    io.emit("bdminton", payload); // Send the message to all connected clients
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(5000, () => {
  console.log('Server is running on http://10.22.12.166:5000');
});
