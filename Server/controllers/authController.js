// in this file we will write the logic for the authentication of the user like register, login, logout ,verify email, forgot password, reset password etc
import User from "../models/usermodel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import transporter from "../config/nodemailer.js";
import { EMAIL_VERIFY_TEMPLATE } from "../config/emailTemplates.js";
import { PASSWORD_RESET_TEMPLATE } from "../config/emailTemplates.js";



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
            sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        //sending welcome email to the user after registration
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email, 
            subject: "Welcome to our application",
            text: `Hello ${name},\n\nThank you for registering on our application! We're excited to have you on board.\n\nBest regards,\nThe Team Yaman`
        };

        try {
            await transporter.sendMail(mailOptions);
        } catch (emailError) {
            console.error("Welcome email failed:", emailError.message);
        }
        
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
            sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
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
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax"
    });
    return res.json({success: true, message: "User logged out successfully" });
}

//
export const sendVerifyOtp = async (req, res) => {
    try {
        const{userId} = req.body;
        const user = await User.findById(userId);

        if(!user) {
            return res.json({success: false, message: "User not found" });
        }

        if(user.isAccountVerified === true){
            return res.json({success: true, message: "Email Already verified successfully" });
        }

        const otp = String(Math.floor(Math.random() * 900000)+100000); 
        // Generate a random 6-digit verification code

        user.verifyotp= otp;
        user.verifyOtpExpiryAt = Date.now() + 10 * 60 * 1000;// Set the OTP expiry time to 10 minutes from now
        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email, //why user.email because we want to send the email to the user who is trying to verify their email address
            subject: "Email Verification",
            // text: `Hello ${user.name},\n\nYour OTP for email verification is: ${otp}\n\nThis OTP is valid for 10 minutes.\n\nBest regards,\nThe Team Yaman`
            html: EMAIL_VERIFY_TEMPLATE.replace("{{name}}", user.name).replace("{{otp}}", otp).replace("{{email}}", user.email)
        };
        await transporter.sendMail(mailOptions);

        return res.json({success: true, message: "OTP sent to email successfully" });

    } catch (error) {
        return res.json({success: false, error: error.message, message: "Internal Server Error" });
    } 
}


export const verifyEmailOtp = async (req, res) => {
    try {
        const { userId, otp } = req.body;
        const user = await User.findById(userId);

        if(!user) {
            return res.json({success: false, message: "User not found" });
        }

        if(user.isAccountVerified === true){
            return res.json({success: true, message: "Email Already verified successfully" });
        }

        if(user.verifyotp !== String(otp) || user.verifyOtpExpiryAt < Date.now()) {
            return res.json({success: false, message: "Invalid or expired OTP" });
        }
        user.isAccountVerified = true;
        user.verifyotp = "";
        user.verifyOtpExpiryAt = 0;
        await user.save();  
        return res.json({success: true, message: "Email verified successfully" });

        } catch (error) {
        return res.json({success: false, error: error.message, message: "Internal Server Error" });
        }
}

export const isAuthenticated = (req, res) => {
    try {
        return res.json({success: true, message: "User is authenticated" });
    } catch (error) {
        return res.json({success: false, error: error.message, message: "Internal Server Error" });
    }
    
}

export const resetPassword = async (req, res) => {
    const { email } = req.body;
    if(!email) {
        return res.json({success: false, message: "enter email" });
    }

    try {
        const user = await User.findOne({ email });
        if(!user) {
            return res.json({success: false, message: "User not found" });
        }
        //otp for password reset
        const otp = String(Math.floor(Math.random() * 900000)+100000); 
        user.resetOtp = otp;
        user.resetOtpExpiryAt = Date.now() + 10 * 60 * 1000;
        await user.save();
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "Password Reset OTP",
            // text: `Hello ${user.name},\n\nYour OTP for password reset is: ${otp}\n\nThis OTP is valid for 10 minutes.\n\nBest regards,\nThe Team Yaman`
            html: PASSWORD_RESET_TEMPLATE.replace("{{name}}", user.name).replace("{{otp}}", otp).replace("{{email}}", user.email)
        };
        await transporter.sendMail(mailOptions);
        return res.json({success: true, message: "OTP sent to email successfully" });


    } catch (error) {
        return res.json({success: false, error: error.message, message: "Internal Server Error" });
    }
}


export const verifyResetPasswordOtp = async (req, res) => {
    const { email, otp, newPassword } = req.body;
    try {
        const user = await User.findOne({ email });
        if(!user) {
            return res.json({success: false, message: "User not found" });
        }
        if(user.resetOtp !== String(otp) || user.resetOtpExpiryAt < Date.now()) {
            return res.json({success: false, message: "Invalid or expired OTP" });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetOtp = "";
        user.resetOtpExpiryAt = 0;
        await user.save();
        return res.json({success: true, message: "Password reset successfully" });


        } 
        
        catch (error) {
        return res.json({success: false, error: error.message, message: "Internal Server Error" });
    }
}

// Get user data
export const getUserData = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await User.findById(userId);

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        return res.json({
            success: true,
            userData: {
                name: user.name,
                email: user.email,
                isAccountVerified: user.isAccountVerified
            }
        });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};
        