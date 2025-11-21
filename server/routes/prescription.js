const express = require('express');
const router = express.Router();

const {
  createPrescription,
  getPrescriptionsForPatient,
  getMyPrescriptions,
} = require('../controllers/prescriptionController');

const authMiddleware = require('../middleware/auth');
const authorize = require('../middleware/authorize');

router.post('/', [authMiddleware, authorize('admin', 'doctor')], createPrescription);

router.get('/patient/:patientId', [authMiddleware, authorize('admin', 'doctor', 'nurse')], getPrescriptionsForPatient);

router.get('/my-prescriptions', [authMiddleware, authorize('patient')], getMyPrescriptions);

module.exports = router;
