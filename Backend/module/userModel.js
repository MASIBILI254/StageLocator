import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin'], // Define the possible roles
        default: 'user', // Set default role to 'user'
    }
}, {
    timestamps: true
});

export default mongoose.model("User", userSchema);
