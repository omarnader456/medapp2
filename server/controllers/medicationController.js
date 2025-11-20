const Medication = require('../models/Medication');

/**
 * @desc    Get all medications
 * @route   GET /api/medications
 * @access  Private (Admin, Doctor, Nurse)
 */
exports.getAllMedications = async (req, res) => {
  try {
    const medications = await Medication.find();
    res.status(200).json({ success: true, count: medications.length, data: medications });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Server Error' });
  }
};

/**
 * @desc    Create a medication
 * @route   POST /api/medications
 * @access  Private (Admin only)
 */
exports.createMedication = async (req, res) => {
  try {
    const medication = await Medication.create(req.body);
    res.status(201).json({ success: true, data: medication });
  } catch (err) {
    res.status(400).json({ success: false, msg: err.message });
  }
};

/**
 * @desc    Update a medication
 * @route   PUT /api/medications/:id
 * @access  Private (Admin only)
 */
exports.updateMedication = async (req, res) => {
  try {
    const medication = await Medication.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!medication) return res.status(404).json({ msg: 'Medication not found' });
    res.status(200).json({ success: true, data: medication });
  } catch (err) {
    res.status(400).json({ success: false, msg: err.message });
  }
};

/**
 * @desc    Delete a medication
 * @route   DELETE /api/medications/:id
 * @access  Private (Admin only)
 */
exports.deleteMedication = async (req, res) => {
  try {
    const medication = await Medication.findById(req.params.id);
    if (!medication) return res.status(404).json({ msg: 'Medication not found' });
    await medication.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Server Error' });
  }
};