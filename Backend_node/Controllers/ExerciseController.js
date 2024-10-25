import ExerciseModel from "../Models/ExerciseModel.js";
import Category from "../Models/CategoryExercisesModel.js";



const addExercise = async (req, res) => {
    const { name, category, alternatives } = req.body;

   
    const video_url = req.file ? req.file.path : null;

   
    if (!category) {
        return res.json({ success: false, message: 'Category is required' });
    }

   
    if (!video_url) {
        return res.status(400).json({ success: false, message: 'Invalid video file' });
    }

    try {
        // Create a new exercise 
        const newExercise = new ExerciseModel({
            name,
            video: video_url, 
            category,
            alternatives: alternatives ? alternatives.map(alt => ({ name: alt })) : [], // Handle alternatives
        });

        // Save the new exercise to the database
        await newExercise.save();

        
        return res.json({ success: true, exercise: newExercise });
    } catch (error) {
        
        return res.status(500).json({ success: false, message: 'Error creating exercise', error: error.message });
    }
};

const getExercises = async (req, res) => {
    const { category } = req.query;

    try {
        
        res.set('Cache-Control', 'no-store');

        const query = category ? { category } : {};
        const exercises = await ExerciseModel.find(query);

        return res.json({ success: true, exercises });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error fetching exercises', error: error.message });
    }
};


const getCategories = async (req, res) => {
    try {

        res.set('Cache-Control', 'no-store');
        
        const categories = await Category.find({});

       
        return res.json({ success: true, categories });
    } catch (error) {
       
        return res.status(500).json({ success: false, message: 'Error fetching categories', error: error.message });
    }
};



const addCategory = async (req , res)=>{
     const image_url=req.file.path;


     const category = new Category({
        category : req.body.category,
        image : image_url
     });
     try {
        await category.save();
        res.json({ success:true , message:'Category added successfully' });

        
     } catch (error) {
        res.json({ success:false , message:'failed to add Category' });
     }
}


export { addExercise ,getExercises , getCategories, addCategory};
