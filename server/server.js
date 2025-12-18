import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
// import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
// import xss from 'xss-clean';
import morgan from 'morgan';

import connectDB from './config/db.js';
import { errorHandler } from './middleware/errorMiddleware.js';
import assessmentRoutes from './routes/assessmentRoutes.js';

dotenv.config();
connectDB();

const app = express();

// --- 1. Security Headers & CORS (Best to run these first) ---
app.use(helmet());
app.use(cors());

// --- 2. Parsers (CRITICAL: These MUST run before mongoSanitize) ---
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Add this line

// --- 3. Data Sanitization ---
// Now that data is parsed, we can clean it
// app.use(mongoSanitize());
// app.use(xss());
app.use(hpp());

// --- 4. Logging ---
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// --- 5. Routes ---
app.use('/api/assessment', assessmentRoutes);

// --- 6. Error Handling ---
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});