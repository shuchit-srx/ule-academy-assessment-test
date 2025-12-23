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
        origin: ['http://localhost:5173', 'http://localhost:5174'],
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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Assessment server running on port ${PORT}`);
});
