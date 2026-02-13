import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import connectDB from './config/mongodb.js';
import authRoutes from './routes/authoutes.js';

const app = express();


connectDB();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());


//API Endpoints
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/api/auth', authRoutes);// Mounts the authRoutes router on the /api/auth path, so all routes defined in authRoutes will be prefixed with /api/auth. For example, the register route will be accessible at /api/auth/register.



app.listen(3000, () => {
    console.log(`Server is running on port ${3000}`);
});


