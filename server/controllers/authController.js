const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const User = require('../models/User');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sendEmail = require('../utils/sendEmail');

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
      secure: process.env.NODE_ENV === 'production'
    }).json({ success: true });
  });
  }
  catch (err) {
    console.error(err.message);
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
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    if (user.twoFactorEnabled) {
      const twoFactorCode = Math.floor(100000 + Math.random() * 900000).toString();

      user.twoFactorCode = twoFactorCode;
      user.twoFactorCodeExpires = Date.now() + 10 * 60 * 1000; 
      await user.save();

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

exports.verifyTwoFactor = async (req, res) => {
  const { userId, token } = req.body;

  try {
    const user = await User.findById(userId).select('+twoFactorCode +twoFactorCodeExpires');

    if (!user) {
      return res.status(400).json({ msg: 'User not found.' });
    }

    if (user.twoFactorCode !== token || user.twoFactorCodeExpires < Date.now()) {
      user.twoFactorCode = undefined;
      user.twoFactorCodeExpires = undefined;
      await user.save();
      return res.status(400).json({ msg: 'Invalid 2FA token.' });
    }

    user.twoFactorCode = undefined;
    user.twoFactorCodeExpires = undefined;
    await user.save();

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


exports.enableTwoFactor = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.twoFactorEnabled = !user.twoFactorEnabled; 
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

exports.logout = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ success: true, msg: 'Logged out successfully' });
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
    const fieldsToUpdate = {
      name: req.body.name,
      email: req.body.email,
    };

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(400).json({ success: false, msg: err.message });
  }
};


exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select('+password');

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ msg: 'Incorrect current password' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ success: true, msg: 'Password updated successfully' });
  } catch (err) {
    res.status(400).json({ success: false, msg: err.message });
  }
};