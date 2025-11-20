const express = require('express');
const router = express.Router();

// Import middleware and controllers
const authMiddleware = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const { getAllUsers, getUserById, updateUser } = require('../controllers/userController');

// Admin-only routes
router
  .route('/')
  .get([authMiddleware, authorize('admin')], getAllUsers);

router
  .route('/:id')
  .get([authMiddleware, authorize('admin')], getUserById)
  .put([authMiddleware, authorize('admin')], updateUser);

module.exports = router;