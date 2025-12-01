const crypto = require('crypto');
const User = require('../models/User');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sendEmail = require('../utils/sendEmail');

// Helper to set secure cookies
const sendTokenResponse = (user, statusCode, res) => {
  const payload = { user: { id: user.id } };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

  const isProd = process.env.NODE_ENV === 'production';

  res.cookie('token', accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000 // 15 minutes
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  res.status(statusCode).json({ success: true });
};

exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role } = req.body;

    // ADD THIS VALIDATION BLOCK:
    const validRoles = ['user', 'admin', 'doctor', 'patient', 'nurse'];
    
    if (!role || role.trim() === '') {
        return res.status(400).json({ msg: 'Role is required.' });
    }

    if (!validRoles.includes(role)) {
        return res.status(400).json({ msg: `Invalid role. Allowed roles: ${validRoles.join(', ')}` });
    }
    // END OF ADDITION

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

   
    user = new User({ name, email, password, role });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    sendTokenResponse(user, 201, res);
  } catch (err) {
    console.error("Registration Error:", err.message);
    
    // ADD THIS BLOCK:
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(val => val.message);
        return res.status(400).json({ msg: messages.join(', ') });
    }
    // END OF ADDITION

    res.status(500).send('Server error');
  }
};

exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password +loginAttempts +lockUntil');

    if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

    if (user.lockUntil && user.lockUntil > Date.now()) {
      return res.status(403).json({ msg: 'Account locked. Try again later.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      await user.incrementLoginAttempts();
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    await user.resetLoginAttempts();

    if (user.twoFactorEnabled) {
      const twoFactorCode = crypto.randomInt(100000, 1000000).toString();
      const salt = await bcrypt.genSalt(10);
      user.twoFactorCode = await bcrypt.hash(twoFactorCode, salt);
      user.twoFactorCodeExpires = Date.now() + 10 * 60 * 1000;
      await user.save();

      try {
        await sendEmail({
          email: user.email,
          subject: 'Your 2FA Code',
          message: `Your code is ${twoFactorCode}`,
        });

        // Generate a temporary token valid for 10 minutes just for 2FA verification
        const twoFactorTokenPayload = { user: { id: user.id }, purpose: '2fa-verification' };
        
        jwt.sign(
            twoFactorTokenPayload, 
            process.env.JWT_SECRET, 
            { expiresIn: '10m' }, 
            (err, token) => {
                if (err) throw err;
                // RETURN JSON response here so client can redirect
                return res.status(200).json({ 
                    success: true, 
                    require2fa: true, 
                    twoFactorToken: token 
                });
            }
        );
        return; // Stop execution here, response handled in callback
      } catch (err) {
        console.error(err);
        return res.status(500).send('Email failed');
      }
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.verifyTwoFactor = async (req, res) => {
  const { twoFactorToken, token } = req.body;
  
  if (!twoFactorToken || !token) {
      return res.status(400).json({ msg: 'Missing token or code' });
  }

  try {
    const decoded = jwt.verify(twoFactorToken, process.env.JWT_SECRET);
    if (decoded.purpose !== '2fa-verification') return res.status(400).json({ msg: 'Invalid token purpose.' });

    const user = await User.findById(decoded.user.id).select('+twoFactorCode +twoFactorCodeExpires');
    if (!user) return res.status(400).json({ msg: 'User not found.' });

    const isCodeValid = await bcrypt.compare(token, user.twoFactorCode);
    if (!isCodeValid || user.twoFactorCodeExpires < Date.now()) {
      return res.status(400).json({ msg: 'Invalid or expired 2FA code.' });
    }

    user.twoFactorCode = undefined;
    user.twoFactorCodeExpires = undefined;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.refreshToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json({ msg: 'No refresh token.' });

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const accessToken = jwt.sign({ user: { id: decoded.user.id } }, process.env.JWT_SECRET, { expiresIn: '15m' });

    res.cookie('token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000
    });

    res.json({ success: true });
  } catch (err) {
    res.status(401).json({ msg: 'Invalid refresh token.' });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  res.clearCookie('refreshToken');
  res.status(200).json({ success: true, msg: 'Logged out' });
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Server Error' });
  }
};

exports.updateMyDetails = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user.id, { name: req.body.name, email: req.body.email }, { new: true, runValidators: true });
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(400).json({ success: false, msg: err.message });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select('+password');
    if (!(await bcrypt.compare(currentPassword, user.password))) {
      return res.status(401).json({ msg: 'Incorrect current password' });
    }
    user.password = await bcrypt.hash(newPassword, await bcrypt.genSalt(10));
    user.passwordChangedAt = Date.now();
    await user.save();
    res.status(200).json({ success: true, msg: 'Password updated' });
  } catch (err) {
    res.status(400).json({ success: false, msg: err.message });
  }
};

exports.enableTwoFactor = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.twoFactorEnabled = !user.twoFactorEnabled; 
    await user.save();
    res.json({ success: true, msg: user.twoFactorEnabled ? 'Enabled' : 'Disabled', twoFactorEnabled: user.twoFactorEnabled });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};