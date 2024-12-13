import ProfileModel from "../Models/ProfileModel.js";
import mongoose from "mongoose";


const addInformations = async (req, res) => {
    const { userId } = req.params; 

 
  
    // Ensure the userId is provided and is a valid object ID
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
  
    try {
      // Check if the user profile exists
      let profile = await ProfileModel.findById(userId);
  
      if (profile) {
        // If profile exists, update it with the provided data
        profile = await ProfileModel.findByIdAndUpdate(
          userId,
          {
            $set: req.body, // Updates the profile with data from the request body
          },
          { new: true, runValidators: true } // Returns the updated profile with validation
        );
        return res.status(200).json(profile);
      } else {
        // If profile doesn't exist, create a new one
        const newProfile = new ProfileModel({
          ...req.body,
          _id: userId, // Assuming the userId is unique to each profile
        });
  
        await newProfile.save();
        return res.status(201).json(newProfile);
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error adding/updating profile information", error: error.message });
    }
  };
  


const getInformations = async (req, res) => {
  const { userId } = req.params; // Assuming userId is passed as a URL parameter

  try {
    const profile = await ProfileModel.findById(userId);

    if (!profile) {
      return res.status(404).json({ message: "Profile not yahya" });
    }

    return res.status(200).json(profile);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching profile information" });
  }
};


const getAllProfiles = async (req, res) => {

  
    try {
      // Fetch all profiles from the database
      const profiles = await ProfileModel.find();
  
      // Check if profiles exist
      if (profiles.length === 0) {
        return res.status(404).json({ message: "No profiles found" });
      }
  
      return res.status(200).json(profiles); // Return the profiles
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error fetching profiles" });
    }
  };

export { addInformations, getInformations,getAllProfiles };
