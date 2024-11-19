import express from 'express';
import { connectDB } from './config/db.js';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import { initializeSocket } from './Sockets/Socket.js';
import ExerciseRouter from './routes/ExerciseRoute.js';
import MessageRouter from './routes/MessageRoute.js';
import ProfileRouter from './routes/ProfileRoute.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 4000;


const corsOptions = {
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
};


// Middleware
app.use(express.json());
app.use(cors(corsOptions));

// Routes
app.use('/api/Exercise', ExerciseRouter);
app.use('/api/Messages', MessageRouter);
app.use('/api', ProfileRouter);

// Connect to MongoDB
connectDB();

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
initializeSocket(server);

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});