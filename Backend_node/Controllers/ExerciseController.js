import ExerciseModel from "../Models/ExerciseModel.js";

const addExercise = async (req, res) => {
    const { name, category, alternatives } = req.body;

    // Ensure the video is being accessed correctly from req.file
    const video_url = req.file ? req.file.path : null;

    // Check if category is provided
    if (!category) {
        return res.json({ success: false, message: 'Category is required' });
    }

    // Check if video was uploaded
    if (!video_url) {
        return res.status(400).json({ success: false, message: 'Invalid video file' });
    }

    try {
        // Create a new exercise with the video URL
        const newExercise = new ExerciseModel({
            name,
            video: video_url, // Store the video URL
            category,
            alternatives: alternatives ? alternatives.map(alt => ({ name: alt })) : [], // Handle alternatives
        });

        // Save the new exercise to the database
        await newExercise.save();

        // Send success response
        return res.json({ success: true, exercise: newExercise });
    } catch (error) {
        // Handle any errors
        return res.status(500).json({ success: false, message: 'Error creating exercise', error: error.message });
    }
};

const getExercises = async (req, res) => {
    const { category } = req.query; // Get category from query parameters

    try {
        // If a category is provided, find exercises by category
        const query = category ? { category } : {}; // Conditional query
        const exercises = await ExerciseModel.find(query);

        // Send success response with the exercises
        return res.json({ success: true, exercises });
    } catch (error) {
        // Handle any errors
        return res.status(500).json({ success: false, message: 'Error fetching exercises', error: error.message });
    }
};

const getCategories = async (req, res) => {
    try {
        // Get distinct categories from the ExerciseModel
        const categories = await ExerciseModel.distinct('category');

        // Send success response with the categories
        return res.json({ success: true, categories });
    } catch (error) {
        // Handle any errors
        return res.status(500).json({ success: false, message: 'Error fetching categories', error: error.message });
    }
};



export { addExercise ,getExercises , getCategories};
