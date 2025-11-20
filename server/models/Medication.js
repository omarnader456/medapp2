const mongoose = require('mongoose');

const MedicationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a medication name'],
    unique: true,
    trim: true,
  },
  dosage: {
    type: String,
    required: [true, 'Please add a dosage (e.g., 500mg, 1 tablet)'],
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  sideEffects: {
    type: String,
    default: 'No common side effects listed.',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Medication', MedicationSchema);