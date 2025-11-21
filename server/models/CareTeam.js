const mongoose = require('mongoose');

const CareTeamSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'A patient must be assigned.'],
    unique: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'A doctor must be assigned.'],
  },
  nurse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'A nurse must be assigned.'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

CareTeamSchema.pre('save', async function (next) {
  const User = mongoose.model('User');

  const [patient, doctor, nurse] = await Promise.all([
    User.findById(this.patient),
    User.findById(this.doctor),
    User.findById(this.nurse),
  ]);

  if (!patient || patient.role !== 'patient') {
    return next(new Error('Invalid user for patient. Role must be "patient".'));
  }
  if (!doctor || doctor.role !== 'doctor') {
    return next(new Error('Invalid user for doctor. Role must be "doctor".'));
  }
  if (!nurse || nurse.role !== 'nurse') {
    return next(new Error('Invalid user for nurse. Role must be "nurse".'));
  }

  next();
});

module.exports = mongoose.model('CareTeam', CareTeamSchema);