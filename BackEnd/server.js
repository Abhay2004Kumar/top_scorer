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
import FeedbackRouter from './routes/feedback.route.js';
import paymentRouter from './routes/payment.route.js';
import stripeRouter from './routes/webhook.route.js'
import DonateRouter from './routes/donate.route.js';
import { console } from 'inspector';
import { cloudinaryConnect } from './utils/cloudinary.js';
import fileupload from 'express-fileupload';
import redisClient from './utils/redis.js';
import rabbitMQClient from './utils/rabbitmq.js';
import { dynamicRateLimit } from './middlewares/rateLimit.middleware.js';

const PORT = process.env.PORT;

const app = express();
const server = http.createServer(app);

// CORS Configuration
app.use(cors({ 
  origin: ["http://localhost:3001", "http://localhost:3003", "https://top-scorer-ecru.vercel.app","https://top-scorer-admin.vercel.app"],
  credentials: true
}));

app.use(fileupload({
  useTempFiles: true,
  tempFileDir: '/tmp/'
}));

app.use(express.json());
app.use(cookieParser());

// Apply rate limiting
app.use(dynamicRateLimit);

// Socket.IO Configuration with Redis
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Enhanced match data with Redis caching
let full_Payload = {
  badminton: { 
    "lastMessageBD": false
  },
  badminton_double: {
    "lastMessageBDouble": false
  },
  tennis: {
    "TT": false
  },
  tennis_D: {
    "TTD": false
  },
  kabbadi_M: {
    "Kabb": false
  },
  Cricket_D: {
    "Cricket": false
  },
  Football: {
    "Foot": false
  }
};

let connectedClient = 0;

// Load cached match data from Redis on startup
const loadCachedMatchData = async () => {
  try {
    const cachedData = await redisClient.getMatchData('global', 'fullPayload');
    if (cachedData) {
      full_Payload = { ...full_Payload, ...cachedData };
      console.log('✅ Loaded cached match data from Redis');
    }
  } catch (error) {
    console.log('⚠️ No cached match data found, starting fresh');
  }
};

// Save match data to Redis
const saveMatchDataToRedis = async () => {
  try {
    await redisClient.setMatchData('global', 'fullPayload', full_Payload, 7200);
  } catch (error) {
    console.error('❌ Error saving match data to Redis:', error);
  }
};

// Enhanced Socket.IO connection handling
io.on("connection", async (socket) => {
  connectedClient++;
  console.log("A user connected. Total clients:", connectedClient);
  
  // Update Redis statistics
  await redisClient.incrementStat('socket', 'totalConnections');
  await redisClient.incrementStat('socket', 'activeConnections');
  
  // Broadcast connected client count
  io.emit("clientCount", connectedClient);

  // Send full payload
  socket.emit("FullPayLoad", full_Payload);
  console.log(full_Payload);

  // Handle data updates with Redis caching
  socket.on("data", async (payload) => {
    try {
      if (payload.name === "Badminton") { 
        full_Payload.badminton.lastMessageBD = payload.data;
        // Cache individual sport data
        await redisClient.setMatchData('badminton', 'current', payload.data, 3600);
      } else if (payload.name === "Badminton_D") {
        full_Payload.badminton_double.lastMessageBDouble = payload.data;
        await redisClient.setMatchData('badminton_double', 'current', payload.data, 3600);
      } else if (payload.name === "tennis") {
        full_Payload.tennis.TT = payload.data;
        await redisClient.setMatchData('tennis', 'current', payload.data, 3600);
      } else if (payload.name === "Tennis_D") {
        full_Payload.tennis_D.TTD = payload.data;
        await redisClient.setMatchData('tennis_double', 'current', payload.data, 3600);
      } else if (payload.name === "Kabaddi") {
        full_Payload.kabbadi_M.Kabb = payload.data;
        await redisClient.setMatchData('kabaddi', 'current', payload.data, 3600);
      } else if (payload.name === "Cricket") {
        full_Payload.Cricket_D.Cricket = payload.data;
        await redisClient.setMatchData('cricket', 'current', payload.data, 3600);
      } else if (payload.name === "Football") {
        full_Payload.Football.Foot = payload.data;
        await redisClient.setMatchData('football', 'current', payload.data, 3600);
      }

      // Update payload with live client count
      full_Payload.clients = connectedClient;

      // Save to Redis
      await saveMatchDataToRedis();

      // Send match update to RabbitMQ for processing
      if (rabbitMQClient.isConnected) {
        await rabbitMQClient.sendMatchUpdate({
          sportType: payload.name,
          data: payload.data,
          timestamp: Date.now(),
          clientCount: connectedClient
        });
      }

      // Broadcast to all
      io.emit("FullPayLoad", full_Payload);
    } catch (error) {
      console.error('Error processing match update:', error);
    }
  });

  socket.on("disconnect", async () => {
    connectedClient--;
    console.log("A user disconnected. Total clients:", connectedClient);
    
    // Update Redis statistics
    await redisClient.incrementStat('socket', 'activeConnections', -1);
    
    io.emit("clientCount", connectedClient);

    // Handle cricket updates
    socket.on("cricket_update", async (data) => {
      try {
        console.log("Received cricket update:", data);
        // Update the full payload
        full_Payload.Cricket_D.Cricket = data;
        
        // Cache cricket data
        await redisClient.setMatchData('cricket', 'current', data, 3600);
        
        // Save to Redis
        await saveMatchDataToRedis();
        
        // Send to RabbitMQ
        if (rabbitMQClient.isConnected) {
          await rabbitMQClient.sendMatchUpdate({
            sportType: 'Cricket',
            data: data,
            timestamp: Date.now(),
            clientCount: connectedClient
          });
        }
        
        // Broadcast to all clients
        io.emit("cricket_update", data);
      } catch (error) {
        console.error('Error processing cricket update:', error);
      }
    });
  });
});

// Enhanced Chat Room with Redis
const chatNamespace = io.of('/chat');

// Store chat rooms, users, and message history
const chatRooms = {
  Badminton: { 
    users: [],
    messages: [] 
  },
  Badminton_Doubles: { 
    users: [],
    messages: [] 
  },
  Tennis: { 
    users: [],
    messages: [] 
  },
  Tennis_Doubles: { 
    users: [],
    messages: [] 
  },
  Kabaddi: { 
    users: [],
    messages: [] 
  },
  Cricket: { 
    users: [],
    messages: [] 
  },
  Football: { 
    users: [],
    messages: [] 
  }
};

// Maximum number of messages to store per room
const MAX_MESSAGES = 50;

chatNamespace.on('connection', async (socket) => {
  // Join a chat room
  socket.on('join_chat_room', async ({ username, room }) => {
    try {
      console.log(username);
      if (chatRooms[room]) {
        // Add user to room
        chatRooms[room].users.push({ id: socket.id, username });
        socket.join(room);
        
        // Notify room that user joined
        socket.to(room).emit('user_joined_chat', username);
        
        // Load messages from Redis
        const cachedMessages = await redisClient.getChatMessages(room, MAX_MESSAGES);
        const messages = cachedMessages.length > 0 ? cachedMessages : chatRooms[room].messages.slice(-MAX_MESSAGES);
        
        // Send room info and message history to user
        chatNamespace.to(socket.id).emit('chat_room_info', {
          room,
          users: chatRooms[room].users.map(u => u.username),
          messages: messages
        });
        
        // Update Redis statistics
        await redisClient.incrementStat('chat', `${room.toLowerCase()}_joins`);
      }
    } catch (error) {
      console.error('Error joining chat room:', error);
    }
  });

  // Handle chat messages with Redis caching
  socket.on('send_chat_message', async ({ room, message }) => {
    try {
      const user = chatRooms[room]?.users.find(u => u.id === socket.id);
      if (user) {
        const chatMessage = {
          username: message.username,
          message: message.message,
          timestamp: new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            timeZone: 'Asia/Kolkata'
          })
        };
        
        // Add message to room's message history
        chatRooms[room].messages.push(chatMessage);
        
        // Keep only the last MAX_MESSAGES messages
        if (chatRooms[room].messages.length > MAX_MESSAGES) {
          chatRooms[room].messages.shift();
        }
        
        // Cache message in Redis
        await redisClient.addChatMessage(room, chatMessage);
        
        // Send notification via RabbitMQ
        if (rabbitMQClient.isConnected) {
          await rabbitMQClient.sendNotification({
            type: 'chat_message',
            room: room,
            username: message.username,
            message: message.message,
            priority: 'low'
          });
        }
        
        // Broadcast message to room
        chatNamespace.to(room).emit('receive_chat_message', chatMessage);
        
        // Update Redis statistics
        await redisClient.incrementStat('chat', `${room.toLowerCase()}_messages`);
      }
    } catch (error) {
      console.error('Error processing chat message:', error);
    }
  });

  // Handle disconnection
  socket.on('disconnect', async () => {
    try {
      // Find and remove user from all rooms
      Object.keys(chatRooms).forEach(async (room) => {
        const index = chatRooms[room].users.findIndex(u => u.id === socket.id);
        if (index !== -1) {
          const user = chatRooms[room].users[index];
          chatRooms[room].users.splice(index, 1);
          socket.to(room).emit('user_left_chat', user.username);
          console.log(`${user.username} left ${room} chat room`);
          
          // Update Redis statistics
          await redisClient.incrementStat('chat', `${room.toLowerCase()}_leaves`);
        }
      });
    } catch (error) {
      console.error('Error handling chat disconnect:', error);
    }
  });
});

// Express Routes
app.use('/api/v1/sports', routes);
app.use('/api/v1/users', UserRouter);
app.use('/api/v1/players', PlayerRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/feedback', FeedbackRouter);
app.use('/api/v1/payment', paymentRouter);
app.use('/api/v1/donate', DonateRouter);

// Stripe webhook route
app.use('/api/v1', stripeRouter);

// Health check endpoint
app.get('/health', async (req, res) => {
  const health = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    services: {
      database: false,
      redis: false,
      rabbitmq: false
    }
  };

  try {
    // Check database connection status
    const mongoose = await import('mongoose');
    health.services.database = mongoose.default.connection.readyState === 1;
  } catch (error) {
    console.error('Database health check failed:', error);
  }

  try {
    // Check Redis connection
    health.services.redis = await redisClient.ping();
  } catch (error) {
    console.error('Redis health check failed:', error);
  }

  try {
    // Check RabbitMQ connection
    health.services.rabbitmq = await rabbitMQClient.healthCheck();
  } catch (error) {
    console.error('RabbitMQ health check failed:', error);
  }

  const allServicesHealthy = Object.values(health.services).every(status => status);
  const statusCode = allServicesHealthy ? 200 : 503;

  res.status(statusCode).json(health);
});

// Initialize services
const initializeServices = async () => {
  try {
    console.log('🚀 Initializing services...');
    
    // Connect to Redis (optional)
    try {
      await redisClient.connect();
    } catch (error) {
      console.log('⚠️  Redis connection failed, continuing without Redis');
    }
    
    // Connect to RabbitMQ (optional)
    try {
      await rabbitMQClient.connect();
    } catch (error) {
      console.log('⚠️  RabbitMQ connection failed, continuing without RabbitMQ');
    }
    
    // Load cached data if Redis is available
    if (redisClient.isConnected) {
      await loadCachedMatchData();
    }
    
    // Start RabbitMQ consumers if available
    if (rabbitMQClient.isConnected) {
      await startRabbitMQConsumers();
    }
    
    console.log('✅ Services initialized successfully');
  } catch (error) {
    console.error('❌ Service initialization failed:', error);
    console.log('⚠️  Continuing with limited functionality');
  }
};

// RabbitMQ Consumers
const startRabbitMQConsumers = async () => {
  if (!rabbitMQClient.isConnected) return;

  // Match update consumer
  await rabbitMQClient.consumeQueue(rabbitMQClient.queues.MATCH_UPDATES, async (data) => {
    console.log('Processing match update:', data);
    // Add any additional processing logic here
  });

  // Notification consumer
  await rabbitMQClient.consumeQueue(rabbitMQClient.queues.NOTIFICATIONS, async (data) => {
    console.log('Processing notification:', data);
    // Add notification processing logic here
  });

  console.log('✅ RabbitMQ consumers started');
};

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🔄 Graceful shutdown initiated...');
  
  // Close Redis connection
  await redisClient.disconnect();
  
  // Close RabbitMQ connection
  await rabbitMQClient.disconnect();
  
  // Close server
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

// Start the server
server.listen(PORT, async () => {
  console.log(`🚀 Server is running on port: ${PORT}`);
  
  // Initialize all services
  await initializeServices();
  
  // Connect to cloudinary and database
  cloudinaryConnect();
  connectDB();
});