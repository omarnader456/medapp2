const express = require('express');
const router = express.Router();

const {
  createPrescription,
  getPrescriptionsForPatient,
  getMyPrescriptions,
} = require('../controllers/prescriptionController');

const authMiddleware = require('../middleware/auth');
const authorize = require('../middleware/authorize');

// Route to create a new prescription
// Only accessible by admins and doctors
router.post('/', [authMiddleware, authorize('admin', 'doctor')], createPrescription);

// Route to get all prescriptions for a specific patient
// Accessible by admins, doctors, and nurses
router.get('/patient/:patientId', [authMiddleware, authorize('admin', 'doctor', 'nurse')], getPrescriptionsForPatient);

// Route for a patient to get their own prescriptions
// Accessible only by patients
router.get('/my-prescriptions', [authMiddleware, authorize('patient')], getMyPrescriptions);

module.exports = router;
