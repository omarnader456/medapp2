const Prescription = require('../models/Prescription');
const CareTeam = require('../models/CareTeam');


exports.createPrescription = async (req, res) => {
  const { patientId, medicationId, time } = req.body;
  try {
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

exports.getPrescriptionsForPatient = async (req, res) => {
  try {

    if (req.user.role === 'patient' && req.user.id !== req.params.patientId) {
        return res.status(403).json({ msg: 'Access denied. You can only view your own records.' });
    }
    if (req.user.role === 'doctor' || req.user.role === 'nurse') {
        const isAssigned = await CareTeam.findOne({ 
            patient: req.params.patientId, 
            [req.user.role]: req.user.id // Dynamic key: checks 'doctor': id or 'nurse': id
        });
        
        if (!isAssigned && req.user.role !== 'admin') {
             return res.status(403).json({ msg: 'Access denied. You are not assigned to this patient.' });
        }
    }
    const prescriptions = await Prescription.find({ patient: req.params.patientId })
      .populate('patient', 'name email')
      .populate('medication', 'name dosage'); 

    res.status(200).json({ success: true, count: prescriptions.length, data: prescriptions });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Server Error' });
  }
};


exports.getMyPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ patient: req.user.id })
      .populate('medication', 'name dosage description sideEffects');

    res.status(200).json({ success: true, count: prescriptions.length, data: prescriptions });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Server Error' });
  }
};
