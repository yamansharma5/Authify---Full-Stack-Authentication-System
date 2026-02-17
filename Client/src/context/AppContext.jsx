import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

axios.defaults.withCredentials = true;

export const AppContextProvider = ({ children }) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check authentication status on app load
    const checkAuth = async () => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/auth/is-authenticated`);
            if (data.success) {
                setIsLoggedIn(true);
                await getUserData();
            } else {
                setIsLoggedIn(false);
                setUserData(null);
            }
        } catch (error) {
            setIsLoggedIn(false);
            setUserData(null);
        } finally {
            setIsLoading(false);
        }
    };

    // Get user data
    const getUserData = async () => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/auth/user-data`);
            if (data.success) {
                setUserData(data.userData);
            }
        } catch (error) {
            // ...existing code...
        }
    };

    // Register user
    const register = async (name, email, password) => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/auth/register`, {
                name,
                email,
                password,
            });
            if (data.success) {
                setIsLoggedIn(true);
                await getUserData();
                toast.success("Registration successful!");
                return { success: true };
            } else {
                toast.error(data.message);
                return { success: false, message: data.message };
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Registration failed");
            return { success: false, message: error.message };
        }
    };

    // Login user
    const login = async (email, password) => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/auth/login`, {
                email,
                password,
            });
            if (data.success) {
                setIsLoggedIn(true);
                await getUserData();
                toast.success("Login successful!");
                return { success: true };
            } else {
                toast.error(data.message);
                return { success: false, message: data.message };
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed");
            return { success: false, message: error.message };
        }
    };

    // Logout user
    const logout = async () => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/auth/logout`);
            if (data.success) {
                setIsLoggedIn(false);
                setUserData(null);
                toast.success("Logged out successfully!");
                return { success: true };
            }
        } catch (error) {
            toast.error("Logout failed");
            return { success: false };
        }
    };

    // Send email verification OTP
    const sendVerifyOtp = async () => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/auth/send-verify-otp`);
            if (data.success) {
                toast.success("OTP sent to your email!");
                return { success: true };
            } else {
                toast.error(data.message);
                return { success: false, message: data.message };
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send OTP");
            return { success: false };
        }
    };

    // Verify email OTP
    const verifyEmail = async (otp) => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/auth/verify-email-otp`, { otp });
            if (data.success) {
                await getUserData();
                toast.success("Email verified successfully!");
                return { success: true };
            } else {
                toast.error(data.message);
                return { success: false, message: data.message };
            }
        } catch (error) {
            toast.error("Verification failed");
            return { success: false };
        }
    };

    // Send reset password OTP
    const sendResetOtp = async (email) => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/auth/reset-password`, { email });
            if (data.success) {
                toast.success("OTP sent to your email!");
                return { success: true };
            } else {
                toast.error(data.message);
                return { success: false, message: data.message };
            }
        } catch (error) {
            toast.error("Failed to send OTP");
            return { success: false };
        }
    };

    // Reset password with OTP
    const resetPassword = async (email, otp, newPassword) => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/auth/verify-reset-password-otp`, {
                email,
                otp,
                newPassword,
            });
            if (data.success) {
                toast.success("Password reset successfully!");
                return { success: true };
            } else {
                toast.error(data.message);
                return { success: false, message: data.message };
            }
        } catch (error) {
            toast.error("Password reset failed");
            return { success: false };
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const value = {
        backendUrl,
        isLoggedIn,
        setIsLoggedIn,
        userData,
        setUserData,
        isLoading,
        register,
        login,
        logout,
        sendVerifyOtp,
        verifyEmail,
        sendResetOtp,
        resetPassword,
        getUserData,
    };

    return <AppContext.Provider value={value}>
        {children}
        </AppContext.Provider>;
};
