const express = require('express');
const router = express.Router();

// Import middleware and controllers
const authMiddleware = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const { getAllUsers } = require('../controllers/userController');

// @route   GET /api/users
// @desc    Get all users
// @access  Private (Admin only)
router.get('/', [authMiddleware, authorize('admin')], getAllUsers);

module.exports = router;