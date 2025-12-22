import axios from 'axios';
import Question from '../models/Question.js';
import Assessment from '../models/Assessment.js';
import { calculateAssessmentResults } from '../utils/calculations/index.js';

export const getQuestions = async (req, res) => {
  const questions = await Question.find().select('-correctOption');
  res.json({ success: true, data: questions });
};

export const submitAssessment = async (req, res) => {
  const { candidate, aptitude, olq } = req.body;

  if (!candidate || !aptitude || !olq) {
    return res.status(400).json({
      success: false,
      message: 'Invalid payload'
    });
  }

  const questions = await Question.find().select('+correctOption');
  const results = calculateAssessmentResults(questions, req.body);

  const assessment = await Assessment.create({
    candidate,
    responses: { aptitude, olq },
    scores: results.scores,
    factorBreakdown: results.factorBreakdown
  });

  try {
    await axios.post(
      `${process.env.ADMIN_SERVER_URL}/api/admin/internal/new-assessment`,
      { assessmentId: assessment._id }
    );
  } catch {
    console.log('Admin server offline');
  }

  res.status(201).json({
    success: true,
    data: assessment
  });
};

export const verifyCoachPin = (req, res) => {
  res.json({
    success: true,
    valid: req.body.pin === process.env.COACH_PIN
  });
};
