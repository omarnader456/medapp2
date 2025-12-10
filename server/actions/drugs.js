const Medication = require('../schemas/drug');

const getAllMedications = async (req, res) => {
  try {
    const medications = await Medication.find();
    res.status(200).json({ success: true, count: medications.length, data: medications });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, msg: 'Server Error' });
  }
};

const createMedication = async (req, res) => {
  try {
    const newMed = await Medication.create(req.body);
    res.status(201).json({ success: true, data: newMed });
  } catch (err) {
    res.status(400).json({ success: false, msg: err.message });
  }
};

const updateMedication = async (req, res) => {
  try {
    // Find first
    let medication = await Medication.findById(req.params.id);
    
    if (!medication) {
        return res.status(404).json({ msg: 'Medication not found' });
    }

    // Update with new data
    medication = await Medication.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true 
    });

    res.status(200).json({ success: true, data: medication });
  } catch (err) {
    res.status(400).json({ success: false, msg: err.message });
  }
};

const deleteMedication = async (req, res) => {
  try {
    const medication = await Medication.findById(req.params.id);
    
    if (!medication) {
        return res.status(404).json({ msg: 'Medication not found' });
    }
    
    await medication.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Server Error' });
  }
};

module.exports = {
    getAllMedications,
    createMedication,
    updateMedication,
    deleteMedication
};