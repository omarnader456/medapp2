const mongoose = require('mongoose');

const DiagnosisSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Person', 
    required: [true, 'A patient must be specified.'],
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Person',
    required: [true, 'The diagnosing doctor must be specified.'],
  },
  title: {
    type: String,
    required: [true, 'Please provide a title for the diagnosis.'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a detailed description of the diagnosis.'],
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Diagnosis', DiagnosisSchema);