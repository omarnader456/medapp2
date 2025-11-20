const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

// Import Controller and Middleware
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const authorize = require('../middleware/authorize');

// @route   POST api/auth/register
// @desc    Register a new user
// @access  Public
router.post(
  '/register',
  authMiddleware, // 1. Check if a user is logged in
  authorize('admin'), // 2. Check if the logged-in user is an admin
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  ],
  authController.register
);


// @route   POST api/auth/login
// @desc    Login user (password check)
// @access  Public
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  authController.login
);

// @route   POST api/auth/verify-2fa
// @desc    Verify 2FA token after login
// @access  Public
router.post('/verify-2fa', authController.verifyTwoFactor);

// @route   POST api/auth/enable-2fa
// @desc    Toggle email-based 2FA on or off
// @access  Private (requires user to be logged in)
router.post(
  '/enable-2fa',
  authMiddleware,
  authController.enableTwoFactor
);

// @route   GET api/auth/logout
// @desc    Log user out and clear cookie
// @access  Public
router.get('/logout', authController.logout);

// @route   GET api/auth/me
// @desc    Get the logged-in user's profile
// @access  Private
router.get('/me', authMiddleware, authController.getMe);

// @route   PUT api/auth/updatedetails
// @desc    Update the logged-in user's details
// @access  Private
router.put('/updatedetails', authMiddleware, authController.updateMyDetails);

// @route   PUT api/auth/updatepassword
// @desc    Update the logged-in user's password
// @access  Private
router.put('/updatepassword', authMiddleware, authController.updatePassword);

module.exports = router;