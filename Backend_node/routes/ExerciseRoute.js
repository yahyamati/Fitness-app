import express from 'express';
import { Category, Exercise } from '../config/Cloudinary.js'; // Import the configured multer instance
import { addExercise, getCategories, getExercises,addCategory } from '../Controllers/ExerciseController.js';

const ExerciseRouter = express.Router();


ExerciseRouter.post('/add', Exercise.single('video'), addExercise);
ExerciseRouter.get('/get',getExercises);
ExerciseRouter.get('/getCategory', getCategories);
ExerciseRouter.post('/addCategory' ,Category.single('image') ,addCategory)


export default ExerciseRouter;
