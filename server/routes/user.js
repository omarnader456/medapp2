const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const { getAllUsers, getUserById, updateUser } = require('../controllers/userController');

router
  .route('/')
  .get([authMiddleware, authorize('admin')], getAllUsers);

router
  .route('/:id')
  .get([authMiddleware, authorize('admin')], getUserById)
  .put([authMiddleware, authorize('admin')], updateUser);

module.exports = router;