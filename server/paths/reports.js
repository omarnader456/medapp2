const express = require('express');
const router = express.Router();

const controller = require('../actions/reports');
const authMiddleware = require('../checks/token');
const authorize = require('../checks/role');

// Create diagnosis (Doctor only)
router.post('/', [authMiddleware, authorize('doctor')], controller.createDiagnosis);

// Get diagnoses for a patient
router.get('/patient/:patientId', [authMiddleware, authorize('patient', 'doctor')], controller.getPatientDiagnoses);

// Update diagnosis
router.put('/:id', [authMiddleware, authorize('doctor')], controller.updateDiagnosis);

// Delete diagnosis
router.delete('/:id', [authMiddleware, authorize('doctor')], controller.deleteDiagnosis);

module.exports = router;