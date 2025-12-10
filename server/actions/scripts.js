const Prescription = require('../schemas/script');
const CareTeam = require('../schemas/group');
const User = require('../schemas/person');

const createPrescription = async (req, res) => {
  try {
    const { patientId, medicationId, time } = req.body;

    // Validate patient
    const patientUser = await User.findById(patientId);
    if (!patientUser || patientUser.role !== 'patient') {
        return res.status(400).json({ msg: 'Invalid patient selected.' });
    }

    // Check assignment for doctors
    if (req.user.role === 'doctor') {
      const isAssigned = await CareTeam.findOne({
        doctor: req.user.id,
        patient: patientId,
      });

      if (!isAssigned) {
        return res.status(403).json({
          msg: 'You are not assigned to this patient.',
        });
      }
    }

    const prescription = await Prescription.create({
      patient: patientId,
      medication: medicationId,
      time: time,
    });

    res.status(201).json({ success: true, data: prescription });

  } catch (err) {
    res.status(400).json({ success: false, msg: err.message });
  }
};

const getPrescriptionsForPatient = async (req, res) => {
  try {
    const patientId = req.params.patientId;
    const userRole = req.user.role;
    const userId = req.user.id;

    if (userRole === 'patient' && userId !== patientId) {
        return res.status(403).json({ msg: 'Access denied.' });
    }

    if (userRole === 'doctor' || userRole === 'nurse') {
        let query = { patient: patientId };
        if (userRole === 'doctor') query.doctor = userId;
        if (userRole === 'nurse') query.nurse = userId;

        const isAssigned = await CareTeam.findOne(query);
        
        if (!isAssigned && userRole !== 'admin') {
             return res.status(403).json({ msg: 'You are not assigned to this patient.' });
        }
    }

    const prescriptions = await Prescription.find({ patient: patientId })
      .populate('patient', 'name email')
      .populate('medication', 'name dosage'); 

    res.status(200).json({ success: true, count: prescriptions.length, data: prescriptions });

  } catch (err) {
    res.status(500).json({ success: false, msg: 'Server Error' });
  }
};

const getMyPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ patient: req.user.id })
      .populate('medication', 'name dosage description sideEffects');

    res.status(200).json({ success: true, count: prescriptions.length, data: prescriptions });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Server Error' });
  }
};

module.exports = {
    createPrescription,
    getPrescriptionsForPatient,
    getMyPrescriptions
};