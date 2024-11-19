import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: false,
  },
  email: {
    type: String,
    required: false,
  },
  bio:{
    type: String,
    required: false,
  },
  location: {
    type: String,
    required: false,
  },
  phoneNumber: {
    type: String,  // Ensure this is String, so it handles numbers correctly
    required: false,
    match: /^[0-9]{10}$/,  // Optional regex validation (e.g., for 10-digit numbers)
  },
  occupation: {
    type: String,
    required: false,
  },
 
}, { timestamps: true });

const ProfileModel = mongoose.models.Profile || mongoose.model('Profile', profileSchema);

export default ProfileModel;
