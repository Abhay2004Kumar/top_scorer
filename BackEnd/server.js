import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const server = http.createServer(app);

// CORS Configuration
const io = new Server(server, {
  cors: {
    origin: "*",  // For development purposes, update to specific origin(s) in production
    methods: ["GET", "POST"]
  }
});

// Variables to store last messages for each game type
let lastMessageBD = { matchData: "No available" };  // Variable to store last Badminton match data
let lastMessageBDouble = { matchData: "No available" };  // Variable to store last Badminton Doubles match data

// Full payload object to store all game data
let full_Payload = {
  badminton: {
    lastMessageBD
  },
  badminton_double: {
    lastMessageBDouble
  }
};

// Set up socket connection
io.on("connection", (socket) => {
  console.log("A user connected");

  // Send the full payload to the newly connected client
  socket.emit("FullPayLoad", full_Payload);

  // Listen for data from the client
  socket.on("data", (payload) => {
    // Check if payload has a name and update the corresponding game type
    if (payload.name === "Badminton") {
      // Update badminton data
      full_Payload.badminton.lastMessageBD = payload.data;
    } 
    else if (payload.name === "Badminton_D") {
      // Update badminton_double data
      full_Payload.badminton_double.lastMessageBDouble = payload.data;
    }
  
    // Log the incoming payload
    console.log("Received Payload:", payload);
  
    // Log the updated full payload structure
    console.log("Updated full_Payload:", full_Payload);
  
    // Broadcast the updated full payload to all connected clients
    io.emit("FullPayLoad", full_Payload);
  });
  

  // Handle client disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Start the server
server.listen(5000, () => {
  console.log('Server is running on port: 5000');
});
