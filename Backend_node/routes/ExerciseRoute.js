import express from 'express';
import { Category, Exercise } from '../config/Cloudinary.js'; 
import { addExercise, getCategories, getExercises,addCategory,getExerciseById } from '../Controllers/ExerciseController.js';

const ExerciseRouter = express.Router();


ExerciseRouter.post('/add', Exercise.single('video'), addExercise);
ExerciseRouter.get('/get',getExercises);
ExerciseRouter.get('/getCategory', getCategories);
ExerciseRouter.get('/:id',getExerciseById);

ExerciseRouter.post('/addCategory' ,Category.single('image') ,addCategory)


export default ExerciseRouter;
