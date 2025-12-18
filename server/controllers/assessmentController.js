import Question from '../models/Question.js';
import Assessment from '../models/Assessment.js';
import { calculateAssessmentResults } from '../utils/calculations.js';
import Joi from 'joi';

export const getQuestions = async (req, res, next) => {
  try {
    const questions = await Question.find({}).select('-correctOption');
    res.status(200).json({ success: true, data: questions });
  } catch (error) {
    next(error);
  }
};

export const submitAssessment = async (req, res, next) => {
  try {
    const schema = Joi.object({
      candidate: Joi.object({
        name: Joi.string().required(),
        entry: Joi.string().required(),
        attempt: Joi.number().required()
      }).required(),
      aptitude: Joi.object().pattern(Joi.string(), Joi.string()).required(),
      olq: Joi.object().pattern(Joi.string(), Joi.number().min(1).max(5)).required()
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message);
    }

    const questionsDB = await Question.find({}).select('+correctOption');

    const results = calculateAssessmentResults(questionsDB, value);

    const assessment = await Assessment.create({
      candidate: value.candidate,
      scores: {
        aptitudeRaw: results.rawStats.aptCorrect,
        aptitudePercentage: results.rawStats.aptScorePercent,
        olqOverall: results.rawStats.overallOlqScore,
        olqPercentage: results.rawStats.normOlq,
        compatibility: results.rawStats.compatibility
      },
      factorBreakdown: results.factorBreakdown,
      topQualities: results.top3.map(q => q.name),
      weakQualities: results.bottom3.map(q => q.name)
    });

    res.status(201).json({
      success: true,
      data: {
        assessmentId: assessment._id,
        scores: assessment.scores,
        top3: results.top3,
        bottom3: results.bottom3,
        detailedOlq: results.olqScores, 
        factorBreakdown: results.factorBreakdown
      }
    });

  } catch (error) {
    next(error);
  }
};

export const verifyCoachPin = async (req, res, next) => {
  try {
    const { pin } = req.body;
    if (!pin) {
      res.status(400);
      throw new Error('PIN is required');
    }

    if (pin === process.env.COACH_PIN) {
      res.status(200).json({ success: true, valid: true });
    } else {
      res.status(401).json({ success: true, valid: false, message: "Invalid PIN" });
    }
  } catch (error) {
    next(error);
  }
};