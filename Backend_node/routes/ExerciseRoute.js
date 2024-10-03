import express from 'express';
import { Exercise } from '../config/Cloudinary.js'; // Import the configured multer instance
import { addExercise, getCategories, getExercises } from '../Controllers/ExerciseController.js';

const ExerciseRouter = express.Router();


ExerciseRouter.post('/add', Exercise.single('video'), addExercise);
ExerciseRouter.get('/get',getExercises);
ExerciseRouter.get('/categories', getCategories);


export default ExerciseRouter;
