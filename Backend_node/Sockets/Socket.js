import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import Message from '../Models/MessageModel.js';

let io;

export const initializeSocket = (server) => {
  // Initialize the Socket.io server
  io = new Server(server, {
    transports: ['websocket'],
    cors: {
      origin: '*', // Adjust origin in production to your specific frontend URL
      methods: ['GET', 'POST'],
      allowedHeaders: ['Content-Type'],
      credentials: true,
    },
  });



  const getSignInKey = () => {
  // This is assuming secretKey is a base64-encoded string
  const secretKey = process.env.JWT_SECRET;  // Make sure your secretKey is stored in the env variables
  const decodedKey = Buffer.from(secretKey, 'base64');
  return decodedKey;
};

io.use((socket, next) => {
  let token = socket.handshake.auth.token;
  console.log('Token received:', token);  // Debugging the received token

  if (!token) {
    return next(new Error('Authentication token required'));
  }

  // Remove "Bearer " prefix if it exists
  if (token.startsWith('Bearer ')) {
    token = token.slice(7);  // Remove the "Bearer " prefix
  }

  try {
    const decoded = jwt.verify(token, getSignInKey());  // Use the decoded key here
    console.log('Decoded JWT:', decoded);  // This should print now if the token is valid

    socket.userId = decoded.userId;  // Assuming userId is part of the decoded payload
    next();
  } catch (error) {
    console.error('Authentication error:', error.message);  // Detailed error logging
    next(new Error('Authentication failed: ' + error.message));  // Send error with more info
  }
});
  
  

  // Handle client connections
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.userId}`);

    // Join a personal room for private messaging
    socket.join(socket.userId);

    socket.on('sendMessage', async (data) => {
      try {
        const { receiverId, content } = data;
    
        // Validate the receiverId and content
        if (!receiverId || !content) {
          return socket.emit('messageError', {
            success: false,
            error: 'Receiver ID and message content are required',
          });
        }
    
        // Assuming socket.userId contains the sender's ID (you set this when the user connects)
        const senderId = socket.userId;
    
        // Create and save the message to the database
        const message = new Message({
          senderId,
          receiverId,
          content,
          timestamp: new Date(),
        });
        await message.save();
    
        // Emit the message to the receiver (this assumes the receiver is connected to the socket)
        io.to(receiverId).emit('newMessage', {
          message: {
            _id: message._id,
            senderId,
            receiverId,
            content,
            timestamp: message.timestamp,
          },
        });
    
        // Emit confirmation to the sender
        socket.emit('messageSent', {
          success: true,
          message: message,
        });
      } catch (error) {
        console.error('Message error:', error.message);
        socket.emit('messageError', {
          success: false,
          error: error.message,
        });
      }
    });

    // Event: User typing
    socket.on('typing', (data) => {
      socket.to(data.receiverId).emit('userTyping', {
        userId: socket.userId,
      });
    });

    // Event: User stopped typing
    socket.on('stopTyping', (data) => {
      socket.to(data.receiverId).emit('userStopTyping', {
        userId: socket.userId,
      });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.userId}`);
    });
  });

  return io;
};

// Function to get the initialized Socket.io instance
export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

// Function to handle WebSocket messages from Postman or external clients


// const handlePostmanWebSocket = (socket) => {
//   socket.on('message', async (message) => {
//     try {
//       const data = JSON.parse(message);

//       switch (data.type) {
//         case 'message':
//           // Handle sending a chat message
//           const newMessage = new Message({
//             senderId: socket.userId,
//             receiverId: data.receiverId,
//             content: data.content,
//           });
//           await newMessage.save();

//           // Emit confirmation to the sender
//           socket.emit('message', {
//             type: 'confirmation',
//             message: 'Message sent successfully',
//             data: newMessage,
//           });

//           // Emit the message to the receiver
//           socket.to(data.receiverId).emit('message', {
//             type: 'new_message',
//             data: newMessage,
//           });
//           break;

//         case 'typing':
//           // Emit typing indicator to the receiver
//           socket.to(data.receiverId).emit('message', {
//             type: 'typing_indicator',
//             userId: socket.userId,
//           });
//           break;

//         case 'stop_typing':
//           // Emit stop typing indicator to the receiver
//           socket.to(data.receiverId).emit('message', {
//             type: 'stop_typing',
//             userId: socket.userId,
//           });
//           break;

//         default:
//           // Handle unknown message types
//           socket.emit('message', {
//             type: 'error',
//             message: 'Unknown message type',
//           });
//       }
//     } catch (error) {
//       console.error('WebSocket message error:', error.message);
//       socket.emit('message', {
//         type: 'error',
//         message: error.message,
//       });
//     }
//   });
// };
