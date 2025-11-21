const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const authorize = require('../middleware/authorize');


router.post(
  '/register',
  authMiddleware,
  authorize('admin'),
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  ],
  authController.register
);



router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  authController.login
);


router.post('/verify-2fa', authController.verifyTwoFactor);


router.post(
  '/enable-2fa',
  authMiddleware,
  authController.enableTwoFactor
);

router.get('/logout', authController.logout);


router.get('/me', authMiddleware, authController.getMe);


router.put('/updatedetails', authMiddleware, authController.updateMyDetails);


router.put('/updatepassword', authMiddleware, authController.updatePassword);

module.exports = router;