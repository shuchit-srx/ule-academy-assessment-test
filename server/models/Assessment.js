import mongoose from 'mongoose';

const assessmentSchema = mongoose.Schema({
  candidate: {
    name: { type: String, required: true },
    entry: { type: String, required: true },
    attempt: { type: Number, required: true }
  },
  scores: {
    aptitudeRaw: Number, 
    aptitudePercentage: Number,
    olqOverall: Number, 
    olqPercentage: Number,
    compatibility: Number 
  },
  factorBreakdown: {
    factorI: Number,
    factorII: Number,
    factorIII: Number,
    factorIV: Number
  },
  topQualities: [String],
  weakQualities: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Assessment = mongoose.model('Assessment', assessmentSchema);
export default Assessment;