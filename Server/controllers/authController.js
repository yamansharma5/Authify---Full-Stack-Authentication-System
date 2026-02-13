// in this file we will write the logic for the authentication of the user like register, login, logout ,verify email, forgot password, reset password etc
import User from "../models/usermodel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";



export const register = async (req, res) => {
    const { name, email, password } = req.body;
    if(!name || !email || !password) {
        return res.json({success: false, message: "Please fill all the fields" });
    }

    
    try {
        const existingUser = await User.findOne({ email });
        // Checks if a user with the provided email already exists in the database.
        if(existingUser) {
            return res.json({success: false, message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        // Hashes the user's password using bcrypt with a salt round of 10 for security.
        console.log(hashedPassword);
        
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",// Ensures the cookie is only sent in requests originating from the same site, providing protection against CSRF attacks.
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        

        return res.json({success: true, message: "User registered successfully" });

    } catch (error) {
        console.error("Registration error:", error);
        return res.json({success: false, error: error.message, message: "Internal Server Error" });
    }
}


// The login function handles user authentication by verifying the provided email and password against the stored user data in the database. If the credentials are valid, it generates a JWT token, sets it as an HTTP-only cookie, and returns a success response. If the credentials are invalid or if any error occurs during the process, it returns an appropriate error message.
export const login = async (req, res) => {
    const { email, password } = req.body;
    if(!email || !password) {
        return res.json({success: false, message: "Please fill all the fields" });
    }

    try {
        const user = await User.findOne({ email });
        if(!user) {
            return res.json({success: false, message: "Invalid email or password" });
        }   

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid) {
            return res.json({success: false,message: "Invalid email or password" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        
        return res.json({success: true, message: "User logged in successfully" });

    } catch (error) {
        console.error("Login error:", error);
        return res.json({success: false, error: error.message, message: "Internal Server Error" });
    }   
}

// The logout function clears the authentication token cookie from the user's browser, effectively logging the user out of the application. It sets the cookie with the same name ("token") to be cleared and returns a success response indicating that the user has been logged out successfully.
export const logout = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",  
        sameSite: "strict"
    });
    return res.json({success: true, message: "User logged out successfully" });
}

export const verifyEmail = async (req, res) => {}