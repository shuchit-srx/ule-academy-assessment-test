import express from 'express';
import { getQuestions, submitAssessment, verifyCoachPin } from '../controllers/assessmentController.js';

const router = express.Router();

router.get('/questions', getQuestions);
router.post('/submit', submitAssessment);
router.post('/verify-coach', verifyCoachPin);

export default router;