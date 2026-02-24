import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        requierd: true,
        unique: true,
        trim: true,
        lowercase: true
    },

    password: {
        type: String,
        required: true
    },

    role: {
        typs: String,
        enum: ["user", "admin"],
        default: "user"
    }
});

export default mongoose.model("User", userSchema);