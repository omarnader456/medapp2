const Diagnosis = require('../schemas/report');
const CareTeam = require('../schemas/group');
const User = require('../schemas/person');

const createDiagnosis = async (req, res) => {
  try {
    const { patientId, title, description } = req.body;
    const doctorId = req.user.id;

    // Validate users
    const patient = await User.findById(patientId);
    if (!patient || patient.role !== 'patient') {
        return res.status(400).json({ msg: 'Invalid patient ID.' });
    }

    // Check assignment
    const isAssigned = await CareTeam.findOne({ doctor: doctorId, patient: patientId });
    if (!isAssigned) {
      return res.status(403).json({ msg: 'You are not assigned to this patient.' });
    }

    const diagnosis = await Diagnosis.create({
      patient: patientId,
      doctor: doctorId,
      title: title,
      description: description,
    });

    res.status(201).json({ success: true, data: diagnosis });
  } catch (err) {
    res.status(400).json({ success: false, msg: err.message });
  }
};

const getPatientDiagnoses = async (req, res) => {
  try {
    const patientId = req.params.patientId;
    const loggedInUser = await User.findById(req.user.id);

    if (!loggedInUser) {
      return res.status(401).json({ msg: 'User not found.' });
    }

    let authorized = false;

    if (loggedInUser.id === patientId) {
      authorized = true;
    } else if (loggedInUser.role === 'doctor') {
      const careTeam = await CareTeam.findOne({ patient: patientId, doctor: loggedInUser.id });
      if (careTeam) {
          authorized = true;
      }
    }

    if (!authorized) {
      return res.status(403).json({ msg: 'Not authorized to view these records.' });
    }

    const diagnoses = await Diagnosis.find({ patient: patientId })
      .populate('doctor', 'name')
      .sort({ date: -1 });

    res.status(200).json({ success: true, count: diagnoses.length, data: diagnoses });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Server Error' });
  }
};

const updateDiagnosis = async (req, res) => {
  try {
    const diagnosisId = req.params.id;
    const doctorId = req.user.id;

    const diagnosis = await Diagnosis.findById(diagnosisId);

    if (!diagnosis) {
      return res.status(404).json({ msg: 'Diagnosis not found.' });
    }

    if (diagnosis.doctor.toString() !== doctorId) {
      return res.status(403).json({ msg: 'You can only edit diagnoses you created.' });
    }

    if (req.body.title) diagnosis.title = req.body.title;
    if (req.body.description) diagnosis.description = req.body.description;

    await diagnosis.save();

    res.status(200).json({ success: true, data: diagnosis });
  } catch (err) {
    res.status(400).json({ success: false, msg: err.message });
  }
};

const deleteDiagnosis = async (req, res) => {
  try {
    const diagnosis = await Diagnosis.findById(req.params.id);
    
    if (!diagnosis) {
        return res.status(404).json({ msg: 'Diagnosis not found' });
    }

    if (diagnosis.doctor.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'You can only delete diagnoses you created.' });
    }

    await diagnosis.deleteOne();
    
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Server Error' });
  }
};

module.exports = {
    createDiagnosis,
    getPatientDiagnoses,
    updateDiagnosis,
    deleteDiagnosis
};