const express = require('express');
const router = express.Router();

const {
  getAllMedications,
  createMedication,
  updateMedication,
  deleteMedication,
} = require('../controllers/medicationController');

const authMiddleware = require('../middleware/auth');
const authorize = require('../middleware/authorize');

router
  .route('/')
  .get([authMiddleware, authorize('admin', 'doctor', 'nurse')], getAllMedications)
  .post([authMiddleware, authorize('admin')], createMedication);

router
  .route('/:id')
  .put([authMiddleware, authorize('admin')], updateMedication)
  .delete([authMiddleware, authorize('admin')], deleteMedication);

module.exports = router;