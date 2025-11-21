const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const {
  createCareTeam,
  getMyAssignments,
  getAllAssignments,
  updateAssignment,
  deleteAssignment,
} = require('../controllers/careTeamController');

router.get('/my-assignments', authMiddleware, getMyAssignments);

router.get('/my-patients', [authMiddleware, authorize('doctor', 'nurse')], require('../controllers/careTeamController').getMyPatients);

router
  .route('/')
  .post([authMiddleware, authorize('admin')], createCareTeam)
  .get([authMiddleware, authorize('admin')], getAllAssignments);

router
  .route('/:id')
  .put([authMiddleware, authorize('admin')], updateAssignment)
  .delete([authMiddleware, authorize('admin')], deleteAssignment);

module.exports = router;