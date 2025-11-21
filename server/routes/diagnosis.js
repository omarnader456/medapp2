const express = require('express');
const router = express.Router();

const {
  createDiagnosis,
  getPatientDiagnoses,
  updateDiagnosis,
  deleteDiagnosis,
} = require('../controllers/diagnosisController');

const authMiddleware = require('../middleware/auth');
const authorize = require('../middleware/authorize');

router.post('/', [authMiddleware, authorize('doctor')], createDiagnosis);

router.get('/patient/:patientId', [authMiddleware, authorize('patient', 'doctor')], getPatientDiagnoses);

router
  .route('/:id')
  .put([authMiddleware, authorize('doctor')], updateDiagnosis)
  .delete([authMiddleware, authorize('doctor')], deleteDiagnosis);

module.exports = router;