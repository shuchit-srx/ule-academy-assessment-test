import mongoose from 'mongoose';

const questionSchema = mongoose.Schema({
  section: {
    type: String,
    required: true,
    enum: ['A', 'B'] 
  },
  qId: {
    type: Number,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  options: [{
    label: String, 
    value: String 
  }],
  correctOption: {
    type: String,
    select: false 
  },
  factor: {
    type: String, 
    enum: ['I', 'II', 'III', 'IV', null]
  },
  olqName: {
    type: String 
  }
});

const Question = mongoose.model('Question', questionSchema);
export default Question;