import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    verifyotp: {type: String, default: ''},
    verifyOtpExpiryAt: {type: Date, default: 0},
    isAccountVerified: {type: Boolean, default: false},
    resetOtp: {type: String, default: ''},
    resetOtpExpiryAt: {type: Date, default: 0}   
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
// Checks if a model named "User" already exists in mongoose.models.
// If it does, uses that existing model. If not, creates a new model.
// This prevents recompilation in serverless environments.

export default User;