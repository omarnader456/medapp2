const Diagnosis = require('../models/Diagnosis');
const CareTeam = require('../models/CareTeam');
const User = require('../models/User');

/**
 * @desc    Create a new diagnosis for a patient
 * @route   POST /api/diagnoses
 * @access  Private (Doctor only)
 */
exports.createDiagnosis = async (req, res) => {
  const { patientId, title, description } = req.body;
  const doctorId = req.user.id;

  try {
    // Security Check: Ensure the doctor is assigned to this patient
    const isAssigned = await CareTeam.findOne({ doctor: doctorId, patient: patientId });
    if (!isAssigned) {
      return res.status(403).json({ msg: 'Forbidden: You are not assigned to this patient.' });
    }

    const diagnosis = await Diagnosis.create({
      patient: patientId,
      doctor: doctorId,
      title,
      description,
    });

    res.status(201).json({ success: true, data: diagnosis });
  } catch (err) {
    res.status(400).json({ success: false, msg: err.message });
  }
};

/**
 * @desc    Get diagnoses for a specific patient (for doctors/nurses) or for the logged-in patient
 * @route   GET /api/diagnoses/patient/:patientId
 * @access  Private (Patient, Doctor, Nurse)
 */
exports.getPatientDiagnoses = async (req, res) => {
  const { patientId } = req.params;

  try {
    // Get the full user profile for the logged-in user to check their role
    const loggedInUser = await User.findById(req.user.id);
    if (!loggedInUser) {
      return res.status(401).json({ msg: 'User not found, authorization denied.' });
    }

    let isAuthorized = false;

    // 1. Check if the logged-in user is the patient themselves
    if (loggedInUser.id === patientId) {
      isAuthorized = true;
    }
    // 2. Check if the logged-in user is part of the patient's care team
    else if (loggedInUser.role === 'doctor') {
      const careTeam = await CareTeam.findOne({ patient: patientId, doctor: loggedInUser.id });
      if (careTeam) isAuthorized = true;
    }

    if (!isAuthorized) {
      return res.status(403).json({ msg: 'Forbidden: You are not authorized to view these records.' });
    }

    const diagnoses = await Diagnosis.find({ patient: patientId })
      .populate('doctor', 'name')
      .sort({ date: -1 });

    res.status(200).json({ success: true, count: diagnoses.length, data: diagnoses });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Server Error' });
  }
};

/**
 * @desc    Update a diagnosis
 * @route   PUT /api/diagnoses/:id
 * @access  Private (Doctor only)
 */
exports.updateDiagnosis = async (req, res) => {
  const { title, description } = req.body;
  const diagnosisId = req.params.id;
  const doctorId = req.user.id;

  try {
    const diagnosis = await Diagnosis.findById(diagnosisId);

    if (!diagnosis) {
      return res.status(404).json({ msg: 'Diagnosis not found.' });
    }

    // Security Check: Ensure the logged-in doctor is the one who created the diagnosis.
    if (diagnosis.doctor.toString() !== doctorId) {
      return res.status(403).json({ msg: 'Forbidden: You are not authorized to edit this diagnosis.' });
    }

    // Update fields
    diagnosis.title = title || diagnosis.title;
    diagnosis.description = description || diagnosis.description;

    await diagnosis.save();

    res.status(200).json({ success: true, data: diagnosis });
  } catch (err) {
    res.status(400).json({ success: false, msg: err.message });
  }
};

/**
 * @desc    Delete a diagnosis
 * @route   DELETE /api/diagnoses/:id
 * @access  Private (Doctor only)
 */
exports.deleteDiagnosis = async (req, res) => {
  const diagnosisId = req.params.id;
  const doctorId = req.user.id;

  try {
    const diagnosis = await Diagnosis.findById(diagnosisId);
    if (!diagnosis) return res.status(404).json({ msg: 'Diagnosis not found' });

    // Security Check: Ensure the logged-in doctor is the one who created the diagnosis.
    if (diagnosis.doctor.toString() !== doctorId) {
      return res.status(403).json({ msg: 'Forbidden: You are not authorized to delete this diagnosis.' });
    }

    await diagnosis.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Server Error' });
  }
};