const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const User = require('../models/User');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sendEmail = require('../utils/sendEmail');
// @desc    Register User
// @route   POST /api/auth/register
exports.register = async (req, res) => {
try{
  const {errors} = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({errors: errors.array()});
  }
  const { name, email, password, role } = req.body;
  let user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({ msg: 'User already exists' });
  }

  user = new User({
    name,
    email,
    password,
    role
  });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);
  await user.save();

  const payload = {
    user: {
      id: user.id
    }
  };
  jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: 360000
  }, (err, token) => {
    if (err) throw err;
    res.cookie('token', token, {
      httpOnly: true,
      // Use secure cookies in production
      secure: process.env.NODE_ENV === 'production'
    }).json({ success: true });
  });
  }
  catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Login User (Step 1)
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // NOTE: You might want to implement brute-force protection here
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // If 2FA is enabled, don't issue the final token yet.
    if (user.twoFactorEnabled) {
      // 1. Generate a random 6-digit code
      const twoFactorCode = Math.floor(100000 + Math.random() * 900000).toString();

      // 2. Set an expiry for 10 minutes
      user.twoFactorCode = twoFactorCode;
      user.twoFactorCodeExpires = Date.now() + 10 * 60 * 1000; // 10 mins
      await user.save();

      // 3. Send the code to the user's email
      try {
        await sendEmail({
          email: user.email,
          subject: 'Your Two-Factor Authentication Code',
          message: `Your 2FA code is ${twoFactorCode}. It will expire in 10 minutes.`,
        });

        return res.status(200).json({
          success: true,
          require2fa: true,
          userId: user.id,
        });
      } catch (err) {
        console.error(err);
        user.twoFactorCode = undefined;
        user.twoFactorCodeExpires = undefined;
        await user.save();
        return res.status(500).send('Error sending 2FA email. Please try again.');
      }
    }

    // If 2FA is not enabled, proceed with login.
    const payload = { user: { id: user.id } };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
      }).json({ success: true });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Verify 2FA Code (Step 2 of Login)
// @route   POST /api/auth/verify-2fa
exports.verifyTwoFactor = async (req, res) => {
  const { userId, token } = req.body;

  try {
    // Find user and include the 2FA fields
    const user = await User.findById(userId).select('+twoFactorCode +twoFactorCodeExpires');

    if (!user) {
      return res.status(400).json({ msg: 'User not found.' });
    }

    // Check if code is correct and not expired
    if (user.twoFactorCode !== token || user.twoFactorCodeExpires < Date.now()) {
      user.twoFactorCode = undefined;
      user.twoFactorCodeExpires = undefined;
      await user.save();
      return res.status(400).json({ msg: 'Invalid 2FA token.' });
    }

    user.twoFactorCode = undefined;
    user.twoFactorCodeExpires = undefined;
    await user.save();

    // If code is correct, issue the final access token
    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 360000 }, (err, authToken) => {
      if (err) throw err;
      res.cookie('token', authToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
      }).json({ success: true });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Verify and Enable 2FA
// @route   POST /api/auth/enable-2fa
exports.enableTwoFactor = async (req, res) => {
  // This route must be protected.
  try {
    // Just toggle the 2FA status for the logged-in user
    const user = await User.findById(req.user.id);
    user.twoFactorEnabled = !user.twoFactorEnabled; // Toggle
    await user.save();

    const message = user.twoFactorEnabled
      ? 'Email 2FA has been enabled.'
      : 'Email 2FA has been disabled.';

    res.json({ success: true, msg: message, twoFactorEnabled: user.twoFactorEnabled });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Log user out
// @route   GET /api/auth/logout
exports.logout = (req, res) => {
  // To log out, we simply clear the cookie containing the JWT
  res.clearCookie('token');
  res.status(200).json({ success: true, msg: 'Logged out successfully' });
};

/**
 * @desc    Get current logged in user
 * @route   GET /api/auth/me
 * @access  Private
 */
exports.getMe = async (req, res) => {
  try {
    // req.user is set by the auth middleware
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Server Error' });
  }
};

/**
 * @desc    Update user details for logged-in user
 * @route   PUT /api/auth/updatedetails
 * @access  Private
 */
exports.updateMyDetails = async (req, res) => {
  try {
    // Fields to update
    const fieldsToUpdate = {
      name: req.body.name,
      email: req.body.email,
    };

    // Find user and update. We explicitly do NOT allow 'role' to be updated here.
    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(400).json({ success: false, msg: err.message });
  }
};

/**
 * @desc    Update user password
 * @route   PUT /api/auth/updatepassword
 * @access  Private
 */
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // 1. Get user from DB and explicitly select the password field
    const user = await User.findById(req.user.id).select('+password');

    // 2. Check if the provided current password is correct
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ msg: 'Incorrect current password' });
    }

    // 3. Hash the new password and save it
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ success: true, msg: 'Password updated successfully' });
  } catch (err) {
    res.status(400).json({ success: false, msg: err.message });
  }
};