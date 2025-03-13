import mongoose, { Schema } from "mongoose";


const userSchema = new Schema({
    name: {
        type: String, 
        required: true,
        trim: true,
    },

    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
    },

    phoneNo: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },

    avatar: {
        type: String,
        default: "https://cdn-icons-png.flaticon.com/512/2202/2202112.png"
    }

}, { timestamps: true});



export const User = mongoose.model("User", userSchema);
