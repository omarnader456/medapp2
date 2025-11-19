const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    // This is a standard, robust regex for email validation
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please use a valid email',
    ],
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'doctor', 'patient', 'nurse'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false, // Do not return password by default
  },
  twoFactorEnabled: {
    type: Boolean,
    default: false,
  },
  // We replace the TOTP secret with fields for an email-based code
  twoFactorCode: {
    type: String,
    select: false,
  },
  twoFactorCodeExpires: {
    type: Date,
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', UserSchema);