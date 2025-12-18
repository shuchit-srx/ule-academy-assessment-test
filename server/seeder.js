import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Question from './models/Question.js';
import { questions } from './data/seedData.js';
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const importData = async () => {
  try {
    await Question.deleteMany();

    const formattedQuestions = questions.map(q => ({
      ...q,
      olqName: q.name 
    }));

    await Question.insertMany(formattedQuestions);

    console.log('Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();