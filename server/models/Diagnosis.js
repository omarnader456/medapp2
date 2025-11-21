const mongoose = require('mongoose');

const DiagnosisSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'A patient must be specified.'],
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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

DiagnosisSchema.pre('save', async function (next) {
  const User = mongoose.model('User');
  const [patient, doctor] = await Promise.all([User.findById(this.patient), User.findById(this.doctor)]);
  if (!patient || patient.role !== 'patient') return next(new Error('Invalid patient ID.'));
  if (!doctor || doctor.role !== 'doctor') return next(new Error('Invalid doctor ID.'));
  next();
});

module.exports = mongoose.model('Diagnosis', DiagnosisSchema);