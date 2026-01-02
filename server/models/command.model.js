import mongoose from "mongoose";

const commandSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    command: {
        type: String,
        required: true
    },

    appName: {
        type: String,
        required: true
    },

    os: {
        type: String,
        enum: ['linux', 'windows', 'macos', 'mac'],
        required: true
    },
    distro: {
        type: String
    },

}, { timestamps: true })

export const Command = mongoose.model("Command", commandSchema);