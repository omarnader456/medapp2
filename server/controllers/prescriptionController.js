const Prescription = require('../models/Prescription');
const CareTeam = require('../models/CareTeam');

/**
 * @desc    Create a new prescription for a patient
 * @route   POST /api/prescriptions
 * @access  Private (Admin or Doctor)
 */
exports.createPrescription = async (req, res) => {
  const { patientId, medicationId, time } = req.body;
  try {
    // If the user is a doctor, verify they are assigned to this patient
    if (req.user.role === 'doctor') {
      const isAssigned = await CareTeam.findOne({
        doctor: req.user.id,
        patient: patientId,
      });

      if (!isAssigned) {
        return res.status(403).json({
          msg: 'Forbidden: You are not assigned to this patient.',
        });
      }
    }

    const prescription = await Prescription.create({
      patient: patientId,
      medication: medicationId,
      time,
    });
    res.status(201).json({ success: true, data: prescription });
  } catch (err) {
    res.status(400).json({ success: false, msg: err.message });
  }
};

/**
 * @desc    Get all prescriptions for a specific patient
 * @route   GET /api/prescriptions/patient/:patientId
 * @access  Private (Admin, Doctor, Nurse)
 */
exports.getPrescriptionsForPatient = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ patient: req.params.patientId })
      .populate('patient', 'name email')
      .populate('medication', 'name dosage'); // Populate with medication details

    res.status(200).json({ success: true, count: prescriptions.length, data: prescriptions });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Server Error' });
  }
};

/**
 * @desc    Get all prescriptions for the logged-in patient
 * @route   GET /api/prescriptions/my-prescriptions
 * @access  Private (Patient only)
 */
exports.getMyPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ patient: req.user.id })
      .populate('medication', 'name dosage description sideEffects');

    res.status(200).json({ success: true, count: prescriptions.length, data: prescriptions });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Server Error' });
  }
};
