import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import connectDB from './config/mongodb.js';
import authRoutes from './routes/authRoutes.js';

const app = express();


connectDB();

app.use(express.json());
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'https://authify-full-stack-authentication-system-jat5.onrender.com'],
    credentials: true
}));
app.use(bodyParser.json());
app.use(cookieParser());


//API Endpoints
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/api/auth', authRoutes);// Mounts the authRoutes router on the /api/auth path, so all routes defined in authRoutes will be prefixed with /api/auth. For example, the register route will be accessible at /api/auth/register.



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


