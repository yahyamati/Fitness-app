
import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  video: {
    type: String,
    required: true,
  },

  category:{
    type:String,
    required:true
  },
  alternatives: [{
    name: { type: String, required: true },
  }]
}, { timestamps: true });

const ExerciseModel = mongoose.models.Exercise || mongoose.model('Exercise', exerciseSchema);

export default ExerciseModel;
