import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import connectDB from './config/mongodb.js';
import authRoutes from './routes/authRoutes.js';

const app = express();


connectDB();

// Rate limiter - max 100 requests per 15 minutes per IP
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { success: false, message: "Too many requests, please try again later." }
});

// Stricter rate limit for auth routes (login/register)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { success: false, message: "Too many attempts, please try again later." }
});

app.use(express.json());
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'https://authify-full-stack-authentication-system-jat5.onrender.com'],
    credentials: true
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(limiter);


//API Endpoints
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/api/auth', authLimiter, authRoutes);// Mounts the authRoutes router on the /api/auth path, so all routes defined in authRoutes will be prefixed with /api/auth. For example, the register route will be accessible at /api/auth/register.



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


