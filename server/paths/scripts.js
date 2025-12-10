const express = require('express');
const router = express.Router();

const controller = require('../actions/scripts');
const authMiddleware = require('../checks/token');
const authorize = require('../checks/role');

// Create prescription
router.post('/', [authMiddleware, authorize('admin', 'doctor')], controller.createPrescription);

// Get prescriptions for a specific patient
router.get('/patient/:patientId', [authMiddleware, authorize('admin', 'doctor', 'nurse')], controller.getPrescriptionsForPatient);

// Get my own prescriptions
router.get('/my-prescriptions', [authMiddleware, authorize('patient')], controller.getMyPrescriptions);

module.exports = router;