import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import connectDB from './config/mongodb.js';
import authRoutes from './routes/authRoutes.js';

const app = express();

// Trust Render's reverse proxy (required for rate limiting & secure cookies behind proxy)
app.set('trust proxy', 1);

// Connect to MongoDB
connectDB();

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(express.json());        // Built-in body parser — no need for body-parser separately
app.use(cookieParser());

// CORS — allow your Vercel frontend (and localhost for dev)
const allowedOrigins = [
    'https://authify-full-stack-authentication-s-xi.vercel.app',
    'http://localhost:5173',  // Vite default dev port
    'http://localhost:3000',
];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (e.g. Postman, mobile apps, curl)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.warn(`⚠️ CORS blocked for origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

// ─── Rate Limiting ─────────────────────────────────────────────────────────────

// General rate limiter — max 100 requests per 15 minutes per IP
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Too many requests, please try again later." }
});

// Stricter rate limit for auth routes (login/register/reset)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Too many attempts, please try again later." }
});

app.use(limiter);

// ─── Health Check ──────────────────────────────────────────────────────────────
// IMPORTANT: Render uses this to detect server is alive and prevent spin-downs
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Authify API is running ✅',
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV || 'development'
    });
});

// Dedicated health-check endpoint (good practice)
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

// ─── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth', authLimiter, authRoutes);

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({ success: false, message: `Route ${req.method} ${req.url} not found` });
});

// ─── Global Error Handler ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
    console.error("💥 Unhandled error:", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
});

// ─── Server Start ──────────────────────────────────────────────────────────────
// Render injects PORT automatically — never hardcode a port for production
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    console.log(`📡 Health check: http://localhost:${PORT}/health`);
});
