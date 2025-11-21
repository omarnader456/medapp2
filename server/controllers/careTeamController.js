const CareTeam = require('../models/CareTeam');
const User = require('../models/User');


exports.createCareTeam = async (req, res) => {
  const { patientId, doctorId, nurseId } = req.body;

  try {
    const careTeam = await CareTeam.create({
      patient: patientId,
      doctor: doctorId,
      nurse: nurseId,
    });

    res.status(201).json({ success: true, data: careTeam });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ msg: 'This patient is already assigned to a care team.' });
    }
    res.status(400).json({ success: false, msg: err.message });
  }
};


exports.getMyAssignments = async (req, res) => {
  try {
    const assignments = await CareTeam.find({
      $or: [
        { patient: req.user.id },
        { doctor: req.user.id },
        { nurse: req.user.id },
      ],
    })
      .populate({
        path: 'patient',
        select: 'name email role',
      })
      .populate({
        path: 'doctor',
        select: 'name email role',
      })
      .populate({
        path: 'nurse',
        select: 'name email role',
      });

    res.status(200).json({ success: true, count: assignments.length, data: assignments });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Server Error' });
  }
};

exports.getAllAssignments = async (req, res) => {
  try {
    const assignments = await CareTeam.find()
      .populate('patient', 'name email role')
      .populate('doctor', 'name email role')
      .populate('nurse', 'name email role');

    res.status(200).json({ success: true, count: assignments.length, data: assignments });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Server Error' });
  }
};


exports.updateAssignment = async (req, res) => {
  try {
    const assignment = await CareTeam.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true, 
    });

    if (!assignment) {
      return res.status(404).json({ msg: `Assignment not found with id of ${req.params.id}` });
    }

    res.status(200).json({ success: true, data: assignment });
  } catch (err) {
    res.status(400).json({ success: false, msg: err.message });
  }
};


exports.deleteAssignment = async (req, res) => {
  try {
    const assignment = await CareTeam.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({ msg: `Assignment not found with id of ${req.params.id}` });
    }

    await assignment.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Server Error' });
  }
};


exports.getMyPatients = async (req, res) => {
  try {
    const careTeams = await CareTeam.find({
      $or: [{ doctor: req.user.id }, { nurse: req.user.id }],
    }).populate('patient', 'name email'); 

    const patients = careTeams.map(team => team.patient);

    res.status(200).json({ success: true, count: patients.length, data: patients });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Server Error' });
  }
};