import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import connectDB from './DB/connectDB.js';
import cookieParser from 'cookie-parser';
import { routes } from './routes/sport.route.js';
import UserRouter from './routes/user.route.js';
import PlayerRouter from './routes/player.route.js';
import adminRouter from './routes/admin.route.js';


const PORT = process.env.PORT


const app = express();
const server = http.createServer(app);
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// CORS Configuration
const io = new Server(server, {
  cors: {
    origin: "*",  // For development purposes, update to specific origin(s) in production
    methods: ["GET", "POST"]
  }
});

// // Variables to store last messages for each game type
let lastMessageBD = { matchData: false };  // Variable to store last Badminton match data
let lastMessageBDouble = { matchData: false };  // Variable to store last Badminton Doubles match data

// Full payload object to store all game data
let full_Payload = {
  badminton: { 
    "lastMessageBD" : false
  },
  badminton_double: {
    "lastMessageBDouble" : false
  },
  tennis : {
    "TT": false
  },
  tennis_D: {
    "TTD": false
  },
  kabbadi_M:{
    "Kabb":false
  }
};
 
io.on("connection", (socket) => {
  console.log("A user connected");

  // Send the full payload to the newly connected client
  // socket.emit("FullPayLoad", full_Payload);
  // console.log("FICK",full_Payload.tennis_D);

  // console.log("ALL",full_Payload);
  // Listen for data from the client
  socket.on("data", (payload) => {
    // Check if payload has a name and update the corresponding game type
    console.log("Payload: ", payload)
    if (payload.name === "Badminton") {
      // Update badminton data
      full_Payload.badminton.lastMessageBD = payload.data;
    } 
    else if (payload.name === "Badminton_D") {
      // Update badminton_double datatennis_D
      full_Payload.badminton_double.lastMessageBDouble = payload.data;
    }
    else if (payload.name === "tennis") {
      // Update  data
      console.log("TEnnis");
      full_Payload.tennis.TT = payload.data;
    }
    else if (payload.name === "Tennis_D") {
      // Update badminton_double data 
      console.log("Tennis_D");
      full_Payload.tennis_D.TTD = payload.data;
    }
    else if (payload.name === "Kabaddi") {
      // Update badminton_double data 
      // console.log("Kabaddi");
      console.log(payload.data)
      full_Payload.kabbadi_M.Kabb = payload.data;
    }
    

    io.emit("FullPayLoad", full_Payload);
  });
  

  // Handle client disconnection 
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

app.use('/api/v1/sports',routes);
app.use('/api/v1/users',UserRouter)
app.use('/api/v1/players',PlayerRouter)
app.use('/api/v1/admin',adminRouter)


// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`); 
});

connectDB();