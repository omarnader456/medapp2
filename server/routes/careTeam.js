const express = require('express');
const router = express.Router();

// Import middleware and controllers
const authMiddleware = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const {
  createCareTeam,
  getMyAssignments,
  getAllAssignments,
  updateAssignment,
  deleteAssignment,
} = require('../controllers/careTeamController');

// Route to get the current user's assignments
// Accessible by any logged-in user
router.get('/my-assignments', authMiddleware, getMyAssignments);

// Route for doctors/nurses to get their assigned patients
router.get('/my-patients', [authMiddleware, authorize('doctor', 'nurse')], require('../controllers/careTeamController').getMyPatients);

// Admin-only routes
router
  .route('/')
  .post([authMiddleware, authorize('admin')], createCareTeam)
  .get([authMiddleware, authorize('admin')], getAllAssignments);

router
  .route('/:id')
  .put([authMiddleware, authorize('admin')], updateAssignment)
  .delete([authMiddleware, authorize('admin')], deleteAssignment);

module.exports = router;