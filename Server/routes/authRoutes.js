import express from 'express';
import { register, login, logout, isAuthenticated, getUserData } from '../controllers/authController.js';
import { sendVerifyOtp, verifyEmailOtp } from '../controllers/authController.js';
import userAuth from '../middlewares/userauth.js';
import { resetPassword, verifyResetPasswordOtp } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/send-verify-otp',  userAuth , sendVerifyOtp);
router.post('/verify-email-otp', userAuth, verifyEmailOtp);
router.post('/is-authenticated', userAuth, isAuthenticated);
router.post('/reset-password', resetPassword);
router.post('/verify-reset-password-otp', verifyResetPasswordOtp);
router.post('/user-data', userAuth, getUserData);

export default router;
