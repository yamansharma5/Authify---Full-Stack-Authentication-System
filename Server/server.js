import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import connectDB from './config/mongodb.js';
import authRoutes from './routes/authRoutes.js';

const app = express();

// Trust Render's reverse proxy
app.set('trust proxy', 1);

connectDB();

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    process.env.FRONTEND_URL
].filter(Boolean);

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
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
    },
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


