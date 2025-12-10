const Group = require('../schemas/group');
const Person = require('../schemas/person');

const makeGroup = async (req, res) => {
  try {
    const { patientId, doctorId, nurseId } = req.body;

    const p = await Person.findById(patientId);
    if (!p || p.role !== 'patient') return res.status(400).json({ msg: 'Bad patient' });

    const d = await Person.findById(doctorId);
    if (!d || d.role !== 'doctor') return res.status(400).json({ msg: 'Bad doctor' });

    const n = await Person.findById(nurseId);
    if (!n || n.role !== 'nurse') return res.status(400).json({ msg: 'Bad nurse' });

    const g = await Group.create({ patient: patientId, doctor: doctorId, nurse: nurseId });
    res.status(201).json({ success: true, data: g });

  } catch (e) {
    if (e.code === 11000) return res.status(400).json({ msg: 'Exists' });
    res.status(400).json({ success: false });
  }
};

const myGroups = async (req, res) => {
  try {
    const id = req.user.id;
    const list = await Group.find({ $or: [{ patient: id }, { doctor: id }, { nurse: id }] })
      .populate('patient', 'name email role')
      .populate('doctor', 'name email role')
      .populate('nurse', 'name email role');
    res.status(200).json({ success: true, data: list });
  } catch (e) { res.status(500).json({ success: false }); }
};

const allGroups = async (req, res) => {
  try {
    const list = await Group.find()
      .populate('patient', 'name email')
      .populate('doctor', 'name email')
      .populate('nurse', 'name email');
    res.status(200).json({ success: true, data: list });
  } catch (e) { res.status(500).json({ success: false }); }
};

const editGroup = async (req, res) => {
  try {
    const g = await Group.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!g) return res.status(404).json({ msg: 'Not found' });
    res.status(200).json({ success: true, data: g });
  } catch (e) { res.status(400).json({ success: false }); }
};

const killGroup = async (req, res) => {
  try {
    const g = await Group.findById(req.params.id);
    if (!g) return res.status(404).json({ msg: 'Not found' });
    await g.deleteOne();
    res.status(200).json({ success: true });
  } catch (e) { res.status(500).json({ success: false }); }
};

const myPatients = async (req, res) => {
  try {
    const teams = await Group.find({ $or: [{ doctor: req.user.id }, { nurse: req.user.id }] }).populate('patient', 'name email'); 
    const p = teams.map(t => t.patient);
    res.status(200).json({ success: true, data: p });
  } catch (e) { res.status(500).json({ success: false }); }
};

module.exports = { makeGroup, myGroups, allGroups, editGroup, killGroup, myPatients };