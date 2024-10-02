import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://yahyamati:0660262588@cluster0.vixspwo.mongodb.net/Fitness').then(()=>console.log("DB Connected"));

}