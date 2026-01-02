import mongoose from "mongoose";
import validator from 'validator';

const userSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 30
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validator.isEmail, "Please enter a valid email"],
    },
    password: {
        type: String, // Changed from Number to String
        required: true,
        select: false,
        minlength: 8
    },

    savedCommands: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Command' }]

}, { timestamps: true })


export const User = mongoose.model("User", userSchema);