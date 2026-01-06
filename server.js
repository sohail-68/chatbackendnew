// const express = require('express');
// const connectDB = require('./config/db');
// const cors = require('cors');
// const http = require('http');
// const { Server } = require('socket.io');
// require('dotenv').config();

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//     cors: {
//         origin: "https://chatb-vrft.onrender.com", // Update this with your frontend URL
//         methods: ["GET", "POST"],
//     },
// });
// app.use(express.json({ limit: '5mb' }));
// app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// // Connect to MongoDB
// connectDB();

// // Middleware
// app.use(express.json());
// app.use(cors());

// // Socket.IO Setup
// io.on('connection', (socket) => {
//     console.log(`User connected: ${socket.id} at ${new Date().toLocaleTimeString()}`);

//     // Join Room Event
//     socket.on('joinRoom', (userId) => {
//         if (userId) {
//             socket.join(userId);
//             console.log(`User with ID ${userId} joined room: ${userId}`);
//         } else {
//             console.error('joinRoom event received without userId');
//         }
//     });

//     // Typing Indicator Event
//     socket.on('typing', (userId) => {
//         if (userId) {
//             console.log(`User ${userId} is typing...`);
//             // Broadcast typing status to the room excluding the sender
//             socket.broadcast.emit('typing', userId);
//         } else {
//             console.error('typing event received without userId');
//         }
//     });

//     // Stop Typing Indicator Event
//     socket.on('stopTyping', (userId) => {
//         if (userId) {
//             console.log(`User ${userId} stopped typing`);
//             // Broadcast stop typing status to the room
//             socket.broadcast.emit('stopTyping', userId);
//         } else {
//             console.error('stopTyping event received without userId');
//         }
//     });

//     // Message Event - sendMessage
//     socket.on('sendMessage', ({ message, senderId, receiverId }) => {
//         if (message && senderId && receiverId) {
//             console.log(`Message received on server: "${message}" from ${senderId} to ${receiverId}`);
//             // Send the message to the receiver
//             io.to(receiverId).emit('receiveMessage', {
//                 message,
//                 senderId,
//                 timestamp: new Date().toISOString(),
//                 receiverId,
//             });
//         } else {
//             console.error('Incomplete sendMessage payload:', { message, senderId, receiverId });
//         }
//     });

//     // Another Send Event - send
 
//     // Handle User Disconnect
//     socket.on('disconnect', () => {
//         console.log(`User disconnected: ${socket.id}`);
//         // Perform any clean-up actions here if needed
//     });
// });

// // API Routes
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api', require('./routes/post'));
// app.use('/api/comment', require('./routes/comment'));

// // Start Server
// const PORT = process.env.PORT || 5001;
// server.listen(PORT, () => {
//     console.log(`Server started on port ${PORT}`);
// });
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

require('dotenv').config();


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://chatf-771g.onrender.com",
    methods: ["GET", "POST"],
  },
});
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Socket.IO Setup
io.on("connection", (socket) => {
  console.log("⚡ User connected:", socket.id);

  socket.on("joinRoom", (userId) => {
    socket.join(userId);
    console.log(`📥 User ${userId} joined their room`);
  });

  socket.on("sendMessage", async (data) => {
    const { sender, receiver, content } = data;  // 👈 change names to match frontend

    try {
      const Message = require("./models/Message");
      const newMessage = new Message({ sender, receiver, content });
      const savedMessage = await newMessage.save();

      // send to specific user room
      io.to(receiver).emit("receiveMessage", savedMessage);
      io.to(receiver).emit("newNotification", {
        _id: savedMessage._id,
        sender,
        content,
        createdAt: savedMessage.createdAt,

    });

    } catch (error) {
      console.error("Message save error:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});


// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api', require('./routes/post'));
app.use('/api/comment', require('./routes/comment'));
app.use("/api/messages", require('./routes/messageRoutes'));

// Start Server
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
