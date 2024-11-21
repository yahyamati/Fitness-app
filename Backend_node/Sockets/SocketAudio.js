import { Server } from 'socket.io';

let io;

export const initializeAudioSocket = (server) => {
  // Initialize the Socket.io server for audio signaling
  io = new Server(server, {
    transports: ['websocket'],
    cors: {
      origin: '*', // Adjust in production
      methods: ['GET', 'POST'],
      allowedHeaders: ['Content-Type'],
      credentials: true,
    },
  });

  // Handle WebRTC signaling
  io.on('connection', (socket) => {
    console.log(`User connected for audio: ${socket.id}`);

    // Handle WebRTC offer
    socket.on('offer', (data) => {
      const { receiverId, offer } = data;
      console.log(`Audio Offer from ${socket.id} to ${receiverId}`);
      io.to(receiverId).emit('offer', { senderId: socket.id, offer });
    });

    // Handle WebRTC answer
    socket.on('answer', (data) => {
      const { receiverId, answer } = data;
      console.log(`Audio Answer from ${socket.id} to ${receiverId}`);
      io.to(receiverId).emit('answer', { senderId: socket.id, answer });
    });

    // Handle ICE candidates
    socket.on('ice-candidate', (data) => {
      const { receiverId, candidate } = data;
      console.log(`ICE Candidate from ${socket.id} to ${receiverId}`);
      io.to(receiverId).emit('ice-candidate', { senderId: socket.id, candidate });
    });

    // Handle user disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected from audio: ${socket.id}`);
    });
  });

  return io;
};

export const getAudioIO = () => {
  if (!io) {
    throw new Error('Socket.io for audio not initialized');
  }
  return io;
};
