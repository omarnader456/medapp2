const express = require('express');
const router = express.Router();

const authMiddleware = require('../checks/token');
const authorize = require('../checks/role');
const userController = require('../actions/people');

// Route to get all users (Admin only)
router.get('/', [authMiddleware, authorize('admin')], userController.getAllUsers);

// Route to get single user
router.get('/:id', [authMiddleware, authorize('admin')], userController.getUserById);

// Route to update user
router.put('/:id', [authMiddleware, authorize('admin')], userController.updateUser);

module.exports = router;