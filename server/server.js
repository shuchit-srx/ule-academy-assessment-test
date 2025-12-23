import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import connectDB from './config/db.js';
import assessmentRoutes from './routes/assessmentRoutes.js';
import { errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();
await connectDB();

const app = express();

app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true
    })
);

app.use(helmet());
app.use(express.json());

if (process.env.NODE_ENV == 'development') {
    app.use(morgan('dev'));
}

app.use('/api/assessment', assessmentRoutes);
app.use(errorHandler);

export default app;
