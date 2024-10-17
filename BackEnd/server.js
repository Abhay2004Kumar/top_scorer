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

let lastMessageBD = { matchData: "No available" };  // Variable to store the last message
let lastMessageBD_Double = { matchData: "No available" };  // Variable to store the last message

io.on("connection", (socket) => {
  console.log("A user connected");

  // Send the last message to the newly connected client
  socket.emit("bdminton", lastMessageBD);
  socket.on("bdminton", (payload) => {
    lastMessageBD = payload; // Store the last message
    io.emit("bdminton", payload); // Send the message to all connected clients
  });

  // bd doubles
  socket.emit('bdDoubles',lastMessageBD_Double);
  socket.on('bdDoubles',(payload)=>{
    lastMessageBD_Double = payload;
    io.emit('bdDoubles',payload);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(5000, () => {
  console.log('Server is running on port: 5000');
});
