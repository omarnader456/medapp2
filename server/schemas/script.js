const mongoose = require('mongoose');

const PrescriptionSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Person', 
    required: [true, 'A patient must be specified.'],
  },
  medication: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Medication',
    required: [true, 'A medication must be specified.'],
  },
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

module.exports = mongoose.model('Prescription', PrescriptionSchema);