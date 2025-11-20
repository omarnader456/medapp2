const mongoose = require('mongoose');

const PrescriptionSchema = new mongoose.Schema({
  // Link to the user who is the patient
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'A patient must be specified.'],
  },
  // Link to the medication being prescribed
  medication: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Medication',
    required: [true, 'A medication must be specified.'],
  },
  // The time of day the medication should be taken
  time: {
    type: String,
    required: [true, 'Please specify the time of day (e.g., "Morning", "8:00 AM").'],
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Optional but recommended: A pre-save hook to ensure the user is a patient
PrescriptionSchema.pre('save', async function (next) {
  const User = mongoose.model('User');
  const patientUser = await User.findById(this.patient);

  if (!patientUser || patientUser.role !== 'patient') {
    return next(new Error('The specified user for this prescription must have the "patient" role.'));
  }
  next();
});

module.exports = mongoose.model('Prescription', PrescriptionSchema);
