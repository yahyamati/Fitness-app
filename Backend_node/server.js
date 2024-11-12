import express from 'express';
import { connectDB } from './config/db.js';
import dotenv from 'dotenv';
import cors from 'cors'

import ExerciseRouter from './routes/ExerciseRoute.js'


dotenv.config(); 

// App config
const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json()); 

app.use(cors());




app.use('/api/Exercise',ExerciseRouter)





connectDB();

// Ping endpoint to keep the backend awake
app.get('/ping', (req, res) => {
  res.send('pong');
});

app.get("/", (req, res) => {
  res.send("API Working");
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'An error occurred', error: err.message });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

