const CareTeam = require('../models/CareTeam');
const User = require('../models/User');

/**
 * @desc    Create a new care team assignment
 * @route   POST /api/care-teams
 * @access  Private (Admin only)
 */
exports.createCareTeam = async (req, res) => {
  const { patientId, doctorId, nurseId } = req.body;

  try {
    // The pre-save hook on the CareTeam model will validate the roles.
    const careTeam = await CareTeam.create({
      patient: patientId,
      doctor: doctorId,
      nurse: nurseId,
    });

    res.status(201).json({ success: true, data: careTeam });
  } catch (err) {
    // Handle errors, including the unique patient constraint
    if (err.code === 11000) {
      return res.status(400).json({ msg: 'This patient is already assigned to a care team.' });
    }
    res.status(400).json({ success: false, msg: err.message });
  }
};

/**
 * @desc    Get all assignments for the logged-in user
 * @route   GET /api/care-teams/my-assignments
 * @access  Private (Patient, Doctor, Nurse)
 */
exports.getMyAssignments = async (req, res) => {
  try {
    // Find any care team where the logged-in user is a member
    const assignments = await CareTeam.find({
      $or: [
        { patient: req.user.id },
        { doctor: req.user.id },
        { nurse: req.user.id },
      ],
    })
      .populate({
        path: 'patient',
        select: 'name email role', // Select which fields to show
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

/**
 * @desc    Get all care team assignments
 * @route   GET /api/care-teams
 * @access  Private (Admin only)
 */
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

/**
 * @desc    Update a care team assignment
 * @route   PUT /api/care-teams/:id
 * @access  Private (Admin only)
 */
exports.updateAssignment = async (req, res) => {
  try {
    const assignment = await CareTeam.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return the modified document
      runValidators: true, // Run model validators on update
    });

    if (!assignment) {
      return res.status(404).json({ msg: `Assignment not found with id of ${req.params.id}` });
    }

    res.status(200).json({ success: true, data: assignment });
  } catch (err) {
    res.status(400).json({ success: false, msg: err.message });
  }
};

/**
 * @desc    Delete a care team assignment
 * @route   DELETE /api/care-teams/:id
 * @access  Private (Admin only)
 */
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

/**
 * @desc    Get all patients assigned to the logged-in doctor or nurse
 * @route   GET /api/care-teams/my-patients
 * @access  Private (Doctor, Nurse)
 */
exports.getMyPatients = async (req, res) => {
  try {
    const careTeams = await CareTeam.find({
      $or: [{ doctor: req.user.id }, { nurse: req.user.id }],
    }).populate('patient', 'name email'); // Populate with patient details

    // Extract just the patient data from the care teams
    const patients = careTeams.map(team => team.patient);

    res.status(200).json({ success: true, count: patients.length, data: patients });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Server Error' });
  }
};